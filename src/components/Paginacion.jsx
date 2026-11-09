// Botones para pasar de página en "Mi colección".
// Solo se muestra cuando hay más de una página.
function Paginacion({ pagina, totalPaginas, onCambiarPagina }) {
  if (totalPaginas <= 1) return null

  const numeros = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    <nav className="paginacion" aria-label="Páginas de la colección">
      <button
        type="button"
        className="paginacion-flecha"
        onClick={() => onCambiarPagina(pagina - 1)}
        disabled={pagina === 1}
      >
        ← Anterior
      </button>

      <div className="paginacion-numeros">
        {numeros.map((numero) => (
          <button
            key={numero}
            type="button"
            className={numero === pagina ? 'paginacion-numero activa' : 'paginacion-numero'}
            aria-current={numero === pagina ? 'page' : undefined}
            aria-label={`Página ${numero}`}
            onClick={() => onCambiarPagina(numero)}
          >
            {numero}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="paginacion-flecha"
        onClick={() => onCambiarPagina(pagina + 1)}
        disabled={pagina === totalPaginas}
      >
        Siguiente →
      </button>
    </nav>
  )
}

export default Paginacion
