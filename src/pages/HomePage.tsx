import { Link } from 'react-router-dom'
import { modules, questions } from '../data/content'
import { latestAttempts, useProgress } from '../context/ProgressContext'

export function HomePage() {
  const progress = useProgress()
  const latest = latestAttempts(progress.attempts)
  const attempted = latest.size
  const correct = [...latest.values()].filter(a => a.correct).length
  const continueQuestion = questions.find(q => !latest.has(q.id)) ?? questions[0]
  const nextModule = modules.find(module => questions.filter(q => q.moduleId === module.id).some(q => !latest.has(q.id))) ?? modules[0]
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  return <div className="page home-page">
    <section className="hero">
      <p className="eyebrow">FROM FIRST PRINCIPLES TO INTERVIEW HARD</p>
      <h1>Make uncertainty<br /><em>feel calculable.</em></h1>
      <p>Build probability intuition, price expected value, and practise the reasoning quant interviews reward.</p>
      <Link className="hero-action" to={`/question/${continueQuestion.id}`}>Continue learning <span>→</span></Link>
    </section>

    {!isStandalone && <section className="install-card">
      <div className="install-icon">⇧</div><div><strong>Install for offline study</strong><p>On iPhone: tap Share, then “Add to Home Screen”. Open it once online; the full course is cached.</p></div>
    </section>}

    <section className="stat-grid" aria-label="Your progress">
      <div><strong>{attempted}<small>/250</small></strong><span>attempted</span></div>
      <div><strong>{attempted ? Math.round(correct / attempted * 100) : 0}<small>%</small></strong><span>latest accuracy</span></div>
      <div><strong>{progress.bookmarks.length}</strong><span>bookmarked</span></div>
    </section>

    <section className="section-heading"><div><span className="eyebrow">RECOMMENDED NEXT</span><h2>{nextModule.shortTitle}</h2></div><Link to="/learn">Full path</Link></section>
    <Link to={`/module/${nextModule.id}`} className="next-module-card">
      <span className="module-number">{String(nextModule.order).padStart(2, '0')}</span>
      <div><strong>{nextModule.title}</strong><p>{nextModule.description}</p></div><span>→</span>
    </Link>

    <section className="quick-grid">
      <Link to="/mental"><span>⚡</span><strong>Mental maths</strong><small>20 adaptive questions</small></Link>
      <Link to="/review"><span>↻</span><strong>Review weak spots</strong><small>Mistakes and bookmarks</small></Link>
    </section>
  </div>
}
