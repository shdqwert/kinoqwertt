import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import TrailerModal from '../components/TrailerModal/TrailerModal.jsx'
import { useWatchlist } from '../context/WatchlistContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getPopularTv, getTopRatedTv, getTvVideos } from '../services/tmdb.js'
import { mapTmdbSummaryToCard } from '../adapters/tmdbMovie.js'
import { setCachedMovie } from '../services/tmdbMovieCache.js'
import { pickTrailerKey } from '../utils/pickTrailerKey.js'
import iconBookmark from '../assets/movie-ui/icon-bookmark.svg'
import iconStar from '../assets/movie-ui/icon-star.svg'
import RateButton from '../components/RateButton/RateButton.jsx'
import iconPlay from '../components/ComingSoon/assets/icon-play.svg'
import '../pages/TopListPage.css'

const FETCH_PAGES = 10
const RATING_OPTIONS = [9, 8, 7, 6]

function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TvPage({ onBack, onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson }) {
  const { t } = useLanguage()
  const { isSaved, toggleSave } = useWatchlist()
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [genresOpen, setGenresOpen] = useState(false)
  const [minRating, setMinRating] = useState(null)
  const [ratingOpen, setRatingOpen] = useState(false)
  const [pendingTrailerFor, setPendingTrailerFor] = useState(null)
  const [unavailableFor, setUnavailableFor] = useState(null)
  const [activeTrailer, setActiveTrailer] = useState(null)

  useEffect(() => {
    let cancelled = false
    const pages = Array.from({ length: FETCH_PAGES }, (_, i) => i + 1)
    Promise.all([
      ...pages.map((p) => getTopRatedTv(p).catch(() => ({ results: [] }))),
      ...pages.slice(0, 4).map((p) => getPopularTv(p).catch(() => ({ results: [] }))),
    ])
      .then((results) => {
        if (cancelled) return
        const byId = new Map()
        for (const r of results) {
          for (const item of r.results || []) {
            if (!byId.has(item.id)) byId.set(item.id, item)
          }
        }
        const cards = [...byId.values()].map((item) => mapTmdbSummaryToCard(item, 'tv'))
        cards.forEach(setCachedMovie)
        setShows(cards)
      })
      .catch(() => {
        if (!cancelled) setShows([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allGenres = useMemo(() => [...new Set(shows.flatMap((s) => s.genres))].sort(), [shows])

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const filtered = shows
    .filter((s) => selectedGenres.length === 0 || s.genres.some((g) => selectedGenres.includes(g)))
    .filter((s) => !minRating || Number(s.score) >= minRating)
    .slice()
    .sort((a, b) => Number(b.score) - Number(a.score))

  const playTrailer = async (show) => {
    setUnavailableFor(null)
    setPendingTrailerFor(show.slug)
    try {
      const videos = await getTvVideos(show.tmdbId)
      const key = pickTrailerKey(videos)
      if (key) setActiveTrailer({ ...show, trailerId: key })
      else setUnavailableFor(show.slug)
    } catch {
      setUnavailableFor(show.slug)
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
          <p className="top-list-page__eyebrow">TMDB</p>
          <h1>{t('tv_heading')}</h1>
          <p className="top-list-page__subtitle">{t('tv_subtitle')}</p>
        </div>

        <div className="top-list-page__body">
          <aside className="top-list-page__filters">
            <h2>{t('filters_title')}</h2>
            <div className="top-list-page__filter-group">
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
            <div className="top-list-page__filter-group">
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
          </aside>

          <div className="top-list-page__list-col">
            {loading ? (
              <p className="top-list-page__status">{t('loading')}</p>
            ) : (
              <>
                <div className="top-list-page__list-header">
                  <span>{t('sort_by_ranking')}</span>
                  <span className="top-list-page__list-count">{filtered.length} {t('titles_count')}</span>
                </div>

                <ol className="top-list-page__list">
                  {filtered.map((show, i) => {
                    const saved = isSaved(show.slug)
                    const pendingTrailer = pendingTrailerFor === show.slug
                    const unavailable = unavailableFor === show.slug
                    return (
                      <li className="top-list-page__card" key={show.slug}>
                        <div className="top-list-page__rank">
                          <span>{i + 1}</span>
                          <div className="top-list-page__rank-bar" />
                        </div>

                        <div className="top-list-page__poster" onClick={() => onOpenTitle?.(show.slug)}>
                          <img src={show.poster} alt="" />
                          <button
                            type="button"
                            className={`top-list-page__bookmark${saved ? ' top-list-page__bookmark--saved' : ''}`}
                            aria-label={t('add_to_watchlist')}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSave(show.slug)
                            }}
                          >
                            <img src={iconBookmark} alt="" />
                          </button>
                        </div>

                        <div className="top-list-page__info">
                          <button type="button" className="top-list-page__title" onClick={() => onOpenTitle?.(show.slug)}>
                            {show.title}
                          </button>
                          <div className="top-list-page__meta">
                            <span>{show.year}</span>
                          </div>
                          <div className="top-list-page__genres">
                            {show.genres.map((genre) => (
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
                          <p className="top-list-page__plot">{show.plot}</p>
                          <p className="top-list-page__line">{t('label_votes_colon')} {show.scoreCount}</p>
                          <button
                            type="button"
                            className={`top-list-page__trailer${unavailable ? ' top-list-page__trailer--unavailable' : ''}`}
                            disabled={pendingTrailer}
                            onClick={() => playTrailer(show)}
                          >
                            <img src={iconPlay} alt="" />
                            <span>{pendingTrailer ? '…' : unavailable ? t('trailer_unavailable') : t('trailer')}</span>
                          </button>
                        </div>

                        <div className="top-list-page__side">
                          <div className="top-list-page__rating">
                            <img src={iconStar} alt="" />
                            <span>{show.score} ({show.scoreCount})</span>
                          </div>
                          <RateButton slug={show.slug} className="top-list-page__rate" />
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </>
            )}
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

export default TvPage
