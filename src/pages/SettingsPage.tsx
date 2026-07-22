import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearAllData, exportBackup, importBackup } from '../lib/db'
import { useProgress } from '../context/ProgressContext'

export function SettingsPage() {
  const progress = useProgress()
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  async function download() {
    const data = await exportBackup()
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = `quant-prob-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url)
    setMessage('Backup exported.')
  }
  async function upload(file?: File) {
    if (!file) return
    try { await importBackup(JSON.parse(await file.text())); await progress.reload(); setMessage('Backup restored.') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not import this backup.') }
  }
  async function clear() {
    if (!window.confirm('Delete all attempts, notes, bookmarks and mental-maths history on this device?')) return
    await clearAllData(); await progress.reload(); setMessage('Local progress cleared.')
  }
  return <div className="page"><div className="page-title"><span className="eyebrow">SETTINGS</span><h1>Local by design.</h1><p>Your progress never leaves this device unless you export it.</p></div>
    <section className="settings-card"><h2>Install on iPhone</h2><ol><li>Open the deployed site in Safari, Chrome, Edge, or Firefox on iOS 16.4+.</li><li>Tap the Share button.</li><li>Choose “Add to Home Screen”, then confirm.</li><li>Launch the new icon once while online. Afterwards, use it in airplane mode.</li></ol></section>
    <section className="settings-card"><h2>Backup and restore</h2><p>Export a versioned JSON backup before clearing browser data or moving phones.</p><div className="button-row"><button className="secondary-button" onClick={() => void download()}>Export backup</button><button className="secondary-button" onClick={() => inputRef.current?.click()}>Import backup</button></div><input ref={inputRef} type="file" accept="application/json" hidden onChange={e => void upload(e.target.files?.[0])} /></section>
    <section className="settings-card"><h2>More</h2><Link to="/resources">Sources and further study →</Link><button className="danger-button" onClick={() => void clear()}>Clear local progress</button></section>
    {message && <div className="toast" role="status">{message}</div>}
  </div>
}
