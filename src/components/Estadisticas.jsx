// Muestra los contadores de libros. Recibe la lista por props.
function Estadisticas({ libros }) {
  const leidos = libros.filter((libro) => libro.estado === 'Leído').length
  const pendientes = libros.filter((libro) => libro.estado === 'Quiero leer').length

  return (
    <section className="estadisticas">
      <div className="estadistica">
        <span aria-hidden="true">📚</span>
        <div>
          <strong>{libros.length}</strong>
          <p>Libros en total</p>
        </div>
      </div>

      <div className="estadistica">
        <span aria-hidden="true">✓</span>
        <div>
          <strong>{leidos}</strong>
          <p>Libros leídos</p>
        </div>
      </div>

      <div className="estadistica">
        <span aria-hidden="true">♡</span>
        <div>
          <strong>{pendientes}</strong>
          <p>Por leer</p>
        </div>
      </div>
    </section>
  )
}

export default Estadisticas
