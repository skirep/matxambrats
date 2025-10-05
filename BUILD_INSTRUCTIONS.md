# Build Instructions for Mobile Apps

## Overview

This document explains how to build the Dejoco Blocks Tetris game as an Android APK or iOS IPA.

## What Was Added

The following files and configurations were added to enable mobile app compilation:

### 1. Capacitor Configuration
- **`package.json`**: Node.js package configuration with Capacitor dependencies (Android & iOS) and build scripts
- **`capacitor.config.json`**: Capacitor configuration defining the app ID, name, and web directory for both platforms
- **`.gitignore`**: Git ignore file to exclude build artifacts, node_modules, and generated folders

### 2. GitHub Actions Workflows
- **`.github/workflows/build-apk.yml`**: Automated workflow that builds the Android APK on every push to main branch
- **`.github/workflows/build-ipa.yml`**: Automated workflow that builds the iOS IPA (simulator) on every push to main branch

### 3. Documentation
- **`README.md`**: Updated with Android and iOS build instructions
- **`BUILD_INSTRUCTIONS.md`**: This file with detailed build information
- **`PLAY_STORE_GUIDE.md`**: Complete guide for publishing to Google Play Store
- **`PLAY_STORE_QUICK_START.md`**: Quick reference for Play Store publishing
- **`APP_STORE_GUIDE.md`**: Complete guide for publishing to Apple App Store
- **`APP_STORE_QUICK_START.md`**: Quick reference for App Store publishing

## How It Works

### Architecture

1. **Web App**: The game is built with HTML, CSS, and JavaScript
2. **Capacitor**: Wraps the web app in native mobile containers (Android & iOS)
3. **Build Tools**: 
   - **Gradle**: Builds the Android APK
   - **Xcode**: Builds the iOS IPA

### Build Process

1. **Copy files**: Web files are copied from the root to the `www/` directory
2. **Sync**: Capacitor syncs the web files to the `android/` and/or `ios/` directories
3. **Build**: 
   - **Android**: Gradle compiles the Android project into an APK
   - **iOS**: Xcode compiles the iOS project into an IPA

## Building Locally

### Prerequisites

#### For Android
- Node.js 18 or higher
- Java Development Kit (JDK) 17
- Git

#### For iOS
- macOS (required)
- Xcode 14.0 or higher
- CocoaPods
- Node.js 18 or higher
- Git

### Steps

1. Clone the repository:
```bash
git clone https://github.com/skirep/tetris-three.js.git
cd tetris-three.js
```

2. Install dependencies:
```bash
npm install
```

3. Build the web app:
```bash
npm run build
```

4. Add mobile platforms:

**For Android:**
```bash
npx cap add android
```

**For iOS (macOS only):**
```bash
npx cap add ios
cd ios/App
pod install
cd ../..
```

5. Build the apps:

**Android Debug APK:**
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

**iOS (via Xcode):**
```bash
npx cap open ios
```
Then in Xcode: Product → Archive → Distribute App

### Alternative: Using NPM Scripts

You can also use the convenience scripts defined in package.json:

```bash
# Android
npm run android:build          # Build debug APK
npm run android:build:release  # Build release APK (unsigned)

# iOS
npm run ios:build              # Prepare for iOS build
npm run cap:open:ios           # Open in Xcode

# Both platforms
npm run cap:sync               # Sync changes to all platforms
```

## GitHub Actions Automated Builds

Every push to the main branch automatically triggers build workflows for both Android and iOS.

### Android APK Workflow

The Android workflow:
1. Installs dependencies
2. Builds the web app
3. Syncs with Capacitor
4. Builds the debug APK
5. Uploads the APK as an artifact

### iOS IPA Workflow

The iOS workflow:
1. Installs dependencies on a macOS runner
2. Builds the web app
3. Syncs with Capacitor
4. Installs CocoaPods dependencies
5. Builds the iOS app for simulator
6. Creates a simulator IPA
7. Uploads the IPA as an artifact

**Note:** The iOS workflow builds for the iOS Simulator (not physical devices) because building for devices requires code signing certificates and provisioning profiles from an Apple Developer account. The simulator IPA can be used for testing on macOS with Xcode Simulator.

### Accessing Built Artifacts

**For Android APKs:**
1. Go to the "Actions" tab in the GitHub repository
2. Click on the latest "Build Android APK" workflow run
3. Download the APK from the "Artifacts" section
4. The APK is retained for 30 days

