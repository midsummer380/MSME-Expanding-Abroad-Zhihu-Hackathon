import { createHash } from 'node:crypto'

const CACHE_TTL = 30 * 60 * 1000
const CACHE_MAX = 60
const cache = new Map()

export function aiConfig() {
  const timeout = Number(process.env.AI_TIMEOUT_MS || 6000)
  return {
    baseUrl: (process.env.AI_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/+$/, ''),
    apiKey: (process.env.AI_API_KEY || '').trim(),
    model: process.env.AI_MODEL || 'deepseek-chat',
    timeout: Number.isFinite(timeout) && timeout >= 1500 ? timeout : 6000,
    mock: process.env.AI_MOCK === '1'
  }
}

export function aiReady() {
  const cfg = aiConfig()
  return cfg.mock || Boolean(cfg.apiKey)
}

export function hashFacts(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

export function cacheGet(key) {
  const hit = cache.get(key)
  if (!hit) return null
  if (Date.now() > hit.expires) {
    cache.delete(key)
    return null
  }
  return hit.value
}

export function cacheSet(key, value) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value)
  cache.set(key, { value, expires: Date.now() + CACHE_TTL })
}

export function parseJsonLoose(text) {
  if (!text) return null
  let s = String(text).trim()
  s = s.replace(/^```(?:json)?/i, '').replace(/```\s*$/, '').trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(s.slice(start, end + 1))
  } catch {
    return null
  }
}

async function callOnce(messages, cfg) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), cfg.timeout)
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        temperature: 0.4,
        max_tokens: 1500
      }),
      signal: controller.signal
    })
    if (!res.ok) throw new Error(`upstream ${res.status}`)
    const payload = await res.json()
    return payload?.choices?.[0]?.message?.content || ''
  } finally {
    clearTimeout(timer)
  }
}

// 两次尝试；超时、非 2xx、JSON 解析失败都视为失败，由调用方回落规则模式。
export async function chatJSON(messages) {
  const cfg = aiConfig()
  if (cfg.mock) return { data: null, mock: true }
  if (!cfg.apiKey) return { error: 'no_key' }

  let detail = ''
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callOnce(messages, cfg)
      const parsed = parseJsonLoose(raw)
      if (parsed) return { data: parsed }
      detail = 'invalid_json'
    } catch (err) {
      detail = String(err?.message || err).slice(0, 120)
    }
  }
  return { error: 'upstream', detail }
}
