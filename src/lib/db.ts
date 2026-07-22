import { openDB, type DBSchema } from 'idb'
import type { Attempt, MentalMathResult, ProgressState } from '../types'

interface QuantDB extends DBSchema {
  attempts: {
    key: number
    value: Attempt & { id: number }
    indexes: { 'by-question': string }
  }
  mentalResults: {
    key: number
    value: MentalMathResult & { id: number }
    indexes: { 'by-category': string }
  }
  keyval: {
    key: string
    value: unknown
  }
}

const DB_NAME = 'quant-probability-lab'
const DB_VERSION = 1

const dbPromise = openDB<QuantDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    const attempts = db.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true })
    attempts.createIndex('by-question', 'questionId')
    const mental = db.createObjectStore('mentalResults', { keyPath: 'id', autoIncrement: true })
    mental.createIndex('by-category', 'category')
    db.createObjectStore('keyval')
  }
})

export async function loadProgress(): Promise<ProgressState> {
  const db = await dbPromise
  const [attempts, bookmarks, notes] = await Promise.all([
    db.getAll('attempts'),
    db.get('keyval', 'bookmarks'),
    db.get('keyval', 'notes')
  ])
  return {
    attempts,
    bookmarks: Array.isArray(bookmarks) ? bookmarks as string[] : [],
    notes: notes && typeof notes === 'object' ? notes as Record<string, string> : {}
  }
}

export async function saveAttempt(attempt: Attempt) {
  const db = await dbPromise
  return db.add('attempts', attempt as Attempt & { id: number })
}

export async function saveBookmarks(bookmarks: string[]) {
  const db = await dbPromise
  await db.put('keyval', bookmarks, 'bookmarks')
}

export async function saveNotes(notes: Record<string, string>) {
  const db = await dbPromise
  await db.put('keyval', notes, 'notes')
}

export async function saveMentalResult(result: MentalMathResult) {
  const db = await dbPromise
  return db.add('mentalResults', result as MentalMathResult & { id: number })
}

export async function loadMentalResults() {
  const db = await dbPromise
  return db.getAll('mentalResults')
}

export interface BackupData {
  schemaVersion: 1
  exportedAt: string
  progress: ProgressState
  mentalResults: MentalMathResult[]
}

export async function exportBackup(): Promise<BackupData> {
  const [progress, mentalResults] = await Promise.all([loadProgress(), loadMentalResults()])
  return { schemaVersion: 1, exportedAt: new Date().toISOString(), progress, mentalResults }
}

export async function importBackup(data: unknown) {
  if (!data || typeof data !== 'object' || (data as BackupData).schemaVersion !== 1) throw new Error('Unsupported backup file.')
  const backup = data as BackupData
  if (!backup.progress || !Array.isArray(backup.progress.attempts)) throw new Error('Backup is missing progress data.')
  const db = await dbPromise
  const tx = db.transaction(['attempts', 'mentalResults', 'keyval'], 'readwrite')
  await Promise.all([tx.objectStore('attempts').clear(), tx.objectStore('mentalResults').clear()])
  for (const { id: _id, ...attempt } of backup.progress.attempts) await tx.objectStore('attempts').add(attempt as Attempt & { id: number })
  for (const { id: _id, ...result } of backup.mentalResults ?? []) await tx.objectStore('mentalResults').add(result as MentalMathResult & { id: number })
  await tx.objectStore('keyval').put(backup.progress.bookmarks ?? [], 'bookmarks')
  await tx.objectStore('keyval').put(backup.progress.notes ?? {}, 'notes')
  await tx.done
}

export async function clearAllData() {
  const db = await dbPromise
  const tx = db.transaction(['attempts', 'mentalResults', 'keyval'], 'readwrite')
  await Promise.all([
    tx.objectStore('attempts').clear(),
    tx.objectStore('mentalResults').clear(),
    tx.objectStore('keyval').clear()
  ])
  await tx.done
}
