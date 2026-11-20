import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleApi } from './handler.mjs'

// Node 20.12+ 可直接读取 .env；没有该方法时用系统环境变量。
try {
  process.loadEnvFile?.()
} catch {
  // 没有 .env 时保持现有环境变量
}

const root = path.resolve(fileURLToPath(new URL('../dist', import.meta.url)))
const port = Number(process.env.PORT || 8787)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2'
}

async function sendFile(res, file) {
  const body = await readFile(file)
  res.statusCode = 200
  res.setHeader('content-type', TYPES[path.extname(file)] || 'application/octet-stream')
  res.setHeader('cache-control', path.extname(file) === '.html' ? 'no-store' : 'public, max-age=31536000, immutable')
  res.end(body)
}

const server = http.createServer(async (req, res) => {
  try {
    if (await handleApi(req, res)) return
  } catch {
    res.statusCode = 500
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ ok: false, reason: 'server_error' }))
    return
  }

  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  const target = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`)
  if (!target.startsWith(root)) {
    res.statusCode = 403
    res.end('forbidden')
    return
  }

  try {
    const info = await stat(target)
    if (info.isFile()) {
      await sendFile(res, target)
      return
    }
  } catch {
    // 回落到 SPA 入口
  }

  try {
    await sendFile(res, path.join(root, 'index.html'))
  } catch {
    res.statusCode = 404
    res.end('run npm run build first')
  }
})

server.listen(port, () => {
  console.log(`ANCHOR server: http://localhost:${port}`)
})
