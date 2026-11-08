// Todo lo que habla con la API de Google Books está en este archivo.
// Documentación: https://developers.google.com/books/docs/v1/using?hl=es-419

const URL_BASE = 'https://www.googleapis.com/books/v1/volumes'
const CLAVE = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

// Google a veces devuelve las portadas con "http://"; las pasamos a "https://".
// También sacamos el efecto de "página doblada" (edge=curl) que agrega a algunas tapas.
function portadaSegura(imageLinks) {
  const url = imageLinks?.thumbnail || imageLinks?.smallThumbnail || ''
  return url.replace('http://', 'https://').replace('&edge=curl', '')
}

// Google Books devuelve los géneros en inglés (ej: "Fiction", "True Crime").
// Esta lista los traduce al español. Si un género no está en la lista,
// el campo queda vacío para que la persona lo escriba.
const GENEROS = {
  'fiction': 'Ficción',
  'juvenile fiction': 'Infantil y juvenil',
  'young adult fiction': 'Juvenil',
  'juvenile nonfiction': 'Infantil (no ficción)',
  'young adult nonfiction': 'Juvenil (no ficción)',
  'romance': 'Romance',
  'thrillers': 'Thriller',
  'suspense': 'Suspenso',
  'mystery & detective': 'Policial',
  'crime': 'Policial',
  'murder': 'Policial',
  'action & adventure': 'Aventura',
  'contemporary': 'Contemporánea',
  'coming of age': 'Juvenil',
  'fantasy': 'Fantasía',
  'science fiction': 'Ciencia ficción',
  'horror': 'Terror',
  'historical': 'Novela histórica',
  'literary': 'Literatura',
  'classics': 'Clásicos',
  'biography & autobiography': 'Biografía',
  'history': 'Historia',
  'true crime': 'Crimen real',
  'poetry': 'Poesía',
  'drama': 'Drama',
  'literary criticism': 'Crítica literaria',
  'literary collections': 'Antología',
  'comics & graphic novels': 'Cómic',
  'humor': 'Humor',
  'self-help': 'Autoayuda',
  'psychology': 'Psicología',
  'philosophy': 'Filosofía',
  'religion': 'Religión',
  'body, mind & spirit': 'Espiritualidad',
  'family & relationships': 'Familia y relaciones',
  'health & fitness': 'Salud',
  'cooking': 'Cocina',
  'travel': 'Viajes',
  'nature': 'Naturaleza',
  'science': 'Ciencia',
  'social science': 'Ciencias sociales',
  'political science': 'Política',
  'business & economics': 'Economía',
  'education': 'Educación',
  'art': 'Arte',
  'music': 'Música',
  'performing arts': 'Artes escénicas',
  'photography': 'Fotografía',
  'architecture': 'Arquitectura',
  'design': 'Diseño',
  'sports & recreation': 'Deportes',
  'language arts & disciplines': 'Lengua',
  'foreign language study': 'Idiomas',
  'computers': 'Informática',
  'mathematics': 'Matemática',
  'medical': 'Medicina',
  'law': 'Derecho',
  'technology & engineering': 'Tecnología',
  'reference': 'Consulta',
}

// Traduce el primer género de la lista que se pueda traducir.
function traducirGeneros(categorias = []) {
  for (const categoria of categorias) {
    const genero = traducirGenero(categoria)
    if (genero) return genero
  }
  return ''
}

// Traduce un género. Algunos vienen como "Fiction / Romance / General":
// probamos desde la parte más específica ("Romance") hacia la más general ("Fiction").
function traducirGenero(categoria) {
  if (!categoria) return ''
  const partes = categoria.split('/').map((parte) => parte.trim().toLowerCase())
  for (const parte of partes.reverse()) {
    if (GENEROS[parte]) return GENEROS[parte]
    // Si ya viene en español (ej: "Ficción"), lo dejamos como está
    const enEspanol = Object.values(GENEROS).find((genero) => genero.toLowerCase() === parte)
    if (enEspanol) return enEspanol
  }
  return ''
}

// Para comparar títulos sin importar mayúsculas ni tildes ("Fría" = "fria")
function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

// Cuántas de las palabras escritas aparecen en el título.
// La última palabra puede estar a medio escribir, así que alcanza con que una
// palabra del título empiece con ella ("hug" cuenta para "Hugo").
function puntaje(titulo, texto) {
  const palabrasTitulo = normalizar(titulo).split(/\s+/)
  const palabrasBuscadas = normalizar(texto).split(/\s+/).filter(Boolean)
  return palabrasBuscadas.filter((palabra, i) => {
    const esLaUltima = i === palabrasBuscadas.length - 1
    return palabrasTitulo.some((p) => (esLaUltima ? p.startsWith(palabra) : p === palabra))
  }).length
}

