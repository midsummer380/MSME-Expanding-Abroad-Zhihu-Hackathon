const HIT_LABEL = {
  root: '根源情怀',
  contract: '契约边界',
  diffuse: '整体渗透',
  individual: '普世个体',
  central: '中心统筹',
  decentralized: '契约分权',
  pragmatic: '实用先发',
  codex: '预防法典'
}

export default function SignalsSection({ result }) {
  const { judgment, profile } = result
  const hits = (profile.signalHits || []).slice(0, 9)

  return (
    <section id="signals" className="section signals-section">
      <div className="sec-head">
        <span className="sec-no">02</span>
        <h2>信号屏</h2>
        <span className="sec-meta">SIGNAL / 这句话是从原文哪几个词读出来的</span>
        <span className="sec-case mono">四元素 · 企业层面</span>
      </div>

      <div className="signal-layout">
        <div className="signal-axes">
          <div className="axis-head mono">
            <span>元素对</span>
            <span>读数</span>
            <span>权重</span>
          </div>
          {judgment.axes.map((axis) => (
            <div className="axis-row-wrap" key={axis.key}>
              <div className="axis-row">
                <div className="axis-side left">
                  <span className="axis-name">{axis.left}</span>
                  <b className="mono">{axis.leftScore}</b>
                </div>
                <div className="axis-track">
                  <span className="axis-fill" style={{ width: `${axis.leftScore}%` }} />
                  <i className="axis-tick" />
                </div>
                <div className="axis-side right">
                  <b className="mono">{axis.rightScore}</b>
                  <span className="axis-name">{axis.right}</span>
                </div>
                <span className="axis-w mono">W {axis.weight}</span>
              </div>
              <p className="axis-note">{axis.note}</p>
            </div>
          ))}
          <p className="axis-disclaimer mono">
            评分口径：词簇强度 × 文本完整度，规则引擎 v0.1。分数不是国家文化评分，只描述这家企业的公开叙事。
          </p>
        </div>

        <aside className="signal-side">
          <div className="stamp-block">
            <span className="stamp-mono mono">METHOD / 01</span>
            <p className="stamp-big">
              国家文化评分
              <b>≠</b>
              企业行为检测
            </p>
            <p className="stamp-copy">
              Hofstede 式框架把国家层面的均值反投到企业，构成生态谬误。这里只读这家企业自己写了什么，再翻译成目标市场的合规含义。
            </p>
          </div>

          <div className="lexicon">
            <div className="lexicon-head">
              <h4>原文词簇</h4>
              <span className="mono">{hits.reduce((s, h) => s + h.count, 0)} 处命中</span>
            </div>
            {hits.map((hit, i) => (
              <div className="hit" key={`${hit.word}-${i}`}>
                <div className="hit-top">
                  <span className="hit-word">{hit.word}</span>
                  <span className="hit-axis mono">{HIT_LABEL[hit.key]} ×{hit.count}</span>
                </div>
                <p className="hit-snippet">“{hit.snippet}”</p>
              </div>
            ))}
            {!hits.length && <p className="hit-empty">未检出四元素词簇，判断按中位读数生成。</p>}
          </div>
        </aside>
      </div>
    </section>
  )
}
