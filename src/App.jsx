import { useState, useEffect, useRef } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from './firebase'
import {
  escucharLibros,
  agregarLibro,
  actualizarLibro,
  eliminarLibro,
} from './librosService'
import Estadisticas from './components/Estadisticas'
import FormularioLibro from './components/FormularioLibro'
import TarjetaLibro from './components/TarjetaLibro'
import DetalleLibro from './components/DetalleLibro'
import Paginacion from './components/Paginacion'
import hoja from './assets/hoja.png'
import './App.css'

// Cantidad de libros que se muestran en cada página de "Mi colección"
const LIBROS_POR_PAGINA = 6

function App() {
  // Estado de la app
  const [usuario, setUsuario] = useState(null)
  const [libros, setLibros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [libroEditando, setLibroEditando] = useState(null)
  // Libro del que se muestra la ventana "Ver más" (null = cerrada)
  const [libroDetalle, setLibroDetalle] = useState(null)
  const [filtro, setFiltro] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  // Página de "Mi colección" que se está viendo (empieza en 1)
  const [pagina, setPagina] = useState(1)
  // Referencia a "Mi colección", para volver arriba de la lista al cambiar de página
  const seccionColeccion = useRef(null)
  // mensaje = { texto, tipo } donde tipo es 'exito' o 'error'
  // "mensaje" se muestra arriba, junto al formulario (agregar / editar)
  const [mensaje, setMensaje] = useState(null)
  // "aviso" es el mensaje de las acciones de las tarjetas (eliminar / cambiar estado).
  // aviso = { texto, tipo, lugar }: lugar es 'lectura' (sección "Leyendo ahora")
  // o 'coleccion' ("Mi colección"), así aparece donde se hizo la acción.
  const [aviso, setAviso] = useState(null)
  const temporizadorMensaje = useRef(null)

  // Muestra el aviso y lo oculta solo después de 4 segundos
  function avisar(lugar, texto, tipo) {
    clearTimeout(temporizadorMensaje.current)
    setAviso({ texto, tipo, lugar })
    temporizadorMensaje.current = setTimeout(() => setAviso(null), 4000)
  }

  // Al cerrar la app, cancelamos el temporizador del mensaje
  useEffect(() => () => clearTimeout(temporizadorMensaje.current), [])

  // 1) Inicio de sesión anónimo: cada navegador recibe un usuario propio (uid)
  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user)
      } else {
        try {
          await signInAnonymously(auth)
        } catch (error) {
          console.error(error)
          setCargando(false)
          setMensaje({ texto: 'No se pudo conectar. Revisá tu conexión y recargá la página.', tipo: 'error' })
        }
      }
    })
    return () => cancelar()
  }, [])

  // 2) CONSULTAR: cuando hay usuario, escuchamos sus libros en Firestore
  useEffect(() => {
    if (!usuario) return

    const cancelar = escucharLibros(
      usuario.uid,
      (librosFirebase) => {
        setLibros(librosFirebase)
        setCargando(false)
      },
      (error) => {
        console.error(error)
        setCargando(false)
        setMensaje({ texto: 'No se pudieron cargar tus libros. Recargá la página.', tipo: 'error' })
      }
    )
    return () => cancelar()
  }, [usuario])

  // AGREGAR o MODIFICAR (según si estamos editando)
  async function guardarLibro(datosLibro) {
    try {
      if (libroEditando) {
        await actualizarLibro(libroEditando.id, datosLibro)
        setMensaje({ texto: '¡Libro actualizado correctamente!', tipo: 'exito' })
        setLibroEditando(null)
      } else {
        await agregarLibro(usuario.uid, datosLibro)
        setMensaje({ texto: '¡Libro agregado a tu biblioteca!', tipo: 'exito' })
      }
      return true
    } catch (error) {
      console.error(error)
      setMensaje({ texto: 'No se pudo guardar el libro. Intentá de nuevo.', tipo: 'error' })
      return false
    }
  }

  // MODIFICAR solo el estado (Quiero leer / Leyendo / Leído).
  // La tarjeta indica a qué estado pasa el libro y desde qué sección se tocó.
  async function cambiarEstado(libro, nuevoEstado, lugar) {
    try {
      await actualizarLibro(libro.id, { estado: nuevoEstado })
      avisar(lugar, `"${libro.titulo}" ahora está en "${nuevoEstado}".`, 'exito')
    } catch (error) {
      console.error(error)
      avisar(lugar, 'No se pudo actualizar el estado.', 'error')
    }
  }

  // ELIMINAR
  async function borrarLibro(libro, lugar) {
    if (!window.confirm(`¿Querés eliminar "${libro.titulo}"?`)) return
    try {
      await eliminarLibro(libro.id)
      // En rojo, para que se note que el libro se borró
      avisar(lugar, `"${libro.titulo}" se eliminó de tu colección.`, 'eliminado')
    } catch (error) {
      console.error(error)
      avisar(lugar, 'No se pudo eliminar el libro.', 'error')
    }
  }

  function empezarEdicion(libro) {
    setLibroEditando(libro)
    setMensaje(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // LEYENDO AHORA: los libros que se están leyendo, ordenados por título.
  // La sección aparece arriba de todo solo si hay alguno (o mientras se muestra
  // un aviso de esa sección, por ejemplo al terminar el último libro).
  const librosLeyendo = libros
    .filter((libro) => libro.estado === 'Leyendo')
    .sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'))
  const mostrarLeyendo = !cargando && (librosLeyendo.length > 0 || aviso?.lugar === 'lectura')

  // Filtro por estado + búsqueda por título o autor (se hace en el navegador)
  const textoBuscado = busqueda.toLowerCase()
  const librosFiltrados = libros.filter((libro) => {
    const coincideFiltro = filtro === 'Todos' || libro.estado === filtro
    const coincideBusqueda =
      libro.titulo.toLowerCase().includes(textoBuscado) ||
      libro.autor.toLowerCase().includes(textoBuscado)
    return coincideFiltro && coincideBusqueda
  })

  // Orden alfabético por título, así cada libro siempre queda en la misma página
  librosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'))

  // PAGINACIÓN: se muestran de a 6 libros, dentro del filtro y la búsqueda elegidos.
  // Si se elimina el último libro de la última página, se pasa a la página anterior.
  const totalPaginas = Math.max(1, Math.ceil(librosFiltrados.length / LIBROS_POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const inicio = (paginaActual - 1) * LIBROS_POR_PAGINA
  const librosDeLaPagina = librosFiltrados.slice(inicio, inicio + LIBROS_POR_PAGINA)

  // Al cambiar de filtro o de búsqueda, se vuelve a la página 1
  function cambiarFiltro(nuevoFiltro) {
    setFiltro(nuevoFiltro)
    setPagina(1)
  }

  function cambiarBusqueda(texto) {
    setBusqueda(texto)
    setPagina(1)
  }

  // Al cambiar de página, la vista vuelve al principio de "Mi colección"
  function cambiarPagina(nuevaPagina) {
    setPagina(nuevaPagina)
    seccionColeccion.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="pagina">
      <header className="encabezado">
        <div className="marca">
          <img src={hoja} alt="" className="icono-marca" width="36" height="36" />
          <span>Mi biblioteca</span>
        </div>
        <span className="frase-header">Un mundo entre páginas</span>
      </header>

      <section className="presentacion">
        <p className="subtitulo">TU ESPACIO DE LECTURA</p>
        <h1>Mis libros, mi historia.</h1>
        <p>Guardá cada historia que te acompaña y cada aventura que está por comenzar.</p>
      </section>

      {/* Apartado especial: lo primero que se ve al entrar son los libros que se están leyendo */}
      {mostrarLeyendo && (
        <section className="leyendo-ahora" aria-labelledby="titulo-leyendo">
          <div className="titulo-seccion">
            <div>
              <span className="etiqueta">TU LECTURA ACTUAL</span>
              <h2 id="titulo-leyendo">Leyendo ahora</h2>
            </div>
          </div>

          {aviso?.lugar === 'lectura' && (
            <p className={`mensaje ${aviso.tipo}`} role="status">
              {aviso.texto}
            </p>
          )}

          {librosLeyendo.length > 0 ? (
            <div className="lista-libros">
              {librosLeyendo.map((libro) => (
                <TarjetaLibro
                  key={libro.id}
                  libro={libro}
                  onCambiarEstado={(l, estado) => cambiarEstado(l, estado, 'lectura')}
                  onEditar={empezarEdicion}
                  onEliminar={(l) => borrarLibro(l, 'lectura')}
                  onVerDetalle={setLibroDetalle}
                />
              ))}
            </div>
          ) : (
            <p className="vacio">No estás leyendo ningún libro en este momento.</p>
          )}
        </section>
      )}

      <section className="formulario-seccion">
        <div className="titulo-seccion">
          <div>
            <span className="etiqueta">TU COLECCIÓN</span>
            <h2>{libroEditando ? 'Editar libro' : 'Agregar un libro'}</h2>
          </div>
        </div>

        <FormularioLibro
          // key: al cambiar de libro, el formulario se reinicia con sus datos
          key={libroEditando ? libroEditando.id : 'nuevo'}
          libroEditando={libroEditando}
          deshabilitado={!usuario}
          onGuardar={guardarLibro}
          onCancelar={() => setLibroEditando(null)}
          onError={(texto) => setMensaje({ texto, tipo: 'error' })}
        />

        {mensaje && (
          <p className={`mensaje ${mensaje.tipo}`} role="status">
            {mensaje.texto}
          </p>
        )}
      </section>

      <section className="biblioteca" ref={seccionColeccion}>
        <div className="titulo-seccion">
          <div>
            <span className="etiqueta">TUS HISTORIAS FAVORITAS</span>
            <h2>Mi colección</h2>
          </div>
        </div>

        {/* Los íconos con el conteo también funcionan como filtros */}
        <Estadisticas libros={libros} filtro={filtro} onCambiarFiltro={cambiarFiltro} />

        <input
          className="buscador"
          type="search"
          placeholder="⌕ Buscar por título o autor..."
          aria-label="Buscar por título o autor"
          value={busqueda}
          onChange={(e) => cambiarBusqueda(e.target.value)}
        />

        {aviso?.lugar === 'coleccion' && (
          <p className={`mensaje ${aviso.tipo}`} role="status">
            {aviso.texto}
          </p>
        )}

        <div className="lista-libros">
          {cargando ? (
            <p className="vacio">Cargando tu biblioteca...</p>
          ) : librosFiltrados.length === 0 ? (
            <p className="vacio">
              {libros.length === 0
                ? 'Todavía no hay libros. ¡Agregá tu primera lectura!'
                : 'No hay libros que coincidan con la búsqueda o el filtro.'}
            </p>
          ) : (
            librosDeLaPagina.map((libro) => (
              <TarjetaLibro
                key={libro.id}
                libro={libro}
                onCambiarEstado={(l, estado) => cambiarEstado(l, estado, 'coleccion')}
                onEditar={empezarEdicion}
                onEliminar={(l) => borrarLibro(l, 'coleccion')}
                onVerDetalle={setLibroDetalle}
              />
            ))
          )}
        </div>

        <Paginacion
          pagina={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={cambiarPagina}
        />
      </section>

      {libroDetalle && (
        <DetalleLibro libro={libroDetalle} onCerrar={() => setLibroDetalle(null)} />
      )}

      <footer>
        <p>Hecho con ♡ para los amantes de los libros.</p>
        <span>MI BIBLIOTECA · 2026</span>
      </footer>
    </main>
  )
}

export default App