// Hace el pedido a Google Books y devuelve la lista de libros "en crudo"
async function consultarGoogle(consulta, senal) {
  const parametros = new URLSearchParams({
    q: consulta,
    langRestrict: 'es',
    printType: 'books',
    maxResults: '20', // pedimos más para poder filtrar y quedarnos con los mejores
    fields: 'items(id,volumeInfo(title,authors,categories,publishedDate,imageLinks/thumbnail))',
    key: CLAVE,
  })

  const respuesta = await fetch(`${URL_BASE}?${parametros}`, { signal: senal })
  if (!respuesta.ok) {
    throw new Error(`Google Books respondió ${respuesta.status}`)
  }

  const datos = await respuesta.json()
  // Si no hay resultados, Google no manda "items"
  return datos.items ?? []
}

// BUSCAR: devuelve hasta 6 libros en español que coinciden con el título
// y, si se escribió, con el autor (sirve cuando hay muchos libros con títulos parecidos).
// "senal" permite cancelar la búsqueda si la persona sigue escribiendo.
export async function buscarLibros(texto, autor, senal) {
  let items = []
  if (autor) {
    // "inauthor:" le pide a Google que el autor coincida
    items = await consultarGoogle(`${texto} inauthor:${autor}`, senal)
  }
  // Sin autor, o si con ese autor no apareció nada (por ejemplo, mal escrito), buscamos solo por título
  if (items.length === 0) {
    items = await consultarGoogle(texto, senal)
  }

  const libros = items.map((item) => ({
    googleId: item.id,
    titulo: (item.volumeInfo.title ?? '').slice(0, 100),
    autor: (item.volumeInfo.authors ?? []).join(', ').slice(0, 100),
    genero: traducirGeneros(item.volumeInfo.categories),
    portada: portadaSegura(item.volumeInfo.imageLinks),
    anio: Number(item.volumeInfo.publishedDate?.slice(0, 4)) || null,
  }))

  // Limpiamos los resultados:
  // - sin autor no sirven (no se podrían guardar)
  // - los publicados antes de 1900 suelen ser documentos antiguos escaneados
  // - sacamos repetidos (mismo título y autor)
  const vistos = new Set()
  const filtrados = libros.filter((libro) => {
    if (!libro.autor) return false
    if (libro.anio && libro.anio < 1900) return false
    const clave = normalizar(libro.titulo) + '|' + normalizar(libro.autor)
    if (vistos.has(clave)) return false
    vistos.add(clave)
    return true
  })

  // Ordenamos: primero los títulos que más se parecen a lo escrito;
  // si empatan, primero los que tienen portada; y si no, el orden de Google.
  filtrados.sort(
    (a, b) =>
      puntaje(b.titulo, texto) - puntaje(a.titulo, texto) ||
      Number(Boolean(b.portada)) - Number(Boolean(a.portada)),
  )
  return filtrados.slice(0, 6)
}

// DETALLE: trae la sinopsis y otros datos de un libro por su id de Google
export async function obtenerDetalle(googleId, senal) {
  const parametros = new URLSearchParams({
    fields:
      'volumeInfo(title,authors,description,pageCount,publishedDate,publisher,categories,imageLinks/thumbnail,infoLink)',
    key: CLAVE,
  })

  const respuesta = await fetch(`${URL_BASE}/${encodeURIComponent(googleId)}?${parametros}`, {
    signal: senal,
  })
  if (!respuesta.ok) {
    throw new Error(`Google Books respondió ${respuesta.status}`)
  }

  const { volumeInfo = {} } = await respuesta.json()

  // La sinopsis viene con etiquetas HTML (<p>, <b>...): nos quedamos solo con el texto
  const html = volumeInfo.description ?? ''
  const sinopsis = new DOMParser().parseFromString(html, 'text/html').body.textContent.trim()

  return {
    titulo: volumeInfo.title ?? '',
    // El detalle suele traer géneros más completos que la búsqueda
    genero: traducirGeneros(volumeInfo.categories),
    autor: (volumeInfo.authors ?? []).join(', '),
    sinopsis,
    paginas: volumeInfo.pageCount ?? null,
    anio: volumeInfo.publishedDate?.slice(0, 4) ?? '',
    editorial: volumeInfo.publisher ?? '',
    portada: portadaSegura(volumeInfo.imageLinks),
    enlace: volumeInfo.infoLink ?? '',
  }
}
