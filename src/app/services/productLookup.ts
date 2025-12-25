/**
 * Product lookup service supporting multiple databases
 * Supports: Open Food Facts, UPCitemdb, Indian databases, and your own internal database
 */

export interface ProductInfo {
  name: string;
  category: string;
  brand?: string;
  imageUrl?: string;
  barcode: string;
  description?: string;
  nutritionalInfo?: any;
  source?: string; // Which database provided the data
  price?: number; // MRP for Indian products
  manufacturer?: string;
}

/**
 * Look up product information from barcode using multiple databases
 * @param barcode - Product barcode (UPC, EAN, etc.)
 * @returns Product information or null if not found
 */
export async function lookupProductByBarcode(
  barcode: string
): Promise<ProductInfo | null> {
  // Try multiple databases in order of preference
  const databases = [
    lookupInternalDatabase,     // Check your own database first
    lookupOpenFoodFactsIndia,    // Open Food Facts India-specific
    lookupOpenFoodFacts,         // Then Open Food Facts (global food items)
    lookupUPCItemDB,             // Then UPCitemdb (general products)
  ];

  for (const lookupFn of databases) {
    try {
      // Add 5 second timeout per database to prevent hanging
      const result = await Promise.race([
        lookupFn(barcode),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000))
      ]);
      
      if (result) {
        return result;
      }
    } catch (error) {
      console.error(`Error in ${lookupFn.name}:`, error);
      // Continue to next database
    }
  }

  // No product found in any database
  return null;
}

/**
 * Look up product in your internal Supabase database
 * This checks if you've already added this product before
 */
async function lookupInternalDatabase(
  barcode: string
): Promise<ProductInfo | null> {
  try {
    // Note: This would connect to your Supabase products table
    // For now, we return null since internal lookup is optional
    // You can implement this by querying your products API
    
    // Example implementation:
    // const products = await productsApi.getAll();
    // const found = products.find(p => p.sku === barcode);
    // if (found) {
    //   return {
    //     name: found.name,
    //     category: found.category,
    //     brand: found.vendorType,
    //     imageUrl: found.imageUrl,
    //     barcode: barcode,
    //     source: 'internal'
    //   };
    // }
    
    return null;
  } catch (error) {
    console.error('Internal database lookup error:', error);
    return null;
  }
}

/**
 * Look up product using Open Food Facts API (best for food products)
 * FREE - No API key required
 * Database: 2.8+ million food products worldwide
 */
async function lookupOpenFoodFacts(
  barcode: string
): Promise<ProductInfo | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (!response.ok) {
      console.error('Open Food Facts lookup failed:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.status === 0 || !data.product) {
      return null;
    }

    const product = data.product;

    return {
      name: product.product_name || product.generic_name || 'Unknown Product',
      category: extractOpenFoodFactsCategory(product),
      brand: product.brands || undefined,
      imageUrl: product.image_url || product.image_front_url || undefined,
      barcode: barcode,
      description: product.generic_name || undefined,
      nutritionalInfo: product.nutriments || undefined,
      source: 'Open Food Facts',
    };
  } catch (error) {
    console.error('Open Food Facts error:', error);
    return null;
  }
}

/**
 * Look up product using UPCitemdb (best for general retail products)
 * FREE tier: 100 requests/day
 * PAID tier: Requires API key for unlimited access
 */
async function lookupUPCItemDB(
  barcode: string
): Promise<ProductInfo | null> {
  try {
    // Get API key from environment (optional for free tier)
    const apiKey = import.meta.env.VITE_UPCITEMDB_API_KEY;
    
    const headers: HeadersInit = {};
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`,
      { headers }
    );

    if (!response.ok) {
      // Free tier limit might be reached
      if (response.status === 429) {
        console.warn('UPCitemdb rate limit reached (100/day on free tier)');
      }
      return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const item = data.items[0];

    return {
      name: item.title || 'Unknown Product',
      category: extractUPCCategory(item),
      brand: item.brand || undefined,
      imageUrl: item.images?.[0] || undefined,
      barcode: barcode,
      description: item.description || undefined,
      source: 'UPCitemdb',
    };
  } catch (error) {
    console.error('UPCitemdb error:', error);
    return null;
  }
}

/**
 * Look up product using Open Food Facts India API (best for Indian food products)
 * FREE - No API key required
 * Database: 2.8+ million food products worldwide
 */
async function lookupOpenFoodFactsIndia(
  barcode: string
): Promise<ProductInfo | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (!response.ok) {
      console.error('Open Food Facts lookup failed:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.status === 0 || !data.product) {
      return null;
    }

    const product = data.product;

    return {
      name: product.product_name || product.generic_name || 'Unknown Product',
      category: extractOpenFoodFactsCategory(product),
      brand: product.brands || undefined,
      imageUrl: product.image_url || product.image_front_url || undefined,
      barcode: barcode,
      description: product.generic_name || undefined,
      nutritionalInfo: product.nutriments || undefined,
      source: 'Open Food Facts',
      price: product.price || undefined,
      manufacturer: product.manufacturer || undefined,
    };
  } catch (error) {
    console.error('Open Food Facts error:', error);
    return null;
  }
}

/**
 * Extract category from Open Food Facts data
 */
function extractOpenFoodFactsCategory(product: any): string {
  const categories = product.categories_tags || [];
  
  if (categories.length > 0) {
    const category = categories[categories.length - 1]
      .replace(/^en:/, '')
      .replace(/-/g, ' ')
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return category;
  }

  if (product.categories) {
    const cats = product.categories.split(',');
    if (cats.length > 0) {
      return cats[0].trim();
    }
  }

  return 'Groceries';
}

/**
 * Extract category from UPCitemdb data
 */
function extractUPCCategory(item: any): string {
  if (item.category) {
    return item.category
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return 'General Merchandise';
}

/**
 * ALTERNATIVE DATABASES YOU CAN ADD:
 * 
 * 1. Barcode Lookup (barcodelookup.com)
 *    - API: https://www.barcodelookup.com/api
 *    - Requires API key ($19.99/month for 10K requests)
 *    - Best for: US retail products
 * 
 * 2. EAN Search (ean-search.org)
 *    - API: https://www.ean-search.org/ean-database-api.html
 *    - Free tier: 100 requests/day
 *    - Best for: European products
 * 
 * 3. Edamam Food Database
 *    - API: https://developer.edamam.com/food-database-api
 *    - Requires API key (free tier available)
 *    - Best for: Nutritional information
 * 
 * 4. Your Own CSV/JSON Import
 *    - Upload your own product database
 *    - Store in Supabase Storage or KV store
 *    - Best for: Custom catalogs
 */