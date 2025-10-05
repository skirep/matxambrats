# Comparació de Plataformes: Android vs iOS

Aquest document compara els requisits i processos per publicar l'aplicació Dejoco Blocks a Google Play Store i Apple App Store.

---

## Resum Ràpid

| Aspecte | Android (Google Play) | iOS (Apple App Store) |
|---------|----------------------|----------------------|
| **Sistema Operatiu Requerit** | Windows, macOS o Linux | **Només macOS** |
| **IDE Principal** | Android Studio | **Xcode** |
| **Llenguatge de Build** | Gradle (Groovy/Kotlin DSL) | Xcode Build System |
| **Compte de Desenvolupador** | $25 USD (un cop) | **$99 USD/any** |
| **Temps de Revisió** | Unes hores a 1 dia | **1-3 dies laborables** |
| **Format de Distribució** | APK (debug) / AAB (release) | **IPA** |
| **Dependències Natives** | Automàtic amb Gradle | **CocoaPods** |

---

## Requisits del Sistema

### Android
```bash
✓ Node.js 18+
✓ Java JDK 17
✓ Android SDK (automàtic)
✓ Qualsevol OS: Windows/Mac/Linux
```

### iOS
```bash
✓ Node.js 18+
✓ macOS (obligatori)
✓ Xcode 14.0+
✓ CocoaPods
✓ Command Line Tools
```

**⚠️ Important:** iOS **només** es pot compilar en macOS. No hi ha cap manera de construir per iOS en Windows o Linux sense un Mac.

---

## Configuració Inicial

### Android

```bash
# 1. Instal·lar dependències
npm install

# 2. Construir app web
npm run build

# 3. Afegir plataforma Android
npx cap add android

# 4. Construir APK
cd android && ./gradlew assembleDebug
```

### iOS

```bash
# 1. Instal·lar dependències
npm install

# 2. Construir app web
npm run build

# 3. Afegir plataforma iOS
npx cap add ios

# 4. Instal·lar dependències natives
cd ios/App && pod install && cd ../..

# 5. Obrir a Xcode
npx cap open ios

# 6. A Xcode: Product → Archive → Distribute
```

---

## Signatura i Certificats

### Android: Keystore (Més Simple)

**Crear Keystore:**
```bash
keytool -genkey -v -keystore dejoco-blocks-release-key.jks \
  -alias dejoco-blocks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Fitxers necessaris:**
- ✅ 1 fitxer `.jks` (keystore)
- ✅ 2 contrasenyes (store i key)

**Configuració:**
- Edita `android/app/build.gradle`
- Afegeix configuració de signatura
- Construeix amb `./gradlew bundleRelease`

### iOS: Certificats i Provisioning Profiles (Més Complex)

**Pas 1: Crear App ID**
- Vés a Apple Developer Portal
- Crea un Identifier amb Bundle ID: `com.dejocoarts.blocks`

**Pas 2: Certificats**
- Development Certificate (per provar en dispositius)
- Distribution Certificate (per App Store)
- Requereix CSR (Certificate Signing Request) des de Keychain Access

**Pas 3: Provisioning Profiles**
- Development Profile (per testejar)
- Distribution Profile (per publicar)

**Pas 4: Configurar a Xcode**
- Signing & Capabilities
- Seleccionar Team
- Automàtic (recomanat) o Manual

**Fitxers generats:**
- ✅ Certificats (.cer)
- ✅ Private Keys (al Keychain)
- ✅ Provisioning Profiles (.mobileprovision)

---

## Icona de l'Aplicació

### Android: Múltiples Carpetes

**Ubicació:** `android/app/src/main/res/`

```
mipmap-mdpi/ic_launcher.png     (48x48 px)
mipmap-hdpi/ic_launcher.png     (72x72 px)
mipmap-xhdpi/ic_launcher.png    (96x96 px)
mipmap-xxhdpi/ic_launcher.png   (144x144 px)
mipmap-xxxhdpi/ic_launcher.png  (192x192 px)
```

**Eines:**
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
- [App Icon Generator](https://www.appicon.co/)

### iOS: Asset Catalog

**Ubicació:** `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

```
Icon-20@2x.png      (40x40 px)
Icon-20@3x.png      (60x60 px)
Icon-29@2x.png      (58x58 px)
Icon-29@3x.png      (87x87 px)
Icon-40@2x.png      (80x80 px)
Icon-40@3x.png      (120x120 px)
Icon-60@2x.png      (120x120 px)
Icon-60@3x.png      (180x180 px)
Icon-1024.png       (1024x1024 px)
```

