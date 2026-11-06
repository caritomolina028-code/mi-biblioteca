
import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { db } from './firebase'
import './App.css'

const librosIniciales = [
  {
    id: 1,
    titulo: 'La biblioteca de la medianoche',
    autor: 'Matt Haig',
    genero: 'Ficción',
    estado: 'Leído',
  },
  {
    id: 2,
    titulo: 'Hábitos atómicos',
    autor: 'James Clear',
    genero: 'Desarrollo personal',
    estado: 'Quiero leer',
  },
  {
    id: 3,
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    genero: 'Clásico',
    estado: 'Leído',
  },
]

function App() {
  const [libros, setLibros] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [genero, setGenero] = useState('')
  const [estado, setEstado] = useState('Quiero leer')
  const [busqueda, setBusqueda] = useState('')
  const [editando, setEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
  const cancelar = onSnapshot(collection(db, 'libros'), (snapshot) => {
    const librosFirebase = snapshot.docs.map((documento) => ({
      id: documento.id,
      ...documento.data()
    }))

    setLibros(librosFirebase)
  })

  return () => cancelar()
}, [])

  const librosFiltrados = libros.filter((libro) => {
    const coincideFiltro =
      filtro === 'Todos' || libro.estado === filtro

    const coincideBusqueda =
      libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.autor.toLowerCase().includes(busqueda.toLowerCase())

    return coincideFiltro && coincideBusqueda
  })

  async function guardarLibro(e) {
  e.preventDefault()

  if (!titulo.trim() || !autor.trim()) {
    setMensaje('Completá el título y el autor.')
    return
  }

  const datosLibro = {
    titulo,
    autor,
    genero: genero || 'Sin categoría',
    estado,
  }

  try {
    if (editando !== null) {
      await updateDoc(doc(db, 'libros', editando), datosLibro)

      setMensaje('¡Libro actualizado correctamente!')
      setEditando(null)
    } else {
      await addDoc(collection(db, 'libros'), datosLibro)

      setMensaje('¡Libro agregado a tu biblioteca!')
    }

    setTitulo('')
    setAutor('')
    setGenero('')
    setEstado('Quiero leer')

  } catch (error) {
    console.error('Error al guardar el libro:', error)
    setMensaje('No se pudo guardar el libro.')
  }
}

  function editarLibro(libro) {
    setTitulo(libro.titulo)
    setAutor(libro.autor)
    setGenero(libro.genero)
    setEstado(libro.estado)
    setEditando(libro.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function eliminarLibro(id) {
  if (window.confirm('¿Querés eliminar este libro?')) {
    try {
      await deleteDoc(doc(db, 'libros', id))
      setMensaje('Libro eliminado correctamente.')
    } catch (error) {
      console.error('Error al eliminar:', error)
      setMensaje('No se pudo eliminar el libro.')
    }
  }
}

  async function cambiarEstado(libro) {
  const nuevoEstado =
    libro.estado === 'Leído' ? 'Quiero leer' : 'Leído'

  try {
    await updateDoc(doc(db, 'libros', libro.id), {
      estado: nuevoEstado
    })

    setMensaje('¡Estado del libro actualizado!')
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    setMensaje('No se pudo actualizar el estado.')
  }
}

  const leidos = libros.filter((libro) => libro.estado === 'Leído').length
  const pendientes = libros.filter((libro) => libro.estado === 'Quiero leer').length

  return (
    <main className="pagina">
      <header className="encabezado">
        <div className="marca">
          <span className="icono-libro">📖</span>
          <span>mi biblioteca</span>
        </div>
        <span className="frase-header">Un mundo entre páginas</span>
      </header>

      <section className="presentacion">
        <p className="subtitulo">TU ESPACIO DE LECTURA</p>
        <h1>Mis libros, mi historia.</h1>
        <p>Un lugar para guardar cada historia que te acompaña y cada aventura que está por comenzar.</p>
      </section>

      <section className="estadisticas">
        <div className="estadistica">
          <span>📚</span>
          <div>
            <strong>{libros.length}</strong>
            <p>Libros en total</p>
          </div>
        </div>

        <div className="estadistica">
          <span>✓</span>
          <div>
            <strong>{leidos}</strong>
            <p>Libros leídos</p>
          </div>
        </div>

        <div className="estadistica">
          <span>♡</span>
          <div>
            <strong>{pendientes}</strong>
            <p>Por leer</p>
          </div>
        </div>
      </section>

      <section className="formulario-seccion">
        <div className="titulo-seccion">
          <div>
            <span className="etiqueta">TU COLECCIÓN</span>
            <h2>{editando ? 'Editar libro' : 'Agregar un libro'}</h2>
          </div>
        </div>

        <form onSubmit={guardarLibro} className="formulario">
          <div className="campos">
            <label>
              Título del libro *
              <input
                type="text"
                placeholder="Ej: El principito"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </label>

            <label>
              Autor *
              <input
                type="text"
                placeholder="Nombre del autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              />
            </label>

            <label>
              Género
              <input
                type="text"
                placeholder="Ej: Novela, romance..."
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              />
            </label>

            <label>
              Estado de lectura
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="Quiero leer">Quiero leer</option>
                <option value="Leído">Leído</option>
              </select>
            </label>
          </div>

          <div className="acciones-formulario">
            <button type="submit" className="boton-principal">
              {editando ? 'Guardar cambios' : '+ Agregar libro'}
            </button>

            {editando !== null && (
              <button
                type="button"
                className="boton-secundario"
                onClick={() => {
                  setEditando(null)
                  setTitulo('')
                  setAutor('')
                  setGenero('')
                  setEstado('Quiero leer')
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </section>

      <section className="biblioteca">
        <div className="titulo-seccion">
          <div>
            <span className="etiqueta">TUS HISTORIAS FAVORITAS</span>
            <h2>Mi colección</h2>
          </div>
          <span className="cantidad">{libros.length} libros</span>
        </div>

        <input
          className="buscador"
          type="search"
          placeholder="⌕ Buscar por título o autor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="filtros">
          {['Todos', 'Leído', 'Quiero leer'].map((opcion) => (
            <button
              key={opcion}
              className={filtro === opcion ? 'filtro activo' : 'filtro'}
              onClick={() => setFiltro(opcion)}
            >
              {opcion}
            </button>
          ))}
        </div>

        <div className="lista-libros">
          {librosFiltrados.length === 0 ? (
            <p className="vacio">Todavía no hay libros en esta sección. ¡Agregá tu primera lectura!</p>
          ) : (
            librosFiltrados.map((libro) => (
              <article className="tarjeta-libro" key={libro.id}>
                <div className="portada">
                  <span>📖</span>
                </div>

                <div className="datos-libro">
                  <span className={libro.estado === 'Leído' ? 'estado leido' : 'estado pendiente'}>
                    {libro.estado}
                  </span>
                  <h3>{libro.titulo}</h3>
                  <p>{libro.autor}</p>
                  <small>{libro.genero}</small>

                  <div className="acciones-libro">
                    <button onClick={() => cambiarEstado(libro)}>
                      Cambiar estado
                    </button>
                    <button onClick={() => editarLibro(libro)}>
                      Editar
                    </button>
                    <button onClick={() => eliminarLibro(libro.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
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
