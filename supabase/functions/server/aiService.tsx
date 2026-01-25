
import { createClient } from "npm:@supabase/supabase-js@2";

// Rule-based fallback parser when AI is unavailable
function fallbackParser(note: string, productsList: any[]) {
  console.log('Using fallback parser for note:', note);
  
  // Ensure productsList is an array
  const safeProducts = Array.isArray(productsList) ? productsList : [];
  
  // Normalize note
  const lines = note.toLowerCase().split(/[,\n]/).filter(line => line.trim());
  const items = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Extract quantity (regex for "2 kg", "2.5", "half", "one")
    let quantity = 1;
    let unit = 'pcs';
    let cleanName = trimmed;

    // Handle "half"
    if (trimmed.includes('half')) {
      quantity = 0.5;
      cleanName = cleanName.replace('half', '').trim();
    }

    // Try to find number at start
    const numberMatch = cleanName.match(/^(\d+(\.\d+)?)\s*/);
    if (numberMatch) {
      quantity = parseFloat(numberMatch[1]);
      cleanName = cleanName.substring(numberMatch[0].length).trim();
    }

    // Extract unit if present (kg, g, l, ml, pack, packet|pkt, pcs)
    const unitMatch = cleanName.match(/^(kg|g|l|ml|pack|packet|pkt|pcs)\s+/);
    if (unitMatch) {
      unit = unitMatch[1];
      cleanName = cleanName.substring(unitMatch[0].length).trim();
    }

    // Fuzzy match product
    let bestMatch = null;
    let highestScore = 0;

    for (const product of safeProducts) {
      if (!product || !product.name) continue;
      
      const productName = product.name.toLowerCase();
      // Simple inclusion check
      if (productName.includes(cleanName) || cleanName.includes(productName)) {
        // Calculate a basic score based on length match
        const score = Math.min(cleanName.length, productName.length) / Math.max(cleanName.length, productName.length);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = product;
        }
      }
    }

    // If score is too low, treat as unmatched
    const matchedProduct = highestScore > 0.3 ? bestMatch : null;

    items.push({
      originalText: trimmed,
      productName: matchedProduct ? matchedProduct.name : cleanName,
      productId: matchedProduct ? matchedProduct.id : null,
      quantity,
      unit,
      confidence: matchedProduct ? 70 : 20 // 0-100 scale
    });
  }

  return { items, confidence_score: items.length > 0 ? (items.every(i => i.confidence > 50) ? 70 : 20) : 0 };
}

function fallbackPurchaseParser(note: string, productsList: any[]) {
  console.log('Using fallback purchase parser for note:', note);
  
  // Reuse base parsing logic but look for price patterns
  const safeProducts = Array.isArray(productsList) ? productsList : [];
  const lines = note.toLowerCase().split(/[,\n]/).filter(line => line.trim());
  const items = [];

  for (const line of lines) {
    let cleanLine = line.trim();
    if (!cleanLine) continue;

    // Extract price if present (e.g., "for 500", "at 20")
    // Patterns: "for 500", "at 500", "rs 500", "500rs", "500/-"
    let costPrice = 0;
    let isTotalCost = false;

    const totalCostMatch = cleanLine.match(/for\s+(\d+(\.\d+)?)/);
    const unitCostMatch = cleanLine.match(/at\s+(\d+(\.\d+)?)/);
    const genericPriceMatch = cleanLine.match(/(?:rs\.?|₹)\s*(\d+(\.\d+)?)/) || cleanLine.match(/(\d+(\.\d+)?)\s*(?:rs\.?|₹|\/-)/);

    if (totalCostMatch) {
      costPrice = parseFloat(totalCostMatch[1]);
      isTotalCost = true;
      cleanLine = cleanLine.replace(totalCostMatch[0], '').trim();
    } else if (unitCostMatch) {
      costPrice = parseFloat(unitCostMatch[1]);
      cleanLine = cleanLine.replace(unitCostMatch[0], '').trim();
    } else if (genericPriceMatch) {
      costPrice = parseFloat(genericPriceMatch[1]);
      cleanLine = cleanLine.replace(genericPriceMatch[0], '').trim();
    }

    // Now extract qty and product using similar logic to sales
    let quantity = 1;
    let unit = 'pcs';

    if (cleanLine.includes('half')) {
      quantity = 0.5;
      cleanLine = cleanLine.replace('half', '').trim();
    }

    const numberMatch = cleanLine.match(/^(\d+(\.\d+)?)\s*/);
    if (numberMatch) {
      quantity = parseFloat(numberMatch[1]);
      cleanLine = cleanLine.substring(numberMatch[0].length).trim();
    }

    const unitMatch = cleanLine.match(/^(kg|g|l|ml|pack|packet|pkt|pcs|box|carton|sack|bundle)\s+/);
    if (unitMatch) {
      unit = unitMatch[1];
      cleanLine = cleanLine.substring(unitMatch[0].length).trim();
    }

    // Fuzzy match
    let bestMatch = null;
    let highestScore = 0;
    for (const product of safeProducts) {
      if (!product || !product.name) continue;
      const productName = product.name.toLowerCase();
      if (productName.includes(cleanLine) || cleanLine.includes(productName)) {
        const score = Math.min(cleanLine.length, productName.length) / Math.max(cleanLine.length, productName.length);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = product;
        }
      }
    }
    const matchedProduct = highestScore > 0.3 ? bestMatch : null;

    // Calculate final unit cost if total was provided
    let finalUnitCost = costPrice;
    if (isTotalCost && quantity > 0) {
      finalUnitCost = costPrice / quantity;
    }

    items.push({
      originalText: line.trim(),
      productName: matchedProduct ? matchedProduct.name : cleanLine,
      productId: matchedProduct ? matchedProduct.id : null,
      quantity,
      unit,
      costPrice: finalUnitCost,
      totalCost: isTotalCost ? costPrice : finalUnitCost * quantity,
      confidence: matchedProduct ? 70 : 20
    });
  }
  return { items, confidence_score: items.length > 0 ? (items.every(i => i.confidence > 50) ? 70 : 20) : 0 };
}

