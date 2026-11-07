# Mi biblioteca

Aplicación web para registrar los libros que leíste y los que querés leer. Podés agregar libros, marcarlos como leídos o pendientes, editarlos, eliminarlos, buscarlos y filtrarlos.

- **App publicada:** https://mi-biblioteca-zeta.vercel.app/
- **Tecnologías:** React + Vite, Firebase (Cloud Firestore y Authentication anónima), Vercel.

## Cómo usarla

1. Completá título y autor (obligatorios) y, si querés, el género.
2. Tocá **Quiero leer** o **Leído**: el libro se guarda directamente con ese estado.
3. En **Mi colección**, tocá los contadores (**Libros en total**, **Libros leídos**, **Por leer**) para ver solo esos libros. También podés usar el buscador.
4. En cada tarjeta podés **marcar como leído / pendiente**, **editar** o **eliminar**.

Cada navegador recibe un usuario anónimo propio: tus libros se guardan en Firebase y siguen ahí al recargar, pero desde otro dispositivo verías una biblioteca distinta.

## Instalación local

Necesitás Node.js instalado.

```bash
npm install
npm run dev
```

### Configurar Firebase

1. En [Firebase Console](https://console.firebase.google.com/) creá un proyecto y registrá una app web (`</>`).
2. En **Authentication → Método de acceso**, habilitá **Anónimo**.
3. Creá una base de **Cloud Firestore** (edición Standard, `(default)`, región `southamerica-east1`) en **modo producción**.
4. Copiá `.env.example` como `.env` y completá los valores del objeto `firebaseConfig`:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

5. Reiniciá `npm run dev` después de cambiar el `.env`.

### Publicar las reglas de Firestore

Las reglas están en `firestore.rules`. Copiá su contenido en **Firestore → Reglas** y tocá **Publicar**. Publicar en Vercel **no** actualiza las reglas.

## Publicar en Vercel

1. Importá el repositorio de GitHub en [Vercel](https://vercel.com/).
2. Framework: **Vite**, build: `npm run build`, salida: `dist`.
3. En **Settings → Environment Variables** cargá las 4 variables `VITE_FIREBASE_*` (entorno Production).
4. Desplegá. Si cambiás las variables, hacé **Redeploy**.

## Dónde se conecta Firebase

| Archivo | Qué hace |
|---|---|
| `src/firebase.js` | Inicializa Firebase con las variables del `.env` y exporta `db` y `auth`. |
| `src/App.jsx` | Inicia la sesión anónima (`signInAnonymously`). |
| `src/librosService.js` | Todas las operaciones con Firestore: consultar (`onSnapshot`), agregar (`addDoc`), modificar (`updateDoc`) y eliminar (`deleteDoc`). |
| `firestore.rules` | Permisos de la base de datos. |

## Modelo de datos

Colección `libros`, un documento por libro:

| Campo | Tipo | Ejemplo |
|---|---|---|
| `titulo` | texto (1 a 100) | "El principito" |
| `autor` | texto (1 a 100) | "Antoine de Saint-Exupéry" |
| `genero` | texto (hasta 50) | "Clásico" |
| `estado` | "Leído" o "Quiero leer" | "Leído" |
| `ownerId` | texto | uid del usuario anónimo |

## Seguridad

- Cada usuario solo puede ver, modificar y eliminar sus propios libros.
- Las reglas validan los campos y no permiten cambiar el dueño de un libro.
- Todo lo que no está permitido queda bloqueado.
- El `.env` no se sube al repositorio.

## Estructura

```
src/
  firebase.js          conexión con Firebase
  librosService.js     operaciones con Firestore
  App.jsx              estado principal y lógica
  assets/              íconos de acuarela (hoja y libros)
  components/
    Estadisticas.jsx   contadores de libros (también filtran la colección)
    FormularioLibro.jsx  formulario para agregar/editar
    TarjetaLibro.jsx   tarjeta de cada libro
docs/capturas/         capturas de cada versión
firestore.rules        reglas de seguridad
```

## Imágenes

Los íconos de la hoja y de los libros se hicieron a partir de ilustraciones de acuarela usadas como referencia: se recortaron y se les quitó el fondo. Fuente: [completar de dónde salieron las imágenes].
