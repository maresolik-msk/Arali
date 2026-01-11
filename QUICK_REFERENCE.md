# ⚡ Arali Quick Reference Card

**One-page cheat sheet for building, distributing, and managing Arali**

---

## 🎯 Choose Your Path

| Method | Time | Cost | Platforms | Difficulty |
|--------|------|------|-----------|------------|
| **PWA** | 5 min | Free | iOS, Android, Desktop | ⭐ Easy |
| **Android APK** | 30 min | Free | Android only | ⭐⭐ Medium |
| **Play Store** | 1-3 days | $25 | Android only | ⭐⭐⭐ Advanced |

---

## 📱 PWA Deployment (5 Minutes)

```bash
npm run build
vercel deploy
# Done! Share link with users
```

**Deploy to:**
- Vercel: `vercel deploy`
- Netlify: Drag & drop `dist/`
- Firebase: `firebase deploy`

---

## 🤖 Android APK (30 Minutes)

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Build web app
npm run build

# 3. Add Android
npx cap add android

# 4. Sync
npx cap sync android

# 5. Open Android Studio
npx cap open android

# 6. Build APK
# Build → Generate Signed Bundle / APK
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔄 Update Workflow

### PWA
```bash
npm run build
vercel deploy
# Users auto-update
```

### APK
```bash
npm run build
npx cap sync android
npx cap open android
# Rebuild APK in Android Studio
```

---

## 📦 Distribution

### Direct APK
- Email, Google Drive, website
- Users enable "Unknown Apps"
- Install directly

### Play Store
- $25 one-time fee
- 1-3 day review
- Automatic updates

---

## 🆘 Quick Links

| Need | Link |
|------|------|
| **New? Start here** | [GETTING_STARTED.md](./GETTING_STARTED.md) |
| **PWA Setup** | [docs/PWA_IMPLEMENTATION.md](./docs/PWA_IMPLEMENTATION.md) |
| **Quick APK** | [QUICK_START_APK.md](./QUICK_START_APK.md) |
| **Full APK Guide** | [APK_GENERATION_GUIDE.md](./APK_GENERATION_GUIDE.md) |
| **Distribution** | [DISTRIBUTION_GUIDE.md](./DISTRIBUTION_GUIDE.md) |
| **Checklist** | [APK_CHECKLIST.md](./APK_CHECKLIST.md) |

---

## 🛠️ Prerequisites

### PWA
- ✅ Node.js 22+
- ✅ HTTPS hosting

### APK
- ✅ Above + JDK 17+
- ✅ Android Studio
- ✅ Capacitor packages

---

## 🔐 Important

**Keystore:**
- Location: `android/arali-release-key.jks`
- ⚠️ **BACKUP SAFELY!**
- ⚠️ **Cannot update app without it**

---

## 🎯 Common Commands

```bash
# Build production
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android

# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
```

---

## ✅ Pre-Launch Checklist

- [ ] Tested on multiple devices
- [ ] Offline mode works
- [ ] No crashes
- [ ] Keystore backed up
- [ ] Privacy policy ready
- [ ] Support email active

---

## 📊 File Sizes

- **Web (dist/):** ~5-8 MB
- **APK (Debug):** ~15-25 MB
- **APK (Release):** ~10-20 MB

---

## 🎉 Quick Wins

**Deploy PWA NOW:**
```bash
npm run build && vercel deploy
```

**Test APK NOW:**
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Gradle build fails | `cd android && ./gradlew clean` |
| Cannot install APK | Enable "Unknown Apps" |
| Keystore not found | Check file path |
| PWA not installing | Need HTTPS hosting |

---

## 📞 Get Help

- **Docs:** See links above
- **Capacitor:** https://capacitorjs.com/docs
- **PWA Guide:** https://web.dev/progressive-web-apps/
- **Play Store:** https://support.google.com/googleplay/android-developer

---

**Built with ❤️ by MARESOLIK INC**  
*Smart Retail. Zero Waste.*

**Ready to launch? Pick PWA or APK and go! 🚀**