**For iOS IPAs:**
1. Go to the "Actions" tab in the GitHub repository
2. Click on the latest "Build iOS IPA" workflow run
3. Download the simulator IPA from the "Artifacts" section
4. The IPA is retained for 30 days
5. You can install it on iOS Simulator in Xcode on macOS

### Manual Workflow Trigger

You can manually trigger builds for both platforms:

**Android:**
1. Go to the "Actions" tab
2. Select "Build Android APK" workflow
3. Click "Run workflow"
4. Choose the branch (usually main)
5. Click "Run workflow"

This will build both debug and release versions.

**iOS:**
1. Go to the "Actions" tab
2. Select "Build iOS IPA" workflow
3. Click "Run workflow"
4. Choose the branch (usually main)
5. Click "Run workflow"

This will build the simulator IPA.

## Installing the Builds

### Android APK on Android Devices

#### Method 1: Direct Installation
1. Download the APK to your Android device
2. Open the APK file
3. Allow installation from unknown sources if prompted
4. Install the app

#### Method 2: ADB Installation
1. Enable USB debugging on your Android device
2. Connect your device to your computer
3. Run:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### iOS IPA on iOS Simulator

The IPA built by GitHub Actions is for the iOS Simulator only. To install it:

1. Download the simulator IPA artifact from GitHub Actions
2. Extract the IPA file (it's a ZIP archive):
```bash
unzip dejoco-blocks-simulator.ipa
```
3. Open Xcode and launch iOS Simulator
4. Drag and drop the `Payload/App.app` to the simulator
5. Alternatively, use command line:
```bash
xcrun simctl install booted Payload/App.app
```

**For Physical iOS Devices:**
To build an IPA for physical devices, you need to:
1. Have an Apple Developer account
2. Set up code signing certificates and provisioning profiles
3. Build locally using Xcode with proper signing configuration
4. See `APP_STORE_GUIDE.md` for detailed instructions

## Customization

### Changing App Name or ID
Edit `capacitor.config.json`:
```json
{
  "appId": "com.yourcompany.yourapp",
  "appName": "Your App Name",
  "webDir": "www",
  "server": {
    "androidScheme": "https",
    "iosScheme": "https"
  }
}
```

### Adding App Icons

**Android:**
1. Create icons in various sizes (see Android icon guidelines)
2. Place them in `android/app/src/main/res/mipmap-*` directories
3. Update `android/app/src/main/AndroidManifest.xml`

**iOS:**
1. Create an App Icon Set (1024x1024 base image)
2. Use [App Icon Generator](https://www.appicon.co/) to generate all sizes
3. Replace contents of `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Signing for Production

**Android APK/AAB:**
1. Create a keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing in `android/app/build.gradle`
3. Build the signed APK:
```bash
./gradlew assembleRelease
```

See `PLAY_STORE_GUIDE.md` for complete instructions.

**iOS IPA:**
1. Create an Apple Developer account ($99/year)
2. Create certificates and provisioning profiles
3. Configure signing in Xcode (Signing & Capabilities)
4. Archive and distribute through Xcode

See `APP_STORE_GUIDE.md` for complete instructions.

## Troubleshooting

### Android Issues

**Build Fails with "SDK not found"**
- Ensure Android SDK is installed
- Set ANDROID_HOME environment variable

**Gradle Errors**
- Try cleaning the build:
```bash
cd android
./gradlew clean
```

**Capacitor Sync Issues**
- Delete the android folder and regenerate:
```bash
rm -rf android
npx cap add android
```

### iOS Issues

**Xcode not found**
- Ensure Xcode is installed from Mac App Store
- Run: `xcode-select --install`

**CocoaPods Errors**
- Update CocoaPods:
```bash
sudo gem install cocoapods
pod setup
```

**Pod Install Fails**
- Clean and reinstall:
```bash
cd ios/App
pod deintegrate
pod install
cd ../..
```

**Signing Errors**
- Ensure you have an Apple Developer account
- Check Bundle Identifier matches your App ID
- Enable "Automatically manage signing" in Xcode

**iOS Platform Issues**
- Delete and regenerate:
```bash
rm -rf ios
npx cap add ios
cd ios/App && pod install && cd ../..
```

## Support

For issues specific to:
- **Capacitor**: https://capacitorjs.com/docs
- **Android Build**: https://developer.android.com/studio/build
- **iOS Build**: https://capacitorjs.com/docs/ios
- **This Project**: Open an issue on GitHub
