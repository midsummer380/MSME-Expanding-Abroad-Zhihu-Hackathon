import { MARKETS } from '../data/markets'

export default function Header({ stage, market, marketCode, onMarket, onReset, hasResult }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <div className="brand-text">
          <span className="brand-name">可锚</span>
          <span className="brand-en">ANCHOR</span>
          <span className="brand-sub mono">OUTBOUND COMPLIANCE TERMINAL · v0.1</span>
        </div>
      </div>

      <div className="topbar-mid mono">
        <span>AI+出海</span>
        <span>内容本地化 / 跨文化适配</span>
        <span>中小微企业</span>
      </div>

      <div className="topbar-actions">
        {hasResult && (
          <label className="market-select">
            <span className="market-label mono">MARKET</span>
            <select
              value={marketCode}
              onChange={(e) => onMarket(e.target.value)}
              aria-label="目标市场"
            >
              {Object.values(MARKETS).map((m) => (
                <option key={m.code} value={m.code}>
                  {m.name} · {m.code}
                </option>
              ))}
            </select>
            <span className="market-caret" aria-hidden="true">▾</span>
          </label>
        )}
        {hasResult && (
          <button type="button" className="ghost-btn mono" onClick={onReset}>
            重新输入
          </button>
        )}
        {!hasResult && <span className="stage-tag mono">{stage === 'analyzing' ? 'SCANNING' : 'INPUT'}</span>}
      </div>
    </header>
  )
}
