export default function ResumenSolicitudes({ indicadores }) {
  const tarjetas = [
    { label: 'Total', value: indicadores.total, className: 'summary-total' },
    { label: 'Pendientes', value: indicadores.pendientes, className: 'summary-pending' },
    { label: 'En proceso', value: indicadores.enProceso, className: 'summary-progress' },
    { label: 'Resueltas', value: indicadores.resueltas, className: 'summary-done' },
  ]

  return (
    <div>
      <div className="summary-grid">
        {tarjetas.map((tarjeta) => (
          <div className={`summary-card ${tarjeta.className}`} key={tarjeta.label}>
            <span>{tarjeta.label}</span>
            <strong>{tarjeta.value}</strong>
          </div>
        ))}
      </div>
      <div className="progress-label">
        <span>Porcentaje resuelto</span>
        <strong>{indicadores.porcentajeResueltas}%</strong>
      </div>
      <div className="progress-track" aria-label={`${indicadores.porcentajeResueltas}% de solicitudes resueltas`}>
        <span style={{ width: `${indicadores.porcentajeResueltas}%` }} />
      </div>
    </div>
  )
}
