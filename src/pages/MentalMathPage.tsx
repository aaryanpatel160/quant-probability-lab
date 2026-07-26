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

  if (!started) return <div className="page mental-page"><div className="page-title"><span className="eyebrow">LIMITLESS ADAPTIVE PRACTICE</span><h1>Start easy.<br />Keep climbing.</h1><p>Questions continue for as long as you want. Three-question streaks raise the difficulty, while a miss steps it back so the practice stays useful.</p></div><section className="mental-intro"><div className="bolt">⚡</div><h2>Unlimited warm-up</h2><ul><li>Arithmetic, fractions and percentages</li><li>Estimation and rapid expected value</li><li>No question cap or mandatory timer</li><li>Leave at any time; every answer is still recorded</li></ul><button className="primary-button" onClick={startSession}>Start practising</button></section></div>

  const answered = index + (feedback ? 1 : 0)
  const accuracy = answered ? Math.round(correctCount / answered * 100) : 0

  return <div className="page mental-page"><div className="mental-progress"><span>Question {index + 1}</span><div title={`Difficulty tier ${tier} of 5`}><i style={{ width: `${tier * 20}%` }} /></div><span>Tier {tier} · {accuracy}%</span></div><section className="mental-card"><span className="category-pill probability">{problem.category}</span><h1>{problem.prompt}</h1>{!feedback ? <><input autoFocus className="mental-input" inputMode="decimal" value={response} onChange={e => setResponse(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && response.trim()) void submit() }} aria-label="Mental maths answer" /><button className="primary-button" disabled={!response.trim()} onClick={() => void submit()}>Check</button></> : <div className={`mental-feedback ${feedback.correct ? 'correct' : 'incorrect'}`}><span>{feedback.correct ? 'Correct' : 'Answer'}</span><strong>{problem.displayAnswer}</strong><small>{(feedback.ms / 1000).toFixed(1)} seconds · {correctCount}/{answered} correct this run</small><div className="method-card"><span>METHOD</span><p>{problem.method}</p></div><button className="primary-button" onClick={advance}>Next →</button></div>}</section><button className="text-button mental-restart" onClick={startSession}>Restart from easy</button></div>
}
