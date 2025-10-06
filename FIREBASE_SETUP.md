# Configuració de Firebase per al Mode Multijugador

## Introducció

El mode multijugador (Deathmatch Online) utilitza Firebase Realtime Database per sincronitzar les partides entre jugadors. Per a que funcioni correctament, necessites configurar les regles de seguretat de la base de dades.

## Configuració Pas a Pas

### 1. Accedeix a la Consola de Firebase

1. Ves a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el teu projecte: **dejoco-blocks**

### 2. Configura Realtime Database

1. Al menú lateral, cerca **Realtime Database**
2. Si no tens una base de dades creada, fes clic a **Create Database**
3. Selecciona una ubicació (preferiblement propera als teus usuaris)
4. Quan et pregunti per les regles de seguretat, selecciona **Start in locked mode** (les configuraràs al següent pas)

### 3. Configura les Regles de Seguretat

1. A la pestanya **Rules** de Realtime Database
2. Substitueix les regles existents pel contingut del fitxer `database.rules.json` d'aquest repositori:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        ".indexOn": ["status", "createdAt"]
      }
    }
  }
}
```

3. Fes clic a **Publish** per aplicar les regles

### 4. Verifica la Configuració

La configuració actual de Firebase al fitxer `script.js` és:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyAKe5KSEh71w1ik2ynRYBEyd9jWOY-Dl5U",
    authDomain: "dejoco-blocks.firebaseapp.com",
    projectId: "dejoco-blocks",
    databaseURL: "https://dejoco-blocks-default-rtdb.firebaseio.com"
};
```

Assegura't que el `databaseURL` coincideix amb l'URL de la teva Realtime Database.

## Explicació de les Regles

Les regles configurades permeten:

- **Lectura i escriptura** a totes les sales (`rooms/$roomCode`)
- **Indexació** pels camps `status` i `createdAt` per optimitzar les consultes

### Per què aquestes regles?

1. **`.read: true` i `.write: true`**: Permeten a qualsevol jugador crear sales i unir-s'hi. Per a una aplicació en producció amb més seguretat, pots implementar autenticació de Firebase.

2. **`.indexOn: ["status", "createdAt"]`**: Optimitza la consulta que busca sales disponibles:
   ```javascript
   roomsRef.orderByChild('status').equalTo('waiting')
   ```

## Millores de Seguretat (Opcional)

Per a una aplicació en producció, considera aquestes millores:

### 1. Autenticació Anònima

Activa l'autenticació anònima a Firebase i modifica les regles:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

### 2. Validació de Dades

Afegeix validació per assegurar l'estructura de les dades:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['status', 'createdAt'])",
        "player1": {
          ".validate": "newData.hasChildren(['name', 'ready', 'linesCleared'])"
        },
        "player2": {
          ".validate": "newData.hasChildren(['name', 'ready', 'linesCleared'])"
        },
        "status": {
          ".validate": "newData.isString() && (newData.val() == 'waiting' || newData.val() == 'playing' || newData.val() == 'finished')"
        }
      }
    }
  }
}
```

### 3. Neteja Automàtica de Sales Antigues

Les sales que no s'utilitzen ocupen espai. Pots afegir una funció de Cloud Functions per eliminar-les:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.cleanupOldRooms = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  const db = admin.database();
  const now = Date.now();
  const cutoff = now - 3600000; // 1 hora

  const oldRoomsQuery = db.ref('rooms').orderByChild('createdAt').endAt(cutoff);
  const snapshot = await oldRoomsQuery.once('value');
  
  const updates = {};
  snapshot.forEach((child) => {
    updates[child.key] = null;
  });

  return db.ref('rooms').update(updates);
});
```

## Verificació

Per verificar que tot funciona:

1. Obre l'aplicació en dos navegadors o dispositius diferents
2. A un dispositiu, fes clic a **Deathmatch Online**
3. A l'altre dispositiu, també fes clic a **Deathmatch Online**
4. El segon jugador hauria de unir-se automàticament a la sala del primer
5. La partida hauria de començar quan els dos jugadors estiguin connectats

## Solució de Problemes

### Error: "Permission denied"

- Verifica que has publicat les regles de seguretat
- Comprova que el `databaseURL` és correcte

### Els jugadors no es connecten

- Verifica la connexió a Internet
- Comprova la consola del navegador per errors
- Assegura't que Firebase està inicialitzat correctament

### Les consultes són lentes

- Verifica que tens l'índex `.indexOn` configurat per al camp `status`
- Firebase hauria de mostrar un avís a la consola si falta un índex

## Recursos

- [Documentació de Realtime Database](https://firebase.google.com/docs/database)
- [Regles de Seguretat](https://firebase.google.com/docs/database/security)
- [Optimització amb Índexs](https://firebase.google.com/docs/database/security/indexing-data)
