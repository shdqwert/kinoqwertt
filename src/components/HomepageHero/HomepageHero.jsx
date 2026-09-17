import { useState } from 'react'
import iconArrow from './assets/icon-arrow.svg'
import iconBookmark from './assets/icon-bookmark.svg'
import ellipseDot from './assets/ellipse-dot.svg'
import ellipsePlayBg from './assets/ellipse-play-bg.svg'
import iconPlay from './assets/icon-play.svg'
import arrowPrev from './assets/arrow-prev.svg'
import arrowNext from './assets/arrow-next.svg'
import ratingBadge from './assets/rating-badge.svg'
import photoFalloutBg from './assets/photo-fallout-bg.png'
import photoFalloutPoster from './assets/photo-fallout-poster.png'
import photoInsideoutBg from './assets/photo-insideout-bg.png'
import photoInsideoutPosterSmall from './assets/photo-insideout-poster-small.png'
import photoDuneBg from './assets/photo-dune-bg.png'
import photoDunePoster from './assets/photo-dune-poster.png'
import photoInsideoutPosterLarge from './assets/photo-insideout-poster-large.png'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useWatchlist } from '../../context/WatchlistContext.jsx'
import { getMovie } from '../../data/movies.js'
import { getMovieVideos, getTvVideos } from '../../services/tmdb.js'
import { pickTrailerKey } from '../../utils/pickTrailerKey.js'
import TrailerModal from '../TrailerModal/TrailerModal.jsx'
import './HomepageHero.css'

// Real, openable titles behind each card — Fallout and Inside Out 2 by their
// TMDB ids (found via search), Dune by the local catalog entry that already
// has full details and a known trailer.
const FEATURED_VIDEOS = [
  {
    key: 'fallout',
    className: 'hero__card--fallout',
    bg: photoFalloutBg,
    poster: photoFalloutPoster,
    titleKey: 'hero_fallout_title',
    subtitleKey: 'hero_fallout_subtitle',
    duration: '3:18',
    playLeft: 303,
    playTop: 112,
    slug: 'tv-106379',
  },
  {
    key: 'insideout',
    className: 'hero__card--insideout',
    bg: photoInsideoutBg,
    poster: photoInsideoutPosterSmall,
    mainPoster: photoInsideoutPosterLarge,
    titleKey: 'hero_insideout_title',
    subtitleKey: 'hero_insideout_subtitle',
    duration: '3:18',
    playLeft: 297,
    playTop: 114,
    slug: '1022789',
  },
  {
    key: 'dune',
    className: 'hero__card--dune',
    bg: photoDuneBg,
    poster: photoDunePoster,
    titleKey: 'hero_dune_title',
    subtitleKey: 'hero_dune_subtitle',
    duration: '3:18',
    playLeft: 297,
    playTop: 114,
    slug: 'dune-part-two',
  },
]

