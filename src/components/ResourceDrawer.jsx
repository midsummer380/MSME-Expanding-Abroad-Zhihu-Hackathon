export default function ResourceDrawer({ resource, onClose, result }) {
  if (!resource) return null
  const gap = result?.gaps.find((g) => g.key === resource.gapKey)

  return (
    <div className="drawer-layer">
      <button type="button" className="drawer-backdrop" aria-label="关闭资源面板" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={resource.name}>
        <div className="drawer-head">
          <div className="drawer-title">
            <span className="mono">{resource.code} / {resource.type}</span>
            <h2>{resource.name}</h2>
          </div>
          <button type="button" className="drawer-close mono" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-match">
            <span className="mono">为什么匹配到你</span>
            <p>{resource.fit}</p>
            {gap && (
              <div className="drawer-gap mono">
                <span>{gap.label}</span>
                <b>{gap.title}</b>
              </div>
            )}
          </div>

          <div className="drawer-kv mono">
            <div>
              <span>成本区间</span>
              <b>{resource.cost}</b>
            </div>
            <div>
              <span>上线周期</span>
              <b>{resource.lead}</b>
            </div>
            <div>
              <span>市场</span>
              <b>{resource.market}</b>
            </div>
          </div>

          <div className="drawer-steps">
            <h3>对接路径</h3>
            <ol>
              {resource.steps.map((step, i) => (
                <li key={step}>
                  <span className="step-no mono">0{i + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="drawer-providers">
            <h3>可询价资源</h3>
            {resource.providers.map((p) => (
              <div className="provider" key={p.name}>
                <div>
                  <b>{p.name}</b>
                  <span>{p.note}</span>
                </div>
                <span className="mono">{p.price}</span>
              </div>
            ))}
            <p className="provider-mock mono">服务商名称与报价为演示构造，仅用于展示“诊断结果 → 资源类型 → 可及路径”的映射方式。</p>
          </div>

          <p className="drawer-caveat">注意：{resource.caveat}</p>
        </div>
      </aside>
    </div>
  )
}
