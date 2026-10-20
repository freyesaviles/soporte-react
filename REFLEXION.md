# Reflexión — Servicios Web con React

## ¿Qué diferencia existe entre componente, prop y estado?

Un componente es una función reutilizable que describe una parte de la interfaz. Una prop es un dato que el componente recibe desde su padre, por ejemplo `titulo` o `prioridad` en `SolicitudCard`. El estado es información que React conserva y actualiza dentro de la interfaz; en `App` se usa para las solicitudes, el formulario, los filtros y los mensajes.

## ¿Por qué `useEffect` es adecuado para iniciar una consulta externa?

`useEffect` ejecuta una tarea después de que React pinta la interfaz. Por eso permite iniciar el GET sin hacerlo durante el renderizado. En este proyecto el efecto crea un `AbortController`, consulta el servicio al montar la pantalla y cancela la petición si el componente se desmonta.

## ¿Qué responsabilidades corresponden a React y cuáles a Spring Boot?

React administra la interfaz, los eventos, el estado visual, los formularios y los filtros. Spring Boot expone los endpoints REST, valida las solicitudes, aplica las reglas de negocio y se encarga de persistir los datos cuando existe una base de datos.

## ¿Cómo distinguir un error de CORS, un 404 y una caída del servidor?

Un error CORS aparece cuando el navegador bloquea una respuesta porque el origen del frontend no está permitido. Un 404 significa que el servidor respondió, pero la ruta solicitada no existe. Una caída o conexión rechazada significa que no se pudo establecer comunicación con el backend, normalmente porque está detenido o usa otro puerto.

## ¿Qué mejoraría antes de publicar el sistema?

Añadiría autenticación y autorización, validación también en el servidor, persistencia, paginación, pruebas automatizadas, variables de entorno para las URLs, logging, monitoreo y una política clara para errores y datos sensibles.

## Decisiones de los retos

- Los filtros y la búsqueda se derivan de `solicitudes` con `useMemo`; no duplicamos esos resultados en otro `useState`.
- Los indicadores también se calculan a partir de la lista y el porcentaje devuelve `0` cuando el total es cero.
- La búsqueda normaliza el texto con `trim().toLowerCase()` y el botón **Limpiar** restablece todos los filtros.
- El modo demostración permite practicar sin backend. Para consumir Spring Boot se debe copiar `.env.example` como `.env.local`, cambiar `VITE_USE_MOCK_API=false` y reiniciar Vite.
