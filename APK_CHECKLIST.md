# ✅ APK Generation Checklist

**Use this checklist to track your APK generation progress**

---

## 📋 Prerequisites

- [ ] **Node.js 22+** installed
- [ ] **JDK 17+** installed
  - Download: https://adoptium.net/
- [ ] **Android Studio** installed
  - Download: https://developer.android.com/studio
- [ ] **Environment variables** configured
  - ANDROID_HOME set
  - PATH includes Android SDK tools

---

## 🔧 First-Time Setup

- [ ] **Install Capacitor** packages
  ```bash
  npm install @capacitor/core @capacitor/cli @capacitor/android
  ```

- [ ] **Build web app**
  ```bash
  npm run build
  ```

- [ ] **Initialize Android platform**
  ```bash
  npx cap add android
  ```

- [ ] **Sync web app to Android**
  ```bash
  npx cap sync android
  ```

---

## 🔐 Keystore Setup (One-Time)

- [ ] **Create keystore file**
  - Location: `android/arali-release-key.jks`
  - Password: `____________` (write it down!)
  - Alias: `arali-release`

- [ ] **Backup keystore file**
  - Save to secure location
  - Store password safely
  - ⚠️ **You cannot update app without this!**

---

## 🏗️ Build APK

- [ ] **Open Android Studio**
  ```bash
  npx cap open android
  ```

- [ ] **Wait for Gradle sync** to complete

- [ ] **Generate Signed APK**
  - Menu: Build → Generate Signed Bundle / APK
  - Select: APK
  - Keystore: Use `arali-release-key.jks`
  - Build type: **release**

- [ ] **Find APK file**
  - Location: `android/app/build/outputs/apk/release/app-release.apk`

---

## ✅ Testing

- [ ] **Install on test device**
  - Transfer APK to Android phone
  - Enable "Install Unknown Apps"
  - Install and open

- [ ] **Test offline functionality**
  - Turn off internet
  - App should still work

- [ ] **Test all features**
  - Navigation works
  - All screens load
  - No crashes

- [ ] **Check app icon**
  - Shows correctly on home screen

- [ ] **Test on multiple devices**
  - Different Android versions
  - Different screen sizes

---

## 📦 Distribution

### Option 1: Direct Distribution
- [ ] Share APK file via:
  - [ ] Email
  - [ ] Google Drive / Dropbox
  - [ ] Website download
  - [ ] QR code

### Option 2: Google Play Store
- [ ] Create Google Play Developer account ($25)
- [ ] Create app listing
  - [ ] App name: Arali
  - [ ] Description
  - [ ] Screenshots (min 2)
  - [ ] Privacy policy URL
- [ ] Upload APK/AAB
- [ ] Submit for review
- [ ] Wait for approval (1-3 days)

**📖 Complete Distribution Guide:** [DISTRIBUTION_GUIDE.md](./DISTRIBUTION_GUIDE.md)

---

## 🔄 Updates

When making changes:

- [ ] Update web app code
- [ ] Build web app
  ```bash
  npm run build
  ```
- [ ] Sync to Android
  ```bash
  npx cap sync android
  ```
- [ ] Rebuild APK in Android Studio
- [ ] Test new version
- [ ] Distribute updated APK

---

## 📝 Notes

**Keystore Password:** `________________`

**Keystore Location:** `________________`

**APK Version:** `________________`

**Release Date:** `________________`

**Distribution Method:** `________________`

---

## 🆘 Troubleshooting

Common issues and solutions:

### Gradle build failed
- [ ] Clear cache: `cd android && ./gradlew clean`
- [ ] Invalidate Android Studio caches
- [ ] Update Gradle wrapper

### Cannot install APK
- [ ] Enable "Install Unknown Apps"
- [ ] Uninstall old version first
- [ ] Check package ID matches

### Keystore not found
- [ ] Verify file path is correct
- [ ] Ensure keystore file exists
- [ ] Check file permissions

---

## ✅ Final Checklist Before Release

- [ ] **App tested on multiple devices**
- [ ] **All features working offline**
- [ ] **No crashes or errors**
- [ ] **App icon displays correctly**
- [ ] **Splash screen works**
- [ ] **Keystore backed up safely**
- [ ] **APK file size reasonable** (~10-20 MB)
- [ ] **Version number updated**
- [ ] **Release notes prepared**

---

## 📚 Need Help?

- Quick Guide: [QUICK_START_APK.md](./QUICK_START_APK.md)
- Full Guide: [APK_GENERATION_GUIDE.md](./APK_GENERATION_GUIDE.md)
- PWA Docs: [docs/PWA_IMPLEMENTATION.md](./docs/PWA_IMPLEMENTATION.md)

---

**🎉 When all checked, your APK is ready for distribution!**