# 📱 Arali APK Generation Guide

Complete guide to generate a native Android APK from your Arali PWA using Capacitor.

---

## 🎯 Quick Start (6 Steps)

### Step 0: Install Capacitor (First Time Only)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

This installs the Capacitor packages needed to generate native apps.

### Step 1: Build Your Web App

```bash
npm run build
```

This creates an optimized production build in the `/dist` folder.

### Step 2: Initialize Capacitor Android Platform

```bash
npx cap add android
```

This generates the `android/` directory with your native Android project.

### Step 3: Copy Web Assets to Android

```bash
npx cap sync android
```

This copies your built web app into the Android project.

### Step 4: Open in Android Studio

```bash
npx cap open android
```

Android Studio will open automatically.

### Step 5: Build APK in Android Studio

1. **Menu** → **Build** → **Generate Signed Bundle / APK**
2. Select **APK** → Click **Next**
3. **Create a new keystore** (or use existing):
   - Click **Create new...**
   - Choose location: `android/arali-release-key.jks`
   - Set password: `[your-secure-password]`
   - Alias: `arali-release`
   - Fill in your details (Name, Organization, etc.)
4. **Click Next** → **Select "release"** → **Finish**
5. **Find your APK** at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 📋 Detailed Instructions

### Prerequisites

#### Install Required Software:

1. **Node.js 22+** (Already installed ✓)
2. **JDK 17+**
   ```bash
   # macOS (using Homebrew)
   brew install openjdk@17
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install openjdk-17-jdk
   
   # Windows
   # Download from: https://adoptium.net/
   ```

3. **Android Studio**
   - Download: https://developer.android.com/studio
   - During installation, select:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device

4. **Configure Environment Variables**
   ```bash
   # Add to ~/.bashrc or ~/.zshrc (macOS/Linux)
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   
   # Windows: Set in System Environment Variables
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```

---

### Building Process

#### 1. Build Web App
```bash
npm run build
```

**Output:** `dist/` folder with optimized production files

#### 2. Add Android Platform (First Time Only)
```bash
npx cap add android
```

**What This Does:**
- Creates `android/` directory
- Generates native Android project structure
- Configures package ID: `com.maresolik.arali`
- Sets app name: "Arali"

#### 3. Sync Web App to Android
```bash
npx cap sync android
```

**What This Does:**
- Copies `dist/` contents to `android/app/src/main/assets/public`
- Updates native plugins
- Syncs configuration from `capacitor.config.json`

**Run this command every time you make changes to your web app!**

#### 4. Build Signed APK

**Option A: Using Android Studio (Recommended)**

1. Open the project:
   ```bash
   npx cap open android
   ```

2. Wait for Gradle sync to complete

3. Generate Signed APK:
   - **Build** → **Generate Signed Bundle / APK**
   - Select **APK**
   - Create or select keystore
   - Build type: **release**
   - Click **Finish**

4. Find APK:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

**Option B: Using Command Line**

1. Create keystore (first time only):
   ```bash
   cd android
   keytool -genkey -v -keystore arali-release-key.jks \
     -alias arali-release -keyalg RSA -keysize 2048 \
     -validity 10000 \
     -storepass [YOUR_PASSWORD] \
     -keypass [YOUR_PASSWORD] \
     -dname "CN=MARESOLIK INC, OU=Development, O=MARESOLIK, L=Your City, ST=Your State, C=US"
   ```

2. Build APK:
   ```bash
   cd android
   ./gradlew assembleRelease \
     -Pandroid.injected.signing.store.file=arali-release-key.jks \
     -Pandroid.injected.signing.store.password=[YOUR_PASSWORD] \
     -Pandroid.injected.signing.key.alias=arali-release \
     -Pandroid.injected.signing.key.password=[YOUR_PASSWORD]
   ```

3. Find APK:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 🔐 Keystore Management

### Create Keystore
```bash
keytool -genkey -v \
  -keystore android/arali-release-key.jks \
  -alias arali-release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### Important Notes:
- ✅ **Save your keystore file** (`arali-release-key.jks`)
- ✅ **Remember your passwords**
- ✅ **Backup your keystore** - You cannot update your app without it!
- ❌ **Never commit keystore to Git** (already in `.gitignore`)

### Keystore Info
```bash
keytool -list -v -keystore android/arali-release-key.jks
```

---

## 📦 APK Output

After building, you'll find:

```
android/app/build/outputs/apk/
├── debug/
│   └── app-debug.apk (unsigned, for testing)
└── release/
    └── app-release.apk (signed, for distribution)
