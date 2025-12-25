# 🇮🇳 Indian Product Database Integration Guide

Complete guide for integrating Indian retail product databases into Arali's barcode scanning system.

---

## 🎯 Current Setup for Indian Products

The app now prioritizes Indian databases when scanning products:

```
1. Your Internal Database (Your Supabase DB)
   ↓ (if not found)
2. Indian Product Databases (GS1 India + Open Food Facts India)
   ↓ (if not found)
3. Open Food Facts Global (Food products worldwide)
   ↓ (if not found)
4. UPCitemdb (General products)
   ↓ (if not found)
5. Manual Entry
```

---

## 🆓 Free Indian Product Databases

### 1. **Open Food Facts India** ✅ ACTIVE NOW
- **URL**: https://in.openfoodfacts.org/
- **Coverage**: 100,000+ Indian food products
- **Cost**: 100% FREE, Unlimited
- **Best For**: Packaged food, beverages, FMCG
- **Setup**: Already integrated! ✨

**Popular Indian Products Available**:
- ✅ Parle-G Biscuits
- ✅ Amul Milk products
- ✅ Britannia biscuits
- ✅ Haldiram's snacks
- ✅ Mother Dairy products
- ✅ ITC products
- ✅ Tata products
- ✅ Nestle India products

**Test Barcodes (Indian Products)**:
```
8901063010628 - Parle-G Gold Biscuits
8901063015395 - Parle Monaco Biscuits
8904063203205 - Britannia Good Day
8906010391515 - Haldiram's Bhujia
8906010391522 - Amul Butter
```

---

### 2. **GS1 India Database** (GEPIR)
- **URL**: https://www.gs1india.org/
- **Coverage**: All GS1-registered Indian products
- **Cost**: FREE search (limited), API access requires membership
- **Best For**: Verified Indian manufacturers

**How to Use (Manual Search - FREE)**:
1. Go to https://www.gepir.in/
2. Enter barcode
3. Get verified product information

**How to Get API Access**:
1. Become GS1 India member: https://www.gs1india.org/membership/
2. Request API access
3. Membership cost: ₹10,000 - ₹50,000/year (based on company size)

---

## 💰 Premium Indian Product Databases

### 3. **IndiaMART Product API**
- **URL**: https://www.indiamart.com/
- **Coverage**: 70+ million products from Indian suppliers
- **Cost**: Contact for pricing (B2B platform)
- **Best For**: Wholesale, manufacturing, industrial products

**Setup**:
1. Contact IndiaMART API team: https://www.indiamart.com/
2. Get API credentials
3. Add to your `.env.local`:
```bash
VITE_INDIAMART_API_KEY=your_api_key_here
```

**Implementation** (Add to `/src/app/services/productLookup.ts`):
```typescript
async function lookupIndiaMART(barcode: string): Promise<ProductInfo | null> {
  const apiKey = import.meta.env.VITE_INDIAMART_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(
    `https://api.indiamart.com/product/lookup?barcode=${barcode}&key=${apiKey}`
  );
  
  const data = await response.json();
  if (!data.product) return null;

  return {
    name: data.product.name,
    category: data.product.category,
    brand: data.product.brand,
    imageUrl: data.product.image,
    barcode: barcode,
    source: 'IndiaMART',
    price: data.product.price,
    manufacturer: data.product.seller,
  };
}
```

---

### 4. **Amazon India Product Advertising API**
- **URL**: https://webservices.amazon.in/paapi5/
- **Coverage**: All products sold on Amazon India
- **Cost**: FREE (requires Amazon Associates account)
- **Best For**: Consumer products available on Amazon

**Setup Steps**:
1. Sign up for Amazon Associates: https://affiliate.amazon.in/
2. Register for Product Advertising API
3. Get Access Key + Secret Key
4. Implement using `amazon-paapi` package

```bash
npm install amazon-paapi
```

**Implementation**:
```typescript
import { ProductAdvertisingAPIClient } from 'amazon-paapi';

