// FUNCIÓN DEL SERVIDOR (serverless) para consultar Google Books.
//
// Por qué existe: la clave de Google Books no debe llegar al navegador.
// Una variable con prefijo VITE_ se incluye en el JavaScript que descarga
// cualquier visitante, así que la clave quedaría expuesta. Esta función corre
// en el servidor de Vercel: lee la clave de una variable de entorno SIN el
// prefijo VITE_ (GOOGLE_BOOKS_API_KEY), consulta a Google Books y le devuelve
// a la app solo el resultado. La clave nunca sale del servidor.
//
// Vercel convierte cada archivo de la carpeta /api en una dirección:
// este archivo responde en /api/libros.
//
// Usos:
//   /api/libros?q=circe          → buscar libros (lista de resultados)
//   /api/libros?id=mz1fQAAACAAJ  → detalle de un libro (sinopsis, páginas, etc.)

const URL_BASE = 'https://www.googleapis.com/books/v1/volumes'

// Los parámetros de Google se fijan acá y no los manda el navegador:
// así esta función solo sirve para lo que necesita la app.
const CAMPOS_BUSQUEDA =
  'items(id,volumeInfo(title,authors,categories,publishedDate,imageLinks/thumbnail))'
const CAMPOS_DETALLE =
  'volumeInfo(title,authors,description,pageCount,publishedDate,publisher,categories,imageLinks/thumbnail,infoLink)'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const clave = process.env.GOOGLE_BOOKS_API_KEY
  if (!clave) {
    return res.status(500).json({ error: 'Falta configurar GOOGLE_BOOKS_API_KEY en el servidor' })
  }

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const id = typeof req.query.id === 'string' ? req.query.id.trim() : ''

  let url
  if (id) {
    // Los ids de Google Books son letras, números, "_" y "-"
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(id)) {
      return res.status(400).json({ error: 'Id de libro no válido' })
    }
    const parametros = new URLSearchParams({ fields: CAMPOS_DETALLE, key: clave })
    url = `${URL_BASE}/${id}?${parametros}`
  } else if (q && q.length <= 200) {
    const parametros = new URLSearchParams({
      q,
      langRestrict: 'es',
      printType: 'books',
      maxResults: '20', // pedimos más para poder filtrar y quedarnos con los mejores
      fields: CAMPOS_BUSQUEDA,
      key: clave,
    })
    url = `${URL_BASE}?${parametros}`
  } else {
    return res.status(400).json({ error: 'Falta el texto a buscar (q) o el id del libro (id)' })
  }

  try {
    const respuesta = await fetch(url)
    const datos = await respuesta.json()

    if (!respuesta.ok) {
      // Pasamos el mismo código de error (por ejemplo 429 = cupo agotado),
      // pero sin reenviar el detalle de Google
      return res.status(respuesta.status).json({ error: `Google Books respondió ${respuesta.status}` })
    }

    // Vercel guarda la respuesta un día: si alguien repite la misma búsqueda,
    // no se gasta otra consulta del cupo diario
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
    return res.status(200).json(datos)
  } catch (error) {
    console.error(error)
    return res.status(502).json({ error: 'No se pudo consultar Google Books' })
  }
}
