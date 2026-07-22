import { NavLink, Outlet } from 'react-router-dom'

const nav = [
  ['/', 'Home', '⌂'],
  ['/learn', 'Learn', '◫'],
  ['/practice', 'Practice', '◎'],
  ['/mental', 'Mental', '⚡'],
  ['/review', 'Review', '↻']
]

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="Quant Probability Lab home">
          <span className="brand-mark">Q</span>
          <span><strong>Quant Probability</strong><small>LAB</small></span>
        </NavLink>
        <NavLink to="/settings" className="icon-button" aria-label="Settings">⚙</NavLink>
      </header>
      <main className="main-content"><Outlet /></main>
      <nav className="bottom-nav" aria-label="Primary navigation">
        {nav.map(([to, label, icon]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
            <span aria-hidden="true">{icon}</span><small>{label}</small>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
