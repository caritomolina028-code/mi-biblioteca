# Mi biblioteca

Aplicación web para registrar los libros que leíste y los que querés leer. Podés agregar libros, marcarlos como leídos o pendientes, editarlos, eliminarlos, buscarlos y filtrarlos.

- **App publicada:** https://mi-biblioteca-zeta.vercel.app/
- **Tecnologías:** React + Vite, Firebase (Cloud Firestore y Authentication anónima), Vercel.

## Cómo usarla

1. Empezá a escribir el **título**: aparece una lista de libros de Google Books con su portada. Elegí el tuyo y se completan solos el autor, el género y la portada. Si hay muchos libros con títulos parecidos, escribí también el **autor**. Si no lo encontrás, completá los datos a mano.
2. Tocá **Quiero leer**, **Leyendo** o **Leído**: el libro se guarda directamente con ese estado.
3. Los libros que estás leyendo aparecen arriba de todo, en **Leyendo ahora**, apenas entrás a la página.
4. En **Mi colección**, tocá los contadores (**Libros en total**, **Por leer**, **Leyendo**, **Libros leídos**) para ver solo esos libros. También podés usar el buscador. La colección muestra 6 libros por página, en orden alfabético.
5. En cada tarjeta podés tocar **Ver más** (sinopsis, año, editorial y páginas, si el libro vino de Google Books), **Empezar a leer**, **Marcar como leído** o **Marcar como pendiente** (según el estado del libro), **Editar** o **Eliminar**.

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
VITE_GOOGLE_BOOKS_API_KEY=
```

5. Reiniciá `npm run dev` después de cambiar el `.env`.

### Configurar la API de Google Books

1. En [Google Cloud Console](https://console.cloud.google.com/), con el mismo proyecto de Firebase seleccionado, habilitá **Books API** (Biblioteca de APIs). No requiere facturación.
2. En **APIs y servicios → Credenciales → Crear credenciales → Clave de API**:
   - Restricción de API: solo **Books API**.
   - Restricción de aplicaciones: **Sitios web**, con `https://<tu-app>.vercel.app/*` y `http://localhost:5173/*` (y otros puertos que uses).
3. Pegá la clave en `.env` como `VITE_GOOGLE_BOOKS_API_KEY`.

El cupo gratuito es de 1000 consultas por día. Si se agota o la API falla, la app sigue funcionando y se pueden cargar los libros a mano.

### Publicar las reglas de Firestore

Las reglas están en `firestore.rules`. Copiá su contenido en **Firestore → Reglas** y tocá **Publicar**. Publicar en Vercel **no** actualiza las reglas.

## Publicar en Vercel

1. Importá el repositorio de GitHub en [Vercel](https://vercel.com/).
2. Framework: **Vite**, build: `npm run build`, salida: `dist`.
3. En **Settings → Environment Variables** cargá las 4 variables `VITE_FIREBASE_*` y `VITE_GOOGLE_BOOKS_API_KEY` (entorno Production, tipo Config).
4. Desplegá. Si cambiás las variables, hacé **Redeploy**.

## Dónde se conectan Firebase y la API

| Archivo | Qué hace |
|---|---|
| `src/firebase.js` | Inicializa Firebase con las variables del `.env` y exporta `db` y `auth`. |
| `src/App.jsx` | Inicia la sesión anónima (`signInAnonymously`). |
| `src/librosService.js` | Todas las operaciones con Firestore: consultar (`onSnapshot`), agregar (`addDoc`), modificar (`updateDoc`) y eliminar (`deleteDoc`). |
| `src/googleBooks.js` | API de Google Books con `fetch`: buscar libros (`buscarLibros`) y traer el detalle con la sinopsis (`obtenerDetalle`). También traduce los géneros y ordena los resultados. |
| `firestore.rules` | Permisos de la base de datos. |

## Modelo de datos

Colección `libros`, un documento por libro:

| Campo | Tipo | Ejemplo |
|---|---|---|
| `titulo` | texto (1 a 100) | "El principito" |
| `autor` | texto (1 a 100) | "Antoine de Saint-Exupéry" |
| `genero` | texto (hasta 50) | "Clásico" |
| `estado` | "Quiero leer", "Leyendo" o "Leído" | "Leyendo" |
| `ownerId` | texto | uid del usuario anónimo |
| `portada` | texto `https://` (opcional) | imagen de tapa de Google Books |
| `googleId` | texto (opcional) | id del libro en Google Books |

## Seguridad

- Cada usuario solo puede ver, modificar y eliminar sus propios libros.
- Las reglas validan los campos y no permiten cambiar el dueño de un libro.
- Todo lo que no está permitido queda bloqueado.
- El `.env` no se sube al repositorio.
- La clave de Google Books solo sirve para la Books API y solo desde los sitios autorizados (Vercel y localhost).

## Estructura

```
src/
  firebase.js          conexión con Firebase
  librosService.js     operaciones con Firestore
  googleBooks.js       API de Google Books (búsqueda y detalle)
  App.jsx              estado principal y lógica
  assets/              íconos de acuarela (hoja y libros; libros-leyendo.png armado a partir de los otros)
  components/
    Estadisticas.jsx   contadores de libros (también filtran la colección)
    FormularioLibro.jsx  formulario para agregar/editar
    TarjetaLibro.jsx   tarjeta de cada libro
    DetalleLibro.jsx   ventana "Ver más" con la sinopsis
    Paginacion.jsx     botones de página de "Mi colección" (de a 6 libros)
docs/capturas/         capturas de cada versión
firestore.rules        reglas de seguridad
```

## Imágenes y datos

Los datos de búsqueda, portadas y sinopsis vienen de [Google Books](https://books.google.com/).


Los íconos de la hoja y de los libros se hicieron a partir de ilustraciones de acuarela usadas como referencia: se recortaron y se les quitó el fondo. Fuente: imágenes encontradas en Pinterest, usadas solo como referencia e inspiración para este trabajo práctico (el fondo de acuarela verde se recreó con CSS).
