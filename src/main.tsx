import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './styles.css'
import App from './App'
import { ProgressProvider } from './context/ProgressContext'

createRoot(document.getElementById('root')!).render(<StrictMode><ProgressProvider><App /></ProgressProvider></StrictMode>)
