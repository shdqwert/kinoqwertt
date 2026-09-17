import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const WatchlistContext = createContext(null)
const STORAGE_KEY = 'imdb-clone-watchlist'

function readInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function WatchlistProvider({ children }) {
  const [ids, setIds] = useState(readInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // ignore
    }
  }, [ids])

  const isSaved = useCallback((id) => ids.includes(id), [ids])

  const toggleSave = useCallback((id) => {
    if (!id) return
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  return (
    <WatchlistContext.Provider value={{ ids, isSaved, toggleSave, count: ids.length }}>
      {children}
    </WatchlistContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with its Provider on purpose
export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
