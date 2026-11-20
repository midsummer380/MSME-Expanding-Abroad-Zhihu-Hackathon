import { SOURCES } from '../src/data/sources.js'

const UNIT_NUMBER = /(\d+(?:[.,]\d+)?)\s*(%|天|日|小时|周|个月|月|年|件|倍|个|条|€|\$|£|¥)/g

function clean(value, max) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .replace(/[`*_#>]/g, '')
    .trim()
    .slice(0, max)
}

function numberSet(facts) {
  const set = new Set()
  const scan = (text) => {
    for (const m of String(text).matchAll(/(\d+(?:[.,]\d+)?)/g)) {
      set.add(Number(m[1].replace(',', '.')))
    }
  }
  scan(JSON.stringify(facts))
  scan(Object.values(facts.counts || {}).join(' '))
  return set
}

// AI 文本中带单位的数字必须出现在事实表里，避免模型编造覆盖率、天数或价格。
function numbersOk(text, allowed) {
  for (const m of String(text).matchAll(UNIT_NUMBER)) {
    if (!allowed.has(Number(m[1].replace(',', '.')))) return false
  }
  return true
}

function pickSources(ids, allowed) {
  if (!Array.isArray(ids)) return []
  return [...new Set(ids.filter((id) => typeof id === 'string' && allowed.has(id) && SOURCES[id]))]
}

export function sanitizeEnrich(raw, facts) {
  if (!raw || typeof raw !== 'object') return null
  const allowed = new Set((facts.allowedSourceIds || []).filter((id) => SOURCES[id]))
  const nums = numberSet(facts)
  const gapKeys = new Set((facts.gaps || []).map((g) => g.key))
  const resourceIds = new Set((facts.resources || []).map((r) => r.id))

  const result = { verdictNote: null, chains: [], rewrites: [], resourceNotes: [], cited: 0 }

  const note = raw.verdictNote
  if (note && typeof note.text === 'string') {
    const text = clean(note.text, 170)
    const sourceIds = pickSources(note.sourceIds, allowed)
    if (text.length >= 8 && sourceIds.length && numbersOk(text, nums)) {
      result.verdictNote = { text, sourceIds }
    }
  }

  for (const item of Array.isArray(raw.chains) ? raw.chains.slice(0, 3) : []) {
    const gapKey = gapKeys.has(item?.gapKey) ? item.gapKey : null
    const title = clean(item?.title, 30)
    const steps = (Array.isArray(item?.steps) ? item.steps.slice(0, 3) : []).map((s) => ({
      label: clean(s?.label, 6),
      text: clean(s?.text, 150)
    }))
    const sourceIds = pickSources(item?.sourceIds, allowed)
    const textAll = title + steps.map((s) => s.text).join('')
    if (!gapKey || !title || steps.length < 3 || !sourceIds.length || !numbersOk(textAll, nums)) continue
    result.chains.push({ gapKey, title, steps, sourceIds })
  }

  for (const item of Array.isArray(raw.rewrites) ? raw.rewrites.slice(0, 3) : []) {
    const before = clean(item?.before, 80)
    const after = clean(item?.after, 80)
    const reason = clean(item?.reason, 50)
    if (!before || !after || before === after) continue
    if (!numbersOk(before + after + reason, nums)) continue
    result.rewrites.push({ before, after, reason, sourceIds: pickSources(item?.sourceIds, allowed) })
  }

  for (const item of Array.isArray(raw.resourceNotes) ? raw.resourceNotes.slice(0, 3) : []) {
    const resourceId = typeof item?.resourceId === 'string' && resourceIds.has(item.resourceId) ? item.resourceId : null
    const text = clean(item?.text, 90)
    if (!resourceId || text.length < 6 || !numbersOk(text, nums)) continue
    result.resourceNotes.push({ resourceId, text })
  }

  const cited = new Set([
    ...(result.verdictNote?.sourceIds || []),
    ...result.chains.flatMap((c) => c.sourceIds),
    ...result.rewrites.flatMap((r) => r.sourceIds)
  ]).size
  result.cited = cited

  if (!result.verdictNote && !result.chains.length && !result.rewrites.length && !result.resourceNotes.length) {
    return null
  }
  return result
}

const LANG_CODES = ['zh', 'en', 'de', 'ja', 'fr']

export function sanitizeExtract(raw) {
  if (!raw || typeof raw !== 'object') return null
  const out = {}

  if (Number.isFinite(raw.returnDays) && raw.returnDays >= 0 && raw.returnDays <= 365) {
    out.returnDays = Math.round(raw.returnDays)
  }

  if (typeof raw.serviceHours === 'string') {
    const value = clean(raw.serviceHours, 60)
    const timed = /\d{1,2}[:：]\d{2}\s*[–\-—~至到]\s*\d{1,2}[:：]\d{2}/.test(value)
    if (value && (timed || /7\s*[×xX*]\s*24/.test(value))) out.serviceHours = value
  }

  if (Array.isArray(raw.supportLanguages)) {
    const langs = [...new Set(raw.supportLanguages.filter((x) => LANG_CODES.includes(x)))]
    if (langs.length) out.supportLanguages = langs
  }

  if (raw.localEntity && typeof raw.localEntity === 'object') {
    const entity = {}
    let any = false
    for (const code of ['DE', 'US', 'JP', 'UK', 'FR', 'AU']) {
      if (typeof raw.localEntity[code] === 'boolean') {
        entity[code] = raw.localEntity[code]
        any = true
      }
    }
    if (any) out.localEntity = entity
  }

  if (typeof raw.dataStatement === 'boolean') out.dataStatement = raw.dataStatement
  if (raw.dataResidency === 'CN' || raw.dataResidency === 'LOCAL') out.dataResidency = raw.dataResidency

  if (Number.isFinite(raw.aovCNY) && raw.aovCNY >= 10 && raw.aovCNY <= 100000) {
    out.aovCNY = Math.round(raw.aovCNY)
  }

  if (typeof raw.signaturePhrase === 'string') {
    const phrase = clean(raw.signaturePhrase, 22)
    if (phrase) out.signaturePhrase = phrase
  }

  if (Array.isArray(raw.productClaims)) {
    const claims = [...new Set(raw.productClaims.map((x) => clean(x, 20)).filter(Boolean))].slice(0, 5)
    if (claims.length) out.productClaims = claims
  }

  return Object.keys(out).length ? out : null
}
