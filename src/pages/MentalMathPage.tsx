import { useRef, useState } from 'react'
import { checkMentalAnswer, generateMentalProblem, nextTier } from '../lib/mentalMath'
import { useProgress } from '../context/ProgressContext'
import type { MentalMathTemplate } from '../types'

export function MentalMathPage() {
  const progress = useProgress()
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [tier, setTier] = useState(1)
  const [streak, setStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [problem, setProblem] = useState<MentalMathTemplate>(() => generateMentalProblem(1))
  const [response, setResponse] = useState('')
  const [feedback, setFeedback] = useState<{ correct: boolean; ms: number } | null>(null)
  const startedAt = useRef(performance.now())

  function startSession() {
    setStarted(true); setIndex(0); setTier(1); setStreak(0); setCorrectCount(0); setFeedback(null); setResponse('')
    setProblem(generateMentalProblem(1)); startedAt.current = performance.now()
  }

  async function submit() {
    const correct = checkMentalAnswer(problem, response)
    const ms = performance.now() - startedAt.current
    setFeedback({ correct, ms })
    if (correct) setCorrectCount(n => n + 1)
    await progress.recordMentalResult({ category: problem.category, tier, correct, responseMs: Math.round(ms) })
  }

  function advance() {
    const adaptive = nextTier(tier, streak, feedback?.correct ?? false)
    setTier(adaptive.tier); setStreak(adaptive.streak); setIndex(n => n + 1); setResponse(''); setFeedback(null)
    setProblem(generateMentalProblem(adaptive.tier)); startedAt.current = performance.now()
  }

  if (!started) return <div className="page mental-page"><div className="page-title"><span className="eyebrow">ADAPTIVE WARM-UP</span><h1>Start easy.<br />Finish fast.</h1><p>Twenty generated questions rise with three-question streaks and step back after a miss. Useful methods flash after every answer.</p></div><section className="mental-intro"><div className="bolt">⚡</div><h2>20-question warm-up</h2><ul><li>Arithmetic, fractions and percentages</li><li>Estimation and rapid expected value</li><li>No mandatory timer, but response speed is recorded</li></ul><button className="primary-button" onClick={startSession}>Begin warm-up</button></section></div>

  if (index >= 20) return <div className="page mental-page"><section className="mental-finish"><span className="eyebrow">SESSION COMPLETE</span><h1>{correctCount}/20</h1><p>Accuracy today</p><button className="primary-button" onClick={startSession}>Go again</button></section></div>

  return <div className="page mental-page"><div className="mental-progress"><span>{index + 1}/20</span><div><i style={{ width: `${(index + 1) * 5}%` }} /></div><span>Tier {tier}</span></div><section className="mental-card"><span className="category-pill probability">{problem.category}</span><h1>{problem.prompt}</h1>{!feedback ? <><input autoFocus className="mental-input" inputMode="decimal" value={response} onChange={e => setResponse(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && response.trim()) void submit() }} aria-label="Mental maths answer" /><button className="primary-button" disabled={!response.trim()} onClick={() => void submit()}>Check</button></> : <div className={`mental-feedback ${feedback.correct ? 'correct' : 'incorrect'}`}><span>{feedback.correct ? 'Correct' : 'Answer'}</span><strong>{problem.displayAnswer}</strong><small>{(feedback.ms / 1000).toFixed(1)} seconds</small><div className="method-card"><span>METHOD</span><p>{problem.method}</p></div><button className="primary-button" onClick={advance}>Next →</button></div>}</section></div>
}
