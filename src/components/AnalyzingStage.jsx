const LINES = [
  ['FETCH', '读取公开页面 / 政策文本 / 联系页'],
  ['PARSE', '切分品牌叙事、合规文本、售后链路'],
  ['SIGNAL', '四元素词簇匹配，剔除国别均值'],
  ['TZ', '客服时段 × 目标市场咨询高峰'],
  ['ANCHOR', '将断言绑定到条款级来源']
]

export default function AnalyzingStage({ profile, market }) {
  return (
    <main className="analyzing">
      <div className="analyzing-head">
        <span className="ana-case mono">{profile?.id || 'CASE'} / {market?.nameEn}</span>
        <h1>
          正在把<span>叙事</span>翻译成<span>合规信号</span>
        </h1>
        <p className="mono">分析单元：{profile?.name} 的公开文本 · 不读取国别均值</p>
      </div>
      <div className="scan" aria-hidden="true">
        <span className="scan-line" />
      </div>
      <ol className="log">
        {LINES.map(([key, text], i) => (
          <li key={key} style={{ animationDelay: `${i * 0.12}s` }}>
            <span className="log-key mono">{key}</span>
            <span className="log-text">{text}</span>
            <span className="log-state mono">OK</span>
          </li>
        ))}
      </ol>
    </main>
  )
}
