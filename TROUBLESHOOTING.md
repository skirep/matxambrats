# Solució de Problemes / Troubleshooting

## Error: "permission_denied at /rooms"

### Problema

Quan intentes jugar al mode **Deathmatch Online**, reps l'error:

```
Uncaught (in promise) Error: permission_denied at /rooms: Client doesn't have permission to access the desired data.
```

### Causa

Aquest error apareix perquè les regles de seguretat de Firebase Realtime Database no estan configurades o no permeten l'accés a la ruta `/rooms`.

### Solució

Les regles de seguretat necessiten ser desplegades al projecte Firebase. Tens **dues opcions**:

#### Opció 1: Configuració Manual (5 minuts)

Segueix la guia ràpida: **[FIREBASE_QUICK_START.md](FIREBASE_QUICK_START.md)**

Aquesta guia t'explica com:
1. Accedir a la Firebase Console
2. Copiar les regles de `database.rules.json` 
3. Enganxar-les a la pestanya "Rules" de Realtime Database
4. Publicar les regles

#### Opció 2: Desplegament Automàtic amb Firebase CLI

Segueix la guia de desplegament: **[FIREBASE_CLI_DEPLOYMENT.md](FIREBASE_CLI_DEPLOYMENT.md)**

Aquesta guia t'explica com:
1. Instal·lar Firebase CLI
2. Autenticar-te amb Firebase
3. Desplegar automàticament les regles amb `firebase deploy --only database`

### Verificació

Després d'aplicar les regles (per qualsevol dels dos mètodes), verifica que funciona:

1. Obre l'aplicació en dos navegadors o dispositius
2. Fes clic a **Deathmatch Online** en tots dos
3. Els jugadors haurien de connectar-se automàticament

Si encara tens problemes, consulta la secció "Solució de Problemes" a **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)**.

---

## Error: Firebase is not defined

### Problema

La consola del navegador mostra errors com:
```
Uncaught ReferenceError: firebase is not defined
```

### Causa

Els scripts de Firebase CDN no s'han carregat correctament, possiblement per:
- Bloqueig de scripts per part del navegador
- Problemes de connexió a Internet
- Content blocker o extensió del navegador

### Solució

1. Verifica la connexió a Internet
2. Desactiva temporalment extensions com ad blockers
3. Prova amb un altre navegador
4. Verifica que els scripts de Firebase estiguin carregant-se a l'HTML

---

## El multijugador no connecta els jugadors

### Problema

Els jugadors no es troben mútuament o la sala queda esperant indefinidament.

### Possibles Causes i Solucions

1. **Regles no publicades**: Assegura't que has publicat les regles a Firebase Console
2. **URL de la base de dades incorrecta**: Verifica que la `databaseURL` a `script.js` coincideix amb la regió de la teva base de dades (US vs Europa)
3. **Problemes de xarxa**: Comprova la connexió a Internet en tots dos dispositius
4. **Temps d'espera esgotat**: Intenta refrescar la pàgina i tornar a crear/unir-te a la sala

---

## La base de dades està a una regió diferent

### Problema

El `databaseURL` configurat no coincideix amb la regió de la teva Realtime Database.

### Solució

1. Verifica la regió de la teva base de dades a [Firebase Console](https://console.firebase.google.com/)
2. Actualitza el `databaseURL` a `script.js`:
   - **US**: `https://dejoco-blocks-default-rtdb.firebaseio.com`
   - **Europa (europe-west1)**: `https://dejoco-blocks-default-rtdb.europe-west1.firebasedatabase.app/`

---

## Més Ajuda

Per més informació, consulta:
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Guia completa de configuració
- **[README.md](README.md)** - Documentació general del projecte
