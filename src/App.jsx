import { useState, useEffect, useMemo } from 'react'

const STORAGE_KEY = 'docket-entries'

const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'var(--tab-low)' },
  { id: 'normal', label: 'Normal', color: 'var(--tab-normal)' },
  { id: 'high', label: 'High', color: 'var(--tab-high)' },
]

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function App() {
  const [entries, setEntries] = useState(loadEntries)
  const [draft, setDraft] = useState('')
  const [priority, setPriority] = useState('normal')
  const [filter, setFilter] = useState('open')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const counts = useMemo(() => {
    const open = entries.filter((e) => !e.done).length
    return { open, closed: entries.length - open, total: entries.length }
  }, [entries])

  const visible = useMemo(() => {
    if (filter === 'open') return entries.filter((e) => !e.done)
    if (filter === 'closed') return entries.filter((e) => e.done)
    return entries
  }, [entries, filter])

  function addEntry(e) {
    e.preventDefault()
    const title = draft.trim()
    if (!title) return
    const entry = {
      id: crypto.randomUUID(),
      title,
      priority,
      done: false,
      createdAt: Date.now(),
    }
    setEntries((prev) => [entry, ...prev])
    setDraft('')
    setPriority('normal')
  }

  function toggleEntry(id) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, done: !e.done } : e)),
    )
  }

  function removeEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="page">
      <header className="masthead">
        <div className="masthead-left">
          <h1>Docket</h1>
          <p className="dateline">{todayLabel()}</p>
        </div>
        <div className="masthead-right">
          <div className="stat">
            <span className="stat-value">{counts.open}</span>
            <span className="stat-label">open</span>
          </div>
          <div className="stat">
            <span className="stat-value">{counts.closed}</span>
            <span className="stat-label">closed</span>
          </div>
        </div>
      </header>

      <form className="entry-form" onSubmit={addEntry}>
        <input
          className="entry-input"
          type="text"
          placeholder="Enter an item for today's docket…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="priority-picker">
          {PRIORITIES.map((p) => (
            <button
              type="button"
              key={p.id}
              className={`priority-chip ${priority === p.id ? 'active' : ''}`}
              style={{ '--chip-color': p.color }}
              onClick={() => setPriority(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button className="submit-btn" type="submit">
          File it
        </button>
      </form>

      <nav className="filter-row">
        {[
          { id: 'open', label: 'Open' },
          { id: 'closed', label: 'Closed' },
          { id: 'all', label: 'All entries' },
        ].map((f) => (
          <button
            key={f.id}
            className={`filter-tab ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </nav>

      <ol className="ledger">
        {visible.length === 0 && (
          <li className="empty-row">
            {filter === 'open'
              ? 'Nothing open. File a new item above.'
              : filter === 'closed'
              ? 'Nothing closed yet.'
              : 'The docket is empty.'}
          </li>
        )}
        {visible.map((entry) => {
          const p = PRIORITIES.find((x) => x.id === entry.priority) ?? PRIORITIES[1]
          return (
            <li key={entry.id} className={`ledger-row ${entry.done ? 'done' : ''}`}>
              <span className="tab" style={{ background: p.color }} />
              <button
                className="mark"
                aria-label={entry.done ? 'Mark as open' : 'Mark as closed'}
                onClick={() => toggleEntry(entry.id)}
              >
                {entry.done ? '✓' : ''}
              </button>
              <span className="entry-title">{entry.title}</span>
              <span className="entry-time">
                {new Date(entry.createdAt).toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
              <button
                className="remove"
                aria-label="Remove entry"
                onClick={() => removeEntry(entry.id)}
              >
                ✕
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
