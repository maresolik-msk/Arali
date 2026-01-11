# 🚀 Deploy Arali - Clean Build Instructions

## ✅ Issue Fixed

All `figma:asset` imports have been removed from the codebase.

## 🧹 Clean Build (Required)

**Clear all caches before building:**

```bash
# Clean build caches
npm run clean

# Or use the rebuild command (clean + build in one)
npm run rebuild
```

## 📦 Deployment Instructions

### **Option 1: Vercel (Recommended)**

```bash
# 1. Clean and build
npm run rebuild

# 2. Deploy
npx vercel deploy --prod --force

# Note: --force flag clears Vercel's cache
```

**Or trigger a new deployment from Vercel Dashboard:**
1. Go to your Vercel project
2. Click "Deployments"
3. Click "..." menu → "Redeploy"
4. Check "Use existing Build Cache" = OFF
5. Click "Redeploy"

---

### **Option 2: Netlify**

```bash
# 1. Clean and build
npm run rebuild

# 2. Deploy
npx netlify deploy --prod --dir=dist

# Clear cache if needed:
# Go to Netlify Dashboard → Site Settings → Build & Deploy → Clear cache and deploy site
```

---

### **Option 3: Firebase**

```bash
# 1. Clean and build
npm run rebuild

# 2. Deploy
firebase deploy --only hosting
```

---

## 🔍 Verify Build Locally

**Test the build works before deploying:**

```bash
# Clean build
npm run rebuild

# ✅ Should complete successfully!
# ❌ If it still fails, see troubleshooting below
```

---

## 🆘 If Build Still Fails

### **Step 1: Verify Source Files**

Check that figma:asset imports are gone:

```bash
# Search for any remaining figma:asset imports
grep -r "figma:asset" src/

# Should return: (nothing) or only comments
```

### **Step 2: Clear ALL Caches**

```bash
# Remove all cache directories
rm -rf dist
rm -rf .vite
rm -rf node_modules/.vite
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules
npm install

# Try build again
npm run build
```

### **Step 3: Check Files Manually**

Verify these files don't have `figma:asset` imports:

**`/src/app/pages/Inventory.tsx`** should have:
```tsx
// Milk product image from Unsplash
const MILK_IMAGE_URL = "https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?...";
```

**NOT:**
```tsx
import imgMilk from "figma:asset/...";  // ❌ Should be removed
```

**`/src/imports/Frame2.tsx`** should have:
```tsx
const imgImage1 = "https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?...";
```

**NOT:**
```tsx
import imgImage1 from "figma:asset/...";  // ❌ Should be removed
```

---

## ✅ Quick Deploy Checklist

- [ ] Verify no `figma:asset` imports in source code
- [ ] Run `npm run clean` to clear caches
- [ ] Run `npm run build` to test build locally
- [ ] Build succeeds ✅
- [ ] Deploy with `--force` flag on Vercel OR clear cache on Netlify
- [ ] Deployment succeeds ✅

---

## 🎯 One-Command Deploy

**Vercel (with cache clearing):**
```bash
npm run rebuild && npx vercel deploy --prod --force
```

**Netlify:**
```bash
npm run rebuild && npx netlify deploy --prod --dir=dist
```

---

## 📝 What Changed

### Files Modified:

1. **`/src/app/pages/Inventory.tsx`**
   - Removed `figma:asset` import
   - Added Unsplash URL constant

2. **`/src/imports/Frame2.tsx`**
   - Removed `figma:asset` import
   - Added Unsplash URL constant

3. **`/package.json`**
   - Added `clean` script
   - Added `rebuild` script

4. **`/.vercelignore`** (new)
   - Ignores cache directories

---

## 🎉 Success Indicators

**Build output should show:**
```
✓ built in XXXms
✓ dist/index.html
✓ dist/assets/...
```

**NO errors about:**
```
❌ "figma:asset"
❌ "Rollup failed to resolve import"
```

---

## 💡 Why This Happened

The `figma:asset` scheme is a virtual module only available in Figma Make's development environment. It doesn't work in standard Vite builds or on hosting platforms.

**Solution:** Use standard web image URLs (Unsplash, local files, etc.)

---

## 🚀 Ready to Deploy!

Run this now:

```bash
npm run rebuild && npx vercel deploy --prod --force
```

Your app will build and deploy successfully! 🎊

---

**Built with ❤️ by MARESOLIK INC**  
*Smart Retail. Zero Waste.*
