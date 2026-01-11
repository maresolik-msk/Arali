# Arali - Smart Retail Management App

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-success)](./docs/PWA_IMPLEMENTATION.md)
[![APK Generation](https://img.shields.io/badge/APK-Ready-blue)](./QUICK_START_APK.md)
[![Distribution](https://img.shields.io/badge/Distribution-Ready-green)](./DISTRIBUTION_GUIDE.md)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-3ECF8E)](https://supabase.com/)

> **Premium mobile-first retail management app** by **MARESOLIK INC**  
> Featuring Digital Craftsmanship design, glassmorphic UI, and comprehensive business tools

**📖 New? Start here:** [GETTING_STARTED.md](./GETTING_STARTED.md)  
**📚 All Documentation:** [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

---

## ✨ Features

### 🏪 **Business Management**
- **POS Operations** - Fast checkout with barcode scanning
- **Inventory Management** - AI-powered stock tracking
- **Dashboard Analytics** - Real-time business insights
- **Smart Integrations** - Voice commands & automation

### 📱 **Progressive Web App (PWA)**
- ✅ **Offline Capability** - Works without internet
- ✅ **Installable** - Runs like native app on mobile & desktop
- ✅ **Fast Performance** - Service worker caching
- ✅ **Push Notifications** - Stay updated

### 🤖 **Native Android App**
- 📦 **Generate APK** - Create installable Android app
- 🏪 **Play Store Ready** - Publish to Google Play
- 📲 **Direct Install** - Sideload APK file

---

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Progressive Web App (PWA)

The app is **already a PWA**! Deploy to any HTTPS hosting:

```bash
# Build
npm run build

# Deploy to Vercel, Netlify, etc.
# Users can install directly from browser
```

**Installation Guide:** See [PWA_IMPLEMENTATION.md](./docs/PWA_IMPLEMENTATION.md)

### Generate Android APK

Want a native Android app? Follow the quick guide:

**📖 [Quick Start APK Guide](./QUICK_START_APK.md)** - 10 minutes to APK

Or see the detailed guide:

**📚 [Complete APK Generation Guide](./APK_GENERATION_GUIDE.md)** - Everything you need

**Quick Steps:**
```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Build web app
npm run build

# 3. Add Android platform
npx cap add android

# 4. Sync to Android
npx cap sync android

# 5. Open in Android Studio
npx cap open android

# 6. Build APK in Android Studio
# Build → Generate Signed Bundle / APK
```

---

## 📦 Distribution

### **Option 1: PWA (Recommended)**
- ✅ Deploy to HTTPS hosting
- ✅ Users install from browser
- ✅ Works on iOS, Android, Desktop
- ✅ Instant updates
- ✅ No app store fees

### **Option 2: Android APK**
- 📱 Distribute APK file directly
- 🏪 Publish to Google Play Store ($25 fee)
- 📦 Alternative stores (Amazon, Samsung, etc.)

**📖 Complete Distribution Guide:** [DISTRIBUTION_GUIDE.md](./DISTRIBUTION_GUIDE.md)

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3.1** - UI library
- **Tailwind CSS 4** - Utility-first styling
- **Vite** - Build tool
- **React Router 7** - Navigation

### **UI Components**
- **Radix UI** - Accessible components
- **Material UI** - Design system
- **Motion** - Animations
- **Lucide React** - Icons

### **Backend**
- **Supabase** - Database & authentication
- **Edge Functions** - Serverless APIs

### **Mobile**
- **Capacitor 8** - Native app framework
- **Service Workers** - Offline support

---

## 📁 Project Structure

```
arali/
├── public/                 # Static assets
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   └── icons/            # App icons
├── src/
│   ├── app/
│   │   ├── components/   # React components
│   │   └── App.tsx       # Main app component
│   ├── styles/           # Global styles
│   └── utils/            # Utilities
├── docs/                 # Documentation
├── capacitor.config.json # Native app config
├── QUICK_START_APK.md   # Quick APK guide
└── APK_GENERATION_GUIDE.md # Complete APK guide
```

---

## 🎨 Design Philosophy

### **Digital Craftsmanship**
- Architectural typography
- Glassmorphic effects
- Monolithic aesthetics
- Premium feel

### **Mobile-First**
- Touch-optimized interface
- Responsive design
- Fast performance
- Offline capability

---

## 📱 Download

### **iOS & Android (PWA)**
Visit the app in your browser and tap "Install"

### **Android (APK)**
Generate your own APK using the guides above, or download from:
- Google Play Store (coming soon)
- Direct APK download (when available)

---

## 📚 Documentation

- **[Getting Started](./GETTING_STARTED.md)** - Choose your path (NEW!)
- **[How to Get Download Links](./HOW_TO_GET_DOWNLOAD_LINKS.md)** - Access download buttons & create links (NEW!)
- **[PWA Implementation](./docs/PWA_IMPLEMENTATION.md)** - Complete PWA setup
- **[Quick Start APK](./QUICK_START_APK.md)** - Fast APK generation
- **[APK Generation Guide](./APK_GENERATION_GUIDE.md)** - Detailed instructions
- **[Distribution Guide](./DISTRIBUTION_GUIDE.md)** - Play Store & direct distribution (NEW!)
- **[APK Checklist](./APK_CHECKLIST.md)** - Interactive progress tracker (NEW!)
- **[Quick Reference](./QUICK_REFERENCE.md)** - One-page cheat sheet (NEW!)
- **[Service Worker](./docs/SERVICE_WORKER_GUIDE.md)** - Offline functionality

---

## 🔧 Development

### Prerequisites
- Node.js 22+
- npm or pnpm

### Scripts
```bash
npm run build         # Build for production
npm run dev           # Development server (if configured)
```

### For APK Generation
- JDK 17+
- Android Studio
- See [APK_GENERATION_GUIDE.md](./APK_GENERATION_GUIDE.md)

---

## 🤝 Contributing

This is a proprietary product by MARESOLIK INC.

---

## 📄 License

Copyright © 2026 MARESOLIK INC. All rights reserved.

---

## 🆘 Support

### Documentation
- [PWA Setup](./docs/PWA_IMPLEMENTATION.md)
- [APK Generation](./APK_GENERATION_GUIDE.md)

### Resources
- [Capacitor Docs](https://capacitorjs.com/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [React Documentation](https://react.dev/)

---

## 🎉 Features

✅ Progressive Web App (PWA)  
✅ Android APK Generation  
✅ Offline Capability  
✅ Service Worker Caching  
✅ Push Notifications  
✅ Install Prompts  
✅ Full Documentation  
✅ Production Ready  

---

**Built with ❤️ by MARESOLIK INC**  
*Smart Retail. Zero Waste.*