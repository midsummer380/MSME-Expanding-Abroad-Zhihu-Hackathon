import { MARKETS, AXES, REFERENCE_DATE } from '../data/markets'
import { pickResources } from '../data/resources'
import { LEXICON, findHits, scoreFromHits } from './lexicon'

const pad = (n) => String(n).padStart(2, '0')

export function parseServiceHours(text) {
  if (!text) return { found: false, start: null, end: null, label: '未标注客服时段' }
  if (/7\s*[×xX*]\s*24|24\s*小时|全天/.test(text)) {
    return { found: true, start: 0, end: 24, label: '7×24' }
  }
  const m = text.match(/(\d{1,2})[:：](\d{2})\s*[–\-—~至到]\s*(\d{1,2})[:：](\d{2})/)
  if (!m) return { found: false, start: null, end: null, label: '未标注客服时段' }
  const start = Number(m[1]) + Number(m[2]) / 60
  const end = Number(m[3]) + Number(m[4]) / 60
  return {
    found: true,
    start,
    end,
    label: `${pad(m[1])}:${m[2]}–${pad(m[3])}:${m[4]}`
  }
}

// 用 IANA 时区在参考日期的真实偏移计算，不手写时差。
function offsetHours(timeZone) {
  const date = new Date(REFERENCE_DATE)
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  const parts = {}
  for (const p of dtf.formatToParts(date)) if (p.type !== 'literal') parts[p.type] = p.value
  let hour = Number(parts.hour)
  if (hour === 24) hour = 0
  const asUTC = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), hour, Number(parts.minute))
  return Math.round(((asUTC - date.getTime()) / 3600000) * 10) / 10
}

function computeTimezone(service, market) {
  const offset = offsetHours(market.timeZone)
  const shift = 8 - offset
  const peakCells = Array(24).fill(false)
  const segments = []
  for (const w of market.peak) {
    const s = w.start + shift
    const e = w.end + shift
    for (let h = Math.floor(s); h < Math.ceil(e); h++) peakCells[((h % 24) + 24) % 24] = true
    if (e <= 24) segments.push([s, e])
    else {
      segments.push([s, 24])
      segments.push([0, e - 24])
    }
  }
  let coverage = 0
  if (service.found) {
    for (const [s, e] of segments) {
      coverage += Math.max(0, Math.min(e, service.end) - Math.max(s, service.start))
    }
  }
  const ratio = Math.min(1, coverage / market.peakHours)
  const coveredCells = peakCells.map(
    (isPeak, h) => isPeak && service.found && h >= service.start && h + 1 <= service.end
  )
  const level = !service.found ? 'high' : ratio >= 0.7 ? 'ok' : ratio >= 0.35 ? 'mid' : 'high'
  return {
    found: service.found,
    service,
    offset,
    shift,
    peakCells,
    coveredCells,
    coverage: Math.round(coverage * 10) / 10,
    ratio,
    level,
    peakWindow: market.overnightWindow,
    peakTotal: market.peakHours,
    statusLabel:
      level === 'ok' ? '覆盖' : level === 'mid' ? '部分覆盖' : service.found ? '结构性缺口' : '无法核验'
  }
}

function money(market, cny) {
  return `${market.symbol}${Math.round((cny / market.fx) * 10) / 10}`
}

