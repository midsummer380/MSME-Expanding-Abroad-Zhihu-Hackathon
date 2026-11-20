// AI_MOCK=1 时的本地构造数据。结构与真实返回一致，同样经过校验层。
import { SOURCES } from '../src/data/sources.js'

export function mockEnrich(facts) {
  const market = facts.market || {}
  const gap =
    facts.gaps.find((g) => g.level === 'high') ||
    facts.gaps[0] || { key: 'tz', value: '', title: '', detail: '', fix: '' }
  const claim = facts.claims.find((c) => c.sources?.length) || facts.claims[0]
  const sourceIds = claim?.sources?.slice(0, 2) || facts.allowedSourceIds.slice(0, 1)
  const weak = facts.gaps.filter((g) => g.level !== 'ok').slice(0, 2)
  const sourceCodes = sourceIds.map((id) => SOURCES[id]?.code).filter(Boolean).join(' / ')

  return {
    verdictNote: {
      text: `${market.name || '目标市场'}这一步的顺序不能反：${gap.fix}`,
      sourceIds
    },
    chains: weak.map((g) => ({
      gapKey: g.key,
      title: g.title,
      steps: [
        { label: '事实', text: g.value },
        { label: '条款', text: `${sourceCodes || market.legal?.anchor || ''} 规定这一步的责任边界。` },
        { label: '后果', text: g.detail }
      ],
      sourceIds
    })),
    rewrites: [
      {
        before: facts.profile.signaturePhrase || '品牌原句',
        after: `在${market.name || '当地市场'}，先说明「${market.legal?.core || '条款'}」，再讲品牌故事。`,
        reason: '先给可执行条款，再放叙事，顺序决定消费者是否相信。',
        sourceIds: []
      }
    ],
    resourceNotes: facts.resources.slice(0, 2).map((r) => ({
      resourceId: r.id,
      text: `承接${facts.gaps.find((g) => g.key === r.gapKey)?.label || r.gapKey} 缺口，按 ${r.type} 执行。`
    }))
  }
}

export function mockExtract(text) {
  const days = text.match(/(\d{1,3})\s*天/)
  const hours = text.match(/\d{1,2}[:：]\d{2}\s*[–\-—~至到]\s*\d{1,2}[:：]\d{2}/)
  return {
    returnDays: days ? Number(days[1]) : null,
    serviceHours: /7\s*[×xX*]\s*24/.test(text) ? '7×24' : hours ? hours[0] : null,
    supportLanguages: /English|英语/.test(text) ? ['zh', 'en'] : ['zh'],
    localEntity: { DE: /德国|Berlin|Hamburg/.test(text), US: /美国|加州|California/.test(text) },
    dataStatement: /隐私|privacy|数据声明/i.test(text),
    dataResidency: 'CN',
    aovCNY: null,
    signaturePhrase: null,
    productClaims: []
  }
}
