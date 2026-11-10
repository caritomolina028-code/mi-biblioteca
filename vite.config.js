import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// En Vercel, la carpeta /api se convierte en funciones del servidor.
// "npm run dev" (Vite) no las ejecuta, así que este plugin hace lo mismo
// en la compu: cuando la app pide /api/libros, ejecuta api/libros.js
// con la clave del archivo .env. Solo se usa en desarrollo.
function apiLocal() {
  return {
    name: 'api-local',
    configureServer(server) {
      // Carga GOOGLE_BOOKS_API_KEY del .env (sin prefijo VITE_: no llega al navegador)
      const variables = loadEnv(server.config.mode, process.cwd(), '')
      process.env.GOOGLE_BOOKS_API_KEY ??= variables.GOOGLE_BOOKS_API_KEY

      server.middlewares.use('/api/libros', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/libros.js')
        const url = new URL(req.url, 'http://localhost')

        // Imitamos lo que Vercel le entrega a la función: req.query, res.status y res.json
        const solicitud = { method: req.method, query: Object.fromEntries(url.searchParams) }
        const respuesta = {
          status(codigo) {
            res.statusCode = codigo
            return respuesta
          },
          setHeader(nombre, valor) {
            res.setHeader(nombre, valor)
            return respuesta
          },
          json(datos) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(datos))
            return respuesta
          },
        }
        await handler(solicitud, respuesta)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiLocal()],
})