export async function parsePurchaseNote(note: string, productsList: any[]) {
  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  const safeProducts = Array.isArray(productsList) ? productsList : [];
  
  if (!openAiKey) {
    console.warn('OPENAI_API_KEY not set, using fallback purchase parser');
    return { ...fallbackPurchaseParser(note, safeProducts), language: 'en' };
  }

  const productContext = safeProducts.map(p => `${p.name} (ID: ${p.id}, Cost: ${p.costPrice})`).join('\n');

  const prompt = `
    You are a smart retail assistant for vendor purchases in India.
    Parse the following purchase note into structured items.
    
    Purchase Note: "${note}"
    
    Available Products:
    ${productContext}
    
    Instructions:
    1. Detect language ('en', 'te', 'mixed').
    2. Extract product name, quantity, unit, and COST PRICE.
    3. Deduce unit cost from "for 500" or "at 50".
    4. Normalize units.
    5. Calculate 'confidence' (0-100).
    6. Identify ambiguity (e.g., missing price or unit).
    7. Return JSON:
    {
      "language": "en" | "te" | "mixed",
      "items": [
        {
          "originalText": "string",
          "productName": "string",
          "productId": "id or null",
          "quantity": number,
          "unit": "string",
          "costPrice": number,
          "totalCost": number,
          "confidence": number
        }
      ],
      "confidence_score": number,
      "ambiguity_detected": boolean,
      "clarification_question": string | null
    }
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a JSON parser for retail purchases.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
       console.warn('OpenAI API Error for purchase parsing. Switching to fallback.');
       return { ...fallbackPurchaseParser(note, safeProducts), language: 'en' };
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.warn("AI Purchase Parse Exception:", error);
    return { ...fallbackPurchaseParser(note, safeProducts), language: 'en' };
  }
}

export async function parseSalesNote(note: string, productsList: any[]) {
  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  
  // Ensure productsList is an array for map
  const safeProducts = Array.isArray(productsList) ? productsList : [];
  
  // If no key, immediately use fallback
  if (!openAiKey) {
    console.warn('OPENAI_API_KEY not set, using fallback parser');
    return { ...fallbackParser(note, safeProducts), language: 'en' };
  }

  // Optimize products list for context window - just send names and basic units if possible
  const productContext = safeProducts.map(p => `${p.name} (ID: ${p.id}, Unit: ${p.unit}, Price: ${p.price})`).join('\n');

  const prompt = `
    You are a smart retail assistant for a Kirana shop in India. 
    Parse the following sales note (spoken or typed) into structured sales items.
    
    Sales Note: "${note}"
    
    Available Products:
    ${productContext}
    
    Instructions:
    1. Detect the language of the note ('en' for English, 'te' for Telugu, 'mixed' for both).
    2. Extract product name, quantity, unit, and matched product ID.
    3. Map items to "Available Products" using fuzzy matching.
    4. Normalize quantities (e.g., "half kg" -> 0.5, "rendu" -> 2).
    5. Calculate 'confidence' (0-100) per item. Lower it if quantity/unit is vague (e.g., "rice" without qty).
    6. If input is ambiguous (e.g., "give rice"), set 'ambiguity_detected': true and provide a 'clarification_question' in the detected language.
    7. Return JSON:
    {
      "language": "en" | "te" | "mixed",
      "items": [
        {
          "originalText": "substring",
          "productName": "string",
          "productId": "matched ID or null",
          "quantity": number,
          "unit": "string",
          "price": number (if mentioned or implied),
          "confidence": number
        }
      ],
      "confidence_score": number,
      "ambiguity_detected": boolean,
      "clarification_question": string | null
    }
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful JSON parser for retail sales.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      return { ...fallbackParser(note, safeProducts), language: 'en' };
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.warn("AI Parse Exception:", error);
    return { ...fallbackParser(note, safeProducts), language: 'en' };
  }
}

