// Clase de la etiqueta de cada estado (define sus colores en App.css)
const CLASE_ESTADO = {
  'Quiero leer': 'pendiente',
  Leyendo: 'leyendo',
  'Leído': 'leido',
}

// Tarjeta de un libro con sus acciones. Las funciones llegan por props desde App.
// Las acciones para cambiar el estado siguen el recorrido de una lectura:
// Quiero leer → Leyendo → Leído (y desde Leído se puede volver a pendiente).
function TarjetaLibro({ libro, onCambiarEstado, onEditar, onEliminar, onVerDetalle }) {
  return (
    <article className="tarjeta-libro">
      <div className="portada">
        {/* Si el libro tiene portada de Google Books la mostramos; si no, el ícono */}
        {libro.portada ? (
          <img src={libro.portada} alt={`Portada de ${libro.titulo}`} loading="lazy" />
        ) : (
          <span aria-hidden="true">📖</span>
        )}
      </div>

      <div className="datos-libro">
        <span className={`estado ${CLASE_ESTADO[libro.estado] ?? 'pendiente'}`}>
          {libro.estado}
        </span>
        <h3>{libro.titulo}</h3>
        <p>{libro.autor}</p>
        <small>{libro.genero}</small>

        <div className="acciones-libro">
          {/* "Ver más" solo aparece si el libro vino de Google Books */}
          {libro.googleId && (
            <button onClick={() => onVerDetalle(libro)}>Ver más</button>
          )}

          {libro.estado === 'Quiero leer' && (
            <button onClick={() => onCambiarEstado(libro, 'Leyendo')}>Empezar a leer</button>
          )}
          {libro.estado !== 'Leído' && (
            <button onClick={() => onCambiarEstado(libro, 'Leído')}>Marcar como leído</button>
          )}
          {libro.estado === 'Leído' && (
            <button onClick={() => onCambiarEstado(libro, 'Quiero leer')}>
              Marcar como pendiente
            </button>
          )}

          <button onClick={() => onEditar(libro)}>Editar</button>
          <button onClick={() => onEliminar(libro)}>Eliminar</button>
        </div>
      </div>
    </article>
  )
}

export default TarjetaLibro
