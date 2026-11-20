// 资源对接库。服务商名称与报价为演示构造，标注为模拟资源。
export const RESOURCES = [
  {
    id: 'svc-de-tz',
    code: 'SVC-DE-01',
    market: 'DE',
    gapKey: 'tz',
    name: '德语夜间客服接力',
    type: '本地客服外包 / BPO',
    fit: '德语人工接力：补足 16:00–24:00 高峰时段，或为现有 AI 首响补上德语授权。',
    cost: '€600–900 / 月',
    lead: '2 周上线',
    steps: [
      '按 7 天咨询量拆出 18:00–24:00 的会话量，确认是否够 4 小时人力班次。',
      '接入 1 家德语 BPO 做两周试运行，首响 SLA 设为 3 分钟。',
      '工单回流到同一系统，按周复核德语会话的退款承诺口径。'
    ],
    providers: [
      { name: 'NordServe BPO', note: '德语坐席，柏林时间 09:00–18:00 覆盖', price: '€680/月起' },
      { name: 'Rhein Support', note: '按小时计费，最低 40 小时/月', price: '€22/小时' }
    ],
    caveat: 'AI 首响不能替代德语人工处理撤回权与退款争议。'
  },
  {
    id: 'svc-de-entity',
    code: 'SVC-DE-02',
    market: 'DE',
    gapKey: 'entity',
    name: '属地法人 / EU 责任人',
    type: '合规主体服务',
    fit: '补齐 Impressum 地址与 GPSR 欧盟责任人，让退货与监管函件有本地收件人。',
    cost: '€120 / 月 + 开户费',
    lead: '5 个工作日',
    steps: [
      '确认销售主体：是否需要设立德国分支，或仅指定 EU 责任人。',
      '签署责任人授权书，取得可公示的名称、地址与联系方式。',
      '同步更新 Impressum、商品页与退货政策页三处信息。'
    ],
    providers: [
      { name: 'EUDomicile', note: 'EU 责任人 + 地址公示 + 年检', price: '€1,440/年' },
      { name: 'Kanzlei Nord', note: '含合同与撤回权条款复核', price: '按小时计费' }
    ],
    caveat: '责任人不是“挂名地址”，需承担产品安全与召回联络义务。'
  },
  {
    id: 'svc-de-return',
    code: 'SVC-DE-03',
    market: 'DE',
    gapKey: 'reverse',
    name: '德国本地退货点与二次销售检测',
    type: '海外仓 / 逆向物流',
    fit: '把跨境退运 €32/件降为本地入库 €12/件，并判定可二次销售。',
    cost: '€12 / 件起',
    lead: '10 天接入',
    steps: [
      '按品类确认检测标准：外观、功能、配件完整性三档。',
      '选择汉堡或法兰克福退货点，开通本地退货地址。',
      'A 级品回仓二次销售，B 级品本地折价，C 级品集中销毁并留凭证。'
    ],
    providers: [
      { name: 'RheinLager Returns', note: '退货点 + 检测 + 重新贴标', price: '€12/件起' },
      { name: 'Hafen 24 Logistik', note: '大件家具按体积计费', price: '按报价' }
    ],
    caveat: '退货地址必须在政策页可查，否则消费者仍可主张本地退款。'
  },
  {
    id: 'svc-de-pack',
    code: 'SVC-DE-04',
    market: 'DE',
    gapKey: 'packaging',
    name: 'LUCID 包装注册代办',
    type: '合规代办',
    fit: '补齐包装法登记号，避免平台按登记号核验后直接下架。',
    cost: '€290 一次性 + €40 / 年',
    lead: '3–5 个工作日',
    steps: [
      '按材质拆分包装重量：纸、塑料、复合材料。',
      '在 ZSVR 完成注册并取得 LUCID 登记号。',
      '把登记号写入商品页与平台合规信息栏。'
    ],
    providers: [
      { name: 'VerpackPlus', note: '注册 + 年度申报', price: '€290 起' },
      { name: 'Lizenzero 类服务', note: '含系统参与费代缴', price: '按量报价' }
    ],
    caveat: '注册不等于已缴纳系统参与费，两者需分别核验。'
  },
  {
    id: 'svc-de-data',
    code: 'SVC-DE-05',
    market: 'DE',
    gapKey: 'trace',
    name: '售后数据流向声明与工单本地化',
    type: '数据合规',
    fit: '补齐工单表单的收集目的、接收方与存储地说明，闭合售后责任链。',
    cost: '€1,800 一次性',
    lead: '3 周',
    steps: [
      '盘点售后工单字段与第三方系统（客服、物流、支付）。',
      '在表单下方补充收集目的、接收方与保存期限。',
      '如需回传中国，补充跨境传输依据与申诉渠道。'
    ],
    providers: [
      { name: 'Datenschutz Werk', note: 'DSGVO 记录与声明模板', price: '€1,800 起' }
    ],
    caveat: '声明不是免责条款，数据最小化仍需在系统层落实。'
  },
  {
    id: 'svc-us-tz',
    code: 'SVC-US-01',
    market: 'US',
    gapKey: 'tz',
    name: '美东夜班客服',
    type: '本地客服外包',
    fit: '覆盖美东 22:00–06:00（北京时间）的询单高峰，压住 24 小时响应率。',
    cost: '$520–780 / 月',
    lead: '2 周上线',
    steps: [
      '把 22:00–02:00 设为人工班次，其余时段 AI 首响加次日回呼。',
      '接入平台消息 API，统一响应计时口径。',
      '每周抽检退款与换货承诺是否符合政策页。'
    ],
    providers: [
      { name: 'EastCoast Reply', note: '英语坐席，ET 09:00–18:00', price: '$620/月起' },
      { name: 'NightShift CX', note: '按会话计费', price: '$0.85/会话' }
    ],
    caveat: '只做首响不做授权，退款争议仍需卖家决策。'
  },
  {
    id: 'svc-us-return',
    code: 'SVC-US-02',
    market: 'US',
    gapKey: 'reverse',
    name: '加州退货地址与检测',
    type: '海外仓 / 逆向物流',
    fit: '提供加州境内退货地址，把退运成本压到 $4.5/件并判定二次销售。',
    cost: '$4.5 / 件起',
    lead: '7–10 天',
    steps: [
      '在加州安大略或洛杉矶选择退货点，取得可公示地址。',
      '设定检测分级与退款时限（收货后 3 个工作日）。',
      '把地址写入政策页与平台退货设置。'
    ],
    providers: [
      { name: 'Ontario Return Hub', note: '入库、检测、重新上架', price: '$4.5/件起' }
    ],
    caveat: '地址可用不代表退款时效达标，两者需一起公示。'
  },
  {
    id: 'svc-us-tax',
    code: 'SVC-US-03',
    market: 'US',
    gapKey: 'tax',
    name: '各州销售税代收配置',
    type: '税务合规',
    fit: '按经济关联门槛判断代收义务，避免税负在结算后被追溯。',
    cost: '$0–45 / 月',
    lead: '1 周',
    steps: [
      '按州统计过去 12 个月销售额与订单数。',
      '对照各州经济关联门槛，标记触发代收的州。',
      '在支付与平台后台配置税率与申报周期。'
    ],
    providers: [
      { name: 'TaxBridge', note: '自动注册 + 月度申报', price: '$45/月起' }
    ],
    caveat: '平台代收与自主代收的责任边界需逐州确认。'
  },
  {
    id: 'svc-us-content',
    code: 'SVC-US-04',
    market: 'US',
    gapKey: 'legal',
    name: '功效声明审校',
    type: '本地化内容审校',
    fit: '删除无法核验的绝对化表述，避免 FTC §5 与平台功效审核双重拦截。',
    cost: '$0.06 / 词',
    lead: '5 个工作日',
    steps: [
      '提取商品页与广告中的功效、认证、对比类表述。',
      '逐条要求提供测试报告编号或删除。',
      '输出可替换的安全表述清单。'
    ],
    providers: [
      { name: 'PlainClaim Review', note: '英德双语声明审校', price: '$0.06/词' }
    ],
    caveat: '审校不替代产品检测，缺少报告仍需改文案。'
  },
  {
    id: 'svc-us-data',
    code: 'SVC-US-05',
    market: 'US',
    gapKey: 'trace',
    name: '工单数据本地闭环',
    type: '数据合规',
    fit: '让美国售后工单在本地可查、可审、可交接，避免责任断点。',
    cost: '$1,200 一次性',
    lead: '2–3 周',
    steps: [
      '确认工单系统是否可设美国区域存储。',
      '补充隐私政策中的收集目的、共享方与保留期限。',
      '建立工单与退款的本地审计日志。'
    ],
    providers: [
      { name: 'StateSide Data', note: '工单本地化 + 审计日志', price: '$1,200 起' }
    ],
    caveat: '数据本地化不等于合规完成，访问权限仍需最小化。'
  },
  {
    id: 'svc-jp-tz',
    code: 'SVC-JP-01',
    market: 'JP',
    gapKey: 'tz',
    name: '日语客服接力',
    type: '本地客服外包 / BPO',
    fit: '覆盖日本 09:00–17:00（北京时间）咨询高峰，并补日语返品与退款授权。',
    cost: '¥90,000–140,000 / 月',
    lead: '2 周上线',
    steps: [
      '按咨询量拆出日语会话，确认是否需要 4 小时人工班次。',
      '接入日语 BPO 试运行，首响 SLA 设为 3 分钟。',
      '把返品特约与退款口径做成日语话术卡，按周抽检。'
    ],
    providers: [
      { name: 'Tokyo Reply', note: '日语坐席，JST 10:00–19:00', price: '¥110,000/月起' },
      { name: 'Kansai CX', note: '按小时计费，最低 40 小时/月', price: '¥3,200/小时' }
    ],
    caveat: '机器翻译首响不能处理返品特约与撤回争议。'
  },
  {
    id: 'svc-jp-entity',
    code: 'SVC-JP-02',
    market: 'JP',
    gapKey: 'entity',
    name: '日本事业者住所与退货地址',
    type: '属地主体服务',
    fit: '补齐特商法要求的名称、住所、电话与可送达的日本退货地址。',
    cost: '¥18,000 / 月',
    lead: '5 个工作日',
    steps: [
      '确认是否需要设立日本法人，或仅使用合规的住所与电话代行。',
      '签署地址与电话使用授权，取得可公示信息。',
      '同步更新特商法表记页、退货政策页与平台后台。'
    ],
    providers: [
      { name: 'JP Address Desk', note: '住所、电话、邮件转送', price: '¥18,000/月' }
    ],
    caveat: '地址代行不等于产品安全责任转移。'
  },
  {
    id: 'svc-jp-return',
    code: 'SVC-JP-03',
    market: 'JP',
    gapKey: 'reverse',
    name: '日本退货点与二次销售检测',
    type: '海外仓 / 逆向物流',
    fit: '把跨境退运 ¥2,800/件降为本地入库 ¥900/件，并判定可二次销售。',
    cost: '¥900 / 件起',
    lead: '10 天接入',
    steps: [
      '按品类确定检测标准：外观、功能、配件完整性。',
      '在东京或大阪选择退货点，开通本地退货地址。',
      'A 级品回仓二次销售，B 级品本地折价，C 级品销毁留证。'
    ],
    providers: [
      { name: 'Kanto Returns', note: '入库、检测、重新贴标', price: '¥900/件起' }
    ],
    caveat: '退货地址必须与特商法表记一致。'
  },
  {
    id: 'svc-jp-tax',
    code: 'SVC-JP-04',
    market: 'JP',
    gapKey: 'tax',
    name: 'JCT 注册与含税价公示',
    type: '税务合规',
    fit: '确认课税事业者身份，避免售价含税口径在结算后被追溯。',
    cost: '¥0–50,000',
    lead: '2 周',
    steps: [
      '核对过去销售额与 JCT 注册义务。',
      '确定含税或未税展示口径，统一商品页与结算页。',
      '如需注册，提交申请并配置平台税率。'
    ],
    providers: [
      { name: 'JP Tax Desk', note: 'JCT 注册与申报', price: '¥30,000 起' }
    ],
    caveat: '平台代收与自主注册的责任边界需分别确认。'
  },
  {
    id: 'svc-jp-data',
    code: 'SVC-JP-05',
    market: 'JP',
    gapKey: 'trace',
    name: 'APPI 告知与工单本地化',
    type: '数据合规',
    fit: '补齐个人信息的利用目的、第三方提供与保存期限说明。',
    cost: '¥80,000',
    lead: '3 周',
    steps: [
      '盘点售后工单字段与第三方系统。',
      '在表单下方与隐私政策补利用目的与提供对象。',
      '建立保存期限与删除流程。'
    ],
    providers: [
      { name: 'Privacy JP', note: 'APPI 记录与声明模板', price: '¥80,000 起' }
    ],
    caveat: '声明不是免责条款，数据最小化仍需在系统层落实。'
  },
  {
    id: 'svc-uk-tz',
    code: 'SVC-UK-01',
    market: 'UK',
    gapKey: 'tz',
    name: '英国时段客服接力',
    type: '本地客服外包',
    fit: '覆盖英国 17:00–01:00（北京时间）咨询高峰，压住 24 小时响应率。',
    cost: '£520–780 / 月',
    lead: '2 周上线',
    steps: [
      '把 17:00–22:00 设为人工班次，其余时段 AI 首响加次日回呼。',
      '接入平台消息 API，统一响应计时口径。',
      '每周抽检取消权与退款承诺是否符合政策页。'
    ],
    providers: [
      { name: 'London Reply', note: '英语坐席，GMT 09:00–18:00', price: '£620/月起' }
    ],
    caveat: '首响不等于授权，取消与退款仍需卖家决策。'
  },
  {
    id: 'svc-uk-entity',
    code: 'SVC-UK-02',
    market: 'UK',
    gapKey: 'entity',
    name: '英国退货地址与本地责任人',
    type: '属地主体服务',
    fit: '补齐可公示的英国退货地址，满足 CCR 2013 的退回路径要求。',
    cost: '£90 / 月 + £9 / 件',
    lead: '5 个工作日',
    steps: [
      '确认销售主体与是否需要英国代表。',
      '签署地址使用协议，取得可公示信息。',
      '更新政策页、平台后台与取消表单。'
    ],
    providers: [
      { name: 'UK Address Co', note: '地址、邮件转送、退货接收', price: '£90/月' }
    ],
    caveat: '地址服务不承担产品安全与召回责任。'
  },
  {
    id: 'svc-uk-return',
    code: 'SVC-UK-03',
    market: 'UK',
    gapKey: 'reverse',
    name: '英国本地退货点与检测',
    type: '海外仓 / 逆向物流',
    fit: '英国境内入库与分级检测，避免每单跨境退运。',
    cost: '£9 / 件起',
    lead: '10 天',
    steps: [
      '确定检测分级与退款时限。',
      '在伦敦或曼彻斯特选择退货点。',
      'A 级品重新上架，B 级品本地折价，C 级品销毁留证。'
    ],
    providers: [
      { name: 'Midlands Returns', note: '入库、检测、重新贴标', price: '£9/件起' }
    ],
    caveat: '退货地址需与政策页、平台后台一致。'
  },
  {
    id: 'svc-uk-pack',
    code: 'SVC-UK-04',
    market: 'UK',
    gapKey: 'packaging',
    name: '英国包装 EPR 注册与申报',
    type: '合规代办',
    fit: '补齐包装数据申报与生产者责任登记信息。',
    cost: '£180 + £60 / 年',
    lead: '10 个工作日',
    steps: [
      '按材质拆分包装重量。',
      '完成 EPR 注册与年度数据申报。',
      '把登记信息写入平台合规栏与商品页。'
    ],
    providers: [
      { name: 'PackUK', note: 'EPR 注册与申报', price: '£180 起' }
    ],
    caveat: '注册不等于已缴纳回收费，两者需分别核验。'
  },
  {
    id: 'svc-uk-data',
    code: 'SVC-UK-05',
    market: 'UK',
    gapKey: 'trace',
    name: 'UK GDPR 告知与工单本地化',
    type: '数据合规',
    fit: '补齐英国代表、处理目的与 ICO 投诉路径。',
    cost: '£900',
    lead: '3 周',
    steps: [
      '盘点工单字段与第三方系统。',
      '补充英国代表与投诉路径。',
      '建立保存期限与访问权限。'
    ],
    providers: [
      { name: 'UK Privacy Desk', note: 'UK GDPR 声明与记录', price: '£900 起' }
    ],
    caveat: '声明不是免责条款，数据最小化仍需在系统层落实。'
  },
  {
    id: 'svc-fr-tz',
    code: 'SVC-FR-01',
    market: 'FR',
    gapKey: 'tz',
    name: '法语客服接力',
    type: '本地客服外包',
    fit: '覆盖法国 16:00–23:00（北京时间）咨询高峰，并补法语撤回授权。',
    cost: '€600–900 / 月',
    lead: '2 周上线',
    steps: [
      '拆出 16:00–22:00 的法语会话量。',
      '接入法语 BPO 试运行，首响 SLA 设为 3 分钟。',
      '把撤回表单与退款口径做成法语话术卡。'
    ],
    providers: [
      { name: 'Paris Support', note: '法语坐席，CET 09:00–18:00', price: '€680/月起' }
    ],
    caveat: '机器翻译不能处理撤回权与退款争议。'
  },
  {
    id: 'svc-fr-entity',
    code: 'SVC-FR-02',
    market: 'FR',
    gapKey: 'entity',
    name: '法国属地责任人与退货地址',
    type: '属地主体服务',
    fit: '补齐可公示的法国地址与退货收件人，闭合撤回权路径。',
    cost: '€120 / 月 + €11 / 件',
    lead: '5 个工作日',
    steps: [
      '确认销售主体与法国代表安排。',
      '签署地址与授权文件。',
      '更新政策页、撤回表单与平台后台。'
    ],
    providers: [
      { name: 'France Domicile', note: '地址、邮件转送、退货接收', price: '€120/月' }
    ],
    caveat: '地址代行不承担产品安全责任。'
  },
  {
    id: 'svc-fr-return',
    code: 'SVC-FR-03',
    market: 'FR',
    gapKey: 'reverse',
    name: '法国本地退货点与检测',
    type: '海外仓 / 逆向物流',
    fit: '法国境内入库与分级检测，避免每单跨境退运。',
    cost: '€11 / 件起',
    lead: '10 天',
    steps: [
      '确定检测分级与退款时限。',
      '在巴黎或里昂选择退货点。',
      'A 级品重新上架，C 级品销毁留证。'
    ],
    providers: [
      { name: 'Hexagone Returns', note: '入库、检测、重新贴标', price: '€11/件起' }
    ],
    caveat: '退货地址需与撤回表单一致。'
  },
  {
    id: 'svc-fr-pack',
    code: 'SVC-FR-04',
    market: 'FR',
    gapKey: 'packaging',
    name: 'Triman / Info-tri 标识与申报',
    type: '合规代办',
    fit: '补齐包装分类标识与生产者申报，避免法国站下架。',
    cost: '€240 + €40 / 年',
    lead: '10 个工作日',
    steps: [
      '按品类确认 Triman 与 Info-tri 模板。',
      '完成包装申报与标识文件。',
      '更新包装、商品页与平台合规栏。'
    ],
    providers: [
      { name: 'Triman Desk', note: '标识模板与申报', price: '€240 起' }
    ],
    caveat: '标识合规不代表包装回收费用已缴。'
  },
  {
    id: 'svc-fr-data',
    code: 'SVC-FR-05',
    market: 'FR',
    gapKey: 'trace',
    name: 'RGPD 法语告知与工单本地化',
    type: '数据合规',
    fit: '补齐法语隐私告知、处理目的与 CNIL 投诉路径。',
    cost: '€1,200',
    lead: '3 周',
    steps: [
      '盘点工单字段与第三方系统。',
      '补充法语告知与投诉路径。',
      '建立保存期限与访问权限。'
    ],
    providers: [
      { name: 'CNIL Desk', note: '法语声明与记录', price: '€1,200 起' }
    ],
    caveat: '声明不是免责条款，数据最小化仍需在系统层落实。'
  },
  {
    id: 'svc-au-tz',
    code: 'SVC-AU-01',
    market: 'AU',
    gapKey: 'tz',
    name: '澳洲时段英语客服',
    type: '本地客服外包',
    fit: '覆盖澳洲 06:00–14:00（北京时间）高峰，并补英语退货授权。',
    cost: 'A$480–720 / 月',
    lead: '2 周上线',
    steps: [
      '拆出 06:00–10:00 的英语会话量。',
      '接入澳洲 BPO 试运行，首响 SLA 设为 3 分钟。',
      '把 ACL 保障与自愿退货话术分开培训。'
    ],
    providers: [
      { name: 'Sydney Reply', note: '英语坐席，AEST 09:00–18:00', price: 'A$560/月起' }
    ],
    caveat: '客服不能替代 ACL 法定保障的判责。'
  },
  {
    id: 'svc-au-entity',
    code: 'SVC-AU-02',
    market: 'AU',
    gapKey: 'entity',
    name: '澳洲退货地址与退款流程',
    type: '属地主体服务',
    fit: '补齐可公示的澳洲退货地址与检测、退款路径。',
    cost: 'A$80 / 月 + A$9 / 件',
    lead: '7–10 天',
    steps: [
      '确认销售主体与是否需要澳洲代表。',
      '开通悉尼或墨尔本退货地址。',
      '更新政策页与平台退货设置。'
    ],
    providers: [
      { name: 'AUS Returns Desk', note: '地址、退货接收、检测', price: 'A$80/月' }
    ],
    caveat: '地址可用不代表 ACL 保障义务已履行。'
  },
  {
    id: 'svc-au-return',
    code: 'SVC-AU-03',
    market: 'AU',
    gapKey: 'reverse',
    name: '澳洲本地退货点与检测',
    type: '海外仓 / 逆向物流',
    fit: '澳洲境内入库与分级检测，避免每单跨境退运。',
    cost: 'A$9 / 件起',
    lead: '10 天',
    steps: [
      '确定检测分级与退款时限。',
      '在悉尼或墨尔本选择退货点。',
      'A 级品重新上架，C 级品销毁留证。'
    ],
    providers: [
      { name: 'Southern Cross Returns', note: '入库、检测、重新贴标', price: 'A$9/件起' }
    ],
    caveat: '退货点需能出具检测记录，供 ACL 争议使用。'
  },
  {
    id: 'svc-au-tax',
    code: 'SVC-AU-04',
    market: 'AU',
    gapKey: 'tax',
    name: 'GST 注册与含税价公示',
    type: '税务合规',
    fit: '按低价值进口商品门槛确认代收义务，避免税负追溯。',
    cost: 'A$0–300',
    lead: '1 周',
    steps: [
      '统计对澳销售额与订单数。',
      '确认 GST 注册与代收义务。',
      '在商品页与结算页标明含税口径。'
    ],
    providers: [
      { name: 'GST Desk', note: '注册与季度申报', price: 'A$300 起' }
    ],
    caveat: '平台代收与自主代收的责任边界需确认。'
  },
  {
    id: 'svc-au-data',
    code: 'SVC-AU-05',
    market: 'AU',
    gapKey: 'trace',
    name: 'APP 5 告知与工单本地化',
    type: '数据合规',
    fit: '补齐收集目的、披露对象与保存期限说明。',
    cost: 'A$900',
    lead: '3 周',
    steps: [
      '盘点工单字段与第三方系统。',
      '在表单与隐私政策补收集通知。',
      '建立保存期限与访问权限。'
    ],
    providers: [
      { name: 'Privacy AU', note: 'APP 5 声明与记录', price: 'A$900 起' }
    ],
    caveat: '声明不是免责条款，数据最小化仍需在系统层落实。'
  }
]

export function pickResources(marketCode, gapKeys) {
  const pool = RESOURCES.filter((r) => r.market === marketCode)
  const matched = []
  for (const key of gapKeys) {
    for (const r of pool) {
      if (r.gapKey === key && !matched.includes(r)) matched.push(r)
    }
  }
  const rest = pool.filter((r) => !matched.includes(r))
  return [...matched, ...rest].slice(0, 3)
}
