import { useState } from 'react'
import { MARKETS } from '../data/markets'
import { SOURCES } from '../data/sources'
import SourcePanel from './SourcePanel'

function AiNote({ note, onEvidence }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="ai-note">
      <div className="ai-note-head">
        <span className="ai-tag mono">AI 补充 · 已锚定 {note.sourceIds.length} 条</span>
        <button type="button" className="ai-more mono" onClick={onEvidence}>
          去证据屏核对 ↓
        </button>
      </div>
      <p>{note.text}</p>
      <div className="ai-chips">
        {note.sourceIds.map((id) => (
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
      {note.sourceIds.includes(open) && <SourcePanel source={SOURCES[open]} onClose={() => setOpen(null)} />}
    </div>
  )
}

function TzBar({ tz }) {
  return (
    <div className="tzbar">
      <div className="tz-row">
        <span className="tz-label mono">高峰 BJT</span>
        <div className="tz-cells">
          {tz.peakCells.map((on, i) => (
            <span key={i} className={on ? 'cell peak' : 'cell'} title={`${i}:00`} />
          ))}
        </div>
      </div>
      <div className="tz-row">
        <span className="tz-label mono">客服 BJT</span>
        <div className="tz-cells">
          {Array.from({ length: 24 }, (_, i) => {
            const on = tz.found && i >= tz.service.start && i + 1 <= tz.service.end
            return <span key={i} className={on ? 'cell live' : 'cell'} />
          })}
        </div>
      </div>
      <div className="tz-axis mono">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
      </div>
      <div className="tz-stat">
        <b>{Math.round(tz.ratio * 100)}%</b>
        <span className="mono">
          高峰覆盖 {tz.coverage}h / {tz.peakTotal}h · {tz.statusLabel}
        </span>
      </div>
    </div>
  )
}

function GapLight({ gap, tz, market, onAction }) {
  const levelLabel = gap.level === 'high' ? '红灯 01' : gap.level === 'mid' ? '黄灯 01' : '绿灯 01'
  return (
    <aside className="gap-light" data-level={gap.level}>
      <div className="gl-top">
        <span className="gl-tag">{levelLabel}</span>
        <span className="gl-code mono">CHAIN / {gap.label}</span>
      </div>
      <h3>{gap.title}</h3>

      {gap.key === 'tz' ? <TzBar tz={tz} /> : (
        <div className="gl-value">
          <b>{gap.value}</b>
          <span className="mono">{market.name} · {gap.label}</span>
        </div>
      )}

      <div className="gl-detail">
        <span className="mono">现状</span>
        <p>{gap.detail}</p>
      </div>
      <div className="gl-fix">
        <span className="mono">最小修复</span>
        <p>{gap.fix}</p>
      </div>

      <button type="button" className="gl-link mono" onClick={onAction}>
        查看修复动作与资源 →
      </button>
    </aside>
  )
}

function Heatmap({ heat, activeMarket }) {
  const markets = (heat[0]?.cells || []).map((c) => MARKETS[c.market])
  const cols = `1.15fr repeat(${markets.length}, minmax(0, 1fr))`

  return (
    <div className="heat-wrap">
      <div className="heat-cap">
        <h3>产业链缺漏 · 目标市场 × 售后环节</h3>
        <div className="heat-legend mono">
          <span><i className="sw high" />结构性缺口</span>
          <span><i className="sw mid" />降级风险</span>
          <span><i className="sw ok" />已覆盖</span>
        </div>
      </div>
      <div className="heat-scroll">
        <div className="heat" role="table" aria-label="售后环节缺漏热力图">
          <div className="heat-head" role="row" style={{ gridTemplateColumns: cols }}>
            <span role="columnheader">售后环节</span>
            {markets.map((m) => (
              <span role="columnheader" data-active={activeMarket === m.code} key={m.code}>
                {m.name}
                <em className="mono">{m.code}</em>
              </span>
            ))}
          </div>
          {heat.map((row) => (
            <div className="heat-row" role="row" key={row.key} style={{ gridTemplateColumns: cols }}>
              <span className="heat-label" role="cell">{row.label}</span>
              {row.cells.map((c) => (
                <span
                  className={`heat-cell lv-${c.gap.level}`}
                  data-active={activeMarket === c.market}
                  data-level={c.gap.level}
                  role="cell"
                  key={c.market}
                  title={`${c.gap.title}｜${c.gap.detail}`}
                >
                  <i />
                  <b className="mono">{c.gap.value}</b>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function JudgmentSection({ result, onAction, onEvidence, ai }) {
  const { profile, market, judgment, tz, heat } = result
  const red = result.gaps.filter((g) => g.level === 'high').length
  const redByMarket = {}
  for (const row of heat) {
    for (const c of row.cells) {
      if (c.gap.level === 'high') redByMarket[c.market] = (redByMarket[c.market] || 0) + 1
    }
  }
  const bestCode = Object.keys(MARKETS)
    .filter((code) => code !== market.code)
    .reduce((a, code) => ((redByMarket[code] || 0) < (redByMarket[a] || 0) ? code : a))
  const bestRed = redByMarket[bestCode] || 0

  return (
    <section id="verdict" className="section verdict-section">
      <div className="sec-head">
        <span className="sec-no">01</span>
        <h2>判断屏</h2>
        <span className="sec-meta">VERDICT / 先给判断，再给依据</span>
        <span className="sec-case mono">{profile.id} · {market.code}</span>
      </div>

      <div className="verdict-grid">
        <div className="verdict-main">
          <div className="verdict-meta mono">
            <span>CASE {profile.id}</span>
            <span>MARKET {market.nameEn}</span>
            <span>规则置信 {judgment.confidence.toFixed(2)}</span>
            {profile.extraction === 'ai' && <span>AI 抽取 {profile.aiFields?.length || 0} 项</span>}
            <span>{result.analysisTime} CST</span>
          </div>

          <div className="verdict-box">
            <p className="verdict-text">{judgment.main}</p>
            <p className="verdict-market">{judgment.marketLine}</p>
            <p className="verdict-consequence mono">
              <span>链路附判断</span>
              <em className="consequence-text">{judgment.consequence}</em>
            </p>
          </div>

          {ai?.status === 'ok' && ai.data?.verdictNote && (
            <AiNote note={ai.data.verdictNote} onEvidence={onEvidence} />
          )}

          <div className="verdict-readout mono">
            <span>根源情怀 {result.scores.root} ▸ 契约边界 {result.scores.contract}</span>
            <span>整体渗透 {result.scores.diffuse} ▸ 普世个体 {result.scores.individual}</span>
            <span>中心统筹 {result.scores.central} ▸ 契约分权 {result.scores.decentralized}</span>
          </div>

          <div className="stamp-row">
            <div className="unit-stamp">
              <span className="stamp-main">
                国家文化评分 <b>≠</b> 企业行为检测
              </span>
              <span className="stamp-note mono">
                分析单元：{profile.name} 公开叙事 · 不把国别均值投射到这家企业
              </span>
            </div>
            <button type="button" className="verdict-jump mono" onClick={onEvidence}>
              依据 {result.claims.length} 条 / 来源 {result.sourceCount} 条
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        <GapLight gap={judgment.gap} tz={tz} market={market} onAction={onAction} />
      </div>

      <div className="heat-strip">
        <Heatmap heat={heat} activeMarket={market.code} />
        <div className="heat-summary">
          <p>
            {market.name} 5 个售后环节中 <b>{red}</b> 个红灯；
            {red <= bestRed ? `其余市场最少 ${bestRed} 个（${MARKETS[bestCode].name}）` : `${MARKETS[bestCode].name}为 ${bestRed} 个`}。
          </p>
          <p className="mono">
            售后时区、退货主体、逆向物流与售后认证同权。认证是一次性动作，这些环节每天都在发生。
          </p>
        </div>
      </div>
    </section>
  )
}
