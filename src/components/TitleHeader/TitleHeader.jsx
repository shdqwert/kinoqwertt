import { useEffect, useState } from 'react'
import { usePosterPalette } from '../../hooks/usePosterPalette.js'
import { useParallax } from '../../hooks/useParallax.js'
import ThemeDecor from '../ThemeDecor/ThemeDecor.jsx'
import SpiderManMascot from '../SpiderManMascot/SpiderManMascot.jsx'
import MovieScene from '../scenes/MovieScene.jsx'
import PosterAtmosphere from './PosterAtmosphere.jsx'
import TrailerModal from '../TrailerModal/TrailerModal.jsx'
import RateButton from '../RateButton/RateButton.jsx'
import { useWatchlist } from '../../context/WatchlistContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import iconArrowLight from './assets/icon-arrow-light.svg'
import iconPlay from './assets/icon-play.svg'
import iconDotYellow from './assets/icon-dot-yellow.svg'
import divider from './assets/divider.svg'
import iconDotGray from './assets/icon-dot-gray.svg'
import iconMetascore from './assets/icon-metascore.png'
import iconStar from './assets/icon-star.svg'
import iconTrending from './assets/icon-trending.svg'
import './TitleHeader.css'

function TitleHeader({ movie, onOpenGenre }) {
  // The whole page accent (and the hero background below) comes from colors
  // quantized straight out of this movie's own poster — never from a preset
  // or genre-based palette — so every title looks like itself.
  const palette = usePosterPalette(movie.poster)
  const accent = palette?.colors?.[0] || '#f5c518'
  const secondary = palette?.colors?.[1] || '#797979'
  const parallaxRef = useParallax(0.12)
  const { isSaved, toggleSave } = useWatchlist()
  const { t } = useLanguage()
  const saved = isSaved(movie.slug)
  const [trailerOpen, setTrailerOpen] = useState(false)

  // Themes the whole page (footer, nav hovers, decor colors, etc.) to match
  // this movie for as long as its title page is on screen.
  useEffect(() => {
    document.documentElement.style.setProperty('--movie-accent', accent)
    document.documentElement.style.setProperty('--movie-accent-secondary', secondary)
    return () => {
      document.documentElement.style.removeProperty('--movie-accent')
      document.documentElement.style.removeProperty('--movie-accent-secondary')
    }
  }, [accent, secondary])

  const infoRows = [
    { label: t('label_plot'), value: movie.plot, plain: true },
    { label: t('label_director'), value: movie.director },
    { label: t('label_writers'), value: movie.writers.join(' • ') },
    { label: t('label_stars'), value: movie.stars.join(' • ') },
    { label: t('label_awards'), value: movie.awards },
  ].filter((row) => row.value)

  return (
    <section className="title-header" key={movie.slug}>
      <PosterAtmosphere poster={movie.poster} slug={movie.slug} palette={palette} />
      <ThemeDecor motif={movie.theme?.motif} />
      <MovieScene scene={movie.theme?.scene} />
      {movie.theme?.mascot === 'spiderman' && <SpiderManMascot />}
      <div className="title-header__top">
        <div className="title-header__title-block">
          <h1>{movie.title}</h1>
          <div className="title-header__chips">
            <span>{movie.year}</span>
            <img src={iconDotGray} alt="" />
            <span>{movie.rated}</span>
            <img src={iconDotGray} alt="" />
            <span>{movie.runtime}</span>
          </div>
        </div>
        <div className="title-header__actions">
          <RateButton slug={movie.slug} className="title-header__btn" />
          <button type="button" className="title-header__btn title-header__btn--rating">
            <img src={iconStar} alt="" />
            <span className="title-header__rating-value">{movie.score}</span>
            <span className="title-header__rating-max">/10</span>
            <span className="title-header__rating-count">({movie.scoreCount})</span>
          </button>
          {movie.rank && (
            <button type="button" className="title-header__btn title-header__btn--rank">
              <img src={iconTrending} alt="" />
              <span>{movie.rank}</span>
            </button>
          )}
          <a
            className="title-header__btn title-header__btn--watch"
            href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`}
            target="_blank"
            rel="noreferrer"
            title="Opens JustWatch — official legal streaming/rental options for this title"
          >
            <img src={iconPlay} alt="" />
            <span>{t('where_to_watch')}</span>
          </a>
        </div>
      </div>

      <div className="title-header__media">
        <div className="title-header__poster">
          <img src={movie.poster} alt={`${movie.title} poster`} crossOrigin="anonymous" />
        </div>
        <div className="title-header__backdrop" onClick={() => movie.trailerId && setTrailerOpen(true)}>
          <img ref={parallaxRef} src={movie.backdrop} alt="" className="title-header__backdrop-img" />
          <button
            type="button"
            className="title-header__trailer-btn"
            onClick={(e) => {
              e.stopPropagation()
              if (movie.trailerId) setTrailerOpen(true)
            }}
          >
            <img src={iconPlay} alt="" />
            <span>{t('trailer')}</span>
            <img src={iconDotGray} alt="" />
            <span className="title-header__trailer-duration">00:31</span>
          </button>
        </div>
      </div>

      {trailerOpen && (
        <TrailerModal
          videoId={movie.trailerId}
          title={movie.title}
          onClose={() => setTrailerOpen(false)}
        />
      )}

      <div className="title-header__bottom">
        <div className="title-header__info">
          <div className="title-header__info-row">
            <span className="title-header__info-label">{t('label_genre')}</span>
            <div className="title-header__genres">
              {movie.genres.map((genre) => (
                <button
                  type="button"
                  className="title-header__genre-pill"
                  key={genre}
                  onClick={() => onOpenGenre?.(genre)}
                  disabled={!onOpenGenre}
                >
                  {t(genre)}
                </button>
              ))}
            </div>
          </div>
          {infoRows.map((row) => (
            <div className="title-header__info-row" key={row.label}>
              <span className="title-header__info-label">{row.label}</span>
              <span className={row.plain ? 'title-header__info-plain' : 'title-header__info-value'}>{row.value}</span>
            </div>
          ))}
          <div className="title-header__info-row">
            <span className="title-header__info-label">{t('label_reviews')}</span>
            <span className="title-header__info-value">
              {movie.reviews.user} {t('user_reviews_short')} • {movie.reviews.critic} {t('critic_reviews_short')}
              {movie.reviews.metascore && (
                <>
                  {' • '}<img src={iconMetascore} alt="" className="title-header__metascore" /> {t('metascore_label')}
                </>
              )}
            </span>
          </div>
        </div>
        <button
          type="button"
          className={`title-header__watchlist-btn${saved ? ' title-header__watchlist-btn--saved' : ''}`}
          onClick={() => toggleSave(movie.slug)}
        >
          <span>52K</span>
          <img src={iconDotYellow} alt="" />
          <span>{saved ? t('in_watchlist') : t('add_to_watchlist')}</span>
          <img src={divider} alt="" className="title-header__divider" />
          <img src={iconArrowLight} alt="" />
        </button>
      </div>
    </section>
  )
}

export default TitleHeader
