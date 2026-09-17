import { useEffect, useState } from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { useWatchlist } from '../context/WatchlistContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getTopRatedMovies } from '../services/tmdb.js'
import { mapTmdbSummaryToCard } from '../adapters/tmdbMovie.js'
import { setCachedMovie } from '../services/tmdbMovieCache.js'
import iconBookmark from '../assets/movie-ui/icon-bookmark.svg'
import iconStar from '../assets/movie-ui/icon-star.svg'
import './TopListPage.css'

function AwardsPage(props) {
  const { onBack, onOpenTitle } = props
  const { isSaved, toggleSave } = useWatchlist()
  const { t } = useLanguage()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getTopRatedMovies()
      .then((data) => {
        if (cancelled) return
        const cards = (data.results || []).slice(0, 20).map(mapTmdbSummaryToCard)
        cards.forEach(setCachedMovie)
        setMovies(cards)
      })
      .catch(() => {
        if (!cancelled) setMovies([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Header {...props} />
      <div className="top-list-page__back-bar">
        <button type="button" className="top-list-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="top-list-page">
        <div className="top-list-page__heading">
          <p className="top-list-page__eyebrow">{t('awards_eyebrow')}</p>
          <h1>{t('awards_heading')}</h1>
          <p className="top-list-page__subtitle">{t('awards_subtitle')}</p>
        </div>

        <div className="top-list-page__body">
          <div className="top-list-page__list-col" style={{ width: '100%' }}>
            <div className="top-list-page__list-header">
              <span>{t('sort_by_rating')}</span>
              <span className="top-list-page__list-count">{movies.length} {t('titles_count')}</span>
            </div>

            {loading ? (
              <p style={{ color: 'var(--site-text-secondary)' }}>{t('loading')}</p>
            ) : (
              <ol className="top-list-page__list">
                {movies.map((movie, i) => {
                  const saved = isSaved(movie.slug)
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
                        <button
                          type="button"
                          className="top-list-page__title"
                          onClick={() => onOpenTitle?.(movie.slug)}
                        >
                          {movie.title}
                        </button>
                        <div className="top-list-page__meta">
                          <span>{movie.year}</span>
                        </div>
                        <p className="top-list-page__plot">{movie.plot}</p>
                      </div>

                      <div className="top-list-page__side">
                        <div className="top-list-page__rating">
                          <img src={iconStar} alt="" />
                          <span>{movie.score}</span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default AwardsPage
