import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'
export const esModoDemo = import.meta.env.VITE_USE_MOCK_API !== 'false'

const cliente = axios.create({
  baseURL: API_URL,
  timeout: 8000,
})

let solicitudesDemo = [
  { id: 1, titulo: 'Equipo no enciende', prioridad: 'Alta', estado: 'Pendiente' },
  { id: 2, titulo: 'Instalar software', prioridad: 'Media', estado: 'En proceso' },
  { id: 3, titulo: 'Configurar red Wi-Fi', prioridad: 'Baja', estado: 'Resuelta' },
]

function esperar(ms, signal) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout)
      const error = new Error('Request canceled')
      error.name = 'CanceledError'
      reject(error)
    }, { once: true })
  })
}

export async function listarSolicitudes(signal) {
  if (esModoDemo) {
    await esperar(450, signal)
    return [...solicitudesDemo]
  }

  const respuesta = await cliente.get('/solicitudes', { signal })
  return respuesta.data
}

export async function crearSolicitud(datos) {
  if (esModoDemo) {
    await esperar(300)
    const nueva = {
      id: crypto.randomUUID(),
      ...datos,
      estado: 'Pendiente',
    }
    solicitudesDemo = [...solicitudesDemo, nueva]
    return nueva
  }

  const respuesta = await cliente.post('/solicitudes', datos)
  return respuesta.data
}
