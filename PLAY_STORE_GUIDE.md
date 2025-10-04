# Guia Completa per Publicar a Google Play Store

Aquest document proporciona totes les instruccions necessàries per preparar i publicar l'aplicació Dejoco Blocks a Google Play Store.

## Índex

1. [Requisits Previs](#requisits-previs)
2. [Configuració de l'Aplicació](#configuració-de-laplicació)
3. [Icona de l'Aplicació](#icona-de-laplicació)
4. [Generació del Keystore](#generació-del-keystore)
5. [Configuració de Signatura](#configuració-de-signatura)
6. [Construcció de l'APK/AAB de Producció](#construcció-de-lapkaab-de-producció)
7. [Política de Privacitat](#política-de-privacitat)
8. [Materials de la Play Store](#materials-de-la-play-store)
9. [Publicació a Play Store](#publicació-a-play-store)

---

## Requisits Previs

Abans de començar, assegura't de tenir:

- **Compte de Google Play Developer** (cost únic de $25 USD)
- **Node.js 18 o superior**
- **Java Development Kit (JDK) 17**
- **Android Studio** (opcional però recomanat per a proves)

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
    "androidScheme": "https"
  }
}
```

### 3. Preparar el Projecte Android

Si encara no tens la carpeta `android`, genera-la:

```bash
npm install
npm run build
npx cap add android
```

### 4. Configurar AndroidManifest.xml

Edita el fitxer `android/app/src/main/AndroidManifest.xml` i assegura't que conté:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.dejocoarts.blocks">

    <!-- Permisos necessaris -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="@string/app_name"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:exported="true"
            android:screenOrientation="portrait">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

**Nota:** `android:screenOrientation="portrait"` fixa l'orientació a vertical. Elimina aquesta línia si vols suportar orientació horitzontal.

### 5. Configurar build.gradle (nivell app)

Edita `android/app/build.gradle`:

```gradle
android {
    namespace "com.dejocoarts.blocks"
    compileSdk 34
    
    defaultConfig {
        applicationId "com.dejocoarts.blocks"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
    
    // ... resta del fitxer
}
```

**Important:**
- `versionCode`: Incrementa aquest número amb cada nova versió (1, 2, 3...)
- `versionName`: Versió llegible per humans (1.0.0, 1.0.1, 1.1.0...)
- `minSdk 22`: Compatible amb Android 5.1 (Lollipop) i superior
- `targetSdk 34`: Apunta a Android 14

---

## Icona de l'Aplicació

### Crear les Icones

Necessites icones en diferents mides. Pots utilitzar eines com:

- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
- [App Icon Generator](https://www.appicon.co/)
- Adobe Photoshop / GIMP

### Mides Necessàries

Crea icones amb aquestes mides i col·loca-les a les carpetes corresponents:

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48 px)
│   └── ic_launcher_round.png (48x48 px)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72 px)
│   └── ic_launcher_round.png (72x72 px)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96 px)
│   └── ic_launcher_round.png (96x96 px)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144 px)
│   └── ic_launcher_round.png (144x144 px)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192 px)
    └── ic_launcher_round.png (192x192 px)
```

### Icona Adaptable (Recomanat)

Per a Android 8.0+, crea una icona adaptable amb:

1. **Icona de primer pla (foreground)**: L'element principal
2. **Icona de fons (background)**: El fons de l'icona

Crea el fitxer `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

---

## Generació del Keystore

El keystore és necessari per signar l'APK/AAB de producció.

### Crear el Keystore

Executa aquesta comanda (canvia els valors segons les teves necessitats):

```bash
keytool -genkey -v -keystore dejoco-blocks-release-key.jks \
  -alias dejoco-blocks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storetype JKS
```

Se't demanarà:
- **Contrasenya del keystore**: Guarda-la en un lloc segur
- **Nom complet**: El teu nom o nom de l'empresa
- **Unitat organitzativa**: Nom del departament (opcional)
- **Organització**: Nom de l'empresa
- **Ciutat/Localitat**
- **Estat/Província**
- **Codi de país**: ES per Espanya, per exemple

**⚠️ IMPORTANT:** 
- Guarda el fitxer `.jks` en un lloc segur
- **NO** el pugis a Git o repositoris públics
- Si perds aquest fitxer, no podràs actualitzar l'app a Play Store

### Emmagatzemar el Keystore

1. Guarda el fitxer `.jks` fora del repositori (per exemple, a `~/.android/keystores/`)
2. Fes còpies de seguretat en múltiples ubicacions
3. Afegeix `*.jks` i `*.keystore` al teu `.gitignore`

---

## Configuració de Signatura

### Opció 1: Fitxer keystore.properties (Recomanat)

Crea el fitxer `android/keystore.properties` (aquest fitxer NO s'ha de pujar a Git):

```properties
storeFile=/path/to/dejoco-blocks-release-key.jks
storePassword=LA_TEVA_CONTRASENYA_STORE
keyAlias=dejoco-blocks
keyPassword=LA_TEVA_CONTRASENYA_KEY
```

Afegeix `keystore.properties` al teu `.gitignore`:

```bash
echo "android/keystore.properties" >> .gitignore
```

### Opció 2: Variables d'Entorn

Alternativament, pots utilitzar variables d'entorn:

```bash
export DEJOCO_KEYSTORE_FILE="/path/to/dejoco-blocks-release-key.jks"
export DEJOCO_KEYSTORE_PASSWORD="la_teva_contrasenya_store"
export DEJOCO_KEY_ALIAS="dejoco-blocks"
export DEJOCO_KEY_PASSWORD="la_teva_contrasenya_key"
```

### Configurar build.gradle per a Signatura

Edita `android/app/build.gradle`:

```gradle
android {
    // ... configuració anterior ...

    signingConfigs {
        release {
            // Opció 1: Utilitzar keystore.properties
            def keystorePropertiesFile = rootProject.file("keystore.properties")
            if (keystorePropertiesFile.exists()) {
                def keystoreProperties = new Properties()
                keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
                
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
            // Opció 2: Utilitzar variables d'entorn (fallback)
            else if (System.getenv("DEJOCO_KEYSTORE_FILE")) {
                storeFile file(System.getenv("DEJOCO_KEYSTORE_FILE"))
                storePassword System.getenv("DEJOCO_KEYSTORE_PASSWORD")
                keyAlias System.getenv("DEJOCO_KEY_ALIAS")
                keyPassword System.getenv("DEJOCO_KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## Construcció de l'APK/AAB de Producció

Google Play Store ara **requereix Android App Bundle (AAB)** en lloc d'APK per a noves aplicacions.

### Construir Android App Bundle (AAB) - Recomanat

```bash
# 1. Construir la web app
npm run build

# 2. Sincronitzar amb Android
npx cap sync android

# 3. Construir el AAB signat
cd android
./gradlew bundleRelease

# El AAB estarà a:
# android/app/build/outputs/bundle/release/app-release.aab
```

### Construir APK Signat (Opcional)

Si necessites un APK per a distribució fora de Play Store:

```bash
cd android
./gradlew assembleRelease

# L'APK estarà a:
# android/app/build/outputs/apk/release/app-release.apk
```

### Verificar la Signatura

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

Hauries de veure: `jar verified.`

---

## Política de Privacitat

Google Play Store requereix una política de privacitat si la teva app:
- Recull dades d'usuari
- Utilitza serveis de tercers (com Firebase)
- Té permisos d'Internet

### Plantilla de Política de Privacitat

Crea un fitxer `PRIVACY_POLICY.md` o hostatja-la a un lloc web accessible:

```markdown
# Política de Privacitat - Dejoco Blocks

**Data d'efectivitat:** [DATA]

## Recopilació de Dades

Dejoco Blocks recopila les següents dades:

### Dades Personals
- **Nom d'usuari**: Utilitzat només per a la taula de puntuacions locals i remotes
- **Puntuacions**: Emmagatzemades localment i a Firebase Firestore

### Dades Tècniques
- **Connexió a Internet**: Utilitzada per sincronitzar puntuacions amb el servidor

## Ús de les Dades

Les dades recopilades s'utilitzen únicament per:
- Mostrar taules de puntuacions
- Millorar l'experiència de joc

## Emmagatzematge de Dades

- **Local**: Les dades s'emmagatzemen al dispositiu mitjançant LocalStorage
- **Remot**: Les puntuacions s'emmagatzemen a Firebase Firestore (Google Cloud)

## Compartició de Dades

No compartim les teves dades amb tercers. Les dades de puntuació són visibles públicament dins de l'app.

## Seguretat

Utilitzem Firebase per emmagatzemar dades, que compleix amb estàndards de seguretat de la indústria.

## Drets de l'Usuari

Pots:
- Esborrar les teves puntuacions locals des de l'app
- Sol·licitar l'eliminació de les teves dades remotes contactant amb nosaltres

## Serveis de Tercers

Utilitzem:
- **Firebase** (Google): Per emmagatzemar puntuacions
- Política de privacitat de Firebase: https://firebase.google.com/support/privacy

## Canvis a Aquesta Política

Ens reservem el dret d'actualitzar aquesta política. Els canvis es notificaran dins de l'app.

## Contacte

Per preguntes sobre aquesta política, contacta amb:
- Email: [EL_TEU_EMAIL]
- Web: [LA_TEVA_WEB]
```

### Hospedar la Política de Privacitat

Opcions per hospedar la política:

1. **GitHub Pages**: Puja la política com a `privacy-policy.html` i activa GitHub Pages
2. **Google Sites**: Gratuït i fàcil d'utilitzar
3. **Lloc web propi**: Si en tens un

**URL d'exemple:** `https://skirep.github.io/tetris-three.js/privacy-policy.html`

---

## Materials de la Play Store

Per publicar a Play Store, necessitaràs:

### 1. Captures de Pantalla

**Requisits:**
- Format: JPEG o PNG de 24 bits (sense canal alfa)
- Mínims: 2 captures
- Dimensions mínimes: 320 px
- Dimensions màximes: 3840 px
- Relació d'aspecte: Entre 16:9 i 9:16

**Recomanacions:**
- Telèfon: 1080x1920 px o 1080x2340 px
- Tauleta de 7": 1200x1920 px
- Tauleta de 10": 1600x2560 px

**Captures suggerides:**
1. Menu principal
2. Partida en curs
3. Taula de puntuacions
4. Pantalla de com jugar

### 2. Icona de l'Aplicació

**Requisits:**
- Format: PNG de 32 bits
- Dimensions: 512x512 px
- Mida màxima: 1 MB
- Sense transparència

### 3. Gràfic de Funcionalitat (Feature Graphic)

**Requisits:**
- Format: JPEG o PNG de 24 bits
- Dimensions: 1024x500 px
- Utilitzat a la capçalera de la teva pàgina a Play Store

**Consell:** Crea un disseny atractiu amb el logo i el nom del joc.

### 4. Descripció de l'App

#### Descripció Curta (màx 80 caràcters)

**Català:**
```
Un joc de blocs clàssic tipus Tetris amb taula de puntuacions global
```

**Anglès:**
```
A classic Tetris-style block game with global leaderboard
```

#### Descripció Completa (màx 4000 caràcters)

**Català:**
```
🎮 Dejoco Blocks - El Joc de Blocs Clàssic!

Gaudeix del joc de blocs més adictiu en el teu dispositiu Android! Dejoco Blocks és una experiència de joc clàssica amb un disseny modern inspirat en la Game Boy.

✨ CARACTERÍSTIQUES PRINCIPALS:

🎯 Jugabilitat Clàssica
• Col·loca les peces que cauen per completar línies
• 7 peces diferents (tetrominos)
• Dificultat progressiva
• Sistema de puntuació equilibrat

🌐 Suport Multiidioma
• Català
• English

🏆 Sistema de Puntuacions
• Taula de puntuacions local
• Taula de puntuacions global (Firebase)
• Competeix amb jugadors de tot el món!

🎨 Estil Retro Game Boy
• Paleta de colors monocromàtica verda
• Disseny pixelat nostàlgic
• Experiència de joc autèntica

🎵 Experiència Completa
• Música de fons clàssica de Tetris
• Controls de volum ajustables
• Opció de silenciar

📱 Disseny Responsive
• Optimitzat per a telèfons i tauletes
• Controls tàctils intuïtius
• Controls de teclat per a ordinador
• Funciona en mode vertical i horitzontal

⚡ Altres Característiques
• Funció de pausa
• Visualització de la següent peça
• Cronòmetre de partida
• Indicador de nivell
• Desa les teves puntuacions localment

Com Jugar:
1. Les peces cauen des de la part superior
2. Mou-les amb les fletxes o els botons tàctils
3. Rota les peces per encaixar-les
4. Completa línies horitzontals per eliminar-les
5. El joc acaba quan les peces arriben a dalt!

Puntuació:
• 1 línia: 100 punts
• 2 línies: 300 punts
• 3 línies: 500 punts
• 4 línies (Tetris!): 800 punts

Perfecte per:
✓ Amants dels jocs retro
✓ Jugadors casuals
✓ Sessions de joc ràpides
✓ Competir amb amics

Desenvolupat amb passió per Dejoco Arts. Gaudeix del joc més adictiu de blocs en el teu dispositiu Android!

Descarrega ara i demostra les teves habilitats! 🎮
```

**Anglès:**
```
🎮 Dejoco Blocks - The Classic Block Game!

Enjoy the most addictive block game on your Android device! Dejoco Blocks is a classic gaming experience with a modern design inspired by the Game Boy.

✨ KEY FEATURES:

🎯 Classic Gameplay
• Place falling pieces to complete lines
• 7 different pieces (tetrominos)
• Progressive difficulty
• Balanced scoring system

🌐 Multilingual Support
• Català
• English

🏆 Scoring System
• Local leaderboard
• Global leaderboard (Firebase)
• Compete with players worldwide!

🎨 Retro Game Boy Style
• Monochromatic green color palette
• Nostalgic pixelated design
• Authentic gaming experience

🎵 Complete Experience
• Classic Tetris background music
• Adjustable volume controls
• Mute option

📱 Responsive Design
• Optimized for phones and tablets
• Intuitive touch controls
• Keyboard controls for desktop
• Works in portrait and landscape mode

⚡ Other Features
• Pause function
• Next piece preview
• Game timer
• Level indicator
• Save your scores locally

How to Play:
1. Pieces fall from the top
2. Move them with arrows or touch buttons
3. Rotate pieces to fit them
4. Complete horizontal lines to clear them
5. Game ends when pieces reach the top!

Scoring:
• 1 line: 100 points
• 2 lines: 300 points
• 3 lines: 500 points
• 4 lines (Tetris!): 800 points

Perfect for:
✓ Retro game lovers
✓ Casual gamers
✓ Quick game sessions
✓ Competing with friends

Developed with passion by Dejoco Arts. Enjoy the most addictive block game on your Android device!

Download now and show your skills! 🎮
```

### 5. Categoria i Etiquetes

**Categoria:** Jocs > Trencaclosques

**Etiquetes:**
- tetris
- blocks
- puzzle
- retro
- arcade
- classic

### 6. Classificació de Contingut

Completa el qüestionari de classificació:
- **Violència:** Cap
- **Contingut Sexual:** Cap
- **Llenguatge Groller:** Cap
- **Consum de Drogues:** Cap
- **Contingut Generat per Usuaris:** Només noms d'usuari

Classificació esperada: **Tots** (PEGI 3)

---

## Publicació a Play Store

### Pas 1: Crear una Aplicació a la Consola

1. Ves a [Google Play Console](https://play.google.com/console)
2. Fes clic a "Crea aplicació"
3. Omple:
   - Nom de l'app: **Dejoco Blocks**
   - Idioma predeterminat: **Català** o **Anglès**
   - App o joc: **Joc**
   - Gratuïta o de pagament: **Gratuïta**

### Pas 2: Completa la Fitxa de Play Store

A la secció "Fitxa de la botiga principal":

1. **Detalls de l'app:**
   - Afegeix la descripció curta i completa
   - Afegeix les captures de pantalla
   - Puja la icona (512x512)
   - Puja el gràfic de funcionalitat (1024x500)

2. **Categorització:**
   - Categoria: Trencaclosques
   - Etiquetes: tetris, blocks, puzzle, retro

3. **Informació de contacte:**
   - Email
   - Lloc web (opcional)
   - Política de privacitat (obligatori)

### Pas 3: Configurar les Versions

A la secció "Producció":

1. Crea una nova versió
2. Puja el fitxer AAB
3. Afegeix notes de la versió:

**Català:**
```
Versió 1.0.0 - Llançament inicial
• Joc de blocs clàssic tipus Tetris
• Suport per català i anglès
• Taula de puntuacions local i global
• Disseny retro inspirat en Game Boy
• Controls tàctils i de teclat
• Música de fons
```

**Anglès:**
```
Version 1.0.0 - Initial Release
• Classic Tetris-style block game
• Support for Catalan and English
• Local and global leaderboard
• Game Boy-inspired retro design
• Touch and keyboard controls
• Background music
```

### Pas 4: Classificació de Contingut

1. Completa el qüestionari
2. Obté la classificació (hauria de ser "Tots")

### Pas 5: Audiència Objectiu

1. Selecciona l'edat objectiu: 13 anys o més
2. Marca que no conté anuncis

### Pas 6: Revisió i Publicació

1. Revisa tots els apartats
2. Envia per a revisió
3. Espera l'aprovació de Google (pot trigar uns dies)

---

## Actualitzacions Futures

Per publicar actualitzacions:

1. Incrementa `versionCode` i `versionName` a `build.gradle`
2. Construeix un nou AAB
3. Crea una nova versió a Play Console
4. Puja el nou AAB
5. Afegeix notes de la versió
6. Envia per a revisió

**Exemple:**

```gradle
defaultConfig {
    versionCode 2  // Incrementat de 1 a 2
    versionName "1.0.1"  // Actualitzat de 1.0.0 a 1.0.1
}
```

---

## Checklist Final

Abans de publicar, verifica:

- [ ] Keystore generat i guardat de forma segura
- [ ] build.gradle configurat amb signatura
- [ ] AAB generat i signat correctament
- [ ] Icones de l'app creades per a totes les densitats
- [ ] AndroidManifest.xml configurat correctament
- [ ] Política de privacitat creada i hostatjada
- [ ] Captures de pantalla (mínim 2) preparades
- [ ] Gràfic de funcionalitat (1024x500) creat
- [ ] Descripció curta i completa escrites
- [ ] Categoria i etiquetes seleccionades
- [ ] Qüestionari de classificació completat
- [ ] Informació de contacte proporcionada
- [ ] App provada en dispositius reals
- [ ] Tots els permisos justificats

---

## Recursos Addicionals

- [Documentació oficial de Google Play Console](https://support.google.com/googleplay/android-developer)
- [Directrius de qualitat d'aplicacions](https://developer.android.com/quality)
- [Polítiques del programa per a desenvolupadors](https://play.google.com/about/developer-content-policy/)
- [Capacitor: Construcció d'Android](https://capacitorjs.com/docs/android)
- [Firebase: Configuració d'Android](https://firebase.google.com/docs/android/setup)

---

## Suport

Per a preguntes o problemes:
- Obre un issue a GitHub
- Contacta amb Dejoco Arts
- Consulta la documentació de Capacitor

---

**Bona sort amb la teva publicació! 🚀**
