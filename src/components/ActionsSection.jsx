import { useState } from 'react'
import { SOURCES } from '../data/sources'
import SourcePanel from './SourcePanel'

const TIERS = [
  { tier: 1, label: '必须马上做', window: '0–7 天', note: '不做会直接触发平台判责或退款争议' },
  { tier: 2, label: '可以外包', window: '7–30 天', note: '有本地服务商可承接，按件或按月计费' },
  { tier: 3, label: '可以晚点再说', window: '30 天以上', note: '影响转化与长期成本，不立即触发封禁' }
]

const GAP_LABEL = {
  legal: '条款披露',
  tz: '客服时区',
  entity: '退货主体',
  reverse: '逆向物流',
  trace: '数据可追溯',
  sla: '响应承诺',
  packaging: '包装注册',
  tax: '销售税'
}

function AiRewrites({ rewrites, open, setOpen }) {
  if (!rewrites?.length) return null
  return (
    <div className="ai-block">
      <div className="ai-block-head">
        <h3>本地化改写</h3>
        <span className="ai-tag mono">AI 生成 · 按锚定条款改写</span>
      </div>
      <div className="rewrite-grid">
        {rewrites.map((rw, i) => (
          <article className="rewrite-card" key={`${rw.before}-${i}`}>
            <div className="rw-row">
              <span className="rw-label mono">原文</span>
              <p className="rw-text">{rw.before}</p>
            </div>
            <div className="rw-row after">
              <span className="rw-label mono">改写</span>
              <p className="rw-text">{rw.after}</p>
            </div>
            {rw.reason && <p className="rw-reason">{rw.reason}</p>}
            {rw.sourceIds.length > 0 && (
              <div className="chain-src">
                {rw.sourceIds.map((id) => (
                  <button
                    type="button"
                    key={id}
                    className={`ai-src mono ${open === id ? 'is-open' : ''}`}
                    onClick={() => setOpen(open === id ? null : id)}
                  >
                    {SOURCES[id].code}
                  </button>
                ))}
              </div>
            )}
            {rw.sourceIds.includes(open) && <SourcePanel source={SOURCES[open]} onClose={() => setOpen(null)} />}
          </article>
        ))}
      </div>
    </div>
  )
}

export default function ActionsSection({ result, onOpenResource, ai }) {
  const { actions, resources, gaps } = result
  const [openSrc, setOpenSrc] = useState(null)
  const notes = Object.fromEntries((ai?.data?.resourceNotes || []).map((n) => [n.resourceId, n.text]))

  return (
    <section id="actions" className="section actions-section">
      <div className="sec-head">
        <span className="sec-no">04</span>
        <h2>行动屏</h2>
        <span className="sec-meta">ACTION / 修哪个、花多少钱、找谁修</span>
        <span className="sec-case mono">{actions.length} 个动作 · {resources.length} 类资源</span>
      </div>

      <div className="tier-grid">
        {TIERS.map((t) => {
          const list = actions.filter((a) => a.tier === t.tier)
          return (
            <div className="tier-col" data-tier={t.tier} key={t.tier}>
              <div className="tier-head">
                <div className="tier-title">
                  <span className="tier-no mono">T{t.tier}</span>
                  <h3>{t.label}</h3>
                </div>
                <span className="tier-window mono">{t.window}</span>
                <p className="tier-note">{t.note}</p>
              </div>
              <div className="tier-body">
                {list.map((a, i) => (
                  <article className="action" key={`${a.tier}-${a.title}`}>
                    <div className="action-top mono">
                      <span>A{t.tier}.{i + 1}</span>
                      <span className="action-gap">{GAP_LABEL[a.gapKey] || a.gapKey}</span>
                    </div>
                    <h4>{a.title}</h4>
                    <p>{a.detail}</p>
                    <div className="action-meta mono">
                      <span>{a.cost}</span>
                      <span>承接 {a.owner}</span>
                    </div>
                  </article>
                ))}
                {!list.length && <p className="tier-empty mono">本市场无该项动作</p>}
              </div>
            </div>
          )
        })}
      </div>

      {ai?.status === 'ok' && <AiRewrites rewrites={ai.data?.rewrites} open={openSrc} setOpen={setOpenSrc} />}

      <div className="resource-block">
        <div className="resource-head">
          <div>
            <h3>资源对接</h3>
            <p>诊断缺口 → 资源类型 → 可及路径。只匹配诊断里已经亮红的环节。</p>
          </div>
          <span className="mono">{result.market.name} · {resources.length} 类可对接资源</span>
        </div>

        <div className="resource-grid">
          {resources.map((r) => {
            const gap = gaps.find((g) => g.key === r.gapKey)
            return (
              <article className="resource-card" key={r.id}>
                <div className="rc-top mono">
                  <span>{r.code}</span>
                  <span className="rc-type">{r.type}</span>
                </div>
                <h4>{r.name}</h4>
                <p className="rc-fit">{r.fit}</p>
                <div className="rc-match">
                  <span className="mono">匹配缺口</span>
                  <b>{gap ? `${gap.label} / ${gap.level === 'high' ? '红灯' : gap.level === 'mid' ? '黄灯' : '已覆盖'}` : GAP_LABEL[r.gapKey]}</b>
                </div>
                {notes[r.id] && <p className="rc-ai">AI 说明 · {notes[r.id]}</p>}
                <div className="rc-meta mono">
                  <span>{r.cost}</span>
                  <span>{r.lead}</span>
                </div>
                <button type="button" className="rc-btn mono" onClick={() => onOpenResource(r)}>
                  展开对接路径 →
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
