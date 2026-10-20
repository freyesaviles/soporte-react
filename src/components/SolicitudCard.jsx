const prioridadClase = {
  Alta: 'priority-high',
  Media: 'priority-medium',
  Baja: 'priority-low',
}

export default function SolicitudCard({ titulo, prioridad, estado, onResolver, id }) {
  const puedeResolver = estado !== 'Resuelta'

  return (
    <article className="request-card">
      <div className="request-card-main">
        <div className="request-card-title-row">
          <h3>{titulo}</h3>
          <span className={`priority-tag ${prioridadClase[prioridad] ?? ''}`}>{prioridad}</span>
        </div>
        <p className="request-status">
          <span className={`status-dot status-${estado.toLowerCase().replace(' ', '-')}`} />
          {estado}
        </p>
      </div>
      {puedeResolver && (
        <button type="button" className="button button-small" onClick={() => onResolver(id)}>
          Resolver
        </button>
      )}
    </article>
  )
}