function buildGaps(profile, market) {
  const code = market.code
  const tz = computeTimezone(parseServiceHours(profile.serviceHours), market)
  const aov = profile.aovCNY ? profile.aovCNY / market.fx : null
  const returnCost = profile.localEntity?.[code] ? market.localReturnCost : market.intlReturnCost
  const reverseRatio = aov ? returnCost / aov : null

  const gaps = []
  const coverHours = Math.round(tz.coverage * 10) / 10
  const support = profile.supportLanguages || ['zh']
  const languageOk = support.includes(market.language)
  const languageGap = !languageOk && tz.level === 'ok'

  gaps.push({
    key: 'tz',
    label: '客服时区覆盖',
    level: languageGap ? 'mid' : tz.level,
    value: languageGap ? '语言缺口' : tz.found ? `${Math.round(tz.ratio * 100)}%` : 'N/A',
    languageGap,
    title: !tz.found
      ? '客服时段没有写在页面上'
      : languageGap
        ? `时段覆盖了，${market.languageName}人工没接上`
        : tz.level === 'ok'
          ? '客服时段覆盖了目标市场的咨询高峰'
          : tz.ratio < 0.5
            ? `${market.name}高峰 ${market.peakHours} 小时，你接住 ${coverHours} 小时`
            : `${market.name}询单高峰只被覆盖了一部分`,
    detail: languageGap
      ? `时段覆盖 ${Math.round(tz.ratio * 100)}%，但排班没有${market.languageName}坐席；${market.legal.label} 与退款沟通仍缺人工授权。`
      : tz.found
        ? `${profile.serviceHours} 与${market.name}高峰 ${market.overnightWindow} 重叠 ${tz.coverage} 小时，覆盖 ${Math.round(tz.ratio * 100)}%${languageOk ? '' : `；排班也没有${market.languageName}坐席`}。`
        : '页面没有标注客服时段，平台与消费者都无法确认何时能获得回应。',
    fix: languageGap
      ? `补 4 小时${market.languageName}人工接力，或把 AI 首响限制在查询类问题，退款与 ${market.legal.label} 转人工。`
      : tz.level === 'ok'
        ? '保持现有排班，按季度复核咨询高峰。'
        : `AI 首响覆盖 ${market.overnightWindow}，人工接力 4 小时；不要在页面上写「7×24」却只放机器人。`,
    tz
  })

  gaps.push({
    key: 'entity',
    label: '退货法人主体',
    level: profile.localEntity?.[code] ? 'ok' : 'high',
    value: profile.localEntity?.[code] ? '本地可送达' : '无本地主体',
    title: profile.localEntity?.[code]
      ? `${market.name}境内有可送达的退货地址`
      : `${market.name}境内没有一个能收退货的主体`,
    detail: profile.localEntity?.[code]
      ? '退货政策页出现本地收货地址，消费者可以按公示路径寄回。'
      : '退货路径的终点写在深圳仓库，页面未出现本地地址或可识别的本地责任主体。',
    fix: profile.localEntity?.[code]
      ? '核对地址是否与退货政策、平台后台、公示页三处一致。'
      : `按 ${market.legal.entityAnchor} 指定本地责任人并公示地址；退货改由本地退货点承接。`
  })

  gaps.push({
    key: 'reverse',
    label: '逆向物流成本',
    level: reverseRatio == null ? 'mid' : reverseRatio >= 0.5 ? 'high' : reverseRatio >= 0.28 ? 'mid' : 'ok',
    value:
      reverseRatio == null
        ? '无客单价'
        : reverseRatio >= 1
          ? `${reverseRatio.toFixed(1)}× 客单价`
          : `${Math.round(reverseRatio * 100)}% 客单价`,
    title: reverseRatio != null && reverseRatio >= 0.5 ? '退货运费接近商品价值' : '退货成本需要计入定价',
    detail: aov
      ? `客单价约 ${money(market, profile.aovCNY)}，单件退运成本约 ${market.symbol}${returnCost}，${
          reverseRatio >= 1 ? `是客单价的 ${reverseRatio.toFixed(1)} 倍` : `占客单价 ${Math.round(reverseRatio * 100)}%`
        }。`
      : '未检出客单价，无法判断退货运费是否超过商品价值。',
    fix:
      reverseRatio != null && reverseRatio >= 0.5
        ? `本地退货点 + 二次销售检测（${market.symbol}${market.localReturnCost}/件起），或对低客单 SKU 改直发不退回。`
        : '把退运成本写入毛利模型，低客单 SKU 优先本地处置。'
  })

  const traceLevel = !profile.dataStatement
    ? 'mid'
    : profile.dataResidency === 'LOCAL' || profile.dataResidency === code
      ? 'ok'
      : 'high'
  gaps.push({
    key: 'trace',
    label: '售后责任可追溯',
    level: traceLevel,
    value: !profile.dataStatement
      ? '未声明'
      : profile.dataResidency === 'LOCAL'
        ? '本地闭环'
        : profile.dataResidency === code
          ? '本地闭环'
          : '数据回传境外',
    title:
      traceLevel === 'high'
        ? '售后工单在本地无法闭环'
        : traceLevel === 'mid'
          ? '售后数据没有存储地声明'
          : '售后数据流向可追溯',
    detail:
      traceLevel === 'high'
        ? `工单与用户数据回传${profile.dataResidency === 'CN' ? '中国' : '境外'}服务器，页面未说明接收方与存储地。`
        : traceLevel === 'mid'
          ? '用户数据表单未说明收集目的、接收方与保存期限。'
          : '售后工单与数据存储地在页面有说明。',
    fix:
      traceLevel === 'ok'
        ? '保留声明并每年复核一次。'
        : '给工单表单补收集目的、接收方与保存期限；跨境回传需补传输依据。'
  })

  gaps.push({
    key: 'sla',
    label: '售后响应承诺',
    level: profile.responseSla ? 'ok' : 'mid',
    value: profile.responseSla ? '有可核验时限' : '未写时限',
    title: profile.responseSla ? '页面有可核验的响应口径' : '响应时限没有写在页面上',
    detail: profile.responseSla
      ? '页面给出了首响与退款时限，平台判责时有据可依。'
      : '页面未给出可核验的首响时限，平台按 24 小时口径判责。',
    fix: profile.responseSla ? '保持公示口径与工单 SLA 一致。' : '公示首响与退款时限，并接工单 SLA 计时。'
  })

  return { gaps, tz, aov, returnCost, reverseRatio }
}

