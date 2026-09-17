import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const RatingsContext = createContext(null)
const STORAGE_KEY = 'imdb-clone-ratings'

function readInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

// The "Rate" star shows up on every poster across the app but, before this,
// never did anything anywhere — this gives it a real, persisted personal
// rating (1-10 per title), the same way the watchlist bookmark works.
export function RatingsProvider({ children }) {
  const [ratings, setRatings] = useState(readInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings))
    } catch {
      // ignore
    }
  }, [ratings])

  const getRating = useCallback((slug) => ratings[slug] || 0, [ratings])

  const setRatingFor = useCallback((slug, value) => {
    if (!slug) return
    setRatings((prev) => {
      if (!value) {
        const next = { ...prev }
        delete next[slug]
        return next
      }
      return { ...prev, [slug]: value }
    })
  }, [])

  const count = Object.keys(ratings).length

  return (
    <RatingsContext.Provider value={{ ratings, getRating, setRatingFor, count }}>
      {children}
    </RatingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with its Provider on purpose
export function useRatings() {
  const ctx = useContext(RatingsContext)
  if (!ctx) throw new Error('useRatings must be used within RatingsProvider')
  return ctx
}
