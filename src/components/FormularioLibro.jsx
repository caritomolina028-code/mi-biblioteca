import { useEffect, useRef, useState } from 'react'
import { buscarLibros, obtenerDetalle } from '../googleBooks'

// Formulario para agregar o editar un libro.
// - Mientras se escribe el título, busca sugerencias en Google Books.
//   Al elegir una, se completan título, autor, género y portada.
// - Tres botones, "Quiero leer", "Leyendo" y "Leído", guardan el libro con ese estado (un solo paso).
function FormularioLibro({ libroEditando, deshabilitado, onGuardar, onCancelar, onError }) {
  const [titulo, setTitulo] = useState(libroEditando?.titulo ?? '')
  const [autor, setAutor] = useState(libroEditando?.autor ?? '')
  const [genero, setGenero] = useState(libroEditando?.genero ?? '')
  // Datos que vienen de Google Books (portada e id); vacíos si se carga a mano
  const [portada, setPortada] = useState(libroEditando?.portada ?? '')
  const [googleId, setGoogleId] = useState(libroEditando?.googleId ?? '')
  const [guardando, setGuardando] = useState(false)

  // Estado del buscador de sugerencias
  const [sugerencias, setSugerencias] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const temporizador = useRef(null)
  const controlador = useRef(null)

  // Al salir del formulario, cancelamos cualquier búsqueda pendiente
  useEffect(() => {
    return () => {
      clearTimeout(temporizador.current)
      controlador.current?.abort()
    }
  }, [])

  function cerrarSugerencias() {
    clearTimeout(temporizador.current)
    controlador.current?.abort()
    setSugerencias([])
    setBuscando(false)
  }

  async function buscar(texto, autorEscrito) {
    controlador.current?.abort() // cancela la búsqueda anterior
    controlador.current = new AbortController()
    setBuscando(true)
    setErrorBusqueda('')
    try {
      const resultados = await buscarLibros(texto, autorEscrito, controlador.current.signal)
      setSugerencias(resultados)
      if (resultados.length === 0) {
        setErrorBusqueda('No encontramos ese libro. Probá con el título completo o completalo a mano.')
      }
    } catch (error) {
      if (error.name === 'AbortError') return // la cancelamos nosotros, no es un error
      console.error(error)
      setSugerencias([])
      setErrorBusqueda('No se pudo buscar el libro. Podés completarlo a mano.')
    } finally {
      setBuscando(false)
    }
  }

  // Programa una búsqueda con el título y el autor escritos.
  // Esperamos a que la persona deje de escribir un momento antes de buscar.
  function programarBusqueda(tituloEscrito, autorEscrito) {
    setErrorBusqueda('')
    clearTimeout(temporizador.current)

    if (tituloEscrito.trim().length < 3) {
      cerrarSugerencias()
      return
    }
    // El autor solo se usa si tiene al menos 3 letras
    const autorParaBuscar = autorEscrito.trim().length >= 3 ? autorEscrito.trim() : ''
    temporizador.current = setTimeout(() => buscar(tituloEscrito.trim(), autorParaBuscar), 800)
  }

  function cambiarTitulo(valor) {
    setTitulo(valor)
    programarBusqueda(valor, autor)
  }

  // Escribir el autor también vuelve a buscar, para encontrar el libro justo
  // cuando hay muchos con títulos parecidos (ej: "La sombra" de Katzenbach)
  function cambiarAutor(valor) {
    setAutor(valor)
    if (!googleId) programarBusqueda(titulo, valor)
  }

  function elegirSugerencia(libro) {
    setTitulo(libro.titulo)
    setAutor(libro.autor)
    setGenero(libro.genero) // ya viene traducido; si no se pudo traducir, queda vacío
    setPortada(libro.portada)
    setGoogleId(libro.googleId)
    cerrarSugerencias()

    // Muchos libros vienen sin género en la búsqueda: lo pedimos al detalle del libro
    if (!libro.genero) {
      obtenerDetalle(libro.googleId)
        .then((detalle) => {
          // Solo lo completamos si la persona no escribió un género mientras tanto
          if (detalle.genero) setGenero((actual) => actual || detalle.genero)
        })
        .catch((error) => console.error(error))
    }
  }

  function quitarDatosGoogle() {
    setPortada('')
    setGoogleId('')
  }

  async function guardar(estado) {
    // Validación básica
    if (!titulo.trim() || !autor.trim()) {
      onError('Completá el título y el autor.')
      return
    }

    cerrarSugerencias()
    setGuardando(true)
    const salioBien = await onGuardar({
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero: genero.trim() || 'Sin categoría',
      estado,
      portada,
      googleId,
    })
    setGuardando(false)

    // Si se agregó bien, vaciamos el formulario
    if (salioBien && !libroEditando) {
      setTitulo('')
      setAutor('')
      setGenero('')
      quitarDatosGoogle()
    }
  }

  const bloqueado = guardando || deshabilitado

  return (
    <form onSubmit={(e) => e.preventDefault()} className="formulario">
      <div className="campos">
        {/* El buscador va en un contenedor propio para ubicar la lista debajo del campo */}
        <div className="campo-titulo">
          <label>
            Título del libro *
            <input
              type="text"
              placeholder="Escribí el título y elegí tu libro"
              maxLength={100}
              autoComplete="off"
              value={titulo}
              onChange={(e) => cambiarTitulo(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && cerrarSugerencias()}
            />
          </label>

          {buscando && <span className="aviso-busqueda">Buscando...</span>}
          {errorBusqueda && <span className="aviso-busqueda">{errorBusqueda}</span>}

          {sugerencias.length > 0 && (
            <ul className="sugerencias">
              {sugerencias.map((libro) => (
                <li key={libro.googleId}>
                  <button type="button" onClick={() => elegirSugerencia(libro)}>
                    {libro.portada ? (
                      <img src={libro.portada} alt="" width="36" height="52" loading="lazy" />
                    ) : (
                      <span className="sin-portada" aria-hidden="true">📖</span>
                    )}
                    <span>
                      <strong>{libro.titulo}</strong>
                      <small>{libro.autor || 'Autor desconocido'}</small>
                    </span>
                  </button>
                </li>
              ))}
              <li className="fuente">
                ¿No está tu libro? Escribí también el autor · Resultados de Google Books
              </li>
            </ul>
          )}
        </div>

        <label>
          Autor *
          <input
            type="text"
            placeholder="Nombre del autor (ayuda a encontrar el libro)"
            maxLength={100}
            value={autor}
            onChange={(e) => cambiarAutor(e.target.value)}
          />
        </label>

        <label>
          Género
          <input
            type="text"
            placeholder="Ej: Novela, romance..."
            maxLength={50}
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          />
        </label>

        <div className="campo-estado">
          <span className="campo-estado-titulo">
            {libroEditando ? 'Guardar como' : 'Agregar como'}
          </span>
          <div className="botones-estado">
            <button
              type="button"
              className="boton-estado quiero-leer"
              disabled={bloqueado}
              onClick={() => guardar('Quiero leer')}
            >
              Quiero leer
            </button>
            <button
              type="button"
              className="boton-estado leyendo"
              disabled={bloqueado}
              onClick={() => guardar('Leyendo')}
            >
              Leyendo
            </button>
            <button
              type="button"
              className="boton-estado leido"
              disabled={bloqueado}
              onClick={() => guardar('Leído')}
            >
              Leído
            </button>
          </div>
        </div>
      </div>

      {/* Muestra la portada elegida, con opción de quitarla */}
      {portada && (
        <div className="portada-elegida">
          <img src={portada} alt="" width="32" height="46" />
          <span>Portada de Google Books</span>
          <button type="button" onClick={quitarDatosGoogle}>
            Quitar
          </button>
        </div>
      )}

      {guardando && <p className="guardando">Guardando...</p>}

      {libroEditando && (
        <div className="acciones-formulario">
          <button type="button" className="boton-secundario" onClick={onCancelar}>
            Cancelar edición
          </button>
        </div>
      )}
    </form>
  )
}

export default FormularioLibro
