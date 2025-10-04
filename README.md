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

## Build Android APK

This project can be compiled into an Android APK using Capacitor.

### Prerequisites

- Node.js 18 or higher
- Java Development Kit (JDK) 17
- Android SDK (automatically downloaded by Gradle)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build the web app:
```bash
npm run build
```

3. Sync with Android platform:
```bash
npx cap sync android
```

### Build APK

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

### Automated Builds

The project includes a GitHub Actions workflow that automatically builds the APK on every push to the main branch. The APK artifacts are available in the Actions tab of the repository.

### Publishing to Google Play Store

For complete instructions on preparing and publishing this app to Google Play Store, see:
- **[PLAY_STORE_QUICK_START.md](PLAY_STORE_QUICK_START.md)** - Quick reference guide
- **[PLAY_STORE_GUIDE.md](PLAY_STORE_GUIDE.md)** - Comprehensive step-by-step guide

These guides cover:
- Keystore generation and signing configuration
- App icon creation
- Privacy policy requirements
- Store listing materials (screenshots, descriptions)
- AAB/APK build and submission process

## Development

To modify the game:
1. Edit `index.html`, `script.js`, or `styles.css`
2. Run `npm run build` to copy files to the `www` directory
3. Run `npx cap sync android` to update the Android project
4. Build the APK as described above

## License

ISC
