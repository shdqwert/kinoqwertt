import { useEffect, useState } from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import TrailerModal from '../components/TrailerModal/TrailerModal.jsx'
import { useWatchlist } from '../context/WatchlistContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { MOVIES } from '../data/movies.js'
import { getPopularMovies, getUpcomingMovies, getNowPlayingMovies, getMovieVideos } from '../services/tmdb.js'
import { mapTmdbSummaryToCard } from '../adapters/tmdbMovie.js'
import { setCachedMovie } from '../services/tmdbMovieCache.js'
import { pickTrailerKey } from '../utils/pickTrailerKey.js'
import iconPlay from '../components/ComingSoon/assets/icon-play.svg'
import iconBookmark from '../assets/movie-ui/icon-bookmark.svg'
import './TrailersPage.css'

const TABS = [
  { key: 'trending', labelKey: 'tab_trending' },
  { key: 'anticipated', labelKey: 'tab_anticipated' },
  { key: 'popular', labelKey: 'tab_popular' },
  { key: 'recent', labelKey: 'tab_recent' },
]

const TAB_FETCHERS = {
  anticipated: getUpcomingMovies,
  popular: getPopularMovies,
  recent: getNowPlayingMovies,
}

const LOCAL_MOVIES = Object.values(MOVIES)

function TrailersPage({ onBack, onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson }) {
  const [activeTab, setActiveTab] = useState(TABS[0].key)
  const [tmdbMovies, setTmdbMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [pendingTrailerFor, setPendingTrailerFor] = useState(null)
  const [unavailableFor, setUnavailableFor] = useState(null)
  const [activeTrailer, setActiveTrailer] = useState(null)
  const { isSaved, toggleSave } = useWatchlist()
  const { t } = useLanguage()

  useEffect(() => {
    const fetcher = TAB_FETCHERS[activeTab]
    if (!fetcher) return

    let cancelled = false
    // This is React's own documented data-fetching-in-an-effect pattern
    // (react.dev/learn/synchronizing-with-effects#fetching-data); the
    // react-hooks/set-state-in-effect rule flags it anyway.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetcher()
      .then((data) => {
        if (cancelled) return
        const cards = (data.results || []).slice(0, 12).map(mapTmdbSummaryToCard)
        cards.forEach(setCachedMovie)
        setTmdbMovies(cards)
      })
      .catch(() => {
        if (!cancelled) setTmdbMovies([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeTab])

  const movies = activeTab === 'trending' ? LOCAL_MOVIES : tmdbMovies

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
      <div className="trailers-page__back-bar">
        <button type="button" className="trailers-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="trailers-page">
        <h1>{t('trailers_heading')}</h1>

        <div className="trailers-page__tabs">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.key}
              className={`trailers-page__tab${tab.key === activeTab ? ' trailers-page__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="trailers-page__status">{t('loading')}</p>
        ) : movies.length === 0 ? (
          <p className="trailers-page__status">{t('no_trailers_found')}</p>
        ) : (
          <div className="trailers-page__grid">
            {movies.map((movie) => {
              const saved = isSaved(movie.slug)
              const pending = pendingTrailerFor === movie.slug
              const unavailable = unavailableFor === movie.slug
              return (
                <div className="trailers-page__card" key={movie.slug}>
                  <div
                    className="trailers-page__poster trailers-page__poster--clickable"
                    onClick={() => onOpenTitle?.(movie.slug)}
                  >
                    <img src={movie.poster} alt="" />
                    <button
                      type="button"
                      className={`trailers-page__bookmark${saved ? ' trailers-page__bookmark--saved' : ''}`}
                      aria-label={t('add_to_watchlist')}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSave(movie.slug)
                      }}
                    >
                      <img src={iconBookmark} alt="" />
                    </button>
                    <button
                      type="button"
                      className={`trailers-page__play${unavailable ? ' trailers-page__play--unavailable' : ''}`}
                      disabled={pending}
                      onClick={(e) => {
                        e.stopPropagation()
                        playTrailer(movie)
                      }}
                    >
                      <img src={iconPlay} alt="" />
                      <span>{pending ? '…' : unavailable ? t('trailer_unavailable') : t('trailer')}</span>
                    </button>
                  </div>
                  <div className="trailers-page__info">
                    <span className="trailers-page__year">{movie.year}</span>
                    <button
                      type="button"
                      className="trailers-page__title"
                      onClick={() => onOpenTitle?.(movie.slug)}
                    >
                      {movie.title}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <Footer />

      {activeTrailer && (
        <TrailerModal
          videoId={activeTrailer.trailerId}
          title={activeTrailer.title}
          onClose={() => setActiveTrailer(null)}
        />
      )}
    </>
  )
}

export default TrailersPage