function buildJudgment(profile, market, s, tz, gaps) {
  const gap = gaps.find((g) => g.level === 'high') || gaps.find((g) => g.level === 'mid') || gaps[0]
  const rootHeavy = s.root - s.contract >= 18
  const contractHeavy = s.contract - s.root >= 18
  const phrase = profile.signaturePhrase ? `「${profile.signaturePhrase}」` : '这类长期承诺'
  const days = profile.returnDays

  let main = ''
  let marketLine = ''
  const entityOk = Boolean(profile.localEntity?.[market.code])
  const required = market.legal.withdrawalDays
  const windowOk = required == null ? days != null : days != null && days >= required

  if (rootHeavy) {
    main = '你的品牌叙事中「根源情怀」信号显著强于「契约边界」。'
    if (entityOk) {
      marketLine = windowOk
        ? `在${market.name}市场，${phrase}这类承诺有本地主体承接；下一步是让 ${market.legal.expectation}，与售后记录互相对得上。`
        : `在${market.name}市场，${phrase}这类承诺有本地主体承接，但${days != null ? `${days} 天退货窗口` : '页面没有可查的退货窗口'}没有达到 ${market.legal.label} 的要求。`
    } else {
      marketLine = `在${market.name}市场，${phrase}这类承诺必须先落成可执行的「${market.legal.core}」与一个能被找到的本地主体，否则平台规则和消费者都会判定为不可依赖。`
    }
  } else if (contractHeavy) {
    main = '你的品牌叙事中「契约边界」信号强于「根源情怀」。语气不是问题，条款能不能执行才是。'
    if (entityOk) {
      marketLine = windowOk
        ? `在${market.name}市场，条款密度是准入语言；本地主体与退货窗口都在，剩下的是 ${market.legal.expectation}，以及例外品类。`
        : `在${market.name}市场，条款密度是准入语言；本地主体已经在，但${days != null ? `退货窗口只有 ${days} 天` : '退货窗口没有写'}，低于 ${market.legal.label}。`
    } else {
      marketLine = windowOk
        ? `在${market.name}市场，条款密度是准入语言；但退货终点不在本地，条款越完整，越像一份无法执行的合同。`
        : `在${market.name}市场，条款密度是准入语言；但${days != null ? `退货窗口只有 ${days} 天` : '页面没有退货窗口'}，低于 ${market.legal.label}。`
    }
  } else {
    main = '你的品牌叙事中「根源情怀」与「契约边界」强度接近，判断不依赖语气，取决于条款能否落地。'
    marketLine = entityOk
      ? `在${market.name}市场，语气不是变量；${market.legal.label}、本地地址与售后记录才是。`
      : `在${market.name}市场，语气不是变量；${market.legal.label} 与一个能被找到的本地退货主体才是。`
  }

  let consequence = ''
  if (gap.key === 'tz') {
    consequence = gap.languageGap
      ? `同时，时段覆盖不等于语言覆盖：排班没有${market.languageName}坐席，${market.legal.label} 与退款沟通仍无人承接。`
      : tz.found
        ? `同时，${profile.serviceHours} 只覆盖${market.name}咨询高峰的 ${Math.round(tz.ratio * 100)}%，${market.overnightWindow}的询单无人承接。`
        : `同时，页面没有标注客服时段，${market.name}高峰 ${market.overnightWindow} 的询单无人承接。`
  } else if (gap.key === 'entity') {
    consequence = `同时，退货路径的终点在深圳仓库，${market.name}境内没有可送达的责任主体。`
  } else if (gap.key === 'reverse') {
    consequence = `同时，单件商品约 ${money(market, profile.aovCNY)}，退运成本约 ${market.symbol}${profile.localEntity?.[market.code] ? market.localReturnCost : market.intlReturnCost}，退货在成本上不成立。`
  } else if (gap.key === 'trace') {
    consequence = `同时，售后工单与用户数据回传中国，${market.name}境内无法闭合处理记录。`
  } else {
    consequence = `同时，页面没有可核验的响应时限，平台按 24 小时口径判责，${market.name}的夜间询单先触发限流。`
  }

  return {
    main,
    marketLine,
    consequence,
    gap,
    confidence: Math.min(0.92, 0.66 + (profile.signalHits?.length || 0) * 0.012),
    axes: AXES.map((axis) => ({
      ...axis,
      leftScore: s[axis.leftKey],
      rightScore: s[axis.rightKey]
    }))
  }
}

