import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Attempt, MentalMathResult, ProgressState } from '../types'
import { loadProgress, saveAttempt, saveBookmarks, saveMentalResult, saveNotes } from '../lib/db'

interface ProgressContextValue extends ProgressState {
  ready: boolean
  recordAttempt: (attempt: Omit<Attempt, 'createdAt'>) => Promise<void>
  toggleBookmark: (questionId: string) => Promise<void>
  setNote: (questionId: string, note: string) => Promise<void>
  recordMentalResult: (result: Omit<MentalMathResult, 'createdAt'>) => Promise<void>
  reload: () => Promise<void>
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>({ attempts: [], bookmarks: [], notes: {} })
  const [ready, setReady] = useState(false)

  const reload = useCallback(async () => {
    const loaded = await loadProgress()
    setState(loaded)
    setReady(true)
  }, [])

  useEffect(() => { void reload() }, [reload])

  const recordAttempt = useCallback(async (input: Omit<Attempt, 'createdAt'>) => {
    const attempt: Attempt = { ...input, createdAt: new Date().toISOString() }
    const id = await saveAttempt(attempt)
    setState(current => ({ ...current, attempts: [...current.attempts, { ...attempt, id }] }))
  }, [])

  const toggleBookmark = useCallback(async (questionId: string) => {
    let updated: string[] = []
    setState(current => {
      updated = current.bookmarks.includes(questionId)
        ? current.bookmarks.filter(id => id !== questionId)
        : [...current.bookmarks, questionId]
      return { ...current, bookmarks: updated }
    })
    await saveBookmarks(updated)
  }, [])

  const setNote = useCallback(async (questionId: string, note: string) => {
    let updated: Record<string, string> = {}
    setState(current => {
      updated = { ...current.notes, [questionId]: note }
      return { ...current, notes: updated }
    })
    await saveNotes(updated)
  }, [])

  const recordMentalResult = useCallback(async (input: Omit<MentalMathResult, 'createdAt'>) => {
    await saveMentalResult({ ...input, createdAt: new Date().toISOString() })
  }, [])

  const value = useMemo(() => ({ ...state, ready, recordAttempt, toggleBookmark, setNote, recordMentalResult, reload }), [state, ready, recordAttempt, toggleBookmark, setNote, recordMentalResult, reload])
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const value = useContext(ProgressContext)
  if (!value) throw new Error('useProgress must be used inside ProgressProvider')
  return value
}

export function latestAttempts(attempts: Attempt[]) {
  const result = new Map<string, Attempt>()
  for (const attempt of attempts) result.set(attempt.questionId, attempt)
  return result
}
