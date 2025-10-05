# Guia Completa per Publicar a Apple App Store

Aquesta guia proporciona instruccions pas a pas per preparar i publicar l'aplicació **Dejoco Blocks** a l'Apple App Store.

---

## Índex

1. [Requisits Previs](#requisits-previs)
2. [Configuració de l'Aplicació](#configuració-de-laplicació)
3. [Icona de l'Aplicació](#icona-de-laplicació)
4. [Pantalles de Llançament (Launch Screen)](#pantalles-de-llançament-launch-screen)
5. [Configuració de Signatura i Certificats](#configuració-de-signatura-i-certificats)
6. [Construcció de l'IPA](#construcció-de-lipa)
7. [Materials per a l'App Store](#materials-per-a-lapp-store)
8. [Publicació a l'App Store Connect](#publicació-a-lapp-store-connect)
9. [Recursos Addicionals](#recursos-addicionals)

---

## Requisits Previs

### Compte de Desenvolupador d'Apple

- **Necessari:** Apple Developer Program membership ($99 USD/any)
- **Registre:** [developer.apple.com](https://developer.apple.com/programs/)
- **Nota:** Pots desenvolupar i provar localment sense compte, però necessites el compte per publicar

### Requisits del Sistema

- **macOS:** Xcode només funciona en Mac
- **Xcode:** Versió 14.0 o superior
  ```bash
  xcode-select --install
  ```
- **Node.js:** Versió 18 o superior
- **CocoaPods:** Per gestionar dependències natives
  ```bash
  sudo gem install cocoapods
  ```

### Verificar Instal·lació

```bash
# Verificar Xcode
xcodebuild -version

# Verificar Node.js
node --version

# Verificar CocoaPods
pod --version
```

---

## Configuració de l'Aplicació

### 1. Actualitzar el package.json

Assegura't que el fitxer `package.json` té la versió correcta:

```json
{
  "name": "dejoco-blocks",
  "version": "1.0.0",
  "description": "Dejoco Blocks - A Tetris game by Dejoco Arts"
}
```

### 2. Actualitzar capacitor.config.json

Verifica que la configuració de Capacitor és correcta:

```json
{
  "appId": "com.dejocoarts.blocks",
  "appName": "Dejoco Blocks",
  "webDir": "www",
  "server": {
    "androidScheme": "https",
    "iosScheme": "https"
  }
}
```

**Notes:**
- `appId`: Ha de ser únic i coincidir amb el Bundle ID a Apple Developer
- `appName`: El nom que es mostrarà sota la icona de l'app

### 3. Preparar el Projecte iOS

Si encara no tens la carpeta `ios`, genera-la:

```bash
# Instal·lar dependències
npm install

# Construir l'app web
npm run build

# Generar projecte iOS
npx cap add ios
```

Això crearà la carpeta `ios/` amb el projecte Xcode.

### 4. Instal·lar Dependències iOS

```bash
cd ios/App
pod install
cd ../..
```

### 5. Configurar Info.plist

El fitxer `ios/App/App/Info.plist` conté la configuració de l'app. Assegura't que conté:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>Dejoco Blocks</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>UIRequiresFullScreen</key>
    <true/>
    <key>UIStatusBarHidden</key>
    <true/>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
    </array>
</dict>
</plist>
```

**Camps Importants:**
- `CFBundleVersion`: Build number (incrementa per cada build)
- `CFBundleShortVersionString`: Versió visible per l'usuari (1.0.0, 1.0.1, etc.)
- `UIRequiresFullScreen`: L'app ocupa tota la pantalla
- `UISupportedInterfaceOrientations`: Orientacions suportades

---

## Icona de l'Aplicació

### Crear les Icones

Necessites una icona en diverses mides per a iOS. Pots utilitzar eines com:

- [App Icon Generator](https://www.appicon.co/)
- [MakeAppIcon](https://makeappicon.com/)
- Sketch / Figma / Adobe Illustrator

### Mides Necessàries per iOS

Crea un **App Icon Set** amb les següents mides:

```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
├── Icon-20@2x.png (40x40 px)
├── Icon-20@3x.png (60x60 px)
├── Icon-29@2x.png (58x58 px)
├── Icon-29@3x.png (87x87 px)
├── Icon-40@2x.png (80x80 px)
├── Icon-40@3x.png (120x120 px)
├── Icon-60@2x.png (120x120 px)
├── Icon-60@3x.png (180x180 px)
├── Icon-76.png (76x76 px)
├── Icon-76@2x.png (152x152 px)
├── Icon-83.5@2x.png (167x167 px)
└── Icon-1024.png (1024x1024 px) - Per App Store
```

### Generar Automàticament

La manera més fàcil és:

1. Crea una icona de **1024x1024 px**
2. Utilitza [App Icon Generator](https://www.appicon.co/)
3. Descarrega el conjunt generat
4. Substitueix el contingut de `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Contents.json

El fitxer `Contents.json` dins de `AppIcon.appiconset/` ha de tenir:

```json
{
  "images": [
    {
      "size": "20x20",
      "idiom": "iphone",
      "filename": "Icon-20@2x.png",
      "scale": "2x"
    },
    {
      "size": "20x20",
      "idiom": "iphone",
      "filename": "Icon-20@3x.png",
      "scale": "3x"
    },
    {
      "size": "29x29",
      "idiom": "iphone",
      "filename": "Icon-29@2x.png",
      "scale": "2x"
    },
    {
      "size": "29x29",
      "idiom": "iphone",
      "filename": "Icon-29@3x.png",
      "scale": "3x"
    },
    {
      "size": "40x40",
      "idiom": "iphone",
      "filename": "Icon-40@2x.png",
      "scale": "2x"
    },
    {
      "size": "40x40",
      "idiom": "iphone",
      "filename": "Icon-40@3x.png",
      "scale": "3x"
    },
    {
      "size": "60x60",
      "idiom": "iphone",
      "filename": "Icon-60@2x.png",
      "scale": "2x"
    },
    {
      "size": "60x60",
      "idiom": "iphone",
      "filename": "Icon-60@3x.png",
      "scale": "3x"
    },
    {
      "size": "1024x1024",
      "idiom": "ios-marketing",
      "filename": "Icon-1024.png",
      "scale": "1x"
    }
  ],
  "info": {
    "version": 1,
    "author": "xcode"
  }
}
```

---

## Pantalles de Llançament (Launch Screen)

### Opció 1: Storyboard (Recomanat)

El projecte ve amb un Launch Screen per defecte. Pots personalitzar-lo editant:

```
ios/App/App/Base.lproj/LaunchScreen.storyboard
```

### Opció 2: Imatge Estàtica

Si prefereixes utilitzar imatges:

1. Afegeix les imatges a `Assets.xcassets`
2. Crea un nou Image Set anomenat "Splash"
3. Afegeix imatges per a diferents resolucions

---

## Configuració de Signatura i Certificats

### 1. Crear App ID a Apple Developer

1. Vés a [Apple Developer Portal](https://developer.apple.com/account/)
2. Navega a **Certificates, Identifiers & Profiles**
3. Clica **Identifiers** → **+** (nou)
4. Selecciona **App IDs** → **Continue**
5. Configura:
   - **Description:** Dejoco Blocks
   - **Bundle ID:** `com.dejocoarts.blocks` (explicit)
   - **Capabilities:** Marca les necessàries (per defecte cap)
6. Registra l'App ID

### 2. Crear Certificats de Signatura

#### Development Certificate (Per provar)

```bash
# Xcode pot crear-los automàticament
# Vés a Xcode → Preferences → Accounts → Manage Certificates
```

#### Distribution Certificate (Per App Store)

1. A Apple Developer Portal: **Certificates** → **+**
2. Selecciona **Apple Distribution**
3. Crea un Certificate Signing Request (CSR):
   ```bash
   # Obre Keychain Access
   # Keychain Access → Certificate Assistant → Request a Certificate from a Certificate Authority
   # Desa el fitxer .certSigningRequest
   ```
4. Puja el CSR i descarrega el certificat
5. Fes doble clic per instal·lar-lo al Keychain

### 3. Crear Provisioning Profiles

#### Development Profile

Per provar en dispositius físics:

1. A Apple Developer Portal: **Profiles** → **+**
2. Selecciona **iOS App Development**
3. Selecciona el teu App ID
4. Selecciona el certificat de desenvolupament
5. Selecciona dispositius per testejar
6. Descarrega i fes doble clic per instal·lar

#### Distribution Profile (App Store)

Per publicar:

1. **Profiles** → **+**
2. Selecciona **App Store**
3. Selecciona el teu App ID
4. Selecciona el certificat de distribució
5. Descarrega i fes doble clic per instal·lar

### 4. Configurar Signatura a Xcode

Obre el projecte:

```bash
npx cap open ios
```

A Xcode:

1. Selecciona el projecte **App** a la barra lateral
2. Selecciona el target **App**
3. Vés a la pestanya **Signing & Capabilities**
4. Configura:
   - **Team:** Selecciona el teu equip de desenvolupador
   - **Bundle Identifier:** `com.dejocoarts.blocks`
   - **Signing Certificate:** Automatic (recomanat) o Manual
   - **Provisioning Profile:** Automatic o selecciona el perfil creat

**Nota:** "Automatically manage signing" és més fàcil per començar.

---

## Construcció de l'IPA

### Preparar el Build

1. Sincronitza el projecte:
   ```bash
   npm run build
   npx cap sync ios
   ```

2. Obre Xcode:
   ```bash
   npx cap open ios
   ```

### Configurar Versió i Build

A Xcode, selecciona el target **App** i vés a **General**:

- **Version:** 1.0.0 (versió visible per l'usuari)
- **Build:** 1 (incrementa per cada build enviat)

**Important:** Cada build enviat a App Store Connect ha de tenir un número de build únic i més gran que l'anterior.

### Arxivar l'Aplicació

1. A Xcode, selecciona dispositiu: **Any iOS Device (arm64)**
2. Menu: **Product** → **Archive**
3. Espera a que es completi l'arxiu (pot trigar uns minuts)
4. S'obrirà la finestra **Organizer**

### Validar l'Arxiu

Abans de pujar-lo:

1. A l'**Organizer**, selecciona l'arxiu
2. Clica **Validate App**
3. Selecciona les opcions:
   - **App Store Connect**
   - Include bitcode: No (ja no és necessari)
   - Upload symbols: Sí (recomanat per debugging)
4. Clica **Next** i segueix les indicacions
5. Espera la validació (pot trigar uns minuts)

Si hi ha errors, corregeix-los i torna a arxivar.

### Pujar a App Store Connect

1. A l'**Organizer**, clica **Distribute App**
2. Selecciona **App Store Connect** → **Next**
3. Selecciona **Upload** → **Next**
4. Revisa les opcions de distribució:
   - Include bitcode: No
   - Upload symbols: Sí
   - Manage Version and Build Number: Sí (recomanat)
5. Selecciona el perfil de distribució (automàtic)
6. Clica **Upload**
7. Espera a que es completi (pot trigar 10-15 minuts)

**Nota:** Després de pujar, l'IPA es processarà a App Store Connect. Pot trigar 15-60 minuts abans que estigui disponible per a revisió.

---

## Materials per a l'App Store

### 1. Captures de Pantalla

**Requisits:**

Per cada mida de dispositiu (mínim una mida):

**iPhone 6.7" (Required for iPhone 14 Pro Max, 15 Pro Max)**
- Dimensions: 1290x2796 px (portrait)
- Format: PNG o JPEG
- Mínim: 1 captura, Màxim: 10 captures

**iPhone 6.5" (iPhone 11 Pro Max, XS Max)**
- Dimensions: 1242x2688 px (portrait)
- Format: PNG o JPEG

**iPhone 5.5" (iPhone 8 Plus, 7 Plus)**
- Dimensions: 1242x2208 px (portrait)
- Format: PNG o JPEG

**Consell:** Pots utilitzar el simulador d'iOS per fer captures:
```bash
# Obre el simulador
open -a Simulator

# Fes captures amb Cmd+S o Device → Screenshot
```

**Mides recomanades per mostrar:**
1. Pantalla del menú principal
2. Partida en curs
3. Pantalla de puntuacions / Game Over
4. Pantalla d'instruccions

### 2. Icona de l'App Store

**Requisits:**
- Format: PNG sense transparència
- Dimensions: 1024x1024 px
- Color space: RGB
- Sense cantonades arrodonides (Apple les afegeix automàticament)

### 3. Vídeo de Prèvia (Opcional)

**Requisits:**
- Durada: 15-30 segons
- Format: MP4 o MOV
- Resolució: Segons la mida del dispositiu

### 4. Textos de l'App Store

#### Nom de l'App (màx. 30 caràcters)
```
Dejoco Blocks
```

#### Subtítol (màx. 30 caràcters)
```
Tetris Retro Clàssic
```

#### Descripció Promocional (màx. 170 caràcters)

**Català:**
```
Juga al clàssic joc de blocs amb estil Game Boy retro! Trenca files, aconsegueix puntuacions altes i gaudeix de la música nostàlgica.
```

**Anglès:**
```
Play the classic block puzzle game with retro Game Boy style! Break lines, achieve high scores and enjoy nostalgic music.
```

#### Descripció Completa (màx. 4000 caràcters)

**Català:**
```
🎮 Dejoco Blocks - El Clàssic Joc de Blocs Reinventat!

Reviu la nostàlgia dels jocs clàssics amb Dejoco Blocks, un joc de trencaclosques de blocs amb un estil visual inspirat en el Game Boy original!

✨ CARACTERÍSTIQUES PRINCIPALS:

🎯 Jugabilitat Clàssica
• Controla peces de 7 formes diferents
• Completa files per eliminar-les i puntuar
• Dificultat progressiva a mesura que avances
• Sistema de puntuació equilibrat

🎨 Disseny Retro Autèntic
• Estètica inspirada en el Game Boy
• Colors nostàlgics i píxel art
• Interfície neta i intuïtiva
• Animacions fluides

🎵 Experiència Sonora
• Música de fons nostàlgica
• Sons retro per a cada acció
• Opció de silenciar

🌍 Multiidioma
• Disponible en Català
• Disponible en Anglès
• Canvia d'idioma en qualsevol moment

📱 Optimitzat per Mòbil
• Controls tàctils intuïtius
• Jugabilitat vertical
• Funciona sense connexió a Internet
• Lleuger i ràpid

🏆 Sistema de Puntuació
• Registra la teva puntuació més alta
• Competeix amb tu mateix
• Integració amb Game Center (properament)

📖 Instruccions Integrades
• Tutorial visual complet
• Guia de moviments
• Consells i estratègies

🎮 CONTROLS:

• Llisca a esquerra/dreta: Moure peça
• Llisca avall: Baixar ràpid
• Toca: Rotar peça
• Botó de pausa per gestionar el joc

🔥 PERFECTE PER A:

• Amants dels jocs retro
• Fans del trencaclosques clàssic
• Sessions de joc ràpides
• Jugadors de totes les edats
• Nostàlgics del Game Boy

💝 DESENVOLUPAT PER DEJOCO ARTS

Dejoco Blocks és creat amb passió per oferir-te l'experiència més autèntica del joc de blocs clàssic. Sense compres dins l'app, sense anuncis molestos, només diversió pura!

📥 DESCARREGA ARA I COMENÇA A JUGAR!

Redescubreix la màgia del joc de blocs més addictiu de tots els temps!
```

**Anglès:**
```
🎮 Dejoco Blocks - The Classic Block Game Reinvented!

Relive the nostalgia of classic games with Dejoco Blocks, a block puzzle game with a visual style inspired by the original Game Boy!

✨ MAIN FEATURES:

🎯 Classic Gameplay
• Control pieces of 7 different shapes
• Complete lines to clear them and score
• Progressive difficulty as you advance
• Balanced scoring system

🎨 Authentic Retro Design
• Game Boy-inspired aesthetics
• Nostalgic colors and pixel art
• Clean and intuitive interface
• Smooth animations

🎵 Sound Experience
• Nostalgic background music
• Retro sounds for each action
• Mute option

🌍 Multilingual
• Available in Catalan
• Available in English
• Change language anytime

📱 Mobile Optimized
• Intuitive touch controls
• Vertical gameplay
• Works offline
• Light and fast

🏆 Scoring System
• Record your highest score
• Compete with yourself
• Game Center integration (coming soon)

📖 Integrated Instructions
• Complete visual tutorial
• Movement guide
• Tips and strategies

🎮 CONTROLS:

• Swipe left/right: Move piece
• Swipe down: Fast drop
• Tap: Rotate piece
• Pause button to manage game

🔥 PERFECT FOR:

• Retro game lovers
• Classic puzzle fans
• Quick game sessions
• Players of all ages
• Game Boy nostalgics

💝 DEVELOPED BY DEJOCO ARTS

Dejoco Blocks is created with passion to bring you the most authentic classic block game experience. No in-app purchases, no annoying ads, just pure fun!

📥 DOWNLOAD NOW AND START PLAYING!

Rediscover the magic of the most addictive block game of all time!
```

#### Paraules Clau (màx. 100 caràcters, separades per comes)

```
tetris,blocks,puzzle,retro,game boy,classic,arcade,nostalgic,pixel art
```

#### URL de Suport

Si tens una pàgina web o repositori:
```
https://github.com/skirep/tetris-three.js
```

#### Categoria

- **Primary:** Games
- **Secondary:** Puzzle

#### Classificació per Edats

- **4+** (Apte per a tots els públics)

### 5. Política de Privacitat (OBLIGATORI)

Apple requereix una URL de política de privacitat. Pots crear-ne una simple:

**Exemple de Política de Privacitat:**

```markdown
# Política de Privacitat - Dejoco Blocks

Última actualització: [Data]

## Informació que Recopilem

Dejoco Blocks no recull, emmagatzema ni comparteix cap informació personal dels usuaris.

## Dades d'Ús

L'aplicació no fa seguiment de l'activitat de l'usuari ni envia dades a servidors externs.

## Puntuacions

Les puntuacions es guarden localment al dispositiu de l'usuari i no es comparteixen amb tercers.

## Permisos

L'aplicació no requereix cap permís especial del sistema.

## Canvis a Aquesta Política

Qualsevol canvi a aquesta política es publicarà en aquesta pàgina.

## Contacte

Per qualsevol pregunta sobre aquesta política de privacitat, pots contactar-nos a:
- GitHub: https://github.com/skirep/tetris-three.js
```

Pots publicar això a:
- GitHub Pages del repositori
- Un fitxer `privacy.html` al teu domini
- [iubenda.com](https://www.iubenda.com/) (generador gratuït)

---

## Publicació a l'App Store Connect

### 1. Crear l'App a App Store Connect

1. Vés a [App Store Connect](https://appstoreconnect.apple.com/)
2. Clica **My Apps** → **+** → **New App**
3. Omple la informació:
   - **Platform:** iOS
   - **Name:** Dejoco Blocks
   - **Primary Language:** Catalan o English
   - **Bundle ID:** Selecciona `com.dejocoarts.blocks`
   - **SKU:** `dejoco-blocks-001` (identificador únic per a tu)
   - **User Access:** Full Access

### 2. Omplir la Informació de l'App

#### Pestanya App Information

- **Name:** Dejoco Blocks
- **Subtitle:** Tetris Retro Clàssic
- **Privacy Policy URL:** [La teva URL de política de privacitat]
- **Category:** Games / Puzzle
- **Content Rights:** Marca si tens els drets

#### Pestanya Pricing and Availability

- **Price:** Free (Gratis) o selecciona preu
- **Availability:** Tots els països o selecciona específics

### 3. Preparar la Primera Versió

1. A **My Apps**, selecciona la teva app
2. Clica **+ Version or Platform** → **iOS**
3. Omple:
   - **Version:** 1.0.0
   - **Copyright:** © 2024 Dejoco Arts
   - **Description:** [Descripció completa]
   - **Keywords:** [Paraules clau]
   - **Support URL:** [URL de suport]
   - **Marketing URL:** (opcional)

### 4. Pujar Captures de Pantalla

1. Vés a **App Store** tab
2. Per cada mida de dispositiu, puja les captures
3. Ordena-les com vols que apareguin

### 5. Afegir Build

1. A la secció **Build**, clica **+**
2. Selecciona el build que has pujat anteriorment
3. Si no apareix, espera fins que es processi (15-60 min)

### 6. Informació de Revisió

Omple:
- **Contact Information:** El teu nom i email
- **Notes:** Qualsevol informació que vulguis que els revisors sàpiguen

### 7. Classificació per Edats

Respon al qüestionari sobre contingut:
- Violència: No
- Contingut sexual: No
- Etc.

Resultat esperat: **4+**

### 8. Enviar per a Revisió

1. Revisa tota la informació
2. Clica **Add for Review** (a la part superior dreta)
3. Clica **Submit for Review**

**Temps de revisió:** Normalment 1-3 dies laborables.

### 9. Estats de Revisió

- **Waiting for Review:** En cua
- **In Review:** Sent revisat per Apple
- **Pending Developer Release:** Aprovat, pots publicar
- **Ready for Sale:** Publicat a l'App Store!
- **Rejected:** Llegeix els motius i corregeix

---

## Actualitzacions Futures

Per publicar una actualització:

### 1. Actualitzar Versió

A Xcode, incrementa:
- **Build number:** 2, 3, 4... (sempre incrementa)
- **Version:** 1.0.1, 1.1.0, etc.

També a `Info.plist`:
```xml
<key>CFBundleVersion</key>
<string>2</string>
<key>CFBundleShortVersionString</key>
<string>1.0.1</string>
```

### 2. Construir i Pujar Nou Build

```bash
# Actualitzar codi
npm run build
npx cap sync ios

# Arxivar i pujar com abans
npx cap open ios
# Product → Archive → Distribute
```

### 3. Crear Nova Versió a App Store Connect

1. A App Store Connect, selecciona la teva app
2. Clica **+ Version** a l'esquerra
3. Introdueix el nou número de versió (1.0.1)
4. Omple **What's New in This Version**
5. Selecciona el nou build
6. Envia per a revisió

---

## Recursos Addicionals

### Documentació Oficial

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)

### Eines Útils

- [App Icon Generator](https://www.appicon.co/)
- [Screenshot Designer](https://www.screenshotdesigner.com/)
- [LaunchScreen Storyboard Generator](https://iosdevtools.github.io/)

### Comunitat i Suport

- [Apple Developer Forums](https://developer.apple.com/forums/)
- [Capacitor Community](https://capacitorjs.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/ios)

### Costos

- **Apple Developer Program:** $99 USD/any
- **Publicació:** Inclosa en el programa
- **Actualitzacions:** Gratuïtes

---

## Checklist Final

Abans d'enviar a revisió:

- [ ] Compte Apple Developer actiu
- [ ] Xcode instal·lat i actualitzat
- [ ] Projecte iOS generat (`npx cap add ios`)
- [ ] App ID creat a Apple Developer
- [ ] Certificats de distribució creats
- [ ] Provisioning Profile de distribució creat
- [ ] Icones de l'app creades (totes les mides)
- [ ] Bundle Identifier configurat correctament
- [ ] Versió i Build number configurats
- [ ] IPA construït i validat
- [ ] Build pujat a App Store Connect
- [ ] 1+ captures de pantalla per mida de dispositiu
- [ ] Icona 1024x1024 creada
- [ ] Descripcions escrites (català i anglès)
- [ ] Política de privacitat publicada
- [ ] App creada a App Store Connect
- [ ] Build assignat a la versió
- [ ] Informació de contacte omplida
- [ ] Classificació per edats completada
- [ ] App provada en dispositiu real o simulador

---

## Solució de Problemes

### Error: "No matching provisioning profiles found"

**Solució:**
1. A Xcode, desactiva "Automatically manage signing"
2. Selecciona manualment el Provisioning Profile correcte
3. O bé, torna a activar "Automatically manage signing"

### Error: "Code signing entitlements are not valid"

**Solució:**
1. Revisa que el Bundle ID coincideixi exactament
2. Assegura't que l'App ID té les capabilities correctes

### Build no apareix a App Store Connect

**Solució:**
- Espera 15-60 minuts després de pujar
- Comprova que el build s'ha pujat correctament a l'Organizer
- Revisa el correu per errors de processament

### App rebutjada per "Metadata rejected"

**Solució:**
- Llegeix atentament el motiu del rebuig
- Corregeix la informació a App Store Connect
- No cal pujar un nou build si només són metadades

### Error de CocoaPods

**Solució:**
```bash
cd ios/App
pod deintegrate
pod install
```

---

## Suport

Per a preguntes o problemes:
- Obre un issue a [GitHub](https://github.com/skirep/tetris-three.js)
- Consulta la documentació de [Capacitor](https://capacitorjs.com/docs/ios)
- Revisa els [Forums d'Apple Developer](https://developer.apple.com/forums/)

---

**Bona sort amb la teva publicació a l'App Store! 🚀🍎**
