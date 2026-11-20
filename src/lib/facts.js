// 把规则引擎的结果压缩成 AI 可读的事实表。数字与法条只来自这里。
export function resultToFacts(result) {
  const { profile, market, scores, gaps, tz, claims, actions, resources, heat } = result
  const allowedSourceIds = [...new Set(claims.flatMap((c) => c.sources || []))]

  return {
    profile: {
      id: profile.id,
      name: profile.name,
      category: profile.category,
      returnDays: profile.returnDays,
      serviceHours: profile.serviceHours,
      supportLanguages: profile.supportLanguages || ['zh'],
      localEntity: profile.localEntity || {},
      dataStatement: profile.dataStatement,
      dataResidency: profile.dataResidency,
      aovCNY: profile.aovCNY,
      productClaims: profile.productClaims || [],
      signaturePhrase: profile.signaturePhrase || '',
      narrative: (profile.brandNarrative || '').slice(0, 400)
    },
    market: {
      code: market.code,
      name: market.name,
      nameEn: market.nameEn,
      currency: market.currency,
      symbol: market.symbol,
      peakLabel: market.peakLabel,
      peakHours: market.peakHours,
      overnightWindow: market.overnightWindow,
      legal: market.legal
    },
    scores,
    gaps: gaps.map(({ key, label, level, value, title, detail, fix, languageGap }) => ({
      key,
      label,
      level,
      value,
      title,
      detail,
      fix,
      languageGap: Boolean(languageGap)
    })),
    tz: {
      ratio: Math.round(tz.ratio * 100) / 100,
      coverage: tz.coverage,
      peakTotal: tz.peakTotal,
      statusLabel: tz.statusLabel,
      offset: tz.offset
    },
    claims: claims.map(({ id, layer, text, sources, severity }) => ({ id, layer, text, sources, severity })),
    actions: actions.map(({ tier, title, detail, cost, owner, gapKey }) => ({ tier, title, detail, cost, owner, gapKey })),
    resources: resources.map(({ id, code, name, type, gapKey, cost, fit }) => ({ id, code, name, type, gapKey, cost, fit })),
    counts: {
      markets: heat?.[0]?.cells.length || 0,
      gaps: gaps.length,
      claims: claims.length,
      sources: allowedSourceIds.length
    },
    allowedSourceIds
  }
}
