import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translate } from '../i18n/translations.js'
import { setTmdbLanguage } from '../services/tmdb.js'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'imdb-clone-lang'

function readInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'ru') return saved
  } catch {
    // ignore
  }
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readInitialLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
    setTmdbLanguage(lang)
  }, [lang])

  const toggleLang = () => setLang((l) => (l === 'en' ? 'ru' : 'en'))
  const t = useMemo(() => (key) => translate(lang, key), [lang])

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is colocated with its Provider on purpose
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
