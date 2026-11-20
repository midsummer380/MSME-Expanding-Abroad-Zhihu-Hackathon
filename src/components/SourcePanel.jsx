export default function SourcePanel({ source, onClose }) {
  if (!source) return null
  return (
    <div className="source-panel">
      <div className="sp-head">
        <div>
          <span className="sp-code mono">{source.code}</span>
          <h4>{source.title}</h4>
        </div>
        <button type="button" className="sp-close mono" onClick={onClose} aria-label="收起来源">
          收起 ×
        </button>
      </div>
      <div className="sp-meta mono">
        <span>{source.jurisdiction}</span>
        <span>{source.updated}</span>
        <span className="sp-tag">{source.tag}</span>
        <span>条款级锚定</span>
      </div>
      <blockquote className="sp-quote">{source.quote}</blockquote>
      <p className="sp-zh">{source.zh}</p>
      {source.note && <p className="sp-note">适用提示：{source.note}</p>}
      <p className="sp-mock mono">引文为演示用节选改写，不构成法律意见。</p>
    </div>
  )
}
