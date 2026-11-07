import { useState } from 'react'

// Formulario para agregar o editar un libro.
// En lugar de un select + botón "Agregar", hay dos botones:
// "Quiero leer" y "Leído". Tocar uno guarda el libro con ese estado (un solo paso).
function FormularioLibro({ libroEditando, deshabilitado, onGuardar, onCancelar, onError }) {
  const [titulo, setTitulo] = useState(libroEditando?.titulo ?? '')
  const [autor, setAutor] = useState(libroEditando?.autor ?? '')
  const [genero, setGenero] = useState(libroEditando?.genero ?? '')
  const [guardando, setGuardando] = useState(false)

  async function guardar(estado) {
    // Validación básica
    if (!titulo.trim() || !autor.trim()) {
      onError('Completá el título y el autor.')
      return
    }

    setGuardando(true)
    const salioBien = await onGuardar({
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero: genero.trim() || 'Sin categoría',
      estado,
    })
    setGuardando(false)

    // Si se agregó bien, vaciamos el formulario
    if (salioBien && !libroEditando) {
      setTitulo('')
      setAutor('')
      setGenero('')
    }
  }

  const bloqueado = guardando || deshabilitado

  return (
    <form onSubmit={(e) => e.preventDefault()} className="formulario">
      <div className="campos">
        <label>
          Título del libro *
          <input
            type="text"
            placeholder="Ej: El principito"
            maxLength={100}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </label>

        <label>
          Autor *
          <input
            type="text"
            placeholder="Nombre del autor"
            maxLength={100}
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
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
              className="boton-estado leido"
              disabled={bloqueado}
              onClick={() => guardar('Leído')}
            >
              Leído
            </button>
          </div>
        </div>
      </div>

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
