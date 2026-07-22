import { Link } from 'react-router-dom'
import { modules, questions } from '../data/content'
import { latestAttempts, useProgress } from '../context/ProgressContext'

export function LearnPage() {
  const progress = useProgress()
  const latest = latestAttempts(progress.attempts)
  return <div className="page">
    <div className="page-title"><span className="eyebrow">THE LEARNING PATH</span><h1>Zero to hard,<br />one idea at a time.</h1><p>Everything is unlocked. Follow the order or jump straight to the topic you need.</p></div>
    <div className="module-list">{modules.map(module => {
      const moduleQuestions = questions.filter(q => q.moduleId === module.id)
      const done = moduleQuestions.filter(q => latest.get(q.id)?.correct).length
      const pct = Math.round(done / module.questionCount * 100)
      return <Link to={`/module/${module.id}`} className="module-card" key={module.id}>
        <div className="module-index">{String(module.order).padStart(2, '0')}</div>
        <div className="module-card-main"><span className={`category-pill ${module.category}`}>{module.category}</span><h2>{module.title}</h2><p>{module.description}</p><div className="progress-track"><span style={{ width: `${pct}%` }} /></div><small>{done}/{module.questionCount} correct</small></div>
        <span className="module-arrow">→</span>
      </Link>
    })}</div>
  </div>
}