function HomepageHero({ onOpenWatch, onOpenTitle }) {
  const { t } = useLanguage()
  const { isSaved, toggleSave } = useWatchlist()
  const [activeIndex, setActiveIndex] = useState(1)
  const [trailerKeys, setTrailerKeys] = useState({})
  const [pendingTrailerFor, setPendingTrailerFor] = useState(null)
  const [activeTrailer, setActiveTrailer] = useState(null)
  const active = FEATURED_VIDEOS[activeIndex]
  const goTo = (i) => setActiveIndex((i + FEATURED_VIDEOS.length) % FEATURED_VIDEOS.length)

  const playTrailer = async (video) => {
    const known = trailerKeys[video.key] ?? getMovie(video.slug)?.trailerId
    if (known) {
      setActiveTrailer({ ...video, trailerId: known })
      return
    }
    setPendingTrailerFor(video.key)
    try {
      const isTv = video.slug.startsWith('tv-')
      const videos = isTv ? await getTvVideos(video.slug.slice(3)) : await getMovieVideos(video.slug)
      const key = pickTrailerKey(videos)
      if (key) {
        setTrailerKeys((prev) => ({ ...prev, [video.key]: key }))
        setActiveTrailer({ ...video, trailerId: key })
      }
    } catch {
      // no trailer available — leave the modal closed
    } finally {
      setPendingTrailerFor(null)
    }
  }

  return (
    <div className="hero-section">
    <div className="hero">
      <div className="hero__glow" />

      <div className="hero__badge">
        <img src={ellipseDot} alt="" className="hero__badge-dot" />
        <p className="hero__badge-text">{t('hero_badge')}</p>
      </div>

      <a href="#" className="hero__browse-btn" onClick={(e) => { e.preventDefault(); onOpenWatch?.() }}>
        <span>{t('hero_browse_trailers')}</span>
        <img src={iconArrow} alt="" className="hero__browse-btn-icon" />
      </a>

      <div className="hero__main-image">
        <img src={active.bg} alt="" />
      </div>

      <button type="button" className="hero__poster-large-btn" onClick={() => onOpenTitle?.(active.slug)}>
        <img src={active.mainPoster || active.poster} alt="" className="hero__poster-large" />
      </button>

      <button
        type="button"
        className={`hero__bookmark${isSaved(active.slug) ? ' hero__bookmark--saved' : ''}`}
        aria-label={t('add_to_watchlist')}
        onClick={() => toggleSave(active.slug)}
      >
        <img src={iconBookmark} alt="" />
      </button>

      <div className="hero__pagination">
        <div className="hero__pagination-dots">
          {FEATURED_VIDEOS.map((video, i) => (
            <button
              type="button"
              key={video.key}
              className={`hero__dot${i === activeIndex ? ' hero__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={t(video.titleKey)}
            />
          ))}
        </div>
        <div className="hero__pagination-arrows">
          <button type="button" className="hero__arrow hero__arrow--prev" onClick={() => goTo(activeIndex - 1)} aria-label={t('aria_previous')}>
            <img src={arrowPrev} alt="" />
          </button>
          <button type="button" className="hero__arrow hero__arrow--next" onClick={() => goTo(activeIndex + 1)} aria-label={t('aria_next')}>
            <img src={arrowNext} alt="" />
          </button>
        </div>
      </div>

      <div className="hero__title-block">
        <button
          type="button"
          className="hero__title-icon-btn"
          disabled={pendingTrailerFor === active.key}
          onClick={() => playTrailer(active)}
          aria-label={t('trailer')}
        >
          <img src={ratingBadge} alt="" className="hero__title-icon" />
        </button>
        <button type="button" className="hero__title-text" onClick={() => onOpenTitle?.(active.slug)}>
          <p className="hero__title-heading">{t(active.titleKey)}</p>
          <p className="hero__title-sub">{t(active.subtitleKey)}</p>
        </button>
      </div>

      {FEATURED_VIDEOS.map((video, i) => (
        <div
          role="button"
          tabIndex={0}
          key={video.key}
          className={`hero__card ${video.className}${i === activeIndex ? ' hero__card--active' : ''}`}
          onClick={() => onOpenTitle?.(video.slug)}
          onKeyDown={(e) => { if (e.key === 'Enter') onOpenTitle?.(video.slug) }}
        >
          <div className="hero__card-bg">
            <img src={video.bg} alt="" />
            <div className="hero__card-overlay" />
          </div>
          <img src={video.poster} alt="" className="hero__card-poster" />
          <button
            type="button"
            className="hero__card-play"
            style={{ left: video.playLeft, top: video.playTop }}
            disabled={pendingTrailerFor === video.key}
            aria-label={t('trailer')}
            onClick={(e) => {
              e.stopPropagation()
              playTrailer(video)
            }}
          >
            <img src={ellipsePlayBg} alt="" className="hero__card-play-bg" />
            <img src={iconPlay} alt="" className="hero__card-play-icon" />
          </button>
          <div className="hero__card-info">
            <p className="hero__card-title">{t(video.titleKey)}</p>
            <p className="hero__card-subtitle">{t(video.subtitleKey)}</p>
          </div>
          <p className="hero__card-duration">{video.duration}</p>
        </div>
      ))}
    </div>

      {activeTrailer && (
        <TrailerModal
          videoId={activeTrailer.trailerId}
          title={t(activeTrailer.titleKey)}
          onClose={() => setActiveTrailer(null)}
        />
      )}
    </div>
  )
}

export default HomepageHero