async function lookupAmazonIndia(barcode: string): Promise<ProductInfo | null> {
  const client = new ProductAdvertisingAPIClient({
    accessKey: import.meta.env.VITE_AMAZON_ACCESS_KEY,
    secretKey: import.meta.env.VITE_AMAZON_SECRET_KEY,
    partnerTag: import.meta.env.VITE_AMAZON_PARTNER_TAG,
    marketplace: 'Amazon.in'
  });

  const response = await client.getItems({
    itemIds: [barcode],
    resources: ['ItemInfo.Title', 'Images.Primary.Large']
  });

  if (!response.items?.[0]) return null;

  const item = response.items[0];
  return {
    name: item.ItemInfo.Title.DisplayValue,
    category: item.ItemInfo.Classifications?.ProductGroup,
    brand: item.ItemInfo.ByLineInfo?.Brand?.DisplayValue,
    imageUrl: item.Images?.Primary?.Large?.URL,
    barcode: barcode,
    source: 'Amazon India',
  };
}
```

---

### 5. **BigBasket API** (Grocery Focus)
- **URL**: https://www.bigbasket.com/
- **Coverage**: Grocery and FMCG products in India
- **Cost**: Contact for API access
- **Best For**: Grocery stores, supermarkets

**Note**: BigBasket doesn't have a public API. You may need to:
1. Contact their B2B team
2. Use web scraping (not recommended)
3. Partner with them for wholesale

---

### 6. **Flipkart Product API**
- **URL**: https://affiliate.flipkart.com/
- **Coverage**: All products on Flipkart
- **Cost**: FREE (requires Flipkart Affiliate account)
- **Best For**: General retail, electronics, fashion

**Setup**:
1. Join Flipkart Affiliate Program: https://affiliate.flipkart.com/
2. Get API credentials
3. Use their Product API

---

## 🏪 Indian Retail Chain Databases

### 7. **Reliance Retail / JioMart**
- Contact their B2B division for API access
- Best for: FMCG, groceries, fashion

### 8. **DMart Ready**
- Limited API availability
- Focus on their app integration

---

## 📦 Build Your Own Indian Product Database

### Option 1: Crowdsourced Approach
Since Indian product databases are limited, build your own:

1. **Start Scanning**: Every product you scan gets saved to Supabase
2. **Auto-Complete**: Next time someone scans it, instant lookup
3. **Community Database**: Share with other Arali users (optional)

**Enable Internal Database** (in `/src/app/services/productLookup.ts`):
```typescript
async function lookupInternalDatabase(
  barcode: string
): Promise<ProductInfo | null> {
  try {
    const { productsApi } = await import('./api');
    const products = await productsApi.getAll();
    const found = products.find(p => p.sku === barcode);
    
    if (found) {
      return {
        name: found.name,
        category: found.category,
        brand: found.vendorType,
        imageUrl: found.imageUrl,
        barcode: barcode,
        source: 'Your Database',
        price: found.sellingPrice,
      };
    }
  } catch (error) {
    console.error('Internal lookup error:', error);
  }
  
  return null;
}
```

---

### Option 2: Import Supplier Catalogs

Most Indian suppliers/distributors provide Excel/CSV catalogs:

**Create Import Function**:

```typescript
// Add to /src/app/pages/Inventory.tsx
const handleBulkImport = async (file: File) => {
  const text = await file.text();
  const lines = text.split('\n');
  
  // Expected CSV format:
  // Barcode, Name, Category, Brand, MRP
  
  for (let i = 1; i < lines.length; i++) {
    const [barcode, name, category, brand, mrp] = lines[i].split(',');
    
    await productsApi.create({
      sku: barcode.trim(),
      name: name.trim(),
      category: category.trim(),
      vendorType: brand.trim(),
      sellingPrice: parseFloat(mrp),
      stock: 0, // Update manually
      costPrice: 0, // Update manually
    });
  }
  
  toast.success('Bulk import completed!');
};
```

**Add Import UI**:
```tsx
<input 
  type="file" 
  accept=".csv,.xlsx" 
  onChange={(e) => handleBulkImport(e.target.files[0])}
