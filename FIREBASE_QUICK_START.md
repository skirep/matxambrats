# Guia Ràpida: Configuració de Firebase per Multijugador

## Problema

El mode **Deathmatch Online** no funciona i mostra l'error:
```
permission_denied at /rooms: Client doesn't have permission to access the desired data.
```

Això passa perquè falten les regles de seguretat de Firebase Realtime Database.

## Solució Ràpida (5 minuts)

### 1. Ves a Firebase Console

Accedeix a: https://console.firebase.google.com/project/dejoco-blocks/database/dejoco-blocks-default-rtdb/rules

**Important**: Si la teva base de dades està a Europa (europe-west1), l'URL serà:
`https://dejoco-blocks-default-rtdb.europe-west1.firebasedatabase.app/`

### 2. Configura les Regles

A la pestanya **Rules**, enganxa aquest codi:

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

### 3. Publica les Regles

Fes clic al botó **Publish** (Publicar)

### 4. Prova el Multijugador

1. Obre l'aplicació en dos dispositius o navegadors
2. Fes clic a **Deathmatch Online** en tots dos
3. Els jugadors haurien de connectar-se automàticament

## Què fan aquestes regles?

- Permeten que qualsevol jugador pugui crear i unir-se a sales
- Indexen les sales per estat (`waiting`, `playing`) per trobar-les ràpidament
- Permeten la sincronització en temps real entre jugadors

## Desplegament Automàtic (Alternatiu)

Si prefereixes no copiar les regles manualment, pots utilitzar Firebase CLI per desplegar-les automàticament:

**Consulta [FIREBASE_CLI_DEPLOYMENT.md](FIREBASE_CLI_DEPLOYMENT.md)** per instruccions detallades.

## Documentació Completa

Per més detalls i opcions de seguretat avançades, consulta **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)**

## Ajuda

Si tens problemes:
- Verifica que la URL de la base de dades coincideix amb la regió de la teva base de dades:
  - **US**: `https://dejoco-blocks-default-rtdb.firebaseio.com`
  - **Europa (europe-west1)**: `https://dejoco-blocks-default-rtdb.europe-west1.firebasedatabase.app/`
- Comprova la consola del navegador per errors
- Assegura't que has publicat les regles (botó **Publish**)
