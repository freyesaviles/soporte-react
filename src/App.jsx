import { useCallback, useEffect, useMemo, useState } from 'react'
import SolicitudCard from './components/SolicitudCard'
import SolicitudForm from './components/SolicitudForm'
import ResumenSolicitudes from './components/ResumenSolicitudes'
import FiltrosSolicitudes from './components/FiltrosSolicitudes'
import { crearSolicitud, esModoDemo, listarSolicitudes } from './services/api'
import './App.css'

function App() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('Media')
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')

  const cargarSolicitudes = useCallback(async (signal, marcarCargando = true) => {
    try {
      if (marcarCargando) setCargando(true)
      setError('')
      const datos = await listarSolicitudes(signal)
      setSolicitudes(datos)
    } catch (err) {
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError('No fue posible consultar las solicitudes. Verifica el backend y vuelve a intentar.')
      }
    } finally {
      if (!signal?.aborted) setCargando(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    cargarSolicitudes(controller.signal, false)
    return () => controller.abort()
  }, [cargarSolicitudes])

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    return solicitudes.filter((solicitud) => {
      const coincidePrioridad =
        filtroPrioridad === 'Todas' || solicitud.prioridad === filtroPrioridad
      const coincideEstado =
        filtroEstado === 'Todos' || solicitud.estado === filtroEstado
      const coincideTexto = !texto || solicitud.titulo.toLowerCase().includes(texto)

      return coincidePrioridad && coincideEstado && coincideTexto
    })
  }, [busqueda, filtroEstado, filtroPrioridad, solicitudes])

  const indicadores = useMemo(() => {
    const total = solicitudes.length
    const pendientes = solicitudes.filter(({ estado }) => estado === 'Pendiente').length
    const enProceso = solicitudes.filter(({ estado }) => estado === 'En proceso').length
    const resueltas = solicitudes.filter(({ estado }) => estado === 'Resuelta').length

    return {
      total,
      pendientes,
      enProceso,
      resueltas,
      porcentajeResueltas: total === 0 ? 0 : Math.round((resueltas / total) * 100),
    }
  }, [solicitudes])

  async function handleAgregar(event) {
    event.preventDefault()
    const descripcion = titulo.trim()

    if (!descripcion) {
      setMensaje('Escribe una descripción para la solicitud.')
      return
    }

    try {
      setEnviando(true)
      setMensaje('')
      const nueva = await crearSolicitud({ titulo: descripcion, prioridad })
      setSolicitudes((actuales) => [...actuales, nueva])
      setTitulo('')
      setPrioridad('Media')
      setMensaje('Solicitud registrada correctamente.')
    } catch {
      setMensaje('No fue posible registrar la solicitud. Revisa la conexión con el servidor.')
    } finally {
      setEnviando(false)
    }
  }

  function handleResolver(id) {
    setSolicitudes((actuales) =>
      actuales.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, estado: 'Resuelta' } : solicitud,
      ),
    )
    setMensaje('Solicitud marcada como resuelta.')
  }

  function limpiarFiltros() {
    setFiltroPrioridad('Todas')
    setFiltroEstado('Todos')
    setBusqueda('')
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Laboratorio 10 · React + servicios web</p>
          <h1>Sistema de Soporte Técnico</h1>
          <p className="hero-copy">
            Registra, filtra y da seguimiento a las solicitudes de soporte desde una interfaz React.
          </p>
        </div>
        <span className={`mode-badge ${esModoDemo ? 'mode-demo' : 'mode-api'}`}>
          {esModoDemo ? 'Modo demostración' : 'API Spring Boot'}
        </span>
      </header>

      <main className="content-grid">
        <section className="panel form-panel" aria-labelledby="nueva-solicitud">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Paso 11 · useState y eventos</p>
              <h2 id="nueva-solicitud">Nueva solicitud</h2>
            </div>
            <span className="section-number">01</span>
          </div>
          <SolicitudForm
            titulo={titulo}
            prioridad={prioridad}
            enviando={enviando}
            onTituloChange={setTitulo}
            onPrioridadChange={setPrioridad}
            onSubmit={handleAgregar}
          />
          <p className="feedback" role="status" aria-live="polite">
            {mensaje}
          </p>
        </section>

        <section className="panel summary-panel" aria-labelledby="indicadores">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Reto 2 · datos derivados</p>
              <h2 id="indicadores">Indicadores operativos</h2>
            </div>
            <span className="section-number">02</span>
          </div>
          <ResumenSolicitudes indicadores={indicadores} />
        </section>

        <section className="panel requests-panel" aria-labelledby="lista-solicitudes">
          <div className="section-heading section-heading-wide">
            <div>
              <p className="section-kicker">Reto 1 y 3 · filtros combinados</p>
              <h2 id="lista-solicitudes">Solicitudes registradas</h2>
            </div>
            <span className="result-count">{visibles.length} visibles</span>
          </div>

          <FiltrosSolicitudes
            busqueda={busqueda}
            filtroPrioridad={filtroPrioridad}
            filtroEstado={filtroEstado}
            onBusquedaChange={setBusqueda}
            onPrioridadChange={setFiltroPrioridad}
            onEstadoChange={setFiltroEstado}
            onLimpiar={limpiarFiltros}
          />

          {cargando && <p className="loading-message" role="status">Cargando solicitudes...</p>}
          {error && (
            <div className="error-box" role="alert">
              <strong>{error}</strong>
              <button type="button" className="button button-secondary" onClick={() => cargarSolicitudes()}>
                Reintentar
              </button>
            </div>
          )}
          {!cargando && !error && visibles.length === 0 && (
            <p className="empty-message">No hay solicitudes que coincidan con los filtros.</p>
          )}
          {!cargando && !error && visibles.length > 0 && (
            <div className="request-list">
              {visibles.map((solicitud) => (
                <SolicitudCard key={solicitud.id} {...solicitud} onResolver={handleResolver} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer-note">
        <span>React administra la interfaz y el estado.</span>
        <span>Spring Boot administra la API y los datos persistentes.</span>
      </footer>
    </div>
  )
}

export default App