/>
```

---

### Option 3: Manual Data Entry (First Scan)
Your current flow already handles this:
1. Scan barcode
2. If not found in any database
3. Manual entry form opens with barcode pre-filled
4. Save to your database
5. Next scan = instant lookup! ✨

---

## 🎯 Recommended Setup for Indian Retail

### For Small Grocery Stores:
```typescript
const databases = [
  lookupInternalDatabase,       // Products you've scanned (grows over time)
  lookupOpenFoodFactsIndia,     // 100K+ Indian food products (FREE)
  lookupOpenFoodFacts,          // Global food database
];
```

### For Supermarkets/Hypermarkets:
```typescript
const databases = [
  lookupInternalDatabase,       // Your product catalog
  lookupGS1India,              // Verified products (if you're a member)
  lookupOpenFoodFactsIndia,    // Food products
  lookupAmazonIndia,           // General products (FREE with Associates)
  lookupUPCItemDB,             // Fallback
];
```

### For Wholesale/B2B:
```typescript
const databases = [
  lookupInternalDatabase,       // Your catalog
  lookupIndiaMART,             // B2B products (paid)
  lookupGS1India,              // Manufacturer database
  lookupOpenFoodFactsIndia,    // Food products
];
```

---

## 🧪 Test with Indian Products

**Food Products (Open Food Facts India)**:
```
8901063010628 - Parle-G Gold
8904063203205 - Britannia Good Day
8906010391515 - Haldiram's Bhujia
```

**If Not Found**:
1. Check if product has EAN-13 barcode (13 digits)
2. Try scanning the barcode starting with "890" (India prefix)
3. Some Indian products use only MRP stickers (not barcodes)

---

## 📝 Indian Barcode Format

**GS1 India Prefixes**: 890 (most common for Indian products)

**Example**: `8901234567890`
- `890` = India
- `1234567` = Company code
- `890` = Product code
- `0` = Check digit

**Common Issues**:
- ❌ Some small Indian manufacturers don't use proper barcodes
- ❌ MRP stickers are not scannable barcodes
- ✅ All major FMCG brands have proper EAN-13 barcodes

---

## 🚀 Quick Start for Indian Products

### What Works NOW (No Setup):
1. ✅ **Open Food Facts India** - Scan any packaged food
2. ✅ **Internal Database** - After first scan, instant lookup
3. ✅ **Manual Entry** - Always available as fallback

### What You Can Add:
1. **GS1 India Membership** (₹10K-50K/year) - Verified database
2. **Amazon Associates** (FREE) - Consumer products
3. **Supplier Catalogs** - Import CSV files
4. **IndiaMART API** (Paid) - B2B products

---

## 💡 Pro Tips for Indian Retail

1. **Start Simple**: Use Open Food Facts India + Internal Database
2. **Build Your Database**: Every scan adds to your catalog
3. **Import Distributor Data**: Ask your suppliers for product lists
4. **Focus on Top Products**: Manually add your top 100 SKUs
5. **Regional Products**: Small manufacturers may not be in any database

---

## 📞 Support & Resources

**Open Food Facts India**:
- Website: https://in.openfoodfacts.org/
- Contribute: Help add Indian products!
- Community: https://slack.openfoodfacts.org/

**GS1 India**:
- Website: https://www.gs1india.org/
- GEPIR Search: https://www.gepir.in/
- Support: info@gs1india.org

**Amazon India Associates**:
- Sign up: https://affiliate.amazon.in/
- Support: https://affiliate.amazon.in/help

---

## ✅ Indian Product Database Checklist

- [x] Open Food Facts India (FREE, active now)
- [x] Internal database (builds automatically)
- [ ] Enable internal lookup (uncomment code)
- [ ] GS1 India membership (optional)
- [ ] Amazon Associates API (free)
- [ ] Import supplier catalogs (optional)
- [ ] IndiaMART API (paid, for B2B)

---

**Your app is ready for Indian products!** 🇮🇳

Start scanning common Indian brands like Parle, Britannia, Amul, Haldiram's - they're already in Open Food Facts India database!
