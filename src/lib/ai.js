import { resultToFacts } from './facts'

const TIMEOUT = 14000
const cache = new Map()

async function post(path, body) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    return await res.json()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

// 失败一律返回 off，页面继续用规则内容，不阻塞判断屏。
export async function enrichResult(result) {
  const facts = resultToFacts(result)
  const key = [
    result.profile.id,
    result.marketCode,
    result.profile.returnDays,
    result.profile.serviceHours,
    (result.profile.supportLanguages || []).join('-'),
    result.gaps.map((g) => g.level).join(''),
    result.claims.map((c) => c.id).join('-')
  ].join('|')

  if (cache.has(key)) return { status: 'ok', data: cache.get(key) }

  const payload = await post('/api/enrich', { facts })
  if (!payload?.ok || !payload.data) return { status: 'off', data: null, reason: payload?.reason || 'offline' }

  if (cache.size >= 20) cache.delete(cache.keys().next().value)
  cache.set(key, payload.data)
  return { status: 'ok', data: payload.data }
}

// AI 抽取成功则覆盖规则字段；失败直接返回规则结果。
export async function extractProfile(text, marketCode, fallback) {
  const payload = await post('/api/extract', { text: text.slice(0, 6000), marketCode })
  if (!payload?.ok || !payload.data) return { profile: fallback, mode: 'rules' }

  const values = { ...payload.data }
  if (values.localEntity) {
    values.localEntity = { ...(fallback.localEntity || {}), ...values.localEntity }
  }

  return {
    profile: {
      ...fallback,
      ...values,
      id: 'C-01',
      extraction: 'ai',
      aiFields: Object.keys(payload.data)
    },
    mode: 'ai'
  }
}
