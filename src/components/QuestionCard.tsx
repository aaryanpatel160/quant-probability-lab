import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Question } from '../types'
import { checkAnswer } from '../lib/answer'
import { useProgress } from '../context/ProgressContext'
import { MathText } from './MathText'

export function QuestionCard({ question, nextQuestionId }: { question: Question; nextQuestionId?: string }) {
  const progress = useProgress()
  const [response, setResponse] = useState('')
  const [hintCount, setHintCount] = useState(0)
  const [result, setResult] = useState<ReturnType<typeof checkAnswer> | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setLocalNote] = useState(progress.notes[question.id] ?? '')
  const bookmarked = progress.bookmarks.includes(question.id)

  useEffect(() => {
    setResponse(''); setHintCount(0); setResult(null); setShowSolution(false); setNoteOpen(false)
    setLocalNote(progress.notes[question.id] ?? '')
  }, [question.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const answerControl = useMemo(() => {
    if (question.answer.kind === 'multiple-choice') {
      return <div className="choice-list">{question.answer.options.map((option, index) => (
        <label key={option} className={response === String(index) ? 'selected' : ''}>
          <input type="radio" name="answer" value={index} checked={response === String(index)} onChange={e => setResponse(e.target.value)} />
          <span>{option}</span>
        </label>
      ))}</div>
    }
    if (question.answer.kind === 'self-graded') {
      return <textarea className="answer-input" rows={5} value={response} onChange={e => setResponse(e.target.value)} placeholder="Write or speak through your reasoning…" aria-label="Your reasoning" />
    }
    return <input className="answer-input" inputMode="text" value={response} onChange={e => setResponse(e.target.value)} placeholder="e.g. 3/8, 0.375, or 37.5%" aria-label="Your answer" onKeyDown={e => { if (e.key === 'Enter') void submit() }} />
  }, [question.answer, response]) // eslint-disable-line react-hooks/exhaustive-deps

  async function submit() {
    const checked = checkAnswer(question.answer, response)
    setResult(checked)
    if (question.answer.kind !== 'self-graded') {
      await progress.recordAttempt({ questionId: question.id, response, correct: checked.correct, hintCount, revealedSolution: false })
    } else {
      setShowSolution(true)
    }
  }

  async function revealSolution() {
    setShowSolution(true)
    if (question.answer.kind !== 'self-graded') {
      await progress.recordAttempt({ questionId: question.id, response, correct: result?.correct ?? false, hintCount, revealedSolution: true })
    }
  }

  async function selfGrade(correct: boolean) {
    setResult({ correct, message: correct ? 'Marked understood.' : 'Added to your review queue.' })
    await progress.recordAttempt({ questionId: question.id, response, correct, hintCount, revealedSolution: true })
  }

  return (
    <article className="question-card">
      <div className="question-meta">
        <span className={`difficulty d${question.difficulty}`}>Level {question.difficulty}</span>
        <span>{question.phase}</span>
        <button className={`bookmark ${bookmarked ? 'saved' : ''}`} onClick={() => void progress.toggleBookmark(question.id)} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark question'}>{bookmarked ? '★' : '☆'}</button>
      </div>
      <h1>{question.title}</h1>
      <p className="objective">Goal: {question.objective}</p>
      <div className="prompt"><MathText>{question.prompt}</MathText></div>

      <section className="answer-area">
        {answerControl}
        {!result && question.answer.kind !== 'self-graded' && <button className="primary-button" disabled={!response.trim()} onClick={() => void submit()}>Check answer</button>}
        {!showSolution && question.answer.kind === 'self-graded' && <button className="primary-button" disabled={!response.trim()} onClick={() => void submit()}>Compare reasoning</button>}
        {result && <div className={`feedback ${result.correct ? 'correct' : 'incorrect'}`} role="status">{result.message}</div>}
      </section>

      <section className="help-actions">
        {hintCount < question.hints.length && !showSolution && <button className="secondary-button" onClick={() => setHintCount(n => n + 1)}>Hint {hintCount + 1}</button>}
        {!showSolution && <button className="text-button" onClick={() => void revealSolution()}>Show full solution</button>}
        <button className="text-button" onClick={() => setNoteOpen(value => !value)}>Scratchpad</button>
      </section>

      {question.hints.slice(0, hintCount).map(hint => <aside key={hint.level} className="hint"><strong>Hint {hint.level}</strong><p><MathText>{hint.text}</MathText></p></aside>)}

      {noteOpen && <section className="scratchpad"><label htmlFor="scratchpad">Private scratchpad</label><textarea id="scratchpad" rows={5} value={note} onChange={e => setLocalNote(e.target.value)} onBlur={() => void progress.setNote(question.id, note)} placeholder="Sketch a tree, list states, or record your reasoning…" /></section>}

      {showSolution && <section className="solution">
        <span className="eyebrow">FULL EXPLANATION</span>
        <h2>{question.solution.approach}</h2>
        <ol>{question.solution.steps.map((step, index) => <li key={index}><MathText>{step}</MathText></li>)}</ol>
        <div className="final-answer"><span>Answer</span><strong><MathText>{question.solution.answer}</MathText></strong></div>
        <div className="common-trap"><strong>Common trap</strong><p>{question.solution.commonTrap}</p></div>
        {question.solution.followUp && <div className="follow-up"><strong>Stretch it</strong><p>{question.solution.followUp}</p></div>}
        <p className="source-note">Concept source: <a href={question.source.url} target="_blank" rel="noreferrer">{question.source.label} ↗</a><br />{question.source.note}</p>
        {question.answer.kind === 'self-graded' && !result && <div className="self-grade"><p>Does your answer cover these points?</p><ul>{question.answer.rubric.map(item => <li key={item}>{item}</li>)}</ul><div><button className="secondary-button" onClick={() => void selfGrade(false)}>Needs review</button><button className="primary-button" onClick={() => void selfGrade(true)}>Got it</button></div></div>}
      </section>}
      {nextQuestionId && result && <Link className="next-link" to={`/question/${nextQuestionId}`}>Next question →</Link>}
    </article>
  )
}
