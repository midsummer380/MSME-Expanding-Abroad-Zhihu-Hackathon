// 四元素词簇。用于展示“这句话是从原文哪几个词读出来的”。
export const LEXICON = {
  root: ['匠心', '传承', '家族', '手作', '兄弟', '父亲', '十年', '陪伴', '热爱', '山野', '初心', '温度', '家庭', '老手艺', '一针一线', '走过的山', '慢慢'],
  contract: ['条款', '退货政策', '保修', '服务协议', '时效', '标准', '流程', '赔付', '发票', '合同', '明码', '披露', '无理由', '换新', '退款'],
  diffuse: ['生态', '一站式', '全链路', '社群', '共创', '伙伴', '完整方案', '体系', '全家', '平台', '一起'],
  individual: ['个人', '独立', '自由', '个性化', '一个人', '一人', '自我', '随身', '专属', '自己', '每天'],
  central: ['总部', '直营', '自建', '工厂直发', '自主生产', '统一', '自有工厂', '全流程管控', '自己生产'],
  decentralized: ['代理', '经销', '合作方', '本地团队', '第三方', '外包', '加盟', '分销'],
  pragmatic: ['快速', '首发', '敏捷', '试错', '先行', '上新', '迭代', '立刻', '马上', '准时'],
  codex: ['认证', '合规', '检测', '法规', '备案', '审核', '资质', '实验室', '注册', '标准认证']
}

export const AXIS_WORDS = {
  axis1: { left: 'diffuse', right: 'contract' },
  axis2: { left: 'root', right: 'individual' },
  axis3: { left: 'central', right: 'decentralized' },
  axis4: { left: 'pragmatic', right: 'codex' }
}

function snippetFor(text, word) {
  const sentence = (text.split(/(?<=[。！？\n])/).find((s) => s.includes(word)) || text).trim()
  if (sentence.length <= 30) return sentence
  const clauses = sentence.split(/[，；]/).map((s) => s.trim()).filter(Boolean)
  const clause = clauses.find((c) => c.includes(word)) || sentence
  const clean = clause.replace(/^[，。；、\s]+|[，。；、\s]+$/g, '')
  if (clean.length <= 30) return clean
  const idx = clean.indexOf(word)
  const start = Math.max(0, idx - 9)
  const end = Math.min(clean.length, idx + word.length + 13)
  return `${start > 0 ? '…' : ''}${clean.slice(start, end)}${end < clean.length ? '…' : ''}`
}

export function findHits(text, keys) {
  const hits = []
  if (!text) return hits
  for (const key of keys) {
    const words = LEXICON[key] || []
    for (const word of words) {
      const count = text.split(word).length - 1
      if (count > 0) {
        hits.push({ key, word, count, snippet: snippetFor(text, word) })
      }
    }
  }
  return hits.sort((a, b) => b.count - a.count)
}

export function scoreFromHits(text) {
  const hits = findHits(text, Object.keys(LEXICON))
  const weight = (key) => hits.filter((h) => h.key === key).reduce((sum, h) => sum + h.count, 0)
  const pair = (left, right) => {
    const l = weight(left)
    const r = weight(right)
    const total = l + r
    if (total === 0) return { left: 50, right: 50 }
    const leftScore = Math.round(((l + 1.6) / (total + 3.2)) * 100)
    return { left: Math.max(12, Math.min(88, leftScore)), right: 100 - Math.max(12, Math.min(88, leftScore)) }
  }
  const a1 = pair('diffuse', 'contract')
  const a2 = pair('root', 'individual')
  const a3 = pair('central', 'decentralized')
  const a4 = pair('pragmatic', 'codex')
  return {
    signals: {
      diffuse: a1.left,
      contract: a1.right,
      root: a2.left,
      individual: a2.right,
      central: a3.left,
      decentralized: a3.right,
      pragmatic: a4.left,
      codex: a4.right
    },
    hits
  }
}
