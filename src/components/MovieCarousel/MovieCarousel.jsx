import { useState } from 'react'
import iconDot from '../../assets/movie-ui/icon-dot.svg'
import arrowPrev from '../../assets/movie-ui/arrow-prev.svg'
import arrowNext from '../../assets/movie-ui/arrow-next.svg'
import iconBookmark from '../../assets/movie-ui/icon-bookmark.svg'
import iconStar from '../../assets/movie-ui/icon-star.svg'
import RateButton from '../RateButton/RateButton.jsx'
import iconInfo from '../../assets/movie-ui/icon-info.svg'
import iconPlay from '../../assets/movie-ui/icon-play.svg'
import { useWatchlist } from '../../context/WatchlistContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { getMovie } from '../../data/movies.js'
import TrailerModal from '../TrailerModal/TrailerModal.jsx'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js'
import './MovieCarousel.css'

function MovieCarousel({ title, subtitle, titleIcon, movies, onOpenTitle }) {
  const { isSaved, toggleSave } = useWatchlist()
  const { t } = useLanguage()
  const [trailer, setTrailer] = useState(null)
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll()

  return (
    <section className="movie-carousel">
      <div className="movie-carousel__header">
        <div className="movie-carousel__heading">
          <div className="movie-carousel__title">
            <img src={iconDot} alt="" className="movie-carousel__title-dot" />
            <h2>{title}</h2>
            {titleIcon && <img src={titleIcon} alt="" className="movie-carousel__title-icon" />}
          </div>
          {subtitle && <p className="movie-carousel__subtitle">{subtitle}</p>}
        </div>
        <div className="movie-carousel__nav">
          <button type="button" className="movie-carousel__arrow" aria-label={t('aria_previous')} onClick={scrollPrev} disabled={!canPrev}>
            <img src={arrowPrev} alt="" />
          </button>
          <button type="button" className="movie-carousel__arrow" aria-label={t('aria_next')} onClick={scrollNext} disabled={!canNext}>
            <img src={arrowNext} alt="" />
          </button>
        </div>
      </div>

      <div className="movie-carousel__list" ref={ref}>
        {movies.map((movie) => {
          const watchId = movie.titleSlug || movie.key
          const saved = isSaved(watchId)
          const fullMovie = movie.titleSlug ? getMovie(movie.titleSlug) : null
          return (
          <div className="movie-carousel__card" key={movie.key}>
            <div
              className={`movie-carousel__poster${movie.titleSlug ? ' movie-carousel__poster--clickable' : ''}`}
              onClick={movie.titleSlug ? () => onOpenTitle?.(movie.titleSlug) : undefined}
            >
              <img src={movie.poster} alt="" />
              <button
                type="button"
                className={`movie-carousel__bookmark${saved ? ' movie-carousel__bookmark--saved' : ''}`}
                aria-label={t('add_to_watchlist')}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSave(watchId)
                }}
              >
                <img src={iconBookmark} alt="" />
              </button>
            </div>
            {movie.href ? (
              <a href={movie.href} target="_blank" rel="noreferrer" className="movie-carousel__movie-title">
                {movie.title}
              </a>
            ) : movie.titleSlug ? (
              <button
                type="button"
                className="movie-carousel__movie-title movie-carousel__movie-title--link"
                onClick={() => onOpenTitle?.(movie.titleSlug)}
              >
                {movie.title}
              </button>
            ) : (
              <p className="movie-carousel__movie-title">{movie.title}</p>
            )}
            <div className="movie-carousel__meta">
              <div className="movie-carousel__rating">
                <img src={iconStar} alt="" />
                <span>{movie.rating}</span>
              </div>
              <RateButton slug={watchId} className="movie-carousel__rate" />
              <button
                type="button"
                className="movie-carousel__info"
                aria-label={t('aria_more_info')}
                disabled={!movie.titleSlug}
                onClick={() => movie.titleSlug && onOpenTitle?.(movie.titleSlug)}
              >
                <img src={iconInfo} alt="" />
              </button>
            </div>
            <button
              type="button"
              className="movie-carousel__trailer"
              disabled={!fullMovie?.trailerId}
              onClick={() => fullMovie?.trailerId && setTrailer(fullMovie)}
            >
              <img src={iconPlay} alt="" />
              <span>{t('trailer')}</span>
            </button>
          </div>
          )
        })}
      </div>

      {trailer && (
        <TrailerModal videoId={trailer.trailerId} title={trailer.title} onClose={() => setTrailer(null)} />
      )}
    </section>
  )
}

export default MovieCarousel
