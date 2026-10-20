# Sistema de Soporte Técnico

Aplicación React para registrar y consultar solicitudes de soporte técnico. Es el proyecto integrador de la práctica guiada **React — Servicios Web**.

La aplicación demuestra componentes, JSX, props, eventos, `useState`, `useEffect`, Axios, filtros combinados, búsqueda, estados de carga y manejo de errores.

## Funcionalidades

- Registro de solicitudes con descripción y prioridad.
- Listado reutilizable mediante el componente `SolicitudCard`.
- Cambio local del estado de una solicitud a **Resuelta**.
- Filtro combinado por prioridad y estado.
- Búsqueda por texto sin distinguir mayúsculas y minúsculas.
- Indicadores de total, pendientes, solicitudes en proceso y resueltas.
- Porcentaje de solicitudes resueltas, protegido contra división entre cero.
- Estados de carga, error, resultados vacíos y botón para reintentar.
- Cliente HTTP con Axios preparado para Spring Boot.
- Modo demostración local para trabajar sin backend.

## Requisitos

- Node.js 20 o superior recomendado.
- npm.
- Para la integración real: una API Spring Boot ejecutándose en `http://localhost:8080`.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Después abre la URL que muestre Vite, normalmente:

```text
http://localhost:5173/
```

## Configuración de la API

Por defecto, el proyecto utiliza datos de demostración en memoria. Esto permite practicar la interfaz sin tener Spring Boot disponible.

Para utilizar la API real:

1. Copia `.env.example` como `.env.local`.
2. Configura las variables:

```env
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:8080/api
```

3. Reinicia Vite después de modificar las variables de entorno.

La API debe ofrecer como mínimo:

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/solicitudes` | Devuelve un arreglo de solicitudes |
| `POST` | `/api/solicitudes` | Registra y devuelve una solicitud creada |

Ejemplo de solicitud:

```json
{
  "titulo": "Equipo no enciende",
  "prioridad": "Alta"
}
```

Ejemplo de respuesta:

```json
{
  "id": 1,
  "titulo": "Equipo no enciende",
  "prioridad": "Alta",
  "estado": "Pendiente"
}
```

El backend debe permitir el origen del frontend mediante CORS, por ejemplo `http://localhost:5173`.

## Cómo se resolvieron los retos

### Reto 1: filtro combinado

Los filtros se almacenan como estado:

```jsx
const [filtroPrioridad, setFiltroPrioridad] = useState('Todas')
const [filtroEstado, setFiltroEstado] = useState('Todos')
```

La lista visible se deriva de `solicitudes`. Una solicitud debe cumplir simultáneamente la prioridad y el estado seleccionados:

```jsx
const visibles = solicitudes.filter((solicitud) => {
  const coincidePrioridad =
    filtroPrioridad === 'Todas' || solicitud.prioridad === filtroPrioridad
  const coincideEstado =
    filtroEstado === 'Todos' || solicitud.estado === filtroEstado

  return coincidePrioridad && coincideEstado
})
```

No se guarda `visibles` en otro `useState` porque sería información duplicada. Se calcula a partir de la fuente original.

### Reto 2: indicadores operativos

Los indicadores se calculan contando los estados actuales de la lista. El porcentaje evita dividir entre cero:

```jsx
const porcentajeResueltas = total === 0
  ? 0
  : Math.round((resueltas / total) * 100)
```

Cuando la API devuelve un arreglo vacío, todos los contadores muestran `0` y la interfaz muestra un mensaje de lista vacía.

### Reto 3: búsqueda robusta

La búsqueda elimina espacios y normaliza a minúsculas:

```jsx
const texto = busqueda.trim().toLowerCase()
const coincideTexto =
  !texto || solicitud.titulo.toLowerCase().includes(texto)
```

La búsqueda se aplica junto con los filtros de prioridad y estado. El botón **Limpiar** restablece todos los criterios.

Para una API con 10 000 registros convendría agregar paginación, búsqueda en el backend y posiblemente `debounce` para no recalcular o consultar en cada tecla.

### Reto 4: registro mediante POST

El formulario valida que exista una descripción y llama al servicio `crearSolicitud`. La lista se actualiza únicamente después de recibir respuesta del servidor:

```jsx
const nueva = await crearSolicitud({ titulo, prioridad })
setSolicitudes((actuales) => [...actuales, nueva])
```

Mientras se procesa el envío, el botón queda deshabilitado para evitar envíos repetidos desde la interfaz. En modo real, el servidor debe implementar `POST /api/solicitudes`.

### Reto 5: diseño y resiliencia

La interfaz se separó en componentes pequeños:

- `SolicitudForm`: formulario y controles de registro.
- `FiltrosSolicitudes`: búsqueda y filtros.
- `SolicitudCard`: presentación de una solicitud.
- `ResumenSolicitudes`: indicadores operativos.
- `App`: estado principal y coordinación.
- `services/api.js`: comunicación HTTP.

La consulta inicial usa `useEffect`, `Axios` y `AbortController`. La interfaz muestra estados de carga, error, lista vacía y reintento. Los filtros se aplican localmente, por lo que cambiar rápidamente de filtro no genera respuestas HTTP atrasadas.

## Estructura principal

```text
src/
├── components/
│   ├── FiltrosSolicitudes.jsx
│   ├── ResumenSolicitudes.jsx
│   ├── SolicitudCard.jsx
│   └── SolicitudForm.jsx
├── services/
│   └── api.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Scripts disponibles

```bash
npm run dev       # inicia Vite en desarrollo
npm run build     # genera la compilación de producción
npm run preview   # sirve la compilación generada
npm run lint      # revisa el código con Oxlint
```

## Documentación académica

Las respuestas de reflexión sobre componentes, props, estado, `useEffect`, CORS, 404 y responsabilidades entre React y Spring Boot están en [REFLEXION.md](./REFLEXION.md).

## Estado de Git

Este proyecto todavía no tiene un repositorio Git inicializado ni commits locales. Para prepararlo antes de subirlo a GitHub:

```bash
git init
git add .
git commit -m "feat: crear sistema de soporte tecnico con React"
```

Antes de hacer el primer commit conviene verificar que `.env.local` y `node_modules` no se incluyan. El archivo `.gitignore` ya está preparado para excluirlos.
