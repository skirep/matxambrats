# Quick Start: Preparar per a Play Store

Aquest document és una guia ràpida per preparar l'aplicació per a Google Play Store. Per a més detalls, consulta `PLAY_STORE_GUIDE.md`.

## Passos Ràpids

### 1. Generar el Projecte Android (Primera Vegada)

```bash
# Instal·lar dependències
npm install

# Construir l'app web
npm run build

# Generar projecte Android
npx cap add android
```

### 2. Crear Keystore per Signar l'App

```bash
# Genera el keystore (guarda la contrasenya en un lloc segur!)
keytool -genkey -v -keystore dejoco-blocks-release-key.jks \
  -alias dejoco-blocks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storetype JKS
```

**⚠️ IMPORTANT:** Guarda el fitxer `.jks` i les contrasenyes de forma segura! Si els perds, no podràs actualitzar l'app a Play Store.

### 3. Configurar Signatura

Crea el fitxer `android/keystore.properties`:

```properties
storeFile=/ruta/absoluta/a/dejoco-blocks-release-key.jks
storePassword=LA_TEVA_CONTRASENYA_STORE
keyAlias=dejoco-blocks
keyPassword=LA_TEVA_CONTRASENYA_KEY
```

Afegeix-lo al `.gitignore`:

```bash
echo "android/keystore.properties" >> .gitignore
```

### 4. Configurar build.gradle

Edita `android/app/build.gradle` i afegeix abans de `android {`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Dins de `android {`, afegeix:

```gradle
signingConfigs {
    release {
        if (keystorePropertiesFile.exists()) {
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```

### 5. Configurar Versió

Edita `android/app/build.gradle` i assegura't que té:

```gradle
defaultConfig {
    applicationId "com.dejocoarts.blocks"
    minSdk 22
    targetSdk 34
    versionCode 1          // Incrementa per cada nova versió
    versionName "1.0.0"    // Versió llegible per humans
}
```

### 6. Crear Icona de l'App

Necessites icones en diferents mides. Utilitza eines com:
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
- [App Icon Generator](https://www.appicon.co/)

Col·loca les icones a:
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
└── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

### 7. Construir l'Android App Bundle (AAB)

```bash
# Construir i sincronitzar
npm run build
npx cap sync android

# Construir el AAB signat
cd android
./gradlew bundleRelease

# L'AAB estarà a:
# android/app/build/outputs/bundle/release/app-release.aab
```

### 8. Preparar Materials per a Play Store

#### Captures de Pantalla (mínim 2)
- Format: PNG o JPEG
- Mides recomanades: 1080x1920 px (telèfon)
- Captures: Menu principal, Partida, Puntuacions, "Com Jugar"

#### Icona de Play Store
- Format: PNG de 32 bits
- Mides: 512x512 px
- Sense transparència

#### Gràfic de Funcionalitat (Feature Graphic)
- Format: PNG o JPEG
- Mides: 1024x500 px
- Disseny atractiu amb logo i nom

#### Descripcions
Consulta `PLAY_STORE_GUIDE.md` per a textos complets en català i anglès.

### 9. Crear Política de Privacitat

Crea una pàgina web amb la política de privacitat (plantilla a `PLAY_STORE_GUIDE.md`).

Opcions d'hosting gratuït:
- GitHub Pages
- Google Sites
- Firebase Hosting

### 10. Publicar a Play Store

1. Ves a [Google Play Console](https://play.google.com/console)
2. Crea una nova aplicació
3. Omple la fitxa de la botiga amb descripcions i captures
4. Puja l'AAB a producció
5. Completa el qüestionari de classificació de contingut
6. Afegeix la política de privacitat
7. Envia per a revisió

## Checklist Ràpida

- [ ] Node.js i Java JDK instal·lats
- [ ] Projecte Android generat (`npx cap add android`)
- [ ] Keystore creat i guardat de forma segura
- [ ] Signatura configurada a `build.gradle`
- [ ] Icones de l'app creades (totes les densitats)
- [ ] AAB construït i signat
- [ ] 2+ captures de pantalla preparades
- [ ] Icona 512x512 creada
- [ ] Gràfic 1024x500 creat
- [ ] Descripcions escrites
- [ ] Política de privacitat publicada
- [ ] Compte de Play Store Developer creat ($25)
- [ ] App provada en dispositiu real

## Comandes Útils

```bash
# Construir debug APK (per provar)
npm run android:build

# Construir release AAB (per Play Store)
npm run build && npx cap sync android && cd android && ./gradlew bundleRelease

# Verificar signatura
jarsigner -verify -verbose android/app/build/outputs/bundle/release/app-release.aab

# Instal·lar en dispositiu (debug)
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Ajuda

- **Documentació completa:** `PLAY_STORE_GUIDE.md`
- **Build instructions:** `BUILD_INSTRUCTIONS.md`
- **Capacitor docs:** https://capacitorjs.com/docs/android
- **Play Console:** https://play.google.com/console

## Actualitzacions Futures

Per publicar una actualització:

1. Incrementa `versionCode` i `versionName` a `build.gradle`
2. Construeix nou AAB
3. Puja a Play Console
4. Afegeix notes de la versió
5. Envia per a revisió

Exemple:
```gradle
versionCode 2          // Era 1
versionName "1.0.1"    // Era "1.0.0"
```

---

**Bona sort! 🚀**
