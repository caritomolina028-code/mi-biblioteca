import { useEffect, useRef, useState } from 'react'
import { obtenerDetalle } from '../googleBooks'

// Ventana con más información del libro (sinopsis, páginas, año).
// Los datos se piden a Google Books cuando se abre.
function DetalleLibro({ libro, onCerrar }) {
  const ventana = useRef(null)
  const [detalle, setDetalle] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Abrimos la ventana como "modal" (bloquea el fondo y se cierra con Escape)
  useEffect(() => {
    ventana.current?.showModal()
  }, [])

  // Pedimos los datos a la API
  useEffect(() => {
    const controlador = new AbortController()
    obtenerDetalle(libro.googleId, controlador.signal)
      .then((datos) => {
        setDetalle(datos)
        setCargando(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error(err)
        setError('No se pudo cargar la información del libro. Probá más tarde.')
        setCargando(false)
      })
    return () => controlador.abort()
  }, [libro.googleId])

  // Tocar el fondo oscuro también cierra la ventana
  function clicEnFondo(e) {
    if (e.target === ventana.current) ventana.current.close()
  }

  return (
    <dialog
      ref={ventana}
      className="detalle-libro"
      onClose={onCerrar}
      onClick={clicEnFondo}
      aria-labelledby="detalle-titulo"
    >
      <div className="detalle-contenido">
        <button
          type="button"
          className="detalle-cerrar"
          onClick={() => ventana.current.close()}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="detalle-encabezado">
          {libro.portada && <img src={libro.portada} alt="" width="80" height="120" />}
          <div>
            <h3 id="detalle-titulo">{libro.titulo}</h3>
            <p>{libro.autor}</p>
            {detalle && (
              <small>
                {[
                  detalle.anio,
                  detalle.editorial,
                  detalle.paginas && `${detalle.paginas} páginas`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </small>
            )}
          </div>
        </div>

        {cargando && <p className="detalle-aviso">Cargando información...</p>}
        {error && <p className="mensaje error">{error}</p>}

        {detalle && (
          <>
            <h4>Sinopsis</h4>
            <p className="detalle-sinopsis">
              {detalle.sinopsis || 'Este libro no tiene sinopsis en Google Books.'}
            </p>
            {detalle.enlace && (
              <a href={detalle.enlace} target="_blank" rel="noreferrer">
                Ver en Google Books ↗
              </a>
            )}
          </>
        )}
      </div>
    </dialog>
  )
}

export default DetalleLibro
