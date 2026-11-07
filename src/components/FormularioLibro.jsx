import { useState } from 'react'

// Formulario para agregar o editar un libro.
// Si recibe "libroEditando", arranca con los datos de ese libro.
function FormularioLibro({ libroEditando, deshabilitado, onGuardar, onCancelar, onError }) {
  const [titulo, setTitulo] = useState(libroEditando?.titulo ?? '')
  const [autor, setAutor] = useState(libroEditando?.autor ?? '')
  const [genero, setGenero] = useState(libroEditando?.genero ?? '')
  const [estado, setEstado] = useState(libroEditando?.estado ?? 'Quiero leer')
  const [guardando, setGuardando] = useState(false)

  async function manejarEnvio(e) {
    e.preventDefault()

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
      setEstado('Quiero leer')
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="formulario">
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

        <label>
          Estado de lectura
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Quiero leer">Quiero leer</option>
            <option value="Leído">Leído</option>
          </select>
        </label>
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="boton-principal" disabled={guardando || deshabilitado}>
          {guardando ? 'Guardando...' : libroEditando ? 'Guardar cambios' : '+ Agregar libro'}
        </button>

        {libroEditando && (
          <button type="button" className="boton-secundario" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default FormularioLibro
