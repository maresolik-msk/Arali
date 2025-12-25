/**
 * Parse voice commands into product data
 * Supports natural language like:
 * - "Add 10 units of milk"
 * - "Milk expiring January 30th"
 * - "Add bananas, 50 units, price 20 rupees"
 */

interface ParsedVoiceData {
  name?: string;
  quantity?: number;
  price?: number;
  expiryDate?: string;
  stock?: number;
}

export function parseVoiceCommand(transcript: string): ParsedVoiceData {
  const lowerText = transcript.toLowerCase();
  const result: ParsedVoiceData = {};

  // Extract quantity/stock (numbers before "units", "pieces", "items")
  const quantityMatch = lowerText.match(/(\d+)\s*(?:units|pieces|items|pcs)/i);
  if (quantityMatch) {
    result.quantity = parseInt(quantityMatch[1]);
    result.stock = parseInt(quantityMatch[1]);
  }

  // Extract price (numbers with "rupees", "rs", "dollars", or after "price")
  const priceMatch = lowerText.match(/(?:price|cost|rs\.?|rupees?|dollars?|₹|\$)\s*(\d+(?:\.\d+)?)/i);
  if (priceMatch) {
    result.price = parseFloat(priceMatch[1]);
  }

  // Extract product name (text after "add", "of", or before quantity)
  let nameMatch = lowerText.match(/(?:add|of|stock)\s+([\w\s]+?)(?:\s+\d+|\s+expir|,|$)/i);
  if (nameMatch) {
    result.name = capitalizeWords(nameMatch[1].trim());
  } else {
    // Fallback: take the first few words
    const words = transcript.split(/\s+/).filter(w => 
      !['add', 'units', 'pieces', 'items', 'the', 'a', 'an', 'expiring', 'price', 'cost'].includes(w.toLowerCase())
    );
    if (words.length > 0) {
      result.name = capitalizeWords(words.slice(0, 3).join(' '));
    }
  }

  // Extract expiry date
  const expiryMatch = lowerText.match(/expir(?:ing|y|es)?\s+(?:on\s+)?([a-z]+\s+\d+(?:st|nd|rd|th)?(?:\s+\d{4})?)/i);
  if (expiryMatch) {
    result.expiryDate = parseExpiryDate(expiryMatch[1]);
  }

  // Alternative date format: "January 30" or "Jan 30"
  const dateMatch = transcript.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?\b/i);
  if (dateMatch) {
    result.expiryDate = parseExpiryDate(dateMatch[0]);
  }

  return result;
}

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function parseExpiryDate(dateStr: string): string {
  try {
    const months: { [key: string]: number } = {
      jan: 0, january: 0,
      feb: 1, february: 1,
      mar: 2, march: 2,
      apr: 3, april: 3,
      may: 4,
      jun: 5, june: 5,
      jul: 6, july: 6,
      aug: 7, august: 7,
      sep: 8, september: 8,
      oct: 9, october: 9,
      nov: 10, november: 10,
      dec: 11, december: 11,
    };

    const parts = dateStr.toLowerCase().match(/([a-z]+)\s+(\d{1,2})(?:\s+(\d{4}))?/);
    if (!parts) return '';

    const monthName = parts[1];
    const day = parseInt(parts[2]);
    const year = parts[3] ? parseInt(parts[3]) : new Date().getFullYear();

    const month = months[monthName];
    if (month === undefined) return '';

    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error parsing expiry date:', error);
    return '';
  }
}

/**
 * Generate a summary of parsed data for user confirmation
 */
export function generateVoiceSummary(data: ParsedVoiceData): string {
  const parts: string[] = [];
  
  if (data.name) parts.push(`Product: ${data.name}`);
  if (data.quantity) parts.push(`Quantity: ${data.quantity} units`);
  if (data.price) parts.push(`Price: ₹${data.price}`);
  if (data.expiryDate) {
    const date = new Date(data.expiryDate);
    parts.push(`Expires: ${date.toLocaleDateString()}`);
  }

  return parts.length > 0 ? parts.join(', ') : 'No data extracted';
}
