import { Link, Navigate, useParams } from 'react-router-dom'
import { moduleById, questions } from '../data/content'
import { latestAttempts, useProgress } from '../context/ProgressContext'

export function ModulePage() {
  const { moduleId } = useParams()
  const module = moduleId ? moduleById.get(moduleId) : undefined
  const progress = useProgress()
  if (!module) return <Navigate to="/learn" replace />
  const latest = latestAttempts(progress.attempts)
  const moduleQuestions = questions.filter(q => q.moduleId === module.id)
  return <div className="page module-page">
    <Link to="/learn" className="back-link">← Learning path</Link>
    <header className="module-header"><span className="module-number">{String(module.order).padStart(2, '0')}</span><span className={`category-pill ${module.category}`}>{module.category}</span><h1>{module.title}</h1><p>{module.description}</p></header>
    <section className="lesson-card"><span className="eyebrow">MINI-LESSON</span><h2>{module.lesson.title}</h2><p>{module.lesson.summary}</p><ul>{module.lesson.keyIdeas.map(idea => <li key={idea}>{idea}</li>)}</ul><div className="worked-example"><strong>Worked example</strong><p>{module.lesson.workedExample.prompt}</p><ol>{module.lesson.workedExample.steps.map(step => <li key={step}>{step}</li>)}</ol><span>Answer: {module.lesson.workedExample.answer}</span></div></section>
    <section className="question-list"><div className="section-heading"><div><span className="eyebrow">DRILLS & CHECKPOINT</span><h2>{module.questionCount} questions</h2></div></div>{moduleQuestions.map(question => {
      const attempt = latest.get(question.id)
      return <Link key={question.id} to={`/question/${question.id}`} className="question-row"><span className={`status-dot ${attempt ? (attempt.correct ? 'done' : 'wrong') : ''}`}>{attempt?.correct ? '✓' : attempt ? '!' : ''}</span><div><strong>{question.title}</strong><small>Level {question.difficulty} · {question.phase}</small></div><span>→</span></Link>
    })}</section>
  </div>
}