**Més fitxer:** `Contents.json` (defineix totes les mides)

**Eines:**
- [App Icon Generator](https://www.appicon.co/) (suporta iOS)
- [MakeAppIcon](https://makeappicon.com/)

---

## Materials per a les Stores

### Google Play Store

**Captures de Pantalla:**
- Mínim 2, màxim 8
- Recomanat: 1080x1920 px (portrait)
- Format: PNG o JPEG

**Gràfic de Funcionalitat (Feature Graphic):**
- Obligatori
- 1024x500 px
- Format: PNG o JPEG

**Icona de la Store:**
- 512x512 px
- PNG de 32 bits
- Sense transparència

### Apple App Store

**Captures de Pantalla:**
- Mínim 1 mida de dispositiu (recomanat 6.7")
- iPhone 6.7": 1290x2796 px
- iPhone 6.5": 1242x2688 px
- Format: PNG o JPEG
- Mínim 1, màxim 10 per dispositiu

**Icona de la Store:**
- 1024x1024 px
- PNG sense transparència
- Sense cantonades arrodonides (Apple les afegeix)

**Vídeo de Prèvia (Opcional):**
- 15-30 segons
- MP4 o MOV

---

## Procés de Publicació

### Google Play Store

1. **Crear compte** ($25 un cop)
   - [play.google.com/console](https://play.google.com/console)

2. **Construir AAB signat**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

3. **Crear aplicació** a Play Console
   - Omple informació bàsica
   - Puja AAB

4. **Omplir fitxa de la store**
   - Descripció, captures, icona
   - Política de privacitat
   - Classificació de contingut

5. **Enviar per revisió**
   - Revisió: Unes hores a 1 dia

### Apple App Store

1. **Crear compte** ($99/any)
   - [developer.apple.com/programs](https://developer.apple.com/programs/)

2. **Configurar certificats**
   - Crear App ID
   - Certificats de distribució
   - Provisioning Profiles

3. **Arxivar a Xcode**
   ```
   Product → Archive
   ```

4. **Validar i pujar**
   - Organizer → Distribute App
   - Validar → Pujar a App Store Connect
   - Espera 15-60 min per processar

5. **Crear app a App Store Connect**
   - [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Omple metadades, captures, descripcions
   - Selecciona build pujat

6. **Enviar per revisió**
   - Revisió: 1-3 dies laborables

---

## Actualitzacions

### Android

**Incrementa versions:**
```gradle
// android/app/build.gradle
defaultConfig {
    versionCode 2        // Era 1 (sempre incrementa)
    versionName "1.0.1"  // Era "1.0.0"
}
```

**Construeix i puja:**
```bash
./gradlew bundleRelease
# Puja a Play Console → Crear nova versió
```

### iOS

**Incrementa versions a Xcode:**
```
General tab:
Version: 1.0.1    # Era 1.0.0
Build: 2          # Era 1 (sempre incrementa)
```

O edita `Info.plist`:
```xml
<key>CFBundleVersion</key>
<string>2</string>
<key>CFBundleShortVersionString</key>
<string>1.0.1</string>
```

**Arxiva i puja:**
```
Product → Archive → Distribute
# Crea nova versió a App Store Connect
```

---

## Política de Privacitat

**Ambdues plataformes requereixen** una URL de política de privacitat accessible públicament.

### Opcions:

1. **GitHub Pages**
   - Crea `docs/privacy.md` al repositori
   - Activa GitHub Pages
   - URL: `https://username.github.io/repo/privacy`

2. **Fitxer HTML al teu domini**
   - Puja `privacy.html` al teu servidor

3. **Generadors gratuïts**
   - [iubenda.com](https://www.iubenda.com/)
   - [GetTerms.io](https://getterms.io/)
   - [PrivacyPolicies.com](https://www.privacypolicies.com/)

**Exemple mínim:**
```markdown
# Política de Privacitat - Dejoco Blocks

Dejoco Blocks no recull, emmagatzema ni comparteix cap 
informació personal dels usuaris. Les puntuacions es guarden 
localment al dispositiu i no es comparteixen amb tercers.

Contacte: [teu email o GitHub]
```

---

## Costos

### Google Play Store
- **Registre:** $25 USD (un cop, per sempre)
- **Publicació:** Gratuïta
- **Actualitzacions:** Gratuïtes
- **Total any 1:** $25
- **Total any 2+:** $0

### Apple App Store
- **Registre:** $99 USD/any
- **Publicació:** Inclosa
- **Actualitzacions:** Incloses
- **Total per any:** $99

**Total per ambdues plataformes:**
- Any 1: $124 USD
- Any 2+: $99 USD/any

---

## Temps Total Estimat

### Primera Publicació

**Android:**
- Configuració inicial: 2-3 hores
- Crear materials: 2-4 hores
- Primera pujada i publicació: 1 hora
- Revisió: Unes hores
- **Total: ~1 dia**

**iOS:**
- Configuració inicial: 3-5 hores (certificats més complexos)
- Crear materials: 2-4 hores
- Primera arxivació i pujada: 1-2 hores
- Revisió: 1-3 dies
- **Total: 1-2 dies (+ temps de revisió)**

### Actualitzacions

**Android:**
- Canviar codi i versió: 10 min
- Construir i pujar: 15 min
- Revisió: Unes hores
- **Total: ~1 hora**

**iOS:**
- Canviar codi i versió: 10 min
- Arxivar i pujar: 20-30 min
- Revisió: 1-3 dies
- **Total: ~1 hora (+ temps de revisió)**

---

## Quin Triar Primer?

### Comença amb Android si:
- ✅ No tens un Mac
- ✅ Vols resultats més ràpids
- ✅ Tens pressupost limitat ($25 vs $99)
- ✅ Prefereixes un procés més simple
- ✅ La majoria dels teus usuaris són Android

### Comença amb iOS si:
- ✅ Tens un Mac
- ✅ Els teus usuaris són principalment iOS
- ✅ Pots invertir $99/any
- ✅ Estàs disposat a aprendre el procés d'Apple
- ✅ Vols estar a l'App Store d'Apple

### Fes Ambdues si:
- ✅ Tens un Mac (obligatori per iOS)
- ✅ Vols màxim abast
- ✅ Pots gestionar dues stores
- ✅ Tens pressupost per ambdues ($124 primer any)

**Recomanació:** Si tens un Mac, fes ambdues per maximitzar el teu públic!

---

## Recursos

### Documentació
- **Android:** [PLAY_STORE_GUIDE.md](PLAY_STORE_GUIDE.md) + [PLAY_STORE_QUICK_START.md](PLAY_STORE_QUICK_START.md)
- **iOS:** [APP_STORE_GUIDE.md](APP_STORE_GUIDE.md) + [APP_STORE_QUICK_START.md](APP_STORE_QUICK_START.md)
- **General:** [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

### Consoles de Desenvolupador
- **Play Console:** https://play.google.com/console
- **App Store Connect:** https://appstoreconnect.apple.com
- **Apple Developer Portal:** https://developer.apple.com/account

### Eines Útils
- **Icones:** [appicon.co](https://www.appicon.co/)
- **Captures:** [screenshotdesigner.com](https://www.screenshotdesigner.com/)
- **Privacitat:** [iubenda.com](https://www.iubenda.com/)

---

## Preguntes Freqüents

### Puc construir per iOS sense Mac?

**No.** Xcode només funciona en macOS. Alternatives:
- Utilitzar un Mac d'un amic/familiar
- Llogar un Mac a núvol (MacinCloud, MacStadium)
- Comprar un Mac mini (la opció més econòmica)
- Utilitzar serveis CI/CD amb runners macOS (GitHub Actions, etc.)

### Puc provar l'app abans de publicar?

**Android:**
- ✅ Emulador d'Android Studio (qualsevol OS)
- ✅ Dispositiu físic via USB
- ✅ Internal Testing a Play Console

**iOS:**
- ✅ Simulador d'iOS (només macOS)
- ✅ Dispositiu físic via Xcode (necessites Development Profile)
- ✅ TestFlight (després de pujar a App Store Connect)

### Puc utilitzar el mateix codi per ambdues plataformes?

**Sí!** Aquest és el punt fort de Capacitor:
- El mateix codi web (HTML/CSS/JS)
- El mateix `capacitor.config.json`
- Només difereixen les carpetes `android/` i `ios/`

### Quant costa mantenir ambdues apps?

**Costos anuals:**
- Google Play: $0 (després dels $25 inicials)
- Apple App Store: $99/any
- **Total: $99/any**

**Temps de manteniment per actualització:**
- ~1-2 hores de treball
- + temps de revisió (automàtic)

---

**Bona sort amb la teva publicació! 🚀📱**
