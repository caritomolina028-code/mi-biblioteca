import { useState, useEffect } from 'react'
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
import hoja from './assets/hoja.png'
import './App.css'

function App() {
  // Estado de la app
  const [usuario, setUsuario] = useState(null)
  const [libros, setLibros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [libroEditando, setLibroEditando] = useState(null)
  const [filtro, setFiltro] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  // mensaje = { texto, tipo } donde tipo es 'exito' o 'error'
  const [mensaje, setMensaje] = useState(null)

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

  // MODIFICAR solo el estado (Leído / Quiero leer)
  async function cambiarEstado(libro) {
    const nuevoEstado = libro.estado === 'Leído' ? 'Quiero leer' : 'Leído'
    try {
      await actualizarLibro(libro.id, { estado: nuevoEstado })
      setMensaje({ texto: `Marcado como "${nuevoEstado}".`, tipo: 'exito' })
    } catch (error) {
      console.error(error)
      setMensaje({ texto: 'No se pudo actualizar el estado.', tipo: 'error' })
    }
  }

  // ELIMINAR
  async function borrarLibro(libro) {
    if (!window.confirm(`¿Querés eliminar "${libro.titulo}"?`)) return
    try {
      await eliminarLibro(libro.id)
      setMensaje({ texto: 'Libro eliminado correctamente.', tipo: 'exito' })
    } catch (error) {
      console.error(error)
      setMensaje({ texto: 'No se pudo eliminar el libro.', tipo: 'error' })
    }
  }

  function empezarEdicion(libro) {
    setLibroEditando(libro)
    setMensaje(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Filtro por estado + búsqueda por título o autor (se hace en el navegador)
  const textoBuscado = busqueda.toLowerCase()
  const librosFiltrados = libros.filter((libro) => {
    const coincideFiltro = filtro === 'Todos' || libro.estado === filtro
    const coincideBusqueda =
      libro.titulo.toLowerCase().includes(textoBuscado) ||
      libro.autor.toLowerCase().includes(textoBuscado)
    return coincideFiltro && coincideBusqueda
  })

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

      <section className="biblioteca">
        <div className="titulo-seccion">
          <div>
            <span className="etiqueta">TUS HISTORIAS FAVORITAS</span>
            <h2>Mi colección</h2>
          </div>
          <span className="cantidad">
            {libros.length} {libros.length === 1 ? 'libro' : 'libros'}
          </span>
        </div>

        {/* Los íconos con el conteo también funcionan como filtros */}
        <Estadisticas libros={libros} filtro={filtro} onCambiarFiltro={setFiltro} />

        <input
          className="buscador"
          type="search"
          placeholder="⌕ Buscar por título o autor..."
          aria-label="Buscar por título o autor"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

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
            librosFiltrados.map((libro) => (
              <TarjetaLibro
                key={libro.id}
                libro={libro}
                onCambiarEstado={cambiarEstado}
                onEditar={empezarEdicion}
                onEliminar={borrarLibro}
              />
            ))
          )}
        </div>
      </section>

      <footer>
        <p>Hecho con ♡ para los amantes de los libros.</p>
        <span>MI BIBLIOTECA · 2026</span>
      </footer>
    </main>
  )
}

export default App
