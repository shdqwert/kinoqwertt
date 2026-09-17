import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'imdb-clone-users'
const CURRENT_KEY = 'imdb-clone-current-user'

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write failures
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(CURRENT_KEY, null))

  useEffect(() => {
    if (user) writeJSON(CURRENT_KEY, user)
    else {
      try {
        localStorage.removeItem(CURRENT_KEY)
      } catch {
        // ignore
      }
    }
  }, [user])

  // No password field on purpose: this is a client-only demo with no
  // backend, so a fake password would only imply security that isn't there.
  const signUp = (name, email) => {
    const users = readJSON(USERS_KEY, [])
    const normalizedEmail = email.trim().toLowerCase()
    if (users.some((u) => u.email === normalizedEmail)) {
      return { ok: false, error: 'exists' }
    }
    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      joinedAt: new Date().toISOString(),
      subscribed: false,
    }
    writeJSON(USERS_KEY, [...users, newUser])
    setUser(newUser)
    return { ok: true }
  }

  const signIn = (email) => {
    const users = readJSON(USERS_KEY, [])
    const normalizedEmail = email.trim().toLowerCase()
    const found = users.find((u) => u.email === normalizedEmail)
    if (!found) return { ok: false, error: 'not-found' }
    setUser(found)
    return { ok: true }
  }

  const signOut = () => setUser(null)

  // Demo-only membership toggle: there is no real payment backend here, so
  // this simply flips a local flag (same honesty rule as the rest of this
  // context) rather than pretending to charge a card.
  const toggleSubscription = () => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, subscribed: !prev.subscribed }
      const users = readJSON(USERS_KEY, [])
      writeJSON(
        USERS_KEY,
        users.map((u) => (u.email === updated.email ? updated : u))
      )
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, toggleSubscription }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with its Provider on purpose
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
