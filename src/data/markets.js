// 目标市场配置。所有时区覆盖计算都基于真实 IANA 时区在参考日期的偏移。
export const MARKETS = {
  DE: {
    code: 'DE',
    name: '德国',
    nameEn: 'GERMANY',
    language: 'de',
    languageName: '德语',
    timeZone: 'Europe/Berlin',
    tzLabel: 'CET / UTC+1',
    currency: 'EUR',
    symbol: '€',
    fx: 7.8,
    peak: [
      { start: 9, end: 12 },
      { start: 13, end: 17 }
    ],
    peakLabel: '09:00–12:00 / 13:00–17:00 当地时间',
    peakHours: 7,
    intlReturnCost: 32,
    localReturnCost: 12,
    legal: {
      withdrawalDays: 14,
      anchor: 'BGB §355',
      entityAnchor: 'DDG §5 / GPSR Art.16',
      label: '14 天撤回权',
      core: '14 天撤回权',
      expectation: '14 天撤回权与 Impressum 地址'
    },
    overnightWindow: '16:00–24:00（北京时间）'
  },
  US: {
    code: 'US',
    name: '美国',
    nameEn: 'UNITED STATES',
    language: 'en',
    languageName: '英语',
    timeZone: 'America/New_York',
    tzLabel: 'ET / UTC−5',
    currency: 'USD',
    symbol: '$',
    fx: 7.2,
    peak: [
      { start: 9, end: 12 },
      { start: 13, end: 17 }
    ],
    peakLabel: '09:00–12:00 / 13:00–17:00 当地时间',
    peakHours: 7,
    intlReturnCost: 28,
    localReturnCost: 4.5,
    legal: {
      withdrawalDays: 30,
      anchor: '16 CFR 435.2',
      entityAnchor: 'Cal. Civ. Code §1723',
      label: '30 天发货承诺',
      core: '30 天发货承诺',
      expectation: '30 天发货承诺与可送达的退货地址'
    },
    overnightWindow: '22:00–06:00（北京时间）'
  },
  JP: {
    code: 'JP',
    name: '日本',
    nameEn: 'JAPAN',
    language: 'ja',
    languageName: '日语',
    timeZone: 'Asia/Tokyo',
    tzLabel: 'JST / UTC+9',
    currency: 'JPY',
    symbol: '¥',
    fx: 0.048,
    peak: [
      { start: 10, end: 12 },
      { start: 13, end: 18 }
    ],
    peakLabel: '10:00–12:00 / 13:00–18:00 当地时间',
    peakHours: 7,
    intlReturnCost: 2800,
    localReturnCost: 900,
    legal: {
      withdrawalDays: 8,
      anchor: '特商法 §11',
      entityAnchor: '特商法 §11',
      label: '8 天返品特约',
      core: '特定商取引法表记',
      expectation: '特定商取引法表记与 8 天返品特约'
    },
    overnightWindow: '09:00–11:00 / 12:00–17:00（北京时间）'
  },
  UK: {
    code: 'UK',
    name: '英国',
    nameEn: 'UNITED KINGDOM',
    language: 'en',
    languageName: '英语',
    timeZone: 'Europe/London',
    tzLabel: 'GMT / UTC+0',
    currency: 'GBP',
    symbol: '£',
    fx: 9.2,
    peak: [
      { start: 9, end: 12 },
      { start: 14, end: 17 }
    ],
    peakLabel: '09:00–12:00 / 14:00–17:00 当地时间',
    peakHours: 6,
    intlReturnCost: 26,
    localReturnCost: 9,
    legal: {
      withdrawalDays: 14,
      anchor: 'CCR 2013 reg 29',
      entityAnchor: 'CCR 2013 reg 35',
      label: '14 天取消权',
      core: '14 天取消权',
      expectation: '14 天取消权与英国退货地址'
    },
    overnightWindow: '17:00–20:00 / 22:00–01:00（北京时间）'
  },
  FR: {
    code: 'FR',
    name: '法国',
    nameEn: 'FRANCE',
    language: 'fr',
    languageName: '法语',
    timeZone: 'Europe/Paris',
    tzLabel: 'CET / UTC+1',
    currency: 'EUR',
    symbol: '€',
    fx: 7.8,
    peak: [
      { start: 9, end: 12 },
      { start: 14, end: 18 }
    ],
    peakLabel: '09:00–12:00 / 14:00–18:00 当地时间',
    peakHours: 7,
    intlReturnCost: 30,
    localReturnCost: 11,
    legal: {
      withdrawalDays: 14,
      anchor: 'Code conso. L221-18',
      entityAnchor: 'Code conso. L221-5',
      label: '14 天撤回权',
      core: '14 天撤回权',
      expectation: '14 天撤回权与法国退货地址'
    },
    overnightWindow: '16:00–19:00 / 21:00–23:00（北京时间）'
  },
  AU: {
    code: 'AU',
    name: '澳大利亚',
    nameEn: 'AUSTRALIA',
    language: 'en',
    languageName: '英语',
    timeZone: 'Australia/Sydney',
    tzLabel: 'AEDT / UTC+11',
    currency: 'AUD',
    symbol: 'A$',
    fx: 4.7,
    peak: [
      { start: 9, end: 12 },
      { start: 13, end: 17 }
    ],
    peakLabel: '09:00–12:00 / 13:00–17:00 当地时间',
    peakHours: 7,
    intlReturnCost: 38,
    localReturnCost: 9,
    legal: {
      withdrawalDays: null,
      anchor: 'ACL s64',
      entityAnchor: 'ACL s64 / ACCC Returns',
      label: 'ACL 法定保障',
      core: 'ACL 法定保障',
      expectation: 'ACL 法定保障与可查的退货地址'
    },
    overnightWindow: '06:00–09:00 / 10:00–14:00（北京时间）'
  }
}

