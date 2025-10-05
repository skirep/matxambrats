# tetris-three.js
Tetris

## Dejoco Blocks - A Tetris Game by Dejoco Arts

A modern Tetris game built with HTML5, CSS3, and JavaScript. This game supports:
- Multiple languages (Català and English)
- In-game instructions screen with visual guides
- Mobile and desktop controls
- High scores with Firebase integration
- Background music
- Progressive difficulty levels
- Game Boy-inspired retro design

## Play Online

The game is deployed at: [GitHub Pages URL]

## Build Mobile Apps

This project can be compiled into Android APK and iOS IPA using Capacitor.

### Prerequisites

#### For Android
- Node.js 18 or higher
- Java Development Kit (JDK) 17
- Android SDK (automatically downloaded by Gradle)

#### For iOS
- macOS (required for iOS development)
- Xcode 14.0 or higher
- CocoaPods
- Node.js 18 or higher

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build the web app:
```bash
npm run build
```

3. Add mobile platforms:
```bash
# For Android
npx cap add android

# For iOS (macOS only)
npx cap add ios
cd ios/App && pod install && cd ../..
```

4. Sync with platforms:
```bash
npx cap sync
```

### Build Android APK

#### Debug APK
```bash
cd android
./gradlew assembleDebug
```

The APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Release APK
```bash
cd android
./gradlew assembleRelease
```

The APK will be located at: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

**Note:** For a production release, you'll need to sign the APK with a keystore.

### Build iOS IPA

1. Open the iOS project in Xcode:
```bash
npx cap open ios
```

2. In Xcode:
   - Select target device: **Any iOS Device (arm64)**
   - Go to **Product** → **Archive**
   - Once archived, click **Distribute App**
   - Follow the wizard to export or upload to App Store Connect

**Note:** You need an Apple Developer account ($99/year) to distribute on the App Store.

### Automated Builds

The project includes GitHub Actions workflows that automatically build both Android APK and iOS IPA on every push to the main branch:

- **Android APK**: Builds a debug APK that can be installed on Android devices
- **iOS IPA**: Builds a simulator IPA that can be tested on iOS Simulator (macOS only)

The build artifacts are available in the Actions tab of the repository and are retained for 30 days.

**Note:** The iOS workflow builds for the iOS Simulator. To build for physical iOS devices, you need an Apple Developer account and code signing certificates. See `APP_STORE_GUIDE.md` for details.

### Publishing to App Stores

#### Google Play Store

For complete instructions on preparing and publishing this app to Google Play Store, see:
- **[PLAY_STORE_QUICK_START.md](PLAY_STORE_QUICK_START.md)** - Quick reference guide
- **[PLAY_STORE_GUIDE.md](PLAY_STORE_GUIDE.md)** - Comprehensive step-by-step guide

These guides cover:
- Keystore generation and signing configuration
- App icon creation
- Privacy policy requirements
- Store listing materials (screenshots, descriptions)
- AAB/APK build and submission process

#### Apple App Store

For complete instructions on preparing and publishing this app to Apple App Store, see:
- **[APP_STORE_QUICK_START.md](APP_STORE_QUICK_START.md)** - Quick reference guide
- **[APP_STORE_GUIDE.md](APP_STORE_GUIDE.md)** - Comprehensive step-by-step guide

These guides cover:
- Apple Developer account setup
- Certificate and provisioning profile creation
- App icon and launch screen configuration
- App Store Connect submission process
- Screenshots and metadata requirements

## Development

To modify the game:
1. Edit `index.html`, `script.js`, or `styles.css`
2. Run `npm run build` to copy files to the `www` directory
3. Run `npx cap sync` to update mobile projects
4. Build for Android or iOS as described above

### NPM Scripts

```bash
npm run build                    # Build web app
npm run cap:add:android         # Add Android platform
npm run cap:add:ios             # Add iOS platform
npm run cap:sync                # Sync with all platforms
npm run cap:open:android        # Open in Android Studio
npm run cap:open:ios            # Open in Xcode
npm run android:build           # Build debug APK
npm run android:build:release   # Build release APK
npm run ios:build               # Prepare for iOS build
```

## License

ISC
