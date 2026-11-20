import { useState } from 'react'
import { LAYERS } from '../data/markets'
import { SOURCES } from '../data/sources'
import SourcePanel from './SourcePanel'

function AiChains({ ai, open, setOpen }) {
  const chains = ai?.data?.chains || []
  if (ai?.status !== 'ok' || !chains.length) return null

  return (
    <div className="ai-block">
      <div className="ai-block-head">
        <h3>AI 判责推演</h3>
        <span className="ai-tag mono">AI 生成 · 已锚定 {ai.data.cited} 条来源</span>
      </div>
      <div className="chain-list">
        {chains.map((chain) => (
          <article className="chain" key={chain.gapKey}>
            <div className="chain-head">
              <h4>{chain.title}</h4>
              <span className="mono chain-gap">{chain.gapKey.toUpperCase()}</span>
            </div>
            <div className="chain-steps">
              {chain.steps.map((step, i) => (
                <div className="chain-step" key={`${chain.gapKey}-${i}`}>
                  <span>{step.label}</span>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
            <div className="chain-src">
              {chain.sourceIds.map((id) => (
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
            {chain.sourceIds.includes(open) && (
              <SourcePanel source={SOURCES[open]} onClose={() => setOpen(null)} />
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

export default function EvidenceSection({ result, ai }) {
  const [open, setOpen] = useState(null)
  const { claims, sourceCount } = result
  const bare = claims.filter((c) => !c.sources?.length).length

  return (
    <section id="evidence" className="section evidence-section">
      <div className="sec-head">
        <span className="sec-no">03</span>
        <h2>证据屏</h2>
        <span className="sec-meta">CLAIM × SOURCE / 每条断言都能点回原文</span>
        <span className="sec-case mono">
          {claims.length} 条断言 · {sourceCount} 条来源 · {bare} 条裸断言
        </span>
      </div>

      <div className="evidence-intro">
        <p>
          断言在左，来源在右。右侧每个编号都可点开，展开条文节选、适用辖区与版本日期。
          视觉上先成立，才谈得上“可核对”。
        </p>
        <span className="mono">锚定库 SOURCES v0.1 · 法规编号真实，引文为演示节选</span>
      </div>

      {ai?.status === 'off' && (
        <p className="ai-off mono">AI 未启用或调用失败，本屏为规则模式内容；判断与来源不受影响。</p>
      )}

      <AiChains ai={ai} open={open} setOpen={setOpen} />

      {LAYERS.map((layer) => {
        const list = claims.filter((c) => c.layer === layer.no)
        if (!list.length) return null
        return (
          <div className="layer-block" key={layer.no}>
            <div className="layer-head">
              <span className="layer-no mono">{layer.no}</span>
              <div className="layer-title">
                <h3>{layer.name}</h3>
                <p>{layer.def}</p>
              </div>
              <span className="layer-en mono">{layer.en}</span>
            </div>

            <div className="claim-table">
              {list.map((claim) => {
                const active = claim.sources.includes(open)
                return (
                  <div className="claim-item" key={claim.id}>
                    <div className="claim-row">
                      <div className="claim-text">
                        <span className="sev mono" data-level={claim.severity}>
                          {claim.severity === 'high' ? 'HIGH' : 'MID'}
                        </span>
                        <p>{claim.text}</p>
                      </div>
                      <div className="claim-src">
                        <span className="src-label mono">来源</span>
                        {claim.sources.map((id) => (
                          <button
                            key={id}
                            type="button"
                            className={`src-chip mono ${open === id ? 'is-open' : ''}`}
                            aria-expanded={open === id}
                            onClick={() => setOpen(open === id ? null : id)}
                          >
                            {SOURCES[id].code}
                          </button>
                        ))}
                      </div>
                    </div>
                    {active && <SourcePanel source={SOURCES[open]} onClose={() => setOpen(null)} />}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </section>
  )
}
