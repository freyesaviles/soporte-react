export default function SolicitudForm({
  titulo,
  prioridad,
  enviando,
  onTituloChange,
  onPrioridadChange,
  onSubmit,
}) {
  return (
    <form className="request-form" onSubmit={onSubmit}>
      <label htmlFor="titulo">Descripción</label>
      <input
        id="titulo"
        value={titulo}
        onChange={(event) => onTituloChange(event.target.value)}
        placeholder="Ej. Equipo no enciende"
      />

      <label htmlFor="prioridad">Prioridad</label>
      <select
        id="prioridad"
        value={prioridad}
        onChange={(event) => onPrioridadChange(event.target.value)}
      >
        <option>Alta</option>
        <option>Media</option>
        <option>Baja</option>
      </select>

      <button type="submit" className="button" disabled={enviando}>
        {enviando ? 'Registrando...' : 'Registrar solicitud'}
      </button>
    </form>
  )
}