function buildClaims(profile, market) {
  const claims = []
  const add = (layer, text, sources, severity) => claims.push({ layer, text, sources, severity })
  const days = profile.returnDays
  const claimsList = profile.productClaims || []
  const absolute = claimsList.filter((c) => /100%|军工|最|绝对|永久|医用级|第一/.test(c))

  if (market.code === 'DE') {
    if (days == null) {
      add('04', '未检出退换货政策页。德国远程销售合同默认适用 14 天法定撤回权，缺少政策页本身即构成信息义务缺口。', ['bgb355'], 'high')
    } else if (days < 14) {
      add(
        '04',
        `退换货政策把上限写成 ${days} 天，低于德国法定 14 天撤回权；页面未声明店铺政策不减损法定权利。`,
        ['bgb355', 'amazon_odr'],
        'high'
      )
    } else {
      add(
        '04',
        `退换货政策给出 ${days} 天窗口，长于德国法定 14 天；但撤回权的起算点、例外情形与撤回表单未在页面出现。`,
        ['bgb355'],
        'mid'
      )
    }
    if (!profile.localEntity?.DE) {
      add(
        '04',
        '退货路径终点为深圳仓库，德国境内无可识别的收货主体与地址；消费者行使撤回权时缺少可送达对象，平台纠纷通常按卖家败诉处理。',
        ['ddg5', 'bgb355'],
        'high'
      )
      add(
        '02',
        '商品页未公示欧盟责任人（名称与地址）。GPSR 自 2024-12-13 起按责任人信息做上架核验，非欧盟卖家是重点抽查对象。',
        ['gpsr'],
        'high'
      )
    }
    if (!profile.packagingRegistered) {
      add(
        '03',
        '页面未出现 LUCID 包装登记号。德国包装法要求首次投放包装的生产者注册，平台与海关按登记号核验，缺失通常先触发下架。',
        ['verpackg'],
        'high'
      )
    }
    if (absolute.length) {
      add(
        '02',
        `「${absolute.slice(0, 2).join('」「')}」等绝对化表述缺少可核验依据，在德国构成误导性商业行为；平台功效审核会先行拦截。`,
        ['uwg5'],
        'high'
      )
    } else {
      add('02', '产品页的功效表述未附测试报告编号或检测机构，德国竞争法下需能证明陈述的真实性。', ['uwg5'], 'mid')
    }
    if (!(profile.paymentMethods || []).some((p) => /SEPA|账单|Lastschrift|Rechnung/i.test(p))) {
      add(
        '01',
        '结算页仅列信用卡与 PayPal。德国账单支付与 SEPA 直接借记占相当比例，支付方式缺口会转化为弃购与拒付，而弃购成本不进售后账。',
        ['ehi_pay'],
        'mid'
      )
    }
  } else if (market.code === 'US') {
    add(
      '04',
      '商品页未公示发货时限。FTC 邮购规则要求在未声明时按 30 天内发货；延迟须提供取消与全额退款选项。',
      ['ftc4352'],
      profile.responseSla ? 'mid' : 'high'
    )
    if (profile.localEntity?.US) {
      add(
        '04',
        '退货地址已落在加州，但退款时限与退货地址未同页公示；加州民法典 §1723 的披露要求仍不完整。',
        ['cal1723'],
        'mid'
      )
    } else {
      add(
        '04',
        '退货地址在深圳，美国境内没有可送达的退货地址。加州民法典 §1723 下，消费者可保留商品并取得退款。',
        ['cal1723'],
        'high'
      )
    }
    if (profile.responseSla) {
      add(
        '03',
        '7×24 首响满足平台 24 小时口径，但夜班为 AI 首响，退款与换货授权仍按北京时间处理，账号健康指标之外存在二次投诉风险。',
        ['amazon_msg'],
        'mid'
      )
    } else {
      add('03', '平台要求 24 小时内回复买家消息，你的排班无法覆盖美东 22:00–06:00；响应率会先于合规问题触发限流。', ['amazon_msg'], 'high')
    }
    add('03', '结算页未说明各州销售税代收。Wayfair 案后经济关联门槛触发代收义务，税负未计入定价。', ['wayfair'], 'mid')
    if (absolute.length) {
      add('02', `「${absolute.slice(0, 2).join('」「')}」等表述未附检测机构与报告编号，FTC §5 下需有可核验依据。`, ['ftc5'], 'high')
    } else {
      add('02', '「食品级材质」等表述未附检测机构与报告编号，FTC §5 要求功效声明具备可核验依据。', ['ftc5'], 'mid')
    }
    add(
      '01',
      '退货政策页缺少英文摘要与配送预期，消费者在支付前无法确认退货与到货口径，弃购成本被算进获客成本。',
      ['baymard'],
      'mid'
    )
  } else if (market.code === 'JP') {
    if (days == null) {
      add('04', '未检出返品特约。特商法下未约定返品时，消费者可在收货后 8 天内自费退货；缺少表记即缺少可执行边界。', ['tokushoho_return'], 'high')
    } else if (days < 8) {
      add(
        '04',
        `返品特约只写 ${days} 天，低于特商法未约定时的 8 天口径；页面也未写明退货运费由谁承担。`,
        ['tokushoho_return'],
        'high'
      )
    } else {
      add('04', `返品特约给出 ${days} 天，但未写明退货条件、运费承担与退回地址；特商法表记仍不完整。`, ['tokushoho'], 'mid')
    }
    if (!profile.localEntity?.JP) {
      add(
        '04',
        '退货路径终点为深圳仓库，日本境内没有可查的住所与退货地址。特商法要求以易读方式公示事业者名称、住所、电话与返品条件。',
        ['tokushoho'],
        'high'
      )
    }
    if (absolute.length) {
      add('02', `「${absolute.slice(0, 2).join('」「')}」等绝对化表述缺少客观依据，在日本构成景表法上的优良误认。`, ['keihyo'], 'high')
    } else {
      add('02', '产品页的功效表述未附检测报告或客观依据，景表法下需能证明“优于实际”的陈述。', ['keihyo'], 'mid')
    }
    add('03', '隐私政策未说明个人信息的利用目的与第三方提供对象；APPI 要求特定或已公开利用目的。', ['appi'], 'mid')
    if (!(profile.supportLanguages || []).includes('ja')) {
      add('01', '客服时段覆盖日本高峰，但排班没有日语坐席；日语询单进入中文排班，返品与退款沟通被延迟。', ['tokushoho'], 'mid')
    } else {
      add('01', '页面未说明售价是否含日本消费税（JCT）；跨境卖家需确认注册与代收安排。', ['jct'], 'mid')
    }
  } else if (market.code === 'UK') {
    if (days == null) {
      add('04', '未检出取消权条款。英国远程合同默认适用 14 天取消权，缺少条款即构成合同前信息缺口。', ['ccr2013'], 'high')
    } else if (days < 14) {
      add(
        '04',
        `退换货政策把窗口写成 ${days} 天，低于 CCR 2013 的 14 天取消权；页面未声明店铺政策不减损法定权利。`,
        ['ccr2013'],
        'high'
      )
    } else {
      add('04', `退换货政策给出 ${days} 天窗口，但取消表单、退款时限与退货地址未在同页出现。`, ['ccr2013'], 'mid')
    }
    if (!profile.localEntity?.UK) {
      add(
        '04',
        '退货地址在深圳，英国境内没有可送达的退货地址。CCR 2013 要求提供退货地址，否则消费者可延迟退回且风险由卖家承担。',
        ['ccr2013'],
        'high'
      )
    }
    if (absolute.length) {
      add('02', `「${absolute.slice(0, 2).join('」「')}」等表述缺少可核验依据，在英国构成 CPRs 2008 下的误导性商业行为。`, ['cprs'], 'high')
    } else {
      add('02', '产品页的功效表述未附检测机构与报告编号，英国 CPRs 2008 下需能证明陈述的真实性。', ['cprs'], 'mid')
    }
    if (!profile.packagingRegistered) {
      add('03', '页面未提供英国包装 EPR 注册信息。平台与合规审核按生产者责任核验，缺失会先卡住上架。', ['ukepr'], 'mid')
    }
    if (!(profile.supportLanguages || []).includes('en')) {
      add('01', '客服排班没有英语坐席；英国消费者在取消权与退款沟通上会直接进入中文流程。', ['ccr2013'], 'mid')
    } else {
      add('01', '隐私政策沿用欧盟模板，但未写英国代表与 ICO 投诉路径；UK GDPR 的告知义务不完整。', ['ukgdpr'], 'mid')
    }
  } else if (market.code === 'FR') {
    if (days == null) {
      add('04', '未检出撤回权条款。法国远程合同默认适用 14 天撤回权，缺少条款即构成合同前信息缺口。', ['fr_l221_18'], 'high')
    } else if (days < 14) {
      add(
        '04',
        `退换货政策把窗口写成 ${days} 天，低于 L221-18 的 14 天撤回权；页面未声明店铺政策不减损法定权利。`,
        ['fr_l221_18'],
        'high'
      )
    } else {
      add('04', `退换货政策给出 ${days} 天窗口，但撤回表单、起算点与退回地址未在同页出现。`, ['fr_l221_18'], 'mid')
    }
    if (!profile.localEntity?.FR) {
      add(
        '04',
        '退货地址在深圳，法国境内没有可送达的退货主体。消费者行使 14 天撤回权时缺少本地收件人，纠纷通常按卖家败诉处理。',
        ['fr_l221_18'],
        'high'
      )
    }
    if (!profile.packagingRegistered) {
      add('03', '包装与商品页未出现 Triman / Info-tri 分类标识。AGEC 法要求生产者提供统一分类信息，平台审核会核验。', ['triman'], 'high')
    }
    if (absolute.length) {
      add('02', `「${absolute.slice(0, 2).join('」「')}」等绝对化表述缺少依据，在法国构成 L121-1 下的欺骗性商业行为。`, ['fr_l121_1'], 'high')
    } else {
      add('02', '产品页的功效表述未附检测报告，法国消费者法要求可验证的客观依据。', ['fr_l121_1'], 'mid')
    }
    if (!(profile.supportLanguages || []).includes('fr')) {
      add('01', '客服排班没有法语坐席；法国消费者的撤回与退款沟通会落到中文流程。', ['fr_l221_18'], 'mid')
    } else {
      add('01', '隐私政策未提供法语版本与 CNIL 投诉路径；RGPD 要求以清晰易懂的语言告知。', ['dsgvo13'], 'mid')
    }
  } else if (market.code === 'AU') {
    add(
      '04',
      days != null
        ? `页面把退货写成 ${days} 天无理由，但未区分 ACL 法定保障（瑕疵、与描述不符）与自愿退货；混写会让消费者主张无上限。`
        : '未检出退货与退款路径。ACL 法定保障独立于商家政策，缺少公示会让消费者直接走 ACCC 投诉。',
      ['acl64', 'accc_returns'],
      'high'
    )
    if (!profile.localEntity?.AU) {
      add(
        '04',
        '退货地址在深圳，澳洲境内没有可送达的退货地址。ACCC 指引要求购买前清晰展示退货地址与救济流程。',
        ['accc_returns'],
        'high'
      )
    }
    if (absolute.length) {
      add('02', `「${absolute.slice(0, 2).join('」「')}」等表述缺少可核验依据，在澳洲构成 ACL s18 下的误导性行为。`, ['acl18'], 'high')
    } else {
      add('02', '产品页的功效表述未附检测报告，ACL s18 下需能证明陈述不会误导消费者。', ['acl18'], 'mid')
    }
    add('03', '售价未说明是否含 10% GST，也未说明低价值进口商品的代收安排；税负在结算后才被追溯。', ['gst'], 'mid')
    if (!(profile.supportLanguages || []).includes('en')) {
      add('01', '客服排班没有英语坐席；澳洲消费者的退货与退款沟通会落回中文流程。', ['accc_returns'], 'mid')
    } else {
      add('01', '隐私政策未覆盖 Australian Privacy Principles 第 5 条的通知义务；售后工单的收集目的与披露对象缺失。', ['au_privacy'], 'mid')
    }
  }
  return claims.map((c, i) => ({ ...c, id: `claim-${i + 1}` }))
}

