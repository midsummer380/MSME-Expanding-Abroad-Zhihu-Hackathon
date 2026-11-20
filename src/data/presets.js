// 演示样本。官网抓取在演示环境未接入，样本以“已抓取的公开文本”形态提供。
export const PRESETS = [
  {
    id: 'A-01',
    name: '山野造物 WILDMAKE',
    nameEn: 'WILDMAKE',
    category: '户外装备 · 帐篷与露营炊具',
    url: 'https://wildmake.example.com',
    defaultMarket: 'DE',
    sourcePages: '首页 / 品牌故事 / 退换货政策 / 联系我们',
    brandNarrative:
      '2013 年，我们兄弟俩在川西的山里搭起第一顶帐篷。父亲是老裁缝，教我们一针一线都要对得起布料。我们不做最快的品牌，只做能陪一个家庭走十年的装备。每一顶帐篷都以我们走过的山命名。',
    serviceHours: '周一至周五 09:00–18:00（北京时间）',
    returnDays: 7,
    returnText: '7 天无理由退货，商品需不影响二次销售；退回运费由买家承担，寄回深圳仓库。',
    localEntity: { DE: false, US: false },
    packagingRegistered: false,
    dataStatement: false,
    dataResidency: 'CN',
    responseSla: false,
    paymentMethods: ['信用卡', 'PayPal'],
    supportLanguages: ['zh'],
    aovCNY: 268,
    productClaims: ['100% 防水', '军工级面料', '探险队同款'],
    signals: { root: 78, contract: 22, diffuse: 64, individual: 36, central: 72, decentralized: 28, pragmatic: 58, codex: 42 },
    signaturePhrase: '能陪一个家庭走十年'
  },
  {
    id: 'B-02',
    name: '小野电器 XIAOYE',
    nameEn: 'XIAOYE',
    category: '小家电 · 便携榨汁杯',
    url: 'https://xiaoye-appliance.example.com',
    defaultMarket: 'US',
    sourcePages: '首页 / 产品页 / 退换货政策 / 隐私政策',
    brandNarrative:
      '我们做一只每天早上都用得上的榨汁杯。一个人住，也要喝到新鲜的东西。它不承诺陪你十年，但它每天准时上班。去掉多余的按钮，只留下一个：按下去。',
    serviceHours: '7×24 小时（AI 首响 + 洛杉矶外包团队）',
    returnDays: 30,
    returnText: '30 天无理由退货，退款在收货后 3 个工作日内原路退回；美国订单退回加州安大略仓。',
    localEntity: { US: true, DE: false },
    packagingRegistered: false,
    dataStatement: true,
    dataResidency: 'CN',
    responseSla: true,
    paymentMethods: ['信用卡', 'Apple Pay', 'PayPal'],
    supportLanguages: ['zh', 'en'],
    aovCNY: 89,
    productClaims: ['食品级材质', '一键出汁', '随身可带'],
    signals: { root: 36, contract: 64, diffuse: 38, individual: 62, central: 48, decentralized: 52, pragmatic: 66, codex: 34 },
    signaturePhrase: '每天准时上班'
  }
]

export const SAMPLE_TEXT = `山野造物创立于 2013 年，我们兄弟俩从川西的山里出发，做能陪一个家庭走十年的帐篷。
父亲是老裁缝，他教我们一针一线都要对得起布料。每一顶帐篷都以我们走过的山命名。
客服时间：周一至周五 09:00–18:00（北京时间）。
退换货政策：7 天无理由退货，退回运费由买家承担，寄回深圳仓库。
支持信用卡与 PayPal 付款。`
