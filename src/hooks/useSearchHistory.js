import { useCallback, useState } from 'react'

const STORAGE_KEY = 'imdb-clone-search-history'
const MAX_ENTRIES = 8

function readInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // storage unavailable (private browsing, quota) — history just won't persist
  }
}

// Recent search *queries* (the typed text, not a specific result) — shown
// when the search box is focused with nothing typed yet, so a person can
// jump back into a search they made earlier in the session.
export function useSearchHistory() {
  const [history, setHistory] = useState(readInitial)

  const addEntry = useCallback((query) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_ENTRIES)
      persist(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    persist([])
  }, [])

  return { history, addEntry, clearHistory }
}
