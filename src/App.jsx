import { useEffect, useMemo, useRef, useState } from 'react'
import { analyze, buildProfileFromText, presetToProfile } from './lib/analyze'
import { enrichResult, extractProfile } from './lib/ai'
import { MARKETS } from './data/markets'
import { PRESETS, SAMPLE_TEXT } from './data/presets'
import Header from './components/Header'
import InputStage from './components/InputStage'
import AnalyzingStage from './components/AnalyzingStage'
import JudgmentSection from './components/JudgmentSection'
import SignalsSection from './components/SignalsSection'
import EvidenceSection from './components/EvidenceSection'
import ActionsSection from './components/ActionsSection'
import ResourceDrawer from './components/ResourceDrawer'

export default function App() {
  const [stage, setStage] = useState('input')
  const [marketCode, setMarketCode] = useState('DE')
  const [profile, setProfile] = useState(null)
  const [result, setResult] = useState(null)
  const [drawer, setDrawer] = useState(null)
  const [ai, setAi] = useState({ status: 'idle', data: null })
  const timer = useRef(null)
  const aiSeq = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  // AI 只做补充；慢或失败时保持规则内容，判断屏不受影响。
  const loadAi = (res) => {
    const seq = ++aiSeq.current
    setAi({ status: 'loading', data: null })
    enrichResult(res).then((next) => {
      if (seq === aiSeq.current) setAi(next)
    })
  }

  const run = (nextProfile, nextMarket) => {
    setProfile(nextProfile)
    setMarketCode(nextMarket)
    setStage('analyzing')
    setAi({ status: 'idle', data: null })
    window.scrollTo(0, 0)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const res = analyze(nextProfile, nextMarket)
      setResult(res)
      setStage('result')
      loadAi(res)
      window.scrollTo(0, 0)
    }, 1250)
  }

  const switchMarket = (code) => {
    if (!profile || code === marketCode) return
    setMarketCode(code)
    const res = analyze(profile, code)
    setResult(res)
    loadAi(res)
  }

  const scrollToActions = () => {
    document.getElementById('actions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToEvidence = () => {
    document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const reset = () => {
    setStage('input')
    setResult(null)
    setProfile(null)
    setDrawer(null)
    aiSeq.current += 1
    setAi({ status: 'idle', data: null })
    window.scrollTo(0, 0)
  }

  const requestExtract = (text, market) => extractProfile(text, market, buildProfileFromText(text, market))

  const activeMarket = useMemo(() => MARKETS[result?.marketCode || marketCode], [result, marketCode])

  return (
    <div className="app">
      <Header
        stage={stage}
        market={stage === 'result' ? result?.market : activeMarket}
        marketCode={result?.marketCode || marketCode}
        onMarket={switchMarket}
        onReset={reset}
        hasResult={stage === 'result'}
      />

      {stage === 'input' && (
        <InputStage
          presets={PRESETS}
          marketCode={marketCode}
          onMarket={setMarketCode}
          onRun={run}
          buildProfileFromText={buildProfileFromText}
          presetToProfile={presetToProfile}
          extractProfile={requestExtract}
          sampleText={SAMPLE_TEXT}
        />
      )}

      {stage === 'analyzing' && <AnalyzingStage profile={profile} market={activeMarket} />}

      {stage === 'result' && result && (
        <main className="result">
          <nav className="sections-nav" aria-label="诊断层级">
            <a href="#verdict">01 判断</a>
            <a href="#signals">02 信号</a>
            <a href="#evidence">03 证据</a>
            <a href="#actions">04 行动</a>
            <span className="nav-tail mono">
              {result.profile.name} / {result.market.nameEn} / {result.analysisTime} CST
            </span>
          </nav>

          <JudgmentSection result={result} onAction={scrollToActions} onEvidence={scrollToEvidence} ai={ai} />
          <SignalsSection result={result} />
          <EvidenceSection result={result} ai={ai} />
          <ActionsSection result={result} onOpenResource={setDrawer} ai={ai} />

          <footer className="page-foot">
            <div className="foot-col">
              <span className="mono">评估边界</span>
              <p>
                条文编号对应真实法规，引文为演示用节选改写，不构成法律意见。官网抓取未接入实时管线，样本以「已抓取的公开文本」形态载入。
                AI 只负责表达与扩展，数字、红灯与法条来自规则引擎；调用失败自动回落规则模式。
              </p>
            </div>
            <div className="foot-col">
              <span className="mono">锚定库</span>
              <p>SOURCES v0.1 · {result.sourceCount} 条来源已绑定 · 每条断言至少 1 条来源</p>
            </div>
            <div className="foot-col">
              <span className="mono">可锚 ANCHOR</span>
              <p>把文化根源翻译成合规信号 · 把售后时区做成红灯 · 每条判断可点回原文</p>
            </div>
          </footer>
        </main>
      )}

      <ResourceDrawer resource={drawer} onClose={() => setDrawer(null)} result={result} />
    </div>
  )
}