function buildActions(profile, market, gaps) {
  const byKey = Object.fromEntries(gaps.map((g) => [g.key, g]))
  const actions = []
  const push = (tier, title, detail, cost, owner, window, gapKey) =>
    actions.push({ tier, title, detail, cost, owner, window, gapKey })

  if (market.code === 'DE') {
    if (profile.returnDays != null && profile.returnDays < 14) {
      push(1, '把「7 天无理由」升级为 14 天法定撤回权', '替换退换货政策页，附撤回表单与期限起算说明；店铺政策不能减损法定权利。', '€0–180', '合规文案 / 律师复核', '0–7 天', 'legal')
    } else {
      push(1, '在政策页写清 14 天撤回权的起算与例外', '补充撤回期限起算点、例外品类与撤回表单入口，避免条款完整但不可执行。', '€0–180', '合规文案 / 律师复核', '0–7 天', 'legal')
    }
    if (byKey.entity.level !== 'ok') {
      push(1, '指定 EU 责任人并补全 Impressum 与 GPSR 责任人', '取得可公示的本地名称与地址，同步到政策页、商品页、Impressum 三处。', '€120/月', '属地法人服务', '5 个工作日', 'entity')
    }
    if (byKey.tz.level !== 'ok') {
      const isLanguage = byKey.tz.languageGap
      push(
        1,
        isLanguage ? '补 4 小时德语人工授权' : '德语夜间客服接力：AI 首响 + 4 小时人工',
        isLanguage
          ? '保留 AI 首响，退款、撤回权与投诉转德语人工，每天 4 小时重叠。'
          : `覆盖 ${market.overnightWindow} 的咨询高峰，首响 SLA 设 3 分钟。`,
        '€600–900/月',
        '本地客服外包',
        isLanguage ? '1 周' : '2 周',
        'tz'
      )
    }
    if (byKey.reverse.level !== 'ok') {
      push(2, '德国本地退货点 + 二次销售检测', '把跨境退运 €32/件降为本地入库 €12/件，按 A/B/C 级处置。', '€12/件起', '海外仓 / 逆向物流', '10 天', 'reverse')
    }
    if (!profile.packagingRegistered) {
      push(2, 'LUCID 包装注册与年度申报', '按材质拆分包装重量并注册，把登记号写入商品页与平台合规栏。', '€290 + €40/年', '合规代办', '3–5 个工作日', 'packaging')
    }
    if (!(profile.paymentMethods || []).some((p) => /SEPA|账单|Lastschrift|Rechnung/i.test(p))) {
      push(3, '补齐 SEPA 直接借记与账单支付', '按 PSP 报价接入，优先覆盖高客单 SKU 的账单支付。', '按 PSP 报价', '支付服务商', '30 天以上', 'legal')
    }
    if (byKey.trace.level !== 'ok') {
      push(3, '补工单表单的数据流向声明', '写清收集目的、接收方与保存期限；跨境回传补传输依据。', '€1,800 或 1 人日', '数据合规', '30 天以上', 'trace')
    }
  } else if (market.code === 'US') {
    push(1, '公示 30 天发货承诺与延迟处理选项', '在商品页与结算页写明发货时限；无法按时发货时提供取消与全额退款入口。', '$0–200', '运营 / 合规文案', '0–7 天', 'legal')
    if (byKey.tz.level !== 'ok') {
      push(1, '美东时段值守：22:00–06:00 AI 首响 + 英语人工', '人工班次覆盖 22:00–02:00，其余时段首响加次日回呼。', '$520–780/月', '本地客服外包', '2 周', 'tz')
    }
    if (byKey.entity.level !== 'ok') {
      push(1, '补加州境内退货地址与退款时限', '取得可公示的本地退货地址，退款时限写进政策页与平台后台。', '$4.5/件 + $90/月', '海外仓', '7–10 天', 'entity')
    }
    if (byKey.reverse.level !== 'ok') {
      push(2, '海外仓退货检测与二次销售', '本地入库、分级检测，A 级品重新上架，C 级品留销毁凭证。', '$4.5/件起', '海外仓 / 逆向物流', '7–10 天', 'reverse')
    }
    push(2, '各州销售税代收配置', '按经济关联门槛标记代收州，接平台或 PSP 的税率配置。', '$0–45/月', '税务合规', '1 周', 'tax')
    push(3, '功效声明审校，删除无法核验的绝对化表述', '逐条要求测试报告编号或改为安全表述。', '$0.06/词', '本地化内容审校', '5 个工作日', 'legal')
    if (byKey.trace.level !== 'ok') {
      push(3, '工单数据本地闭环与存储地声明', '工单设美国区域存储，补隐私政策与审计日志。', '$1,200', '数据合规', '2–3 周', 'trace')
    }
  } else if (market.code === 'JP') {
    push(
      1,
      profile.returnDays != null && profile.returnDays < 8 ? '把返品特约补到 8 天并写明运费承担' : '补全特商法表记与返品特约',
      '事业者名称、住所、电话、交付时间、返品条件与运费承担同页公示，附日文版本。',
      '¥0–30,000',
      '日语文案 / 律师复核',
      '0–7 天',
      'legal'
    )
    if (byKey.entity.level !== 'ok') {
      push(1, '指定日本境内事业者住所与退货地址', '取得可公示的日本地址与电话，接入本地退货点，同步到特商法表记页。', '¥18,000/月', '属地法人服务', '5 个工作日', 'entity')
    }
    if (byKey.tz.level !== 'ok') {
      const isLanguage = byKey.tz.languageGap
      push(
        1,
        isLanguage ? '补 4 小时日语人工授权' : '日语时段值守：AI 首响 + 人工接力',
        isLanguage
          ? '时段已经覆盖，补日语坐席处理返品、退款与投诉，不要用中文排班兜底。'
          : `覆盖 ${market.overnightWindow} 的咨询高峰，首响 SLA 设 3 分钟。`,
        '¥90,000–140,000/月',
        '本地客服外包',
        isLanguage ? '1 周' : '2 周',
        'tz'
      )
    }
    if (byKey.reverse.level !== 'ok') {
      push(2, '日本本地退货点与二次销售检测', '把跨境退运 ¥2,800/件降为本地入库 ¥900/件，按 A/B/C 级处置。', '¥900/件起', '海外仓 / 逆向物流', '10 天', 'reverse')
    }
    push(2, 'JCT 注册与含税价公示', '确认课税事业者身份，在商品页标明售价是否含消费税。', '¥0–50,000', '税务代理', '2 周', 'tax')
    if (byKey.trace.level !== 'ok') {
      push(3, '补 APPI 利用目的与第三方提供说明', '在工单表单与隐私政策写清利用目的、提供对象与保存期限。', '¥80,000 或 1 人日', '数据合规', '30 天以上', 'trace')
    }
  } else if (market.code === 'UK') {
    push(
      1,
      profile.returnDays != null && profile.returnDays < 14 ? '把取消权窗口补到 14 天并附取消表单' : '补全 14 天取消权的起算与表单',
      '按 CCR 2013 写明起算点、取消方式、退款时限；店铺政策不能减损法定权利。',
      '£0–160',
      '合规文案 / 律师复核',
      '0–7 天',
      'legal'
    )
    if (byKey.entity.level !== 'ok') {
      push(1, '补英国退货地址与本地责任人', '取得可公示的英国退货地址，写进政策页与平台后台。', '£90/月 + £9/件', '属地法人服务', '5 个工作日', 'entity')
    }
    if (byKey.tz.level !== 'ok') {
      const isLanguage = byKey.tz.languageGap
      push(
        1,
        isLanguage ? '补 4 小时英语人工授权' : '英国时段客服：17:00–01:00 AI 首响 + 英语人工',
        isLanguage
          ? '时段已经覆盖，补英语坐席处理取消、退款与投诉。'
          : `覆盖 ${market.overnightWindow} 的咨询高峰，首响 SLA 设 3 分钟。`,
        '£520–780/月',
        '本地客服外包',
        isLanguage ? '1 周' : '2 周',
        'tz'
      )
    }
    if (byKey.reverse.level !== 'ok') {
      push(2, '英国本地退货点与二次销售检测', '英国境内入库、分级检测，避免每单跨境退运。', '£9/件起', '海外仓 / 逆向物流', '10 天', 'reverse')
    }
    if (!profile.packagingRegistered) {
      push(2, '英国包装 EPR 注册与申报', '按材质申报包装数据，取得生产者责任登记信息并写入平台合规栏。', '£180 + £60/年', '合规代办', '10 个工作日', 'packaging')
    }
    if (byKey.trace.level !== 'ok') {
      push(3, '补 UK GDPR 告知与 ICO 投诉路径', '隐私政策补英国代表、处理目的与投诉路径。', '£900 或 1 人日', '数据合规', '30 天以上', 'trace')
    }
  } else if (market.code === 'FR') {
    push(
      1,
      profile.returnDays != null && profile.returnDays < 14 ? '把撤回权窗口补到 14 天并附撤回表单' : '补全 14 天撤回权的起算与表单',
      '按 L221-18 写明起算点、撤回方式、退款时限；同步法语版本。',
      '€0–180',
      '法语合规文案 / 律师复核',
      '0–7 天',
      'legal'
    )
    if (byKey.entity.level !== 'ok') {
      push(1, '补法国退货地址与本地责任人', '取得可公示的法国退货地址，写进政策页与平台后台。', '€120/月 + €11/件', '属地法人服务', '5 个工作日', 'entity')
    }
    if (byKey.tz.level !== 'ok') {
      const isLanguage = byKey.tz.languageGap
      push(
        1,
        isLanguage ? '补 4 小时法语人工授权' : '法语夜间客服接力',
        isLanguage
          ? '时段已经覆盖，补法语坐席处理撤回、退款与投诉。'
          : `覆盖 ${market.overnightWindow} 的咨询高峰，首响 SLA 设 3 分钟。`,
        '€600–900/月',
        '本地客服外包',
        isLanguage ? '1 周' : '2 周',
        'tz'
      )
    }
    if (byKey.reverse.level !== 'ok') {
      push(2, '法国本地退货点与二次销售检测', '法国境内入库、分级检测，避免每单跨境退运。', '€11/件起', '海外仓 / 逆向物流', '10 天', 'reverse')
    }
    if (!profile.packagingRegistered) {
      push(2, 'Triman / Info-tri 标识与包装申报', '按品类补分类标识，完成包装申报并更新商品页。', '€240 + €40/年', '合规代办', '10 个工作日', 'packaging')
    }
    if (byKey.trace.level !== 'ok') {
      push(3, '补 RGPD 法语告知与 CNIL 路径', '隐私政策补法语版本、处理目的与投诉路径。', '€1,200 或 1 人日', '数据合规', '30 天以上', 'trace')
    }
  } else if (market.code === 'AU') {
    push(1, '把自愿退货与 ACL 法定保障分开写', '明确瑕疵、与描述不符走 ACL 保障，自愿退货另列条件；不要用一句“7 天无理由”混写。', 'A$0–250', '合规文案 / 律师复核', '0–7 天', 'legal')
    if (byKey.entity.level !== 'ok') {
      push(1, '补澳洲境内退货地址与退款流程', '取得可公示的澳洲退货地址，写清检测、退款与换货路径。', 'A$80/月 + A$9/件', '海外仓', '7–10 天', 'entity')
    }
    if (byKey.tz.level !== 'ok') {
      const isLanguage = byKey.tz.languageGap
      push(
        1,
        isLanguage ? '补 4 小时英语人工授权' : '澳洲时段客服：06:00–14:00 AI 首响 + 英语人工',
        isLanguage
          ? '时段已经覆盖，补英语坐席处理退货与 ACL 救济。'
          : `覆盖 ${market.overnightWindow} 的咨询高峰，首响 SLA 设 3 分钟。`,
        'A$480–720/月',
        '本地客服外包',
        isLanguage ? '1 周' : '2 周',
        'tz'
      )
    }
    if (byKey.reverse.level !== 'ok') {
      push(2, '澳洲本地退货点与二次销售检测', '澳洲境内入库、分级检测，避免每单跨境退运。', 'A$9/件起', '海外仓 / 逆向物流', '10 天', 'reverse')
    }
    push(2, 'GST 注册与含税价公示', '按低价值进口商品门槛确认代收义务，在结算前标明含税。', 'A$0–300', '税务合规', '1 周', 'tax')
    if (byKey.trace.level !== 'ok') {
      push(3, '补 APP 5 收集通知与披露对象', '在工单表单与隐私政策写清收集目的、披露对象与保存期限。', 'A$900 或 1 人日', '数据合规', '30 天以上', 'trace')
    }
  }
  return actions
}

