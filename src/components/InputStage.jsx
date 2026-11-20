import { useState } from 'react'
import { MARKETS } from '../data/markets'

const HEADLINE = {
  DE: ['你写了品牌故事，', '没写德国人要看的那一条。'],
  US: ['你写了品牌故事，', '没写美国人要的那张退货地址。'],
  JP: ['你写了品牌故事，', '没写日本站要的那张特商法表记。'],
  UK: ['你写了品牌故事，', '没写英国人能用的那 14 天取消权。'],
  FR: ['你写了品牌故事，', '没写法国站要的那份 Triman 标识。'],
  AU: ['你写了品牌故事，', '没写澳洲人默认拥有的 ACL 保障。']
}

export default function InputStage({
  presets,
  marketCode,
  onMarket,
  onRun,
  buildProfileFromText,
  presetToProfile,
  extractProfile,
  sampleText
}) {
  const [mode, setMode] = useState('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState(sampleText)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const submitUrl = (e) => {
    e.preventDefault()
    const value = url.trim()
    if (!value) {
      setNotice('先给一个链接。没有官网就用右侧样本，或粘贴店铺文本。')
      return
    }
    const preset = presets.find((p) => {
      const host = p.url.replace('https://', '').replace('www.', '')
      return value.toLowerCase().includes(host) || value.toLowerCase().includes(p.nameEn.toLowerCase())
    })
    if (preset) {
      setNotice('')
      onRun(presetToProfile(preset), marketCode)
      return
    }
    setMode('text')
    setNotice('演示环境不直连第三方站点抓取（CORS / 反爬）。已切换到文本解析：粘贴店铺介绍页内容，走同一套抽取管线。')
  }

  const submitText = async (e) => {
    e.preventDefault()
    if (busy) return
    if (text.trim().length < 40) {
      setNotice('文本太短，至少 40 字才能读出词簇与售后链路。')
      return
    }
    setNotice('')
    setBusy(true)
    const fallback = buildProfileFromText(text, marketCode)
    let next = fallback
    try {
      const result = await extractProfile(text, marketCode, fallback)
      next = result?.profile || result || fallback
    } catch {
      next = fallback
    }
    setBusy(false)
    onRun(next, marketCode)
  }

  return (
    <main className="input-stage">
      <div className="input-rail">
        <span className="rail-no">00</span>
        <span className="rail-vert mono">INPUT ADAPTER</span>
        <div className="rail-meta">
          <span>3 类信号</span>
          <span>官网 / 店铺页</span>
          <span>无需问卷</span>
        </div>
      </div>

      <div className="input-main">
        <p className="input-kicker mono">最小负担输入 / 从企业已有公开文本读问题</p>
        <h1>
          {HEADLINE[marketCode][0]}
          <br />
          {HEADLINE[marketCode][1]}
        </h1>
        <p className="input-lede">
          粘贴官网链接或店铺介绍页。系统读取品牌叙事、合规文本与售后链路，先给一句判断，再给可点开的依据。
        </p>

        <div className="input-tabs" role="tablist" aria-label="输入方式">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'url'}
            className={mode === 'url' ? 'is-on' : ''}
            onClick={() => setMode('url')}
          >
            官网链接
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'text'}
            className={mode === 'text' ? 'is-on' : ''}
            onClick={() => setMode('text')}
          >
            粘贴店铺文本
          </button>
        </div>

        {mode === 'url' ? (
          <form className="input-form" onSubmit={submitUrl}>
            <div className="field field-wide">
              <label className="mono" htmlFor="url-input">
                URL / STORE PAGE
              </label>
              <input
                id="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://wildmake.example.com"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <div className="field field-wide">
              <span className="mono field-label">TARGET MARKET</span>
              <div className="market-pick">
                {Object.values(MARKETS).map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    className={m.code === marketCode ? 'is-on' : ''}
                    onClick={() => onMarket(m.code)}
                  >
                    {m.name}
                    <span className="mono">{m.code}</span>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="primary-btn">
              开始诊断
              <span aria-hidden="true">→</span>
            </button>
          </form>
        ) : (
          <form className="input-form text-form" onSubmit={submitText}>
            <div className="field field-wide">
              <label className="mono" htmlFor="text-input">
                STORE COPY / 品牌故事 + 退换货政策 + 客服时间
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={7}
                spellCheck="false"
              />
            </div>
            <div className="field field-wide">
              <span className="mono field-label">TARGET MARKET</span>
              <div className="market-pick">
                {Object.values(MARKETS).map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    className={m.code === marketCode ? 'is-on' : ''}
                    onClick={() => onMarket(m.code)}
                  >
                    {m.name}
                    <span className="mono">{m.code}</span>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="primary-btn" disabled={busy}>
              {busy ? 'AI 抽取中…' : '解析这段文本'}
              {!busy && <span aria-hidden="true">→</span>}
            </button>
          </form>
        )}

        {busy && (
          <p className="notice mono">优先走 AI 字段抽取；超时或校验失败会自动回落本地规则，不会卡住诊断。</p>
        )}
        {notice && <p className="notice mono">{notice}</p>}

        <div className="input-foot mono">
          <span>DEMO 未接实时抓取</span>
          <span>AI 抽取优先 · 失败回落规则</span>
          <span>约 1.2 秒出判断</span>
        </div>
      </div>

      <aside className="sample-panel">
        <div className="sample-head">
          <span className="mono">SAMPLE LIBRARY</span>
          <span className="mono">02</span>
        </div>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            className="sample-card"
            onClick={() => onRun(presetToProfile(p), p.defaultMarket)}
          >
            <span className="sample-id mono">
              {p.id} / {p.defaultMarket}
            </span>
            <strong>{p.name}</strong>
            <span className="sample-cat">{p.category}</span>
            <span className="sample-src">{p.sourcePages}</span>
            <span className="sample-go mono">载入 →</span>
          </button>
        ))}
        <div className="sample-note">
          <p>A 默认德国：情怀叙事，无本地主体，09:00–18:00 排班。</p>
          <p>B 默认美国：条款叙事，加州仓，7×24 首响。</p>
          <p>6 个市场各自计算，结果页可随时切换对比。</p>
        </div>
      </aside>
    </main>
  )
}
