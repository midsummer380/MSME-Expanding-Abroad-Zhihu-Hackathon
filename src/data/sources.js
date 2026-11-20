// 条文锚定库 v0.1
// 法规编号与名称对应真实公开文本；引文为演示用节选改写，不构成法律意见。
export const SOURCES = {
  bgb355: {
    id: 'bgb355',
    code: 'BGB §355',
    tag: '法规',
    title: 'Bürgerliches Gesetzbuch § 355 消费者撤回权',
    jurisdiction: '德国 · 联邦法律',
    updated: '2024-01-01',
    quote:
      'Verbraucher haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen einen Fernabsatzvertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem der Verbraucher oder ein von ihm benannter Dritter die Waren in Besitz genommen hat.',
    zh: '消费者有权在十四天内无需说明理由撤回远程销售合同。撤回期限自消费者或其指定第三人占有商品之日起十四日。',
    note: '店铺自定的“7 天无理由”不构成对法定 14 天撤回权的减损。'
  },
  ddg5: {
    id: 'ddg5',
    code: 'DDG §5',
    tag: '法规',
    title: 'Digitale-Dienste-Gesetz § 5 一般信息义务',
    jurisdiction: '德国 · 联邦法律',
    updated: '2024-05-14',
    quote:
      'Diensteanbieter haben folgende Informationen leicht erkennbar, unmittelbar erreichbar und ständig verfügbar zu halten: Name und Anschrift, bei juristischen Personen zusätzlich die Rechtsform und der Vertretungsberechtigte.',
    zh: '服务提供者须持续、直接、易于识别地提供以下信息：名称与地址；法人还需提供法律形式与有权代表人的姓名。',
    note: '原 TMG §5 的 Impressum 义务，现行文本位于 DDG。'
  },
  gpsr: {
    id: 'gpsr',
    code: 'GPSR Art.16',
    tag: '法规',
    title: '欧盟《通用产品安全条例》(EU) 2023/988 第 16 条',
    jurisdiction: '欧盟 · 条例',
    updated: '2024-12-13',
    quote:
      'Für Produkte, die in der Union bereitgestellt werden, muss eine in der Union niedergelassene natürliche oder juristische Person als verantwortliche Person benannt werden; Name und Anschrift sind auf dem Produkt oder in den Online-Angeboten anzugeben.',
    zh: '投放欧盟市场的产品须指定一名在欧盟境内设立的自然人或法人作为责任人，并在产品或在线商品信息中公示其名称与地址。',
    note: '非欧盟卖家自 2024-12-13 起适用，平台按责任人信息做上架核验。'
  },
  verpackg: {
    id: 'verpackg',
    code: 'VerpackG §9',
    tag: '法规',
    title: 'Verpackungsgesetz § 9 登记义务（LUCID）',
    jurisdiction: '德国 · 联邦法律',
    updated: '2023-07-01',
    quote:
      'Hersteller, die Verpackungen erstmals in Verkehr bringen, sind verpflichtet, sich vor der Inverkehrbringung bei der Zentralen Stelle Verpackungsregister registrieren zu lassen und die Registrierungsnummer anzugeben.',
    zh: '首次投放包装的生产者须在投放前于中央包装登记处（LUCID）注册，并提供登记号。',
    note: '平台与海关按登记号核验，缺失通常先触发下架而非仅罚款。'
  },
  uwg5: {
    id: 'uwg5',
    code: 'UWG §5',
    tag: '法规',
    title: 'Gesetz gegen den unlauteren Wettbewerb § 5 误导性商业行为',
    jurisdiction: '德国 · 联邦法律',
    updated: '2022-05-28',
    quote:
      'Eine geschäftliche Handlung ist irreführend, wenn sie unwahre Angaben enthält oder sonstige zur Täuschung geeignete Angaben über wesentliche Merkmale der Ware enthält, insbesondere über Beschaffenheit, Vorteile oder Sicherheit.',
    zh: '商业行为含有不实陈述，或就商品的重要特征（尤其性质、优势或安全性）作出足以误导的陈述，即构成误导。',
    note: '“100% 防水”“军工级”等绝对化表述需可核验依据。'
  },
  dsgvo13: {
    id: 'dsgvo13',
    code: 'DSGVO Art.13',
    tag: '法规',
    title: 'Datenschutz-Grundverordnung 第 13 条 告知义务',
    jurisdiction: '欧盟 · 条例',
    updated: '2018-05-25',
    quote:
      'Werden personenbezogene Daten bei der betroffenen Person erhoben, so teilt der Verantwortliche ihr bei der Erhebung unter anderem den Namen und die Kontaktdaten des Verantwortlichen, die Zwecke und die Rechtsgrundlage der Verarbeitung mit.',
    zh: '直接向数据主体收集个人数据时，控制者须在收集时告知其身份与联系方式、处理目的与合法性基础。',
    note: '售后工单表单属于个人数据收集场景。'
  },
  ehi_pay: {
    id: 'ehi_pay',
    code: 'EHI 2024',
    tag: '行业数据',
    title: 'EHI 在线支付研究 2024（演示用节选）',
    jurisdiction: '德国 · 行业研究',
    updated: '2024-09-01',
    quote:
      'Rechnungskauf und SEPA-Lastschrift stellen im deutschen Onlinehandel zusammen einen wesentlichen Anteil der Zahlungsarten; Kartenzahlung dominiert allein nicht das Präferenzbild.',
    zh: '账单支付与 SEPA 直接借记在德国线上零售中合计占有相当比例，信用卡并非唯一的偏好支付方式。',
    note: '行业数据为口径示意，非精确统计引用。'
  },
  gdpr_ret: {
    id: 'gdpr_ret',
    code: 'DSGVO Art.5',
    tag: '法规',
    title: 'DSGVO 第 5 条 数据处理原则',
    jurisdiction: '欧盟 · 条例',
    updated: '2018-05-25',
    quote:
      'Personenbezogene Daten sind ... für festgelegte, eindeutige und legitime Zwecke erhoben und nicht in einer mit diesen Zwecken nicht zu vereinbarenden Weise weiterverarbeitet werden.',
    zh: '个人数据应为特定、明确、合法的目的收集，不得以与该目的不相容的方式进一步处理。',
    note: '售后工单数据跨境回传需说明目的与接收方。'
  },
  ftc4352: {
    id: 'ftc4352',
    code: '16 CFR 435.2',
    tag: '法规',
    title: 'FTC Mail, Internet, or Telephone Order Merchandise Rule',
    jurisdiction: '美国 · 联邦法规',
    updated: '2014-11-13',
    quote:
      'The seller must have a reasonable basis for stating that a product can be shipped within a stated time. If the seller does not state a time, the seller must ship within 30 days after receipt of a properly completed order.',
    zh: '卖家须有合理依据声明发货时限；未声明的，应在收到有效订单后 30 天内发货。',
    note: '延迟发货须提供取消与全额退款的选项。'
  },
  cal1723: {
    id: 'cal1723',
    code: 'Cal. Civ. §1723',
    tag: '法规',
    title: 'California Civil Code § 1723 邮购退款与退货地址',
    jurisdiction: '美国 · 加州',
    updated: '2023-01-01',
    quote:
      'A mail order seller shall disclose its refund policy and provide a return address within California. If the seller fails to provide such address, the buyer may retain the merchandise and obtain a refund.',
    zh: '邮购卖家须披露退款政策并提供加州境内退货地址；未提供地址的，消费者可保留商品并取得退款。',
    note: '演示用节选改写，正式适用需按品类与销售渠道核对。'
  },
  ftc5: {
    id: 'ftc5',
    code: 'FTC Act §5',
    tag: '法规',
    title: 'Federal Trade Commission Act § 5 不公平或欺骗性行为',
    jurisdiction: '美国 · 联邦法律',
    updated: '2021-07-01',
    quote:
      'Unfair methods of competition in or affecting commerce, and unfair or deceptive acts or practices in or affecting commerce, are hereby declared unlawful.',
    zh: '在商业中或影响商业的不公平竞争方法、不公平或欺骗性行为，均属违法。',
    note: '功效与“认证”类表述需有可核验依据。'
  },
  wayfair: {
    id: 'wayfair',
    code: 'Wayfair 2018',
    tag: '判例',
    title: 'South Dakota v. Wayfair, Inc., 585 U.S. 162',
    jurisdiction: '美国 · 联邦最高法院',
    updated: '2018-06-21',
    quote:
      'The physical presence rule of Quill is unsound and incorrect. A state may require a remote seller to collect sales tax where the seller has substantial nexus, including economic nexus.',
    zh: 'Quill 案确立的“物理存在”规则不再成立；州可对具有实质关联（含经济关联）的远程卖家课以代收销售税义务。',
    note: '各州经济关联门槛不同，需按销售额与订单数分别判断。'
  },
  amazon_msg: {
    id: 'amazon_msg',
    code: 'SC 消息政策',
    tag: '平台政策',
    title: 'Amazon Seller Central 买家消息响应政策（演示摘录）',
    jurisdiction: '平台规则 · 美国站',
    updated: '2025-06-01',
    quote:
      'Sellers are expected to respond to buyer messages within 24 hours. Response time and response rate are incorporated into account health metrics and may affect listing eligibility.',
    zh: '卖家应在 24 小时内回复买家消息；响应时长与响应率计入账号健康指标，并可能影响商品上架资格。',
    note: '平台规则为先于法规触发的限流来源。'
  },
  baymard: {
    id: 'baymard',
    code: 'Baymard 2024',
    tag: '行业数据',
    title: 'Baymard Institute 购物车放弃研究（演示用节选）',
    jurisdiction: '美国 · 行业研究',
    updated: '2024-11-01',
    quote:
      'A significant share of US online shoppers abandon checkout because they cannot find a satisfactory return policy or cannot verify delivery expectations before payment.',
    zh: '相当比例的美国线上消费者在结算阶段放弃，原因包括找不到满意的退货政策，或在支付前无法确认配送预期。',
    note: '行业数据为口径示意，非精确统计引用。'
  },
  amazon_odr: {
    id: 'amazon_odr',
    code: 'SC ODR',
    tag: '平台政策',
    title: 'Amazon 订单缺陷率与纠纷判责（演示摘录）',
    jurisdiction: '平台规则 · 欧盟站',
    updated: '2025-06-01',
    quote:
      'Order Defect Rate must remain below 1%. A-to-z Guarantee claims are decided on the basis of tracking, delivery proof and the seller´s stated return policy.',
    zh: '订单缺陷率须低于 1%。A-to-z 索赔依据物流轨迹、妥投证明与卖家公示的退货政策判定。',
    note: '无可送达的本地退货地址，通常在判责中处于不利位置。'
  },
  tokushoho: {
    id: 'tokushoho',
    code: '特商法 §11',
    tag: '法规',
    title: '特定商取引法 第 11 条 通信販売の表示',
    jurisdiction: '日本 · 法律',
    updated: '2023-06-01',
    quote:
      '通信販売を行う事業者は、商品の販売条件について、事業者の氏名又は名称、住所、電話番号、販売価格、代金の支払時期及び方法、引渡し時期、返品に関する特約等を、消費者にわかりやすく表示しなければならない。',
    zh: '从事通信销售的事业者，须就销售条件以消费者易于理解的方式表示：名称、地址、电话、售价、付款时间与方式、交付时间、返品特约等。',
    note: '日本站点没有 Impressum，但有同等强度的表记义务。'
  },
  tokushoho_return: {
    id: 'tokushoho_return',
    code: '特商法 返品',
    tag: '法规',
    title: '特定商取引法 返品特约の表示（演示节选）',
    jurisdiction: '日本 · 法律',
    updated: '2023-06-01',
    quote:
      '返品に関する特約を表示していない場合、消費者は商品の引渡しを受けた日から八日以内であれば、送料を負担して返品することができる。',
    zh: '未表示返品特约时，消费者可在收到商品之日起八日内，自行承担运费退货。',
    note: '页面写 7 天并不自动无效，但低于未约定时的 8 天默认口径。'
  },
  keihyo: {
    id: 'keihyo',
    code: '景表法 §5',
    tag: '法规',
    title: '景品表示法 第 5 条 優良誤認表示',
    jurisdiction: '日本 · 法律',
    updated: '2023-10-01',
    quote:
      '商品又は役務の品質、規格その他の内容について、実際のものよりも著しく優良であると一般消費者に誤認させる表示は、不当な表示として禁止される。',
    zh: '就商品或服务的品质、规格等内容，使一般消费者误认为显著优于实际情况的表示，属于被禁止的不当表示。',
    note: '“100%”“最高级”等绝对化表述需要客观依据。'
  },
  appi: {
    id: 'appi',
    code: '個情法 §21',
    tag: '法规',
    title: '個人情報保護法 第 21 条 利用目的の通知等',
    jurisdiction: '日本 · 法律',
    updated: '2022-04-01',
    quote:
      '個人情報取扱事業者は、個人情報を取得したときは、速やかに、その利用目的を本人に通知し、又は公表しなければならない。',
    zh: '个人信息处理业者在取得个人信息时，须迅速通知本人或公布其利用目的。',
    note: '售后工单表单属于取得个人信息的场景。'
  },
  jct: {
    id: 'jct',
    code: '消費税法',
    tag: '法规',
    title: '消費税法 課税事業者の表示（演示节选）',
    jurisdiction: '日本 · 法律',
    updated: '2023-10-01',
    quote:
      '事業者が課税事業者である場合、商品の販売価格には消費税相当額を含む旨を表示する必要がある。',
    zh: '事业者为课税事业者时，须表示商品售价是否包含消费税。',
    note: '跨境卖家还需确认是否适用 JCT 注册与代收安排。'
  },
  ccr2013: {
    id: 'ccr2013',
    code: 'CCR 2013 reg 29',
    tag: '法规',
    title: 'Consumer Contracts Regulations 2013, reg 29-35',
    jurisdiction: '英国 · 法规',
    updated: '2014-06-13',
    quote:
      'The consumer has the right to cancel a distance contract within 14 days after the day on which the consumer acquires physical possession of the goods, without giving any reason.',
    zh: '消费者有权在取得商品实际占有之日起 14 天内取消远程合同，无需说明理由。',
    note: '取消权不得被店铺自定的更短窗口减损。'
  },
  cprs: {
    id: 'cprs',
    code: 'CPRs 2008',
    tag: '法规',
    title: 'Consumer Protection from Unfair Trading Regulations 2008',
    jurisdiction: '英国 · 法规',
    updated: '2008-05-26',
    quote:
      'A commercial practice is misleading if it contains false information or is likely to deceive the average consumer in relation to the nature, attributes or benefits of a product.',
    zh: '商业行为含有虚假信息，或就商品性质、属性、优势足以欺骗一般消费者的，构成误导。',
    note: '功效与“认证”类表述需有可核验依据。'
  },
  ukepr: {
    id: 'ukepr',
    code: 'UK EPR',
    tag: '法规',
    title: 'UK Packaging Extended Producer Responsibility（演示节选）',
    jurisdiction: '英国 · 环境署',
    updated: '2024-01-01',
    quote:
      'Producers that place packaged goods on the UK market must report packaging data and meet extended producer responsibility obligations for the packaging they supply.',
    zh: '在英国市场投放带包装商品的生产者，须申报包装数据并履行包装延伸生产者责任义务。',
    note: '平台合规审核会核验生产者责任登记信息。'
  },
  ukgdpr: {
    id: 'ukgdpr',
    code: 'UK GDPR Art.13',
    tag: '法规',
    title: 'UK GDPR Article 13 告知义务（演示节选）',
    jurisdiction: '英国 · 法规',
    updated: '2021-01-01',
    quote:
      'Where personal data are collected from the data subject, the controller shall provide the identity and contact details of the controller and the purposes of the processing at the time of collection.',
    zh: '直接向数据主体收集个人数据时，控制者须在收集时告知其身份、联系方式与处理目的。',
    note: '英国站还需提供 ICO 投诉路径。'
  },
  fr_l221_18: {
    id: 'fr_l221_18',
    code: 'L221-18',
    tag: '法规',
    title: 'Code de la consommation L221-18 撤回权',
    jurisdiction: '法国 · 法律',
    updated: '2016-07-01',
    quote:
      'Le consommateur dispose d´un délai de quatorze jours pour exercer son droit de rétractation d´un contrat conclu à distance, sans avoir à motiver sa décision.',
    zh: '消费者对远程订立的合同享有十四天撤回权，无需说明理由。',
    note: '撤回期限与起算点须在合同前信息中说明。'
  },
  fr_l121_1: {
    id: 'fr_l121_1',
    code: 'L121-1',
    tag: '法规',
    title: 'Code de la consommation L121-1 误导性商业行为',
    jurisdiction: '法国 · 法律',
    updated: '2016-07-01',
    quote:
      'Une pratique commerciale est trompeuse lorsqu´elle repose sur des allégations, indications ou présentations fausses ou de nature à induire en erreur.',
    zh: '商业行为建立在虚假或足以引人误解的陈述、标示或呈现之上时，构成欺骗性商业行为。',
    note: '绝对化功效表述需可核验依据。'
  },
  triman: {
    id: 'triman',
    code: 'Info-tri',
    tag: '法规',
    title: 'AGEC 法 Triman / Info-tri 分类标识（演示节选）',
    jurisdiction: '法国 · 环境署',
    updated: '2023-01-01',
    quote:
      'Les producteurs doivent apposer sur les emballages le logo Triman et une information de tri selon les modalités harmonisées définies par les filières.',
    zh: '生产者须按各回收体系规定的统一方式，在包装上标注 Triman 标识与分类信息。',
    note: '法国站商品页与包装需同时体现分类信息。'
  },
  acl64: {
    id: 'acl64',
    code: 'ACL s64',
    tag: '法规',
    title: 'Australian Consumer Law s64 法定保障',
    jurisdiction: '澳大利亚 · 联邦法律',
    updated: '2011-01-01',
    quote:
      'Guarantees as to acceptable quality, fitness for purpose and correspondence with description apply to consumer goods supplied in trade or commerce and may not be excluded by contract.',
    zh: '关于可接受质量、适用目的与符合描述的法定保障适用于商业供应的消费品，不得以合同排除。',
    note: '法定保障独立于商家自定的“无理由退货”政策。'
  },
  acl18: {
    id: 'acl18',
    code: 'ACL s18',
    tag: '法规',
    title: 'Australian Consumer Law s18 误导性行为',
    jurisdiction: '澳大利亚 · 联邦法律',
    updated: '2011-01-01',
    quote:
      'A person must not, in trade or commerce, engage in conduct that is misleading or deceptive or is likely to mislead or deceive.',
    zh: '任何人不得在贸易或商业中从事误导或欺骗性行为，或可能产生误导、欺骗效果的行为。',
    note: '绝对化功效与“认证”表述需可核验。'
  },
  accc_returns: {
    id: 'accc_returns',
    code: 'ACCC 退货',
    tag: '监管指南',
    title: 'ACCC 退货与退款指引（演示节选）',
    jurisdiction: '澳大利亚 · ACCC',
    updated: '2024-06-01',
    quote:
      'Businesses must not mislead consumers about their rights to a repair, replacement or refund. A return address and the process for claiming a remedy should be clear before purchase.',
    zh: '商家不得就维修、更换或退款权利误导消费者；退货地址与救济申请流程应在购买前清晰可见。',
    note: '自愿退货政策不得压缩 ACL 法定保障。'
  },
  gst: {
    id: 'gst',
    code: 'GST Act',
    tag: '法规',
    title: 'A New Tax System (GST) Act 1999（演示节选）',
    jurisdiction: '澳大利亚 · 联邦法律',
    updated: '2024-07-01',
    quote:
      'Suppliers of low value imported goods to Australian consumers may be required to register for and collect GST where the relevant threshold is met.',
    zh: '向澳洲消费者供应低价值进口商品的供应商，在达到相关门槛时可能需注册并代收 GST。',
    note: '售价是否含 GST 需在结算前说明。'
  },
  au_privacy: {
    id: 'au_privacy',
    code: 'APP 5',
    tag: '法规',
    title: 'Privacy Act 1988, Australian Privacy Principle 5',
    jurisdiction: '澳大利亚 · 联邦法律',
    updated: '2024-01-01',
    quote:
      'An APP entity that collects personal information must notify the individual of the purposes of collection and the entities to which the information may be disclosed.',
    zh: '收集个人信息的 APP 实体须告知个人收集目的以及可能披露的对象。',
    note: '售后工单与退款记录属于收集场景。'
  }
}
