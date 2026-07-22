import { HashRouter, Route, Routes } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { ModulePage } from './pages/ModulePage'
import { QuestionPage } from './pages/QuestionPage'
import { PracticePage } from './pages/PracticePage'
import { MentalMathPage } from './pages/MentalMathPage'
import { ReviewPage } from './pages/ReviewPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW()
  return <HashRouter><Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="learn" element={<LearnPage />} /><Route path="module/:moduleId" element={<ModulePage />} /><Route path="question/:questionId" element={<QuestionPage />} /><Route path="practice" element={<PracticePage />} /><Route path="mental" element={<MentalMathPage />} /><Route path="review" element={<ReviewPage />} /><Route path="resources" element={<ResourcesPage />} /><Route path="settings" element={<SettingsPage />} /></Route></Routes>{needRefresh && <div className="update-toast" role="status"><span>A fresh question-bank build is ready.</span><button onClick={() => void updateServiceWorker(true)}>Update</button><button aria-label="Dismiss update" onClick={() => setNeedRefresh(false)}>×</button></div>}</HashRouter>
}
