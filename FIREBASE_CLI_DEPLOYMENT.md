# Desplegament Automàtic de Regles de Firebase

## Introducció

Aquest document explica com desplegar automàticament les regles de seguretat de Firebase Realtime Database utilitzant Firebase CLI, evitant haver de copiar-les manualment a la consola.

## Prerequisits

1. Node.js i npm instal·lats
2. Compte de Firebase amb el projecte **dejoco-blocks** configurat
3. Realtime Database creat a Firebase Console

## Instal·lació de Firebase CLI

```bash
npm install -g firebase-tools
```

## Configuració i Desplegament

### 1. Autenticació amb Firebase

**Opció A: Utilitzant npm scripts (recomanat)**
```bash
npm run firebase:login
```

**Opció B: Utilitzant Firebase CLI directament**
```bash
firebase login
```

Això obrirà el navegador per iniciar sessió amb el teu compte de Google/Firebase.

### 2. Verificar la Configuració del Projecte

El repositori ja inclou els fitxers de configuració necessaris:
- `firebase.json`: Configura què es desplegarà
- `.firebaserc`: Especifica el projecte Firebase (dejoco-blocks)
- `database.rules.json`: Conté les regles de seguretat

Pots verificar que el projecte està correctament configurat:

```bash
firebase projects:list
```

Hauria de mostrar el projecte **dejoco-blocks**.

### 3. Desplegar les Regles de la Base de Dades

Des del directori arrel del projecte, executa una d'aquestes opcions:

**Opció A: Utilitzant npm scripts (recomanat)**
```bash
npm run firebase:deploy:database
```

**Opció B: Utilitzant Firebase CLI directament**
```bash
firebase deploy --only database
```

Això desplegarà automàticament les regles de `database.rules.json` al teu projecte Firebase.

### Desplegament Complet (Opcional)

Si vols desplegar tant les regles com l'aplicació web a Firebase Hosting:

**Opció A: Utilitzant npm scripts**
```bash
npm run firebase:deploy
```

**Opció B: Utilitzant Firebase CLI directament**
```bash
firebase deploy
```

## Verificació

Després del desplegament, pots verificar que les regles s'han aplicat correctament:

1. Ves a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el projecte **dejoco-blocks**
3. Navega a **Realtime Database** > **Rules**
4. Hauries de veure les regles següents:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      ".write": true,
      ".indexOn": ["status", "createdAt"]
    }
  }
}
```

## Alternatives

Si prefereixes no utilitzar Firebase CLI, pots seguir el mètode manual descrit a:
- **[FIREBASE_QUICK_START.md](FIREBASE_QUICK_START.md)** - Guia ràpida (5 minuts)
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Documentació completa

## Solució de Problemes

### Error: "No authorization"

Si reps aquest error, assegura't que has fet login:

```bash
firebase logout
firebase login
```

### Error: "Permission denied"

Verifica que el teu compte de Google té permisos d'administrador o editor al projecte Firebase.

### El projecte no es troba

Si `firebase projects:list` no mostra **dejoco-blocks**, pots canviar el projecte amb:

```bash
firebase use --add
```

I selecciona **dejoco-blocks** de la llista.

## Recursos

- [Documentació de Firebase CLI](https://firebase.google.com/docs/cli)
- [Regles de Seguretat de Realtime Database](https://firebase.google.com/docs/database/security)
