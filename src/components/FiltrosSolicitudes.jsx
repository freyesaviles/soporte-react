export default function FiltrosSolicitudes({
  busqueda,
  filtroPrioridad,
  filtroEstado,
  onBusquedaChange,
  onPrioridadChange,
  onEstadoChange,
  onLimpiar,
}) {
  return (
    <div className="filters" aria-label="Filtros de solicitudes">
      <div className="filter-search">
        <label htmlFor="busqueda">Buscar por texto</label>
        <input
          id="busqueda"
          value={busqueda}
          onChange={(event) => onBusquedaChange(event.target.value)}
          placeholder="Buscar solicitud..."
        />
      </div>
      <div>
        <label htmlFor="filtro-prioridad">Prioridad</label>
        <select
          id="filtro-prioridad"
          value={filtroPrioridad}
          onChange={(event) => onPrioridadChange(event.target.value)}
        >
          <option>Todas</option>
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>
      </div>
      <div>
        <label htmlFor="filtro-estado">Estado</label>
        <select
          id="filtro-estado"
          value={filtroEstado}
          onChange={(event) => onEstadoChange(event.target.value)}
        >
          <option>Todos</option>
          <option>Pendiente</option>
          <option>En proceso</option>
          <option>Resuelta</option>
        </select>
      </div>
      <button type="button" className="button button-ghost" onClick={onLimpiar}>
        Limpiar
      </button>
    </div>
  )
}