export function analyze(profile, marketCode) {
  const market = MARKETS[marketCode]
  const s = profile.signals
  const { gaps, tz } = buildGaps(profile, market)
  const judgment = buildJudgment(profile, market, s, tz, gaps)
  const claims = buildClaims(profile, market)
  const actions = buildActions(profile, market, gaps)
  const activeGapKeys = [
    ...gaps.filter((g) => g.level === 'high').map((g) => g.key),
    ...gaps.filter((g) => g.level === 'mid').map((g) => g.key),
    'legal'
  ]
  const resources = pickResources(marketCode, activeGapKeys)

  // 全市场热力图
  const heat = buildHeatmap(profile)

  return {
    profile,
    market,
    marketCode,
    scores: s,
    judgment,
    tz,
    gaps,
    heat,
    claims,
    actions,
    resources,
    sourceCount: new Set(claims.flatMap((c) => c.sources)).size,
    analysisTime: new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date())
  }
}

export function buildHeatmap(profile) {
  const rows = [
    { key: 'tz', label: '客服时区覆盖' },
    { key: 'entity', label: '退货法人主体' },
    { key: 'reverse', label: '逆向物流成本' },
    { key: 'trace', label: '售后责任可追溯' },
    { key: 'sla', label: '售后响应承诺' }
  ]
  const perMarket = {}
  for (const code of Object.keys(MARKETS)) {
    perMarket[code] = buildGaps(profile, MARKETS[code]).gaps
  }
  return rows.map((row) => ({
    ...row,
    cells: Object.keys(MARKETS).map((code) => ({
      market: code,
      gap: perMarket[code].find((g) => g.key === row.key)
    }))
  }))
}

