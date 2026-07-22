import { Link } from 'react-router-dom'
import { questionById, questions } from '../data/content'
import { latestAttempts, useProgress } from '../context/ProgressContext'

export function ReviewPage() {
  const progress = useProgress()
  const latest = latestAttempts(progress.attempts)
  const wrong = questions.filter(q => latest.get(q.id)?.correct === false)
  const bookmarked = progress.bookmarks.map(id => questionById.get(id)).filter(Boolean)
  const combined = [...new Map([...wrong, ...bookmarked].map(q => [q!.id, q!])).values()]
  return <div className="page">
    <div className="page-title"><span className="eyebrow">REVIEW QUEUE</span><h1>Turn misses<br />into methods.</h1><p>Questions you missed or bookmarked stay here until you are ready to clear them.</p></div>
    {!combined.length ? <section className="empty-state"><span>✓</span><h2>Your queue is clear.</h2><p>Missed and bookmarked questions will appear here.</p><Link className="primary-button" to="/practice">Go to practice</Link></section> : <div className="review-list">{combined.map(question => <Link key={question.id} to={`/question/${question.id}`} className="question-row"><span className={`status-dot ${latest.get(question.id)?.correct === false ? 'wrong' : ''}`}>{progress.bookmarks.includes(question.id) ? '★' : '!'}</span><div><strong>{question.title}</strong><small>Level {question.difficulty} · {question.tags.slice(0,2).join(', ')}</small></div><span>→</span></Link>)}</div>}
  </div>
}
