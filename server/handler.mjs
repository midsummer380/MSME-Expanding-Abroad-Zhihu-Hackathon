import { MARKETS } from '../src/data/markets.js'
import { SOURCES } from '../src/data/sources.js'
import { aiConfig, aiReady, cacheGet, cacheSet, chatJSON, hashFacts } from './ai.mjs'
import { enrichMessages, extractMessages } from './prompts.mjs'
import { sanitizeEnrich, sanitizeExtract } from './validate.mjs'
import { mockEnrich, mockExtract } from './mock.mjs'

const BODY_LIMIT = 128 * 1024
const RATE_WINDOW = 60 * 1000
const RATE_MAX = 20
const buckets = new Map()

function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(payload))
}

function rateLimited(req) {
  const ip = req.socket?.remoteAddress || 'local'
  const now = Date.now()
  const bucket = buckets.get(ip)
  if (!bucket || now > bucket.reset) {
    buckets.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return false
  }
  bucket.count += 1
  return bucket.count > RATE_MAX
}

function readJson(req) {
  return new Promise((resolve) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > BODY_LIMIT) {
        req.destroy()
        resolve(null)
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        resolve(null)
      }
    })
    req.on('error', () => resolve(null))
  })
}

function factsOk(facts) {
  return (
    facts &&
    typeof facts === 'object' &&
    facts.profile &&
    facts.market &&
    Array.isArray(facts.gaps) &&
    Array.isArray(facts.claims) &&
    Array.isArray(facts.allowedSourceIds) &&
    facts.allowedSourceIds.length <= 40
  )
}

async function enrich(body) {
  const facts = body.facts
  if (!factsOk(facts)) return { status: 400, payload: { ok: false, reason: 'bad_facts' } }

  if (!aiReady()) return { status: 200, payload: { ok: false, reason: 'no_key' } }

  const key = hashFacts(facts)
  const cached = cacheGet(key)
  if (cached) return { status: 200, payload: { ok: true, data: cached, meta: { cached: true } } }

  const cfg = aiConfig()
  if (cfg.mock) {
    const data = sanitizeEnrich(mockEnrich(facts), facts)
    if (!data) return { status: 200, payload: { ok: false, reason: 'invalid_output' } }
    cacheSet(key, data)
    return { status: 200, payload: { ok: true, data, meta: { mock: true } } }
  }

  const sources = facts.allowedSourceIds.map((id) => SOURCES[id]).filter(Boolean)
  const result = await chatJSON(enrichMessages(facts, sources))
  if (result.error) {
    return { status: 200, payload: { ok: false, reason: result.error, detail: result.detail } }
  }

  const data = sanitizeEnrich(result.data, facts)
  if (!data) return { status: 200, payload: { ok: false, reason: 'invalid_output' } }

  cacheSet(key, data)
  return { status: 200, payload: { ok: true, data, meta: { model: cfg.model } } }
}

async function extract(body) {
  const text = typeof body.text === 'string' ? body.text.trim() : ''
  if (text.length < 20) return { status: 400, payload: { ok: false, reason: 'text_too_short' } }
  if (!MARKETS[body.marketCode]) return { status: 400, payload: { ok: false, reason: 'bad_market' } }
  if (!aiReady()) return { status: 200, payload: { ok: false, reason: 'no_key' } }

  const cfg = aiConfig()
  if (cfg.mock) {
    const data = sanitizeExtract(mockExtract(text))
    return { status: 200, payload: data ? { ok: true, data, meta: { mock: true } } : { ok: false, reason: 'invalid_output' } }
  }

  const result = await chatJSON(extractMessages(text, body.marketCode))
  if (result.error) {
    return { status: 200, payload: { ok: false, reason: result.error, detail: result.detail } }
  }

  const data = sanitizeExtract(result.data)
  if (!data) return { status: 200, payload: { ok: false, reason: 'invalid_output' } }
  return { status: 200, payload: { ok: true, data, meta: { model: cfg.model } } }
}

// 返回 true 表示已经处理；false 交给静态资源或 Vite。
export async function handleApi(req, res) {
  let pathname = ''
  try {
    pathname = new URL(req.url, 'http://localhost').pathname
  } catch {
    return false
  }
  if (!pathname.startsWith('/api/')) return false

  if (req.method === 'GET' && pathname === '/api/health') {
    const cfg = aiConfig()
    json(res, 200, {
      ok: true,
      ai: aiReady(),
      mode: cfg.mock ? 'mock' : cfg.apiKey ? 'live' : 'rules'
    })
    return true
  }

  if (req.method !== 'POST' || !['/api/enrich', '/api/extract'].includes(pathname)) {
    json(res, 404, { ok: false, reason: 'not_found' })
    return true
  }

  if (rateLimited(req)) {
    json(res, 429, { ok: false, reason: 'rate_limited' })
    return true
  }

  const body = await readJson(req)
  if (!body) {
    json(res, 400, { ok: false, reason: 'bad_body' })
    return true
  }

  const started = Date.now()
  const result = pathname === '/api/enrich' ? await enrich(body) : await extract(body)
  if (result.payload?.ok) result.payload.meta = { ...result.payload.meta, ms: Date.now() - started }
  json(res, result.status, result.payload)
  return true
}
