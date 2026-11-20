import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleApi } from './server/handler.mjs'

// 开发与预览都把同一套 /api 处理器挂在 Vite 上，不需要另起进程。
function apiPlugin() {
  const mount = (server) => {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) return next()
      try {
        const handled = await handleApi(req, res)
        if (!handled) next()
      } catch {
        res.statusCode = 500
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ ok: false, reason: 'server_error' }))
      }
    })
  }
  return {
    name: 'anchor-api',
    configureServer: mount,
    configurePreviewServer: mount
  }
}

export default defineConfig(({ mode }) => {
  // 只把非 VITE_ 前缀的服务端变量放进 process.env，前端拿不到密钥。
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['AI_BASE_URL', 'AI_API_KEY', 'AI_MODEL', 'AI_TIMEOUT_MS', 'AI_MOCK', 'PORT']) {
    if (env[key] != null) process.env[key] = env[key]
  }

  return {
    plugins: [react(), apiPlugin()],
    server: { port: 5173, open: false }
  }
})
