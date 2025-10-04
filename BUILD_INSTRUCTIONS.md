# Build Instructions for Android APK

## Overview

This document explains how to build the Dejoco Blocks Tetris game as an Android APK.

## What Was Added

The following files and configurations were added to enable Android APK compilation:

### 1. Capacitor Configuration
- **`package.json`**: Node.js package configuration with Capacitor dependencies and build scripts
- **`capacitor.config.json`**: Capacitor configuration defining the app ID, name, and web directory
- **`.gitignore`**: Git ignore file to exclude build artifacts, node_modules, and generated folders

### 2. GitHub Actions Workflow
- **`.github/workflows/build-apk.yml`**: Automated workflow that builds the APK on every push to main branch

### 3. Documentation
- **`README.md`**: Updated with Android build instructions
- **`BUILD_INSTRUCTIONS.md`**: This file with detailed build information

## How It Works

### Architecture

1. **Web App**: The game is built with HTML, CSS, and JavaScript
2. **Capacitor**: Wraps the web app in a native Android container
3. **Gradle**: Builds the Android APK from the Capacitor project

### Build Process

1. **Copy files**: Web files are copied from the root to the `www/` directory
2. **Sync**: Capacitor syncs the web files to the `android/` directory
3. **Build**: Gradle compiles the Android project into an APK

## Building Locally

### Prerequisites
- Node.js 18 or higher
- Java Development Kit (JDK) 17
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

4. Add Android platform (only needed once):
```bash
npx cap add android
```

5. Build the debug APK:
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Alternative: Using NPM Scripts

You can also use the convenience scripts defined in package.json:

```bash
npm run android:build          # Build debug APK
npm run android:build:release  # Build release APK (unsigned)
```

## GitHub Actions Automated Builds

Every push to the main branch automatically triggers the build workflow:

1. The workflow installs dependencies
2. Builds the web app
3. Syncs with Capacitor
4. Builds the debug APK
5. Uploads the APK as an artifact

### Accessing Built APKs

1. Go to the "Actions" tab in the GitHub repository
2. Click on the latest workflow run
3. Download the APK from the "Artifacts" section
4. The APK is retained for 30 days

### Manual Workflow Trigger

You can also manually trigger a build that includes both debug and release APKs:

1. Go to the "Actions" tab
2. Select "Build Android APK" workflow
3. Click "Run workflow"
4. Choose the branch (usually main)
5. Click "Run workflow"

This will build both debug and release versions.

## Installing the APK on Android

### Method 1: Direct Installation
1. Download the APK to your Android device
2. Open the APK file
3. Allow installation from unknown sources if prompted
4. Install the app

### Method 2: ADB Installation
1. Enable USB debugging on your Android device
2. Connect your device to your computer
3. Run:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Customization

### Changing App Name or ID
Edit `capacitor.config.json`:
```json
{
  "appId": "com.yourcompany.yourapp",
  "appName": "Your App Name",
  "webDir": "www"
}
```

### Adding App Icon
1. Create icons in various sizes (see Android icon guidelines)
2. Place them in `android/app/src/main/res/` directories
3. Update `android/app/src/main/AndroidManifest.xml`

### Signing the Release APK
For production releases, you need to sign the APK:

1. Create a keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing in `android/app/build.gradle`
3. Build the signed APK:
```bash
./gradlew assembleRelease
```

## Troubleshooting

### Build Fails with "SDK not found"
- Ensure Android SDK is installed
- Set ANDROID_HOME environment variable

### Gradle Errors
- Try cleaning the build:
```bash
cd android
./gradlew clean
```

### Capacitor Sync Issues
- Delete the android folder and regenerate:
```bash
rm -rf android
npx cap add android
```

## Support

For issues specific to:
- **Capacitor**: https://capacitorjs.com/docs
- **Android Build**: https://developer.android.com/studio/build
- **This Project**: Open an issue on GitHub