export const REFERENCE_DATE = '2026-11-19T04:00:00Z'

export const AXES = [
  {
    key: 'axis1',
    left: '整体渗透',
    right: '契约边界',
    leftKey: 'diffuse',
    rightKey: 'contract',
    weight: 30,
    note: '决定品牌承诺以“共同体叙事”还是“条款语言”被接收'
  },
  {
    key: 'axis2',
    left: '根源情怀',
    right: '普世个体',
    leftKey: 'root',
    rightKey: 'individual',
    weight: 30,
    note: '决定品牌故事能否直接兑换为目标市场的履约信任'
  },
  {
    key: 'axis3',
    left: '中心统筹',
    right: '契约分权',
    leftKey: 'central',
    rightKey: 'decentralized',
    weight: 20,
    note: '影响本地主体、代理与售后责任的分配方式'
  },
  {
    key: 'axis4',
    left: '实用先发',
    right: '预防法典',
    leftKey: 'pragmatic',
    rightKey: 'codex',
    weight: 20,
    note: '影响合规策略的激进程度与风险偏好'
  }
]

export const LAYERS = [
  {
    no: '01',
    name: '文化固有偏见',
    en: 'CULTURAL BIAS',
    def: '包装禁忌、支付习惯、消费者保护惯例等可公开查证的事实。'
  },
  {
    no: '02',
    name: '政治红线',
    en: 'POLITICAL LINE',
    def: '平台政策原文、出口管制清单、公开执法案例与词项。'
  },
  {
    no: '03',
    name: '市场地位歧视',
    en: 'STRUCTURAL ASYMMETRY',
    def: '平台对中小卖家的差异化政策、本地含量与数据本地化规则。'
  },
  {
    no: '04',
    name: '文化价值观',
    en: 'CONSUMER VALUES',
    def: '退换货、冷静期、信息披露的具体条款与平台纠纷判例。'
  }
]
