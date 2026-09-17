import { useEffect, useRef, useState } from 'react'
import { searchMovies, searchTv, searchPeople, searchMulti, getImageUrl, IMAGE_SIZES } from '../../services/tmdb.js'
import logoBase from './assets/logo-base.svg'
import logoPart1 from './assets/logo-part1.svg'
import logoPart2 from './assets/logo-part2.svg'
import logoPart3 from './assets/logo-part3.svg'
import logoPart4 from './assets/logo-part4.svg'
import iconSearch from './assets/icon-search.svg'
import iconArrow from './assets/icon-arrow.svg'
import iconWatchlist from './assets/icon-watchlist.svg'
import iconUser from './assets/icon-user.svg'
import iconMode from './assets/icon-mode.svg'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useWatchlist } from '../../context/WatchlistContext.jsx'
import { useSearchHistory } from '../../hooks/useSearchHistory.js'
import AuthModal from '../AuthModal/AuthModal.jsx'
import './Header.css'

const NAV_KEYS = ['nav_movies', 'nav_tv', 'nav_celebs', 'nav_watch', 'nav_awards', 'nav_community']

const NAV_HANDLERS = {
  nav_movies: 'onOpenMovies',
  nav_tv: 'onOpenTv',
  nav_celebs: 'onOpenCelebs',
  nav_watch: 'onOpenWatch',
  nav_awards: 'onOpenAwards',
  nav_community: 'onOpenCommunity',
}

const SEARCH_SCOPES = [
  { key: 'multi', labelKey: 'search_scope_all' },
  { key: 'movie', labelKey: 'search_scope_movies' },
  { key: 'tv', labelKey: 'search_scope_tv' },
  { key: 'person', labelKey: 'search_scope_people' },
]

const SCOPE_FETCHERS = {
  multi: searchMulti,
  movie: searchMovies,
  tv: searchTv,
  person: searchPeople,
}

