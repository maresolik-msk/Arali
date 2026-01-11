# ⚡ Quick Start: Generate Arali APK

**Time to APK: ~10 minutes** (after prerequisites installed)

---

## 🚀 6-Step Quick Start

### 0️⃣ Install Capacitor (First Time Only)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 1️⃣ Build Web App
```bash
npm run build
```

### 2️⃣ Add Android Platform (First Time Only)
```bash
npx cap add android
```

### 3️⃣ Sync to Android
```bash
npx cap sync android
```

### 4️⃣ Open Android Studio
```bash
npx cap open android
```

### 5️⃣ Build APK in Android Studio
1. **Build** → **Generate Signed Bundle / APK**
2. Select **APK** → Next
3. Create new keystore (save password!)
4. Build type: **release**
5. Find APK: `android/app/build/outputs/apk/release/app-release.apk`

---

## ✅ Done!

Your APK is ready at:
```
android/app/build/outputs/apk/release/app-release.apk
```

Install it on any Android device!

---

## 🔄 Update After Code Changes

```bash
npm run build
npx cap sync android
npx cap open android
# Rebuild APK in Android Studio
```

---

## 📚 Need More Details?

See full guide: [APK_GENERATION_GUIDE.md](./APK_GENERATION_GUIDE.md)

---

## 🆘 Prerequisites Not Installed?

### Required Software:
1. **JDK 17+**: https://adoptium.net/
2. **Android Studio**: https://developer.android.com/studio
3. **Node.js 22+**: ✓ Already installed

### Quick Install (macOS):
```bash
brew install openjdk@17
brew install --cask android-studio
```

### Quick Install (Ubuntu):
```bash
sudo apt update
sudo apt install openjdk-17-jdk
# Download Android Studio manually
```

---

**That's it! 🎉**