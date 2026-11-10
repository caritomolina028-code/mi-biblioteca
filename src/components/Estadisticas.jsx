import iconoTotal from '../assets/libros-total.png'
import iconoPorLeer from '../assets/libros-por-leer.png'
import iconoLeyendo from '../assets/libros-leyendo.png'
import iconoLeidos from '../assets/libros-leidos.png'

// Contadores de libros. Cada uno es un botón: al tocarlo,
// la colección muestra solo esos libros (cambia el filtro).
// Siguen el mismo orden que los botones del formulario: Quiero leer → Leyendo → Leído.
function Estadisticas({ libros, filtro, onCambiarFiltro }) {
  const contar = (estado) => libros.filter((libro) => libro.estado === estado).length

  const opciones = [
    { filtro: 'Todos', icono: iconoTotal, cantidad: libros.length, texto: 'Libros en total' },
    { filtro: 'Quiero leer', icono: iconoPorLeer, cantidad: contar('Quiero leer'), texto: 'Por leer' },
    { filtro: 'Leyendo', icono: iconoLeyendo, cantidad: contar('Leyendo'), texto: 'Leyendo' },
    { filtro: 'Leído', icono: iconoLeidos, cantidad: contar('Leído'), texto: 'Libros leídos' },
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
