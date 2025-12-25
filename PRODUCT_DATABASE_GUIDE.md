# 📦 Product Database Connection Guide

This guide explains how **Arali** connects to product databases and how you can add more sources.

---

## 🔌 Current Setup

The app uses a **waterfall approach** to look up products:

```
1. Internal Database (Your Supabase DB)
   ↓ (if not found)
2. Open Food Facts (Free - Food products)
   ↓ (if not found)
3. UPCitemdb (100 free/day - General products)
   ↓ (if not found)
4. Manual Entry (User fills form)
```

---

## 🆓 Free Databases (No API Key Required)

### 1. **Open Food Facts** ✅ ACTIVE
- **URL**: https://world.openfoodfacts.org/
- **Coverage**: 2.8+ million food products worldwide
- **Best For**: Groceries, beverages, packaged foods
- **Cost**: 100% FREE
- **Setup**: Already integrated! ✨

**Example Products**:
- ✅ Coca-Cola: `5449000000996`
- ✅ Nutella: `3017620422003`
- ✅ Oreos: `0044000032067`

---

### 2. **UPCitemdb** ✅ ACTIVE (Free Tier)
- **URL**: https://www.upcitemdb.com/
- **Coverage**: General retail products
- **Free Tier**: 100 requests/day
- **Paid Tier**: Unlimited ($9.99/month)
- **Best For**: Electronics, clothing, toys, general merchandise
- **Setup**: Already integrated! ✨

**To upgrade to unlimited**:
1. Get API key at: https://www.upcitemdb.com/api
2. Add to `.env.local`:
   ```bash
   VITE_UPCITEMDB_API_KEY=your_api_key_here
   ```
3. Restart your dev server

---

## 💰 Premium Databases (Require API Key)

### 3. **Barcode Lookup** (Recommended for US retail)
- **URL**: https://www.barcodelookup.com/
- **Coverage**: 450+ million products
- **Cost**: $19.99/month (10,000 requests)
- **Best For**: US retail products, comprehensive coverage

**Setup Steps**:
1. Sign up at https://www.barcodelookup.com/api
2. Get your API key
3. Add this function to `/src/app/services/productLookup.ts`:

```typescript
async function lookupBarcodeLookup(
  barcode: string
): Promise<ProductInfo | null> {
  try {
    const apiKey = import.meta.env.VITE_BARCODELOOKUP_API_KEY;
    if (!apiKey) return null;

    const response = await fetch(
      `https://api.barcodelookup.com/v3/products?barcode=${barcode}&key=${apiKey}`
    );

    const data = await response.json();
    if (!data.products || data.products.length === 0) return null;

    const product = data.products[0];
    return {
      name: product.title,
      category: product.category || 'General',
      brand: product.brand,
      imageUrl: product.images?.[0],
      barcode: barcode,
      description: product.description,
      source: 'Barcode Lookup',
    };
  } catch (error) {
    console.error('Barcode Lookup error:', error);
    return null;
  }
}
```

4. Add to `.env.local`:
   ```bash
   VITE_BARCODELOOKUP_API_KEY=your_api_key_here
   ```

---

### 4. **EAN Search** (Best for European products)
- **URL**: https://www.ean-search.org/
- **Coverage**: European products (EAN-13, EAN-8)
- **Cost**: Free tier (100/day), €29/month (unlimited)
- **Best For**: European retail

**Setup**:
```typescript
async function lookupEANSearch(barcode: string): Promise<ProductInfo | null> {
  const apiKey = import.meta.env.VITE_EANSEARCH_API_KEY;
  const response = await fetch(
    `https://api.ean-search.org/api?token=${apiKey}&op=barcode-lookup&ean=${barcode}`
  );
  // ... parse response
}
```

---

### 5. **Edamam Food Database** (Nutritional data)
- **URL**: https://developer.edamam.com/
- **Coverage**: Food products with nutrition info
- **Cost**: Free tier (5,000/month), then paid
- **Best For**: Restaurants, health apps

---

## 🏢 Your Internal Database

### Option A: Use Existing Products (Already Scanned)

The app already stores products in Supabase. To enable internal lookup:

1. Open `/src/app/services/productLookup.ts`
2. Find `lookupInternalDatabase` function
3. Uncomment this code:

```typescript
async function lookupInternalDatabase(
  barcode: string
): Promise<ProductInfo | null> {
  try {
    // Import your API
    const { productsApi } = await import('./api');
    
    // Get all products
    const products = await productsApi.getAll();
    
    // Find by SKU (barcode)
    const found = products.find(p => p.sku === barcode);
    
    if (found) {
      return {
        name: found.name,
        category: found.category,
        brand: found.vendorType,
        imageUrl: found.imageUrl,
        barcode: barcode,
        source: 'Your Database',
      };
    }
  } catch (error) {
    console.error('Internal lookup error:', error);
  }
  
  return null;
}
```

**Benefits**:
- ✅ Instant lookup for products you've already scanned
- ✅ No API calls = faster
- ✅ Works offline (if cached)

---

### Option B: Import Product Catalog (CSV/Excel)

If you have a supplier's product catalog:

1. Create a bulk import function:

```typescript
// Add to /src/app/services/api.ts
async function bulkImportProducts(csvData: string) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const product = {
      sku: values[0],      // Barcode
      name: values[1],     // Product name
      category: values[2], // Category
      // ... map other fields
    };
    
    await productsApi.create(product);
  }
}
```

2. Create a simple upload UI in Inventory.tsx

---

## 🔄 How to Change Database Priority

Edit the `databases` array in `/src/app/services/productLookup.ts`:

```typescript
// Default order
const databases = [
  lookupInternalDatabase,  // 1st: Your DB
  lookupOpenFoodFacts,     // 2nd: Food products
  lookupUPCItemDB,         // 3rd: General products
];