const ADDRESS_HINTS = {
  DE: /德国|Deutschland|Berlin|Hamburg|München|Frankfurt|Köln/,
  US: /美国|USA|United States|California|加州|Los Angeles|Ontario|New York|Delaware/,
  JP: /日本|Japan|Tokyo|Osaka|東京|大阪/,
  UK: /英国|UK|United Kingdom|London|Manchester|Birmingham/,
  FR: /法国|France|Paris|Lyon|Marseille/,
  AU: /澳大利亚|澳洲|Australia|Sydney|Melbourne|Brisbane/
}

const LANGUAGE_HINTS = [
  ['ja', /日语|日本語|Japanese/],
  ['de', /德语|Deutsch|German/],
  ['fr', /法语|français|French/],
  ['en', /英语|English/]
]

export function buildProfileFromText(text, marketCode) {
  const { signals, hits } = scoreFromHits(text)
  const daysMatch = text.match(/(\d{1,3})\s*天/)
  const serviceRaw = (text.match(/[^\n。；]{0,18}(?:客服|服务时间|工作时间)[^\n。；]{0,30}/) || [])[0] || ''
  const aovMatch = text.match(/(?:客单价|均价|售价)[^\d]{0,6}(\d{2,6})/)
  const rootHit = hits.find((h) => h.key === 'root')
  const languages = LANGUAGE_HINTS.filter(([, re]) => re.test(text)).map(([code]) => code)
  let signature = ''
  if (rootHit) {
    const clauses = text.split(/[，。；！？\n]/).map((s) => s.trim()).filter(Boolean)
    const scored = clauses
      .filter((c) => c.length <= 22)
      .map((c) => ({ c, n: LEXICON.root.reduce((sum, w) => sum + (c.includes(w) ? 1 : 0), 0) }))
      .sort((a, b) => b.n - a.n)
    signature = scored[0]?.n ? scored[0].c : ''
  }
  return {
    id: 'C-01',
    name: '自定义店铺文本',
    nameEn: 'CUSTOM INPUT',
    category: '未标注品类',
    url: '',
    defaultMarket: marketCode,
    sourcePages: '粘贴文本',
    brandNarrative: text,
    serviceHours: serviceRaw || '',
    returnDays: daysMatch ? Number(daysMatch[1]) : null,
    returnText: text,
    localEntity: Object.fromEntries(Object.keys(MARKETS).map((code) => [code, ADDRESS_HINTS[code].test(text)])),
    packagingRegistered: /LUCID|VerpackG|包装登记|EPR|Triman|Info-tri|包装申报/.test(text),
    dataStatement: /隐私|Datenschutz|privacy|数据声明/i.test(text),
    dataResidency: /数据(存储|存放)?在?(本地|当地)|本地服务器|local data/i.test(text) ? 'LOCAL' : 'CN',
    responseSla: /24\s*小时|24h|SLA|首响/.test(text),
    paymentMethods: ['SEPA', 'PayPal', '信用卡', 'Apple Pay', '账单'].filter((p) => text.includes(p)),
    supportLanguages: languages.length ? languages : ['zh'],
    aovCNY: aovMatch ? Number(aovMatch[1]) : null,
    productClaims: ['100%', '军工级', '绝对', '永久', '第一', '最高级', '国家级'].filter((w) => text.includes(w)),
    signals,
    signaturePhrase: signature || '',
    signalHits: hits
  }
}

export function presetToProfile(preset, marketCode) {
  const text = [preset.brandNarrative, preset.returnText, (preset.productClaims || []).join('，')].join(' ')
  const hits = findHits(text, Object.keys(LEXICON))
  return {
    ...preset,
    defaultMarket: marketCode || preset.defaultMarket,
    signalHits: hits
  }
}
