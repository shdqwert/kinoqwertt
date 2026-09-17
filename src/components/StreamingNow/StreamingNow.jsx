import { useEffect, useState } from 'react'
import arrowPrev from './assets/arrow-prev.svg'
import arrowNext from './assets/arrow-next.svg'
import iconBookmark from '../../assets/movie-ui/icon-bookmark.svg'
import iconStar from '../../assets/movie-ui/icon-star.svg'
import RateButton from '../RateButton/RateButton.jsx'
import iconInfo from '../../assets/movie-ui/icon-info.svg'
import { useWatchlist } from '../../context/WatchlistContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js'
import { MOVIES } from '../../data/movies.js'
import { getNowPlayingMovies } from '../../services/tmdb.js'
import { mapTmdbSummaryToCard } from '../../adapters/tmdbMovie.js'
import { setCachedMovie } from '../../services/tmdbMovieCache.js'
import './StreamingNow.css'

const PLATFORMS = ['Prime Video', 'Disney+', 'Hulu', 'Netflix', 'HBO Max']

// "Streaming now" isn't a real watch-provider feed here — it's the local
// curated title plus TMDB's currently-playing list, so the row is never
// left mostly empty for lack of matching mock entries.
const CURATED_TITLES = ['dune-part-two'].map((slug) => MOVIES[slug]).filter(Boolean)

function StreamingNow({ onOpenTitle }) {
  const { isSaved, toggleSave } = useWatchlist()
  const { t } = useLanguage()
  const [activePlatform, setActivePlatform] = useState(PLATFORMS[0])
  const [fillTitles, setFillTitles] = useState([])
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll()

  useEffect(() => {
    let cancelled = false
    getNowPlayingMovies()
      .then((data) => {
        if (cancelled) return
        const cards = (data.results || [])
          .filter((m) => m.id !== 438631)
          .slice(0, 8)
          .map(mapTmdbSummaryToCard)
        cards.forEach(setCachedMovie)
        setFillTitles(cards)
      })
      .catch(() => {
        if (!cancelled) setFillTitles([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const TITLES = [...CURATED_TITLES, ...fillTitles]

  return (
    <section className="streaming-now">
      <div className="streaming-now__header">
        <div className="streaming-now__tabs">
          {PLATFORMS.map((platform) => (
            <button
              type="button"
              key={platform}
              className={`streaming-now__tab${platform === activePlatform ? ' streaming-now__tab--active' : ''}`}
              onClick={() => setActivePlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </div>
        <div className="streaming-now__nav">
          <button type="button" className="streaming-now__arrow streaming-now__arrow--prev" aria-label={t('aria_previous')} onClick={scrollPrev} disabled={!canPrev}>
            <img src={arrowPrev} alt="" />
          </button>
          <button type="button" className="streaming-now__arrow" aria-label={t('aria_next')} onClick={scrollNext} disabled={!canNext}>
            <img src={arrowNext} alt="" />
          </button>
        </div>
      </div>

      <div className="streaming-now__list" ref={ref}>
        {TITLES.map((item) => (
          <a
            href="#"
            className="streaming-now__card"
            key={item.slug}
            onClick={(e) => {
              e.preventDefault()
              onOpenTitle?.(item.slug)
            }}
          >
            <div className="streaming-now__poster">
              <img src={item.poster} alt="" />
              <button
                type="button"
                className={`streaming-now__bookmark${isSaved(item.slug) ? ' streaming-now__bookmark--saved' : ''}`}
                aria-label={t('add_to_watchlist')}
                onClick={(e) => {
                  e.preventDefault()
                  toggleSave(item.slug)
                }}
              >
                <img src={iconBookmark} alt="" />
              </button>
            </div>
            <p className="streaming-now__title">{item.title}</p>
            <div className="streaming-now__meta">
              <div className="streaming-now__rating">
                <img src={iconStar} alt="" />
                <span>{item.score}</span>
              </div>
              <RateButton slug={item.slug} className="streaming-now__rate" />
              <button
                type="button"
                className="streaming-now__info"
                aria-label={t('aria_more_info')}
                onClick={(e) => {
                  e.preventDefault()
                  onOpenTitle?.(item.slug)
                }}
              >
                <img src={iconInfo} alt="" />
              </button>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default StreamingNow
