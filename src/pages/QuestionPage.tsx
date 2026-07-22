import { Link, Navigate, useParams } from 'react-router-dom'
import { moduleById, questionById, questions } from '../data/content'
import { QuestionCard } from '../components/QuestionCard'

export function QuestionPage() {
  const { questionId } = useParams()
  const question = questionId ? questionById.get(questionId) : undefined
  if (!question) return <Navigate to="/learn" replace />
  const module = moduleById.get(question.moduleId)!
  const siblings = questions.filter(q => q.moduleId === question.moduleId)
  const index = siblings.findIndex(q => q.id === question.id)
  const next = siblings[index + 1]
  return <div className="page question-page"><Link to={`/module/${module.id}`} className="back-link">← {module.shortTitle}</Link><QuestionCard question={question} nextQuestionId={next?.id} /></div>
}
