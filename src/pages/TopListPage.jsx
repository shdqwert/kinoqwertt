import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import TrailerModal from '../components/TrailerModal/TrailerModal.jsx'
import { useWatchlist } from '../context/WatchlistContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { MOVIES } from '../data/movies.js'
import { getTopRatedMovies, getMovieVideos } from '../services/tmdb.js'
import { mapTmdbSummaryToCard } from '../adapters/tmdbMovie.js'
import { setCachedMovie } from '../services/tmdbMovieCache.js'
import { pickTrailerKey } from '../utils/pickTrailerKey.js'
import iconBookmark from '../assets/movie-ui/icon-bookmark.svg'
import iconStar from '../assets/movie-ui/icon-star.svg'
import RateButton from '../components/RateButton/RateButton.jsx'
import iconPlay from '../components/ComingSoon/assets/icon-play.svg'
import './TopListPage.css'

const FILTER_GROUPS = [
  { key: 'genres', labelKey: 'label_genres' },
  { key: 'year', labelKey: 'filter_release_year' },
  { key: 'rating', labelKey: 'filter_imdb_rating' },
  { key: 'theaters', labelKey: 'filter_in_theaters' },
  { key: 'keywords', labelKey: 'label_keywords' },
]

const RATING_OPTIONS = [9, 8, 7, 6]
const EXTRA_PAGES = 12 // ~240 more titles on top of the local catalog, closing in on a real "Top 250"

const LOCAL_MOVIES = Object.values(MOVIES)

function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function dedupeByTitle(movies) {
  const seen = new Set()
  const out = []
  for (const m of movies) {
    const key = `${m.title}`.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(m)
  }
  return out
}