function Header({
  onOpenTitle,
  onOpenWatch,
  onOpenMovies,
  onOpenWatchlist,
  onOpenProfile,
  onOpenTv,
  onOpenCelebs,
  onOpenAwards,
  onOpenCommunity,
  onOpenPerson,
}) {
  const handlers = { onOpenWatch, onOpenMovies, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity }
  const { theme, toggleTheme } = useTheme()
  const { lang, toggleLang, t } = useLanguage()
  const { user } = useAuth()
  const { count } = useWatchlist()
  const { history, addEntry, clearHistory } = useSearchHistory()
  const [authOpen, setAuthOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchScope, setSearchScope] = useState('multi')
  const [scopeOpen, setScopeOpen] = useState(false)
  const blurTimeout = useRef(null)
  const searchBoxRef = useRef(null)

  useEffect(() => {
    if (!scopeOpen) return
    const onDocMouseDown = (e) => {
      if (!searchBoxRef.current?.contains(e.target)) setScopeOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [scopeOpen])

  useEffect(() => {
    if (!query.trim()) return
    let cancelled = false
    const fetcher = SCOPE_FETCHERS[searchScope]
    const timer = setTimeout(() => {
      fetcher(query)
        .then((data) => {
          if (cancelled) return
          setResults(data.results?.slice(0, 6) || [])
          addEntry(query)
        })
        .catch(() => {
          if (!cancelled) setResults([])
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- addEntry is stable (useCallback with no deps)
  }, [query, searchScope])

  const resultType = (item) => item.media_type || searchScope

  const pickResult = (item) => {
    setQuery('')
    setResults([])
    setSearchOpen(false)
    const type = resultType(item)
    if (type === 'movie') onOpenTitle?.(String(item.id))
    else if (type === 'tv') onOpenTitle?.(`tv-${item.id}`)
    else if (type === 'person') onOpenPerson?.(item.id)
  }

  const pickHistoryEntry = (entry) => {
    setQuery(entry)
    setSearchOpen(true)
  }

  return (
    <header className="imdb-header">
      <div className="imdb-header__inner">
        <a href="/" className="imdb-header__logo" aria-label="IMDb Home">
          <img src={logoBase} alt="" className="imdb-header__logo-layer imdb-header__logo-base" />
          <img src={logoPart1} alt="" className="imdb-header__logo-layer imdb-header__logo-part1" />
          <img src={logoPart2} alt="" className="imdb-header__logo-layer imdb-header__logo-part2" />
          <img src={logoPart3} alt="" className="imdb-header__logo-layer imdb-header__logo-part3" />
          <img src={logoPart4} alt="" className="imdb-header__logo-layer imdb-header__logo-part4" />
        </a>

        <nav className="imdb-header__nav" aria-label="Primary">
          {NAV_KEYS.map((key) => (
            <a
              key={key}
              href="#"
              className="imdb-header__nav-link"
              onClick={(e) => {
                e.preventDefault()
                if (NAV_HANDLERS[key]) handlers[NAV_HANDLERS[key]]?.()
              }}
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="imdb-header__search" ref={searchBoxRef}>
          <div className="imdb-header__search-scope">
            <button
              type="button"
              className="imdb-header__search-filter"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setScopeOpen((open) => !open)}
            >
              {t(SEARCH_SCOPES.find((s) => s.key === searchScope).labelKey)}
              <img src={iconArrow} alt="" className="imdb-header__icon" />
            </button>
            {scopeOpen && (
              <ul className="imdb-header__scope-menu">
                {SEARCH_SCOPES.map((scope) => (
                  <li key={scope.key}>
                    <button
                      type="button"
                      className={`imdb-header__scope-option${scope.key === searchScope ? ' imdb-header__scope-option--active' : ''}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearchScope(scope.key)
                        setScopeOpen(false)
                      }}
                    >
                      {t(scope.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="search"
            className="imdb-header__search-input"
            placeholder={t('search_placeholder')}
            aria-label={t('search_placeholder')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => {
              blurTimeout.current = setTimeout(() => setSearchOpen(false), 150)
            }}
          />
          <img src={iconSearch} alt="" className="imdb-header__icon" />

          {searchOpen && !query.trim() && history.length > 0 && (
            <ul className="imdb-header__search-results imdb-header__search-history">
              <li className="imdb-header__search-history-header">
                <span>{t('search_recent')}</span>
                <button
                  type="button"
                  className="imdb-header__search-history-clear"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    clearHistory()
                  }}
                >
                  {t('search_clear_history')}
                </button>
              </li>
              {history.map((entry) => (
                <li key={entry}>
                  <button
                    type="button"
                    className="imdb-header__search-history-entry"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      pickHistoryEntry(entry)
                    }}
                  >
                    <img src={iconSearch} alt="" className="imdb-header__search-result-poster imdb-header__search-history-icon" />
                    <span className="imdb-header__search-result-info">
                      <span className="imdb-header__search-result-title">{entry}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {searchOpen && query.trim() && results.length > 0 && (
            <ul className="imdb-header__search-results">
              {results.map((item) => {
                const type = resultType(item)
                const title = item.title || item.name || ''
                const year = (item.release_date || item.first_air_date || '').slice(0, 4)
                const image = type === 'person' ? item.profile_path : item.poster_path
                const typeLabel =
                  type === 'tv' ? t('search_scope_tv') : type === 'person' ? t('search_scope_people') : ''
                return (
                  <li key={`${type}-${item.id}`}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        clearTimeout(blurTimeout.current)
                        pickResult(item)
                      }}
                    >
                      <img
                        src={getImageUrl(image, IMAGE_SIZES.poster.small) || iconSearch}
                        alt=""
                        className="imdb-header__search-result-poster"
                      />
                      <span className="imdb-header__search-result-info">
                        <span className="imdb-header__search-result-title">{title}</span>
                        <span className="imdb-header__search-result-year">
                          {year}
                          {typeLabel && (year ? ` • ${typeLabel}` : typeLabel)}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <button type="button" className="imdb-header__action" onClick={onOpenWatchlist}>
          <img src={iconWatchlist} alt="" className="imdb-header__icon" />
          <span>{t('watchlist')}</span>
          {count > 0 && <span className="imdb-header__badge">{count}</span>}
        </button>

        <button
          type="button"
          className="imdb-header__action"
          onClick={() => (user ? onOpenProfile?.() : setAuthOpen(true))}
          title={user ? user.name : t('sign_in')}
        >
          <img src={iconUser} alt="" className="imdb-header__icon" />
          <span>{user ? user.name.split(' ')[0] : t('user')}</span>
        </button>

        <div className="imdb-header__settings">
          <button type="button" className="imdb-header__lang" onClick={toggleLang} title={t('lang_toggle')}>
            {lang.toUpperCase()}
            <img src={iconArrow} alt="" className="imdb-header__icon" />
          </button>
          <button
            type="button"
            className="imdb-header__theme"
            onClick={toggleTheme}
            aria-label={t('theme_toggle')}
            title={t('theme_toggle')}
          >
            <img
              src={iconMode}
              alt=""
              className={`imdb-header__icon${theme === 'light' ? ' imdb-header__icon--active' : ''}`}
            />
          </button>
        </div>
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </header>
  )
}

export default Header
