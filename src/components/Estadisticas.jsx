import iconoTotal from '../assets/libros-total.png'
import iconoLeidos from '../assets/libros-leidos.png'
import iconoPorLeer from '../assets/libros-por-leer.png'

// Contadores de libros. Cada uno es un botón: al tocarlo,
// la colección muestra solo esos libros (cambia el filtro).
function Estadisticas({ libros, filtro, onCambiarFiltro }) {
  const leidos = libros.filter((libro) => libro.estado === 'Leído').length
  const pendientes = libros.filter((libro) => libro.estado === 'Quiero leer').length

  const opciones = [
    { filtro: 'Todos', icono: iconoTotal, cantidad: libros.length, texto: 'Libros en total' },
    { filtro: 'Leído', icono: iconoLeidos, cantidad: leidos, texto: 'Libros leídos' },
    { filtro: 'Quiero leer', icono: iconoPorLeer, cantidad: pendientes, texto: 'Por leer' },
  ]

  return (
    <div className="estadisticas">
      {opciones.map((opcion) => (
        <button
          key={opcion.filtro}
          type="button"
          className={filtro === opcion.filtro ? 'estadistica activa' : 'estadistica'}
          aria-pressed={filtro === opcion.filtro}
          onClick={() => onCambiarFiltro(opcion.filtro)}
        >
          <img src={opcion.icono} alt="" width="56" height="56" />
          <span>
            <strong>{opcion.cantidad}</strong>
            <span className="estadistica-texto">{opcion.texto}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

export default Estadisticas