function TopListPage({ onBack, onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson, initialGenre }) {
  const { isSaved, toggleSave } = useWatchlist()
  const { t } = useLanguage()
  const [selectedGenres, setSelectedGenres] = useState(initialGenre ? [initialGenre] : [])
  const [genresOpen, setGenresOpen] = useState(Boolean(initialGenre))
  const [yearOpen, setYearOpen] = useState(false)
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  const [ratingOpen, setRatingOpen] = useState(false)
  const [minRating, setMinRating] = useState(null)
  const [keywordsOpen, setKeywordsOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [inTheatersOnly, setInTheatersOnly] = useState(false)
  const [extraMovies, setExtraMovies] = useState([])
  const [loadingMore, setLoadingMore] = useState(true)
  const [pendingTrailerFor, setPendingTrailerFor] = useState(null)
  const [unavailableFor, setUnavailableFor] = useState(null)
  const [activeTrailer, setActiveTrailer] = useState(null)

  useEffect(() => {
    let cancelled = false
    const pages = Array.from({ length: EXTRA_PAGES }, (_, i) => i + 1)
    Promise.all(pages.map((p) => getTopRatedMovies(p).catch(() => ({ results: [] }))))
      .then((results) => {
        if (cancelled) return
        const cards = results.flatMap((r) => r.results || []).map((item) => mapTmdbSummaryToCard(item, 'movie'))
        cards.forEach(setCachedMovie)
        setExtraMovies(cards)
      })
      .finally(() => {
        if (!cancelled) setLoadingMore(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allMovies = useMemo(
    () => dedupeByTitle([...LOCAL_MOVIES, ...extraMovies]),
    [extraMovies]
  )
  const allGenres = useMemo(
    () => [...new Set(allMovies.flatMap((m) => m.genres))].sort(),
    [allMovies]
  )

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const currentYear = new Date().getFullYear()

  const movies = allMovies
    .filter((m) => selectedGenres.length === 0 || m.genres.some((g) => selectedGenres.includes(g)))
    .filter((m) => !yearFrom || Number(m.year) >= Number(yearFrom))
    .filter((m) => !yearTo || Number(m.year) <= Number(yearTo))
    .filter((m) => !minRating || Number(m.score) >= minRating)
    .filter((m) => !inTheatersOnly || Number(m.year) >= currentYear - 1)
    .filter((m) => {
      if (!keyword.trim()) return true
      const k = keyword.trim().toLowerCase()
      return m.title.toLowerCase().includes(k) || (m.plot || '').toLowerCase().includes(k)
    })
    .slice()
    .sort((a, b) => Number(b.score) - Number(a.score))

  const activeFilterCount =
    selectedGenres.length + (yearFrom || yearTo ? 1 : 0) + (minRating ? 1 : 0) + (keyword.trim() ? 1 : 0)

  const clearAllFilters = () => {
    setSelectedGenres([])
    setYearFrom('')
    setYearTo('')
    setMinRating(null)
    setKeyword('')
    setInTheatersOnly(false)
  }

  const playTrailer = async (movie) => {
    setUnavailableFor(null)
    if (movie.trailerId) {
      setActiveTrailer(movie)
      return
    }
    setPendingTrailerFor(movie.slug)
    try {
      const videos = await getMovieVideos(movie.tmdbId ?? movie.slug)
      const key = pickTrailerKey(videos)
      if (key) setActiveTrailer({ ...movie, trailerId: key })
      else setUnavailableFor(movie.slug)
    } catch {
      setUnavailableFor(movie.slug)
    } finally {
      setPendingTrailerFor(null)
    }
  }

  return (
    <>
      <Header onOpenTitle={onOpenTitle} onOpenWatch={onOpenWatch} onOpenMovies={onOpenMovies} onOpenWatchlist={onOpenWatchlist} onOpenProfile={onOpenProfile} onOpenTv={onOpenTv} onOpenCelebs={onOpenCelebs} onOpenAwards={onOpenAwards} onOpenCommunity={onOpenCommunity} onOpenPerson={onOpenPerson} />
      <div className="top-list-page__back-bar">
        <button type="button" className="top-list-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="top-list-page">
        <div className="top-list-page__heading">
          <p className="top-list-page__eyebrow">{t('toplist_eyebrow')}</p>
          <h1>{t('toplist_heading')}</h1>
          <p className="top-list-page__subtitle">{t('toplist_subtitle')}</p>
        </div>

        <div className="top-list-page__body">
          <aside className="top-list-page__filters">
            <h2>{t('filters_title')}</h2>
            {FILTER_GROUPS.map((group) => {
              if (group.key === 'genres') {
                return (
                  <div className="top-list-page__filter-group" key={group.key}>
                    <button type="button" className="top-list-page__filter-row" onClick={() => setGenresOpen((open) => !open)}>
                      <span>{t('label_genres')}{selectedGenres.length > 0 ? ` (${selectedGenres.length})` : ''}</span>
                      <ChevronDown />
                    </button>
                    {genresOpen && (
                      <div className="top-list-page__genre-options">
                        {allGenres.map((genre) => (
                          <label className="top-list-page__genre-option" key={genre}>
                            <input type="checkbox" checked={selectedGenres.includes(genre)} onChange={() => toggleGenre(genre)} />
                            <span>{t(genre)}</span>
                          </label>
                        ))}
                        {selectedGenres.length > 0 && (
                          <button type="button" className="top-list-page__genre-clear" onClick={() => setSelectedGenres([])}>
                            {t('clear')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              }
              if (group.key === 'year') {
                return (
                  <div className="top-list-page__filter-group" key={group.key}>
                    <button type="button" className="top-list-page__filter-row" onClick={() => setYearOpen((open) => !open)}>
                      <span>{t('filter_release_year')}{yearFrom || yearTo ? ' (1)' : ''}</span>
                      <ChevronDown />
                    </button>
                    {yearOpen && (
                      <div className="top-list-page__year-inputs">
                        <input
                          type="number"
                          className="top-list-page__year-input"
                          placeholder="1970"
                          value={yearFrom}
                          onChange={(e) => setYearFrom(e.target.value)}
                        />
                        <span className="top-list-page__year-dash">–</span>
                        <input
                          type="number"
                          className="top-list-page__year-input"
                          placeholder={String(currentYear)}
                          value={yearTo}
                          onChange={(e) => setYearTo(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )
              }
              if (group.key === 'rating') {
                return (
                  <div className="top-list-page__filter-group" key={group.key}>
                    <button type="button" className="top-list-page__filter-row" onClick={() => setRatingOpen((open) => !open)}>
                      <span>{t('filter_imdb_rating')}{minRating ? ` (${minRating}+)` : ''}</span>
                      <ChevronDown />
                    </button>
                    {ratingOpen && (
                      <div className="top-list-page__rating-options">
                        {RATING_OPTIONS.map((r) => (
                          <button
                            type="button"
                            key={r}
                            className={`top-list-page__rating-chip${minRating === r ? ' top-list-page__rating-chip--active' : ''}`}
                            onClick={() => setMinRating((prev) => (prev === r ? null : r))}
                          >
                            {r}+
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              if (group.key === 'keywords') {
                return (
                  <div className="top-list-page__filter-group" key={group.key}>
                    <button type="button" className="top-list-page__filter-row" onClick={() => setKeywordsOpen((open) => !open)}>
                      <span>{t('label_keywords')}{keyword.trim() ? ' (1)' : ''}</span>
                      <ChevronDown />
                    </button>
                    {keywordsOpen && (
                      <input
                        type="text"
                        className="top-list-page__keyword-input"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder={t('label_keywords')}
                      />
                    )}
                  </div>
                )
              }
              // 'theaters' — a plain toggle, no sub-panel needed
              return (
                <button
                  type="button"
                  className={`top-list-page__filter-row top-list-page__filter-row--toggle${inTheatersOnly ? ' top-list-page__filter-row--active' : ''}`}
                  key={group.key}
                  onClick={() => setInTheatersOnly((v) => !v)}
                >
                  <span>{t(group.labelKey)}</span>
                  <ChevronDown />
                </button>
              )
            })}
            {activeFilterCount > 0 && (
              <button type="button" className="top-list-page__genre-clear" onClick={clearAllFilters}>
                {t('clear')}
              </button>
            )}
          </aside>

          <div className="top-list-page__list-col">
            <div className="top-list-page__list-header">
              <span>{t('sort_by_ranking')}</span>
              <span className="top-list-page__list-header-dot" />
              <span>{t('hide_rated_titles')}</span>
              <span className="top-list-page__list-count">
                {movies.length} {t('titles_count')}{loadingMore ? ` · ${t('loading')}` : ''}
              </span>
            </div>

            <ol className="top-list-page__list">
              {movies.map((movie, i) => {
                const saved = isSaved(movie.slug)
                const pendingTrailer = pendingTrailerFor === movie.slug
                const unavailable = unavailableFor === movie.slug
                return (
                  <li className="top-list-page__card" key={movie.slug}>
                    <div className="top-list-page__rank">
                      <span>{i + 1}</span>
                      <div className="top-list-page__rank-bar" />
                    </div>

                    <div className="top-list-page__poster" onClick={() => onOpenTitle?.(movie.slug)}>
                      <img src={movie.poster} alt="" />
                      <button
                        type="button"
                        className={`top-list-page__bookmark${saved ? ' top-list-page__bookmark--saved' : ''}`}
                        aria-label={t('add_to_watchlist')}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSave(movie.slug)
                        }}
                      >
                        <img src={iconBookmark} alt="" />
                      </button>
                    </div>

                    <div className="top-list-page__info">
                      <button type="button" className="top-list-page__title" onClick={() => onOpenTitle?.(movie.slug)}>
                        {movie.title}
                      </button>
                      <div className="top-list-page__meta">
                        <span>{movie.year}</span>
                        {movie.rated && (
                          <>
                            <span className="top-list-page__meta-dot" />
                            <span>{movie.rated}</span>
                          </>
                        )}
                        {movie.runtime && (
                          <>
                            <span className="top-list-page__meta-dot" />
                            <span>{movie.runtime}</span>
                          </>
                        )}
                      </div>
                      <div className="top-list-page__genres">
                        {movie.genres.map((genre) => (
                          <button
                            type="button"
                            className={`top-list-page__genre-pill${selectedGenres.includes(genre) ? ' top-list-page__genre-pill--active' : ''}`}
                            key={genre}
                            onClick={() => {
                              toggleGenre(genre)
                              setGenresOpen(true)
                            }}
                          >
                            {t(genre)}
                          </button>
                        ))}
                      </div>
                      <p className="top-list-page__plot">{movie.plot}</p>
                      {movie.director && <p className="top-list-page__line">{t('label_director_colon')} {movie.director}</p>}
                      {movie.stars?.length > 0 && <p className="top-list-page__line">{t('label_stars_colon')} {movie.stars.join(', ')}</p>}
                      <p className="top-list-page__line">{t('label_votes_colon')} {movie.scoreCount}</p>
                      <button
                        type="button"
                        className={`top-list-page__trailer${unavailable ? ' top-list-page__trailer--unavailable' : ''}`}
                        disabled={pendingTrailer}
                        onClick={() => playTrailer(movie)}
                      >
                        <img src={iconPlay} alt="" />
                        <span>{pendingTrailer ? '…' : unavailable ? t('trailer_unavailable') : t('trailer')}</span>
                      </button>
                    </div>

                    <div className="top-list-page__side">
                      <div className="top-list-page__rating">
                        <img src={iconStar} alt="" />
                        <span>{movie.score} ({movie.scoreCount})</span>
                      </div>
                      <RateButton slug={movie.slug} className="top-list-page__rate" />
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      <Footer />

      {activeTrailer && (
        <TrailerModal videoId={activeTrailer.trailerId} title={activeTrailer.title} onClose={() => setActiveTrailer(null)} />
      )}
    </>
  )
}

export default TopListPage