export async function parseMultiIntent(note: string, productsList: any[], vendorsList: any[]) {
  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  const safeProducts = Array.isArray(productsList) ? productsList : [];
  const safeVendors = Array.isArray(vendorsList) ? vendorsList : [];

  if (!openAiKey) {
    // Fallback: Default to Sales parser if no key, as multi-intent fallback is complex
    return { 
      intents: [
        { type: 'sale', ...fallbackParser(note, safeProducts) }
      ],
      confidence_score: 50 // Low confidence since fallback can't really do multi-intent
    };
  }

  const productContext = safeProducts.map(p => `${p.name} (ID: ${p.id})`).join('\n');
  const vendorContext = safeVendors.map(v => `${v.name} (ID: ${v.id})`).join('\n');

  const prompt = `
    You are a smart retail assistant. Parse the following input into multiple intents.
    
    Input: "${note}"
    
    Products:
    ${productContext}
    
    Vendors:
    ${vendorContext}
    
    Instructions:
    1. Identify intents: 'sale', 'purchase', 'payment', 'expense', or 'owner_query'.
    2. Split input into actions.
    3. For 'sale', extract products and quantities.
    4. For 'purchase', extract products, quantities, and optional vendor.
    5. For 'payment', extract vendor and amount.
    6. For 'owner_query', identify the question (e.g. "how are sales?").
    7. Return JSON:
    {
      "intents": [
        {
          "type": "sale" | "purchase" | "payment" | "owner_query",
          "originalText": "substring",
          "items": [...], // for sale/purchase
          "vendorId": "id or null", // for purchase/payment
          "amount": number, // for payment
          "query": "string", // for owner_query
          "confidence": number (0-100)
        }
      ],
      "confidence_score": number (0-100)
    }
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a multi-intent JSON parser for retail.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      return { 
        intents: [
          { type: 'sale', ...fallbackParser(note, safeProducts) }
        ],
        confidence_score: 50
      };
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("AI Multi-Intent Parse Exception:", error);
    return { 
        intents: [
          { type: 'sale', ...fallbackParser(note, safeProducts) }
        ],
        confidence_score: 50
      };
  }
}

export async function generateDailyBrief(storeData: any) {
  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAiKey) return null;

  const prompt = `
    Generate a daily brief for a retail store owner.
    
    Data:
    Sales Today: ₹${storeData.salesToday}
    Orders: ${storeData.orderCount}
    Low Stock Items: ${storeData.lowStockCount}
    Expiring Soon: ${storeData.expiringCount}
    
    Output JSON:
    {
      "summary": "One sentence summary of today's performance.",
      "trend": "up" | "down" | "neutral",
      "alert": "Most critical alert text or null",
      "action": "Recommended action"
    }
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a business analyst.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Daily Brief Generation Error:", error);
    return null;
  }
}

export async function generateOwnerAnswer(query: string, storeData: any) {
  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAiKey) return "AI unavailable.";

  const prompt = `
    You are a store owner assistant. Answer the user query based on data.
    
    Query: "${query}"
    
    Store Data:
    Sales Today: ₹${storeData.salesToday}
    Orders Today: ${storeData.orderCount}
    Total Revenue: ₹${storeData.totalRevenue}
    Low Stock Count: ${storeData.lowStockCount}
    
    Keep it brief and friendly.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) return "Sorry, I couldn't process that.";
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return "Error generating answer.";
  }
}