// Example: Prioritize Barcode Lookup for retail store
const databases = [
  lookupInternalDatabase,  // Always check your DB first
  lookupBarcodeLookup,     // Best for US retail
  lookupOpenFoodFacts,     // Fallback for food
  lookupUPCItemDB,         // Final fallback
];
```

---

## 📊 Database Comparison Table

| Database | Cost | Products | Best For | API Key |
|----------|------|----------|----------|---------|
| **Open Food Facts** | FREE | 2.8M | Food/Groceries | ❌ No |
| **UPCitemdb** | FREE (100/day) | General | Retail Products | ⚠️ Optional |
| **Barcode Lookup** | $20/month | 450M | US Retail | ✅ Yes |
| **EAN Search** | €29/month | European | EU Products | ✅ Yes |
| **Your Database** | FREE | Custom | Your Products | ❌ No |

---

## 🚀 Recommended Setup by Business Type

### 🛒 **Grocery Store**
```typescript
const databases = [
  lookupInternalDatabase,
  lookupOpenFoodFacts,  // Best for groceries
  lookupUPCItemDB,
];
```

### 👕 **Retail Store** (Clothing, Electronics)
```typescript
const databases = [
  lookupInternalDatabase,
  lookupBarcodeLookup,  // Best coverage
  lookupUPCItemDB,
];
```

### 🍽️ **Restaurant/Cafe**
```typescript
const databases = [
  lookupInternalDatabase,
  lookupEdamam,        // Nutrition data
  lookupOpenFoodFacts,
];
```

### 🌍 **International Store**
```typescript
const databases = [
  lookupInternalDatabase,
  lookupOpenFoodFacts,  // Worldwide coverage
  lookupEANSearch,      // European products
  lookupUPCItemDB,      // US/general products
];
```

---

## 🔧 Testing Your Setup

Test with these common barcodes:

```typescript
// Test in browser console:
import { lookupProductByBarcode } from './services/productLookup';

// Coca-Cola (should work with Open Food Facts)
await lookupProductByBarcode('5449000000996');

// iPhone (should work with UPCitemdb or Barcode Lookup)
await lookupProductByBarcode('0190198068407');

// European product (should work with EAN Search)
await lookupProductByBarcode('4006040052692');
```

---

## ❓ FAQ

### Q: What happens if no database has the product?
**A**: The app opens the dialog with the barcode pre-filled in the SKU field. User manually enters product details.

### Q: Can I use multiple databases at once?
**A**: Yes! The app tries each database in order until it finds a match.

### Q: How do I add my supplier's catalog?
**A**: Either:
1. Import CSV/Excel into your Supabase database
2. Build a custom lookup function that queries your supplier's API

### Q: Are there rate limits?
**A**: 
- Open Food Facts: No limit ✅
- UPCitemdb: 100/day (free), unlimited (paid)
- Others: Check their documentation

### Q: Can I cache results to reduce API calls?
**A**: Yes! Store in Supabase after first lookup. Uncomment the internal database function.

---

## 📞 Support

**Database not working?**
1. Check browser console for errors
2. Verify API key in `.env.local`
3. Check API service status
4. Test with known-good barcodes

**Need help?**
- Open Food Facts: https://slack.openfoodfacts.org/
- UPCitemdb: support@upcitemdb.com
- Barcode Lookup: https://www.barcodelookup.com/contact

---

## 🎯 Quick Start Checklist

- [x] Open Food Facts (works out of the box)
- [x] UPCitemdb (100 free/day)
- [ ] Get UPCitemdb API key for unlimited
- [ ] Get Barcode Lookup key ($20/month)
- [ ] Enable internal database lookup
- [ ] Import your product catalog (optional)

---

**Your current setup is ready to scan!** 🎉

Open Food Facts and UPCitemdb (free tier) are already working. Start scanning and add more databases as needed.
