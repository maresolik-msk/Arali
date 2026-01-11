# App Icons Directory

This directory should contain all PWA app icons.

## Required Icons:

Generate PNG images with these exact sizes:
- icon-16x16.png
- icon-32x32.png
- icon-72x72.png
- icon-96x96.png
- icon-120x120.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-180x180.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Design Specifications:

**Brand Colors:**
- Primary: #0F4C81 (Arali Blue)
- Secondary: #082032 (Dark Blue)
- Background: Solid #0F4C81

**Content:**
- White "A" lettermark or Arali logo
- Keep design within 80% safe area (for rounded corners)
- Architectural, premium aesthetic

## Quick Generation:

### Option 1: Automated Tool
```bash
# Install PWA Asset Generator
npx pwa-asset-generator logo.svg public/icons

# Or use specific options
npx pwa-asset-generator logo.svg public/icons \
  --background "#0F4C81" \
  --icon-only \
  --favicon \
  --maskable
```

### Option 2: Online Tool
1. Visit https://realfavicongenerator.net/
2. Upload a 512x512 PNG master icon
3. Download generated package
4. Extract to this directory

### Option 3: Figma Template
1. Create 512x512 artboard
2. Background: Solid #0F4C81
3. Add white "A" or logo (centered, 80% size)
4. Export as PNG at 1x resolution
5. Use image resizer for other sizes

## Temporary Placeholder:

Until you create custom icons, create a simple colored square:
- Any image editor
- Solid #0F4C81 background
- Optional: White "A" text in center
- Save as icon-512x512.png
- Resize for other dimensions

The PWA will work without icons, but users will see a generic icon on their home screen.
