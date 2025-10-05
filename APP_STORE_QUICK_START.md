# Quick Start: Preparar per a Apple App Store

Aquest document és una guia ràpida per preparar l'aplicació per a Apple App Store. Per a més detalls, consulta `APP_STORE_GUIDE.md`.

## Passos Ràpids

### 1. Requisits Previs

```bash
# Verifica que tens tot instal·lat (només en macOS)
xcodebuild -version  # Xcode 14.0+
node --version       # Node.js 18+
pod --version        # CocoaPods

# Instal·lar CocoaPods si no el tens
sudo gem install cocoapods
```

**Important:** Necessites:
- macOS (Xcode només funciona en Mac)
- Apple Developer Account ($99 USD/any per publicar)

### 2. Generar el Projecte iOS (Primera Vegada)

```bash
# Instal·lar dependències
npm install

# Construir l'app web
npm run build

# Generar projecte iOS
npx cap add ios

# Instal·lar dependències natives
cd ios/App
pod install
cd ../..
```

### 3. Configurar App ID a Apple Developer

1. Vés a [developer.apple.com/account](https://developer.apple.com/account)
2. **Certificates, Identifiers & Profiles** → **Identifiers** → **+**
3. Selecciona **App IDs** → **Continue**
4. Bundle ID: `com.dejocoarts.blocks` (explicit)
5. Description: Dejoco Blocks
6. **Register**

### 4. Configurar Signatura a Xcode

```bash
# Obre el projecte iOS
npx cap open ios
```

A Xcode:
1. Selecciona el projecte **App**
2. Selecciona el target **App**
3. Pestanya **Signing & Capabilities**
4. **Team:** Selecciona el teu Apple Developer Team
5. **Bundle Identifier:** `com.dejocoarts.blocks`
6. Activa **Automatically manage signing** (recomanat)

### 5. Configurar Versió

A Xcode, selecciona el target **App** i vés a **General**:

```
Version: 1.0.0       # Versió visible per l'usuari
Build: 1             # Incrementa per cada build enviat
```

O edita `ios/App/App/Info.plist`:
```xml
<key>CFBundleVersion</key>
<string>1</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
```

### 6. Crear Icona de l'App

Necessites icones en diferents mides. Utilitza eines com:
- [App Icon Generator](https://www.appicon.co/)
- [MakeAppIcon](https://makeappicon.com/)

**Procés ràpid:**
1. Crea una icona de 1024x1024 px
2. Puja-la a [appicon.co](https://www.appicon.co/)
3. Descarrega el paquet iOS
4. Substitueix el contingut de `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### 7. Arxivar i Pujar a App Store Connect

A Xcode:

```bash
# Primer, sincronitza els canvis
npm run build
npx cap sync ios
npx cap open ios
```

Després a Xcode:

1. Selecciona dispositiu: **Any iOS Device (arm64)**
2. **Product** → **Archive**
3. Espera a que es completi (uns minuts)
4. A la finestra **Organizer**:
   - Clica **Validate App** (per verificar)
   - Després clica **Distribute App**
5. Selecciona **App Store Connect** → **Upload**
6. Segueix les indicacions i **Upload**
7. Espera (10-15 minuts per pujar, 15-60 min per processar)

### 8. Preparar Materials per a App Store

#### Captures de Pantalla (mínim 1 mida de dispositiu)

**iPhone 6.7" (Requerit per iPhone 14/15 Pro Max)**
- Dimensions: 1290x2796 px (portrait)
- Format: PNG o JPEG
- Mínim 1, màxim 10 captures

**Consell per fer captures:**
```bash
# Obre el simulador
open -a Simulator

# Selecciona iPhone 15 Pro Max
# Fes captures amb Cmd+S
```

**Captures recomanades:**
1. Menu principal
2. Partida en curs
3. Puntuacions / Game Over
4. Instruccions

#### Icona de l'App Store
- Format: PNG de 1024x1024 px
- Sense transparència
- Sense cantonades arrodonides

#### Descripcions

**Nom de l'App:** Dejoco Blocks

**Subtítol:** Tetris Retro Clàssic

Consulta `APP_STORE_GUIDE.md` per a descripcions completes en català i anglès.

### 9. Crear l'App a App Store Connect

1. Vés a [appstoreconnect.apple.com](https://appstoreconnect.apple.com/)
2. **My Apps** → **+** → **New App**
3. Omple:
   - Platform: iOS
   - Name: Dejoco Blocks
   - Primary Language: Catalan o English
   - Bundle ID: `com.dejocoarts.blocks`
   - SKU: `dejoco-blocks-001`
4. **Create**

### 10. Omplir Informació de l'App

#### App Information
- Name: Dejoco Blocks
- Subtitle: Tetris Retro Clàssic
- Category: Games → Puzzle
- Privacy Policy URL: [La teva URL] (OBLIGATORI)

#### Pricing
- Price: Free (o selecciona preu)
- Availability: Tots els països

#### Prepare for Submission
- Version: 1.0.0
- Description: [Descripció completa]
- Keywords: tetris,blocks,puzzle,retro,game boy,classic
- Support URL: https://github.com/skirep/tetris-three.js
- Screenshots: Puja les captures per cada mida
- Build: Selecciona el build pujat

#### Age Rating
- Completa el qüestionari (hauria de resultar en 4+)

### 11. Enviar per a Revisió

1. Revisa tota la informació
2. **Add for Review**
3. **Submit for Review**
4. Espera 1-3 dies laborables per la revisió

---

## Checklist Ràpida

- [ ] macOS i Xcode instal·lats
- [ ] Apple Developer Account actiu ($99/any)
- [ ] Projecte iOS generat (`npx cap add ios`)
- [ ] CocoaPods instal·lat
- [ ] App ID creat a Apple Developer Portal
- [ ] Signatura configurada a Xcode
- [ ] Icones de l'app creades (totes les mides)
- [ ] Versió i Build configurats
- [ ] IPA arxivat i validat
- [ ] Build pujat a App Store Connect
- [ ] Captures de pantalla preparades (1290x2796 px)
- [ ] Icona 1024x1024 creada
- [ ] Descripcions escrites
- [ ] Política de privacitat publicada
- [ ] App creada a App Store Connect
- [ ] Build assignat a la versió
- [ ] Informació completa a App Store Connect
- [ ] Enviat per a revisió

---

## Comandes Útils

```bash
# Construir i sincronitzar
npm run build
npx cap sync ios

# Obrir projecte a Xcode
npx cap open ios

# Actualitzar dependències natives
cd ios/App
pod install
cd ../..

# Netejar build (si hi ha problemes)
cd ios/App
xcodebuild clean
cd ../..
```

---

## Política de Privacitat Ràpida

Apple **requereix** una URL de política de privacitat. Pots publicar-la a:

1. **GitHub Pages** del teu repositori
2. **Fitxer HTML** al teu domini
3. **Generador gratuït:** [iubenda.com](https://www.iubenda.com/)

**Plantilla mínima:**

```markdown
# Política de Privacitat - Dejoco Blocks

Dejoco Blocks no recull, emmagatzema ni comparteix cap informació 
personal dels usuaris. Les puntuacions es guarden localment al 
dispositiu i no es comparteixen amb tercers.

Contacte: https://github.com/skirep/tetris-three.js
```

---

## Actualitzacions Futures

Per publicar una actualització:

1. Actualitza el codi
2. Incrementa `Build` i potser `Version` a Xcode
3. Arxiva nou build i puja a App Store Connect
4. Crea nova versió a App Store Connect
5. Omple "What's New in This Version"
6. Envia per a revisió

Exemple:
```
Build: 2 → 3 → 4...     (sempre incrementa)
Version: 1.0.0 → 1.0.1 → 1.1.0
```

---

## Solució de Problemes Comuns

### CocoaPods no funciona
```bash
sudo gem install cocoapods
pod setup
```

### Build no apareix a App Store Connect
- Espera 15-60 minuts després de pujar
- Comprova el correu per errors de processament

### Error de signatura
- Assegura't que el Bundle ID coincideix exactament
- Desactiva i reactiva "Automatically manage signing"

### Xcode no troba el projecte
```bash
# Regenera el projecte iOS
rm -rf ios
npx cap add ios
cd ios/App && pod install && cd ../..
```

---

## Ajuda

- **Documentació completa:** `APP_STORE_GUIDE.md`
- **Build instructions:** `BUILD_INSTRUCTIONS.md`
- **Capacitor iOS docs:** https://capacitorjs.com/docs/ios
- **App Store Connect:** https://appstoreconnect.apple.com
- **Apple Developer:** https://developer.apple.com

---

## Diferències amb Android

| Aspecte | Android | iOS |
|---------|---------|-----|
| Sistema operatiu | Windows/Mac/Linux | **Només macOS** |
| IDE | Android Studio | **Xcode** |
| Compte de desenvolupador | $25 (un cop) | **$99/any** |
| Temps de revisió | Unes hores | **1-3 dies** |
| Format de build | APK/AAB | **IPA** |
| Signatura | Keystore (JKS) | **Certificats + Provisioning Profiles** |
| Icona | Múltiples carpetes mipmap | **Asset Catalog (xcassets)** |

---

**Bona sort amb la teva publicació! 🚀🍎**