```

### APK File Sizes (Approximate)
- **Unsigned Debug APK:** ~15-25 MB
- **Signed Release APK:** ~10-20 MB (optimized & minified)

---

## 🚀 Distribution Options

### Option 1: Direct Installation (Sideloading)

1. **Transfer APK** to Android device
2. **Enable "Install Unknown Apps":**
   - Settings → Security → Unknown Sources
   - Or: Settings → Apps → Special Access → Install Unknown Apps
3. **Open APK file** and tap "Install"

### Option 2: Google Play Store

1. **Create Developer Account** ($25 one-time fee)
   - https://play.google.com/console/signup

2. **Create New App**
   - App name: Arali
   - Default language: English
   - Type: App
   - Category: Business

3. **Upload APK/AAB**
   - Production → Create new release
   - Upload: `app-release.apk` or AAB bundle

4. **Complete Store Listing:**
   - Screenshots (min 2)
   - App description
   - Privacy policy URL
   - Contact details

5. **Submit for Review** (1-3 days)

### Option 3: Alternative App Stores
- **Amazon Appstore:** https://developer.amazon.com/apps-and-games
- **Samsung Galaxy Store:** https://seller.samsungapps.com/
- **Huawei AppGallery:** https://developer.huawei.com/consumer/en/appgallery

---

## 🔄 Update Workflow

When you make changes to your web app:

```bash
# 1. Make changes to React app
# ...

# 2. Build web app
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Open Android Studio (if needed)
npx cap open android

# 5. Build new APK
# (Follow Build APK steps above)
```

---

## 🛠️ Troubleshooting

### Issue: "Android Studio not found"
**Solution:**
```bash
# Set CAPACITOR_ANDROID_STUDIO_PATH
export CAPACITOR_ANDROID_STUDIO_PATH="/Applications/Android Studio.app"
```

### Issue: "Gradle build failed"
**Solutions:**
1. **Clear Gradle cache:**
   ```bash
   cd android
   ./gradlew clean
   ```

2. **Update Gradle wrapper:**
   ```bash
   cd android
   ./gradlew wrapper --gradle-version=8.5
   ```

3. **Invalidate Android Studio caches:**
   - File → Invalidate Caches → Invalidate and Restart

### Issue: "Keystore not found"
**Solution:**
- Make sure keystore path is correct
- Create new keystore if lost (but you can't update existing app!)

### Issue: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"
**Solution:**
- Uninstall old version first
- Ensure package ID matches: `com.maresolik.arali`

---

## 📝 NPM Scripts (Optional)

Add these to `package.json` for easier workflow:

```json
{
  "scripts": {
    "build": "vite build",
    "cap:sync": "cap sync android",
    "cap:open": "cap open android",
    "cap:build": "npm run build && cap sync android",
    "apk:debug": "cd android && ./gradlew assembleDebug",
    "apk:release": "cd android && ./gradlew assembleRelease"
  }
}
```

Then run:
```bash
npm run cap:build  # Build web + sync
npm run cap:open   # Open Android Studio
npm run apk:debug  # Quick debug APK
```

---

## 🎨 Customization

### App Icon

1. **Generate icons** (512x512 PNG):
   - https://icon.kitchen/
   - Upload: `/public/icon-512x512.png`

2. **Add to Android:**
   ```bash
   # Place icons in:
   android/app/src/main/res/
   ├── mipmap-hdpi/ic_launcher.png (72x72)
   ├── mipmap-mdpi/ic_launcher.png (48x48)
   ├── mipmap-xhdpi/ic_launcher.png (96x96)
   ├── mipmap-xxhdpi/ic_launcher.png (144x144)
   └── mipmap-xxxhdpi/ic_launcher.png (192x192)
   ```

3. **Sync:**
   ```bash
   npx cap sync android
   ```

### Splash Screen

Edit `android/app/src/main/res/drawable/splash.xml`

Or use `capacitor.config.json`:
```json
{
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#0F4C81",
      "showSpinner": true,
      "spinnerColor": "#FFFFFF"
    }
  }
}
```

### App Name

Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Arali</string>
<string name="title_activity_main">Arali - Smart Retail</string>
```

---

## 🔍 Testing

### Install Debug APK
```bash
# Build debug APK
cd android
./gradlew assembleDebug

# Install via ADB
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Run on Emulator
```bash
# List emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_5_API_33

# Install APK
adb install path/to/app-release.apk
```

### View Logs
```bash
adb logcat | grep Capacitor
```

---

## 📊 File Sizes

- **Web Build (dist/):** ~5-8 MB
- **Android APK (Debug):** ~15-25 MB
- **Android APK (Release):** ~10-20 MB
- **Android AAB (Bundle):** ~8-15 MB (smaller, for Play Store)

---

## ✅ Checklist

Before releasing:

- [ ] Test on multiple Android devices
- [ ] Verify all features work offline
- [ ] Check app permissions in manifest
- [ ] Test installation from APK file
- [ ] Verify splash screen displays correctly
- [ ] Test deep linking (if applicable)
- [ ] Check app icon on different launchers
- [ ] Review AndroidManifest.xml permissions
- [ ] Test on Android 8, 10, 12, 13+
- [ ] Verify signing with release keystore
- [ ] Backup keystore file safely

---

## 🎉 Success!

Your Arali APK is ready! You can now:

1. ✅ Install on any Android device
2. ✅ Distribute via Google Play Store
3. ✅ Share APK file directly
4. ✅ Publish to alternative app stores

---

## 🆘 Need Help?

### Capacitor Docs
- https://capacitorjs.com/docs/android

### Android Developer Docs
- https://developer.android.com/studio/publish

### Community Support
- Capacitor Discord: https://discord.gg/UPYYRhtyzp
- Stack Overflow: [android] [capacitor]

---

**Built with ❤️ by MARESOLIK INC**