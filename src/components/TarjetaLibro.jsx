// Tarjeta de un libro con sus acciones. Las funciones llegan por props desde App.
function TarjetaLibro({ libro, onCambiarEstado, onEditar, onEliminar }) {
  const esLeido = libro.estado === 'Leído'

  return (
    <article className="tarjeta-libro">
      <div className="portada" aria-hidden="true">
        <span>📖</span>
      </div>

      <div className="datos-libro">
        <span className={esLeido ? 'estado leido' : 'estado pendiente'}>
          {libro.estado}
        </span>
        <h3>{libro.titulo}</h3>
        <p>{libro.autor}</p>
        <small>{libro.genero}</small>

        <div className="acciones-libro">
          <button onClick={() => onCambiarEstado(libro)}>
            {esLeido ? 'Marcar como pendiente' : 'Marcar como leído'}
          </button>
          <button onClick={() => onEditar(libro)}>Editar</button>
          <button onClick={() => onEliminar(libro)}>Eliminar</button>
        </div>
      </div>
    </article>
  )
}

export default TarjetaLibro
