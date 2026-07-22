import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { modules, questions } from '../data/content'
import { latestAttempts, useProgress } from '../context/ProgressContext'

export function PracticePage() {
  const navigate = useNavigate()
  const progress = useProgress()
  const latest = latestAttempts(progress.attempts)
  const [moduleId, setModuleId] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [status, setStatus] = useState('all')
  const filtered = useMemo(() => questions.filter(question => {
    const attempt = latest.get(question.id)
    return (moduleId === 'all' || question.moduleId === moduleId)
      && (difficulty === 'all' || question.difficulty === Number(difficulty))
      && (status === 'all' || status === 'unseen' && !attempt || status === 'wrong' && attempt?.correct === false || status === 'correct' && attempt?.correct === true)
  }), [moduleId, difficulty, status, latest])
  function start() {
    if (!filtered.length) return
    navigate(`/question/${filtered[Math.floor(Math.random() * filtered.length)].id}`)
  }
  return <div className="page">
    <div className="page-title"><span className="eyebrow">TARGETED PRACTICE</span><h1>Choose what<br />to sharpen.</h1><p>Build a random drill from any topic, level or progress state.</p></div>
    <section className="filter-card">
      <label>Topic<select value={moduleId} onChange={e => setModuleId(e.target.value)}><option value="all">All topics</option>{modules.map(m => <option key={m.id} value={m.id}>{m.shortTitle}</option>)}</select></label>
      <label>Difficulty<select value={difficulty} onChange={e => setDifficulty(e.target.value)}><option value="all">All levels</option>{[1,2,3,4,5].map(level => <option key={level} value={level}>Level {level}</option>)}</select></label>
      <label>Status<select value={status} onChange={e => setStatus(e.target.value)}><option value="all">Any status</option><option value="unseen">Unseen</option><option value="wrong">Needs review</option><option value="correct">Previously correct</option></select></label>
      <div className="filter-result"><strong>{filtered.length}</strong><span>matching questions</span></div>
      <button className="primary-button" onClick={start} disabled={!filtered.length}>Start random question</button>
    </section>
  </div>
}
