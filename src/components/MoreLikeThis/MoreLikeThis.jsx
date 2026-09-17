import { useState } from 'react'
import { MOVIES } from '../../data/movies.js'
import { useWatchlist } from '../../context/WatchlistContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import iconBookmark from '../../assets/movie-ui/icon-bookmark.svg'
import iconStar from '../../assets/movie-ui/icon-star.svg'
import RateButton from '../RateButton/RateButton.jsx'
import iconPlay from '../../assets/movie-ui/icon-play.svg'
import TrailerModal from '../TrailerModal/TrailerModal.jsx'
import './MoreLikeThis.css'

function pickSimilar(currentSlug) {
  const current = MOVIES[currentSlug]
  const others = Object.values(MOVIES).filter((m) => m.slug !== currentSlug)
  if (!current) return others.slice(0, 5)
  const sameGenre = others.filter((m) => m.genres.some((g) => current.genres.includes(g)))
  const rest = others.filter((m) => !sameGenre.includes(m))
  return [...sameGenre, ...rest].slice(0, 5)
}

function MoreLikeThis({ movie: currentMovie, onOpenTitle }) {
  const { isSaved, toggleSave } = useWatchlist()
  const { t } = useLanguage()
  const movies = currentMovie?.similarMovies?.length
    ? currentMovie.similarMovies
    : pickSimilar(currentMovie?.slug)
  const [trailer, setTrailer] = useState(null)

  return (
    <section className="more-like-this">
      <h2>{t('more_like_this_title')}</h2>

      <div className="more-like-this__grid">
        {movies.map((movie) => {
          const saved = isSaved(movie.slug)
          return (
            <div className="more-like-this__card" key={movie.slug}>
              <div className="more-like-this__poster" onClick={() => onOpenTitle?.(movie.slug)}>
                <img src={movie.poster} alt="" />
                <button
                  type="button"
                  className={`more-like-this__bookmark${saved ? ' more-like-this__bookmark--saved' : ''}`}
                  aria-label={t('add_to_watchlist')}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSave(movie.slug)
                  }}
                >
                  <img src={iconBookmark} alt="" />
                </button>
              </div>
              <button
                type="button"
                className="more-like-this__title"
                onClick={() => onOpenTitle?.(movie.slug)}
              >
                {movie.title}
              </button>
              <div className="more-like-this__meta">
                <div className="more-like-this__rating">
                  <img src={iconStar} alt="" />
                  <span>{movie.score}</span>
                </div>
                <RateButton slug={movie.slug} className="more-like-this__rate" />
              </div>
              <button
                type="button"
                className="more-like-this__trailer"
                disabled={!movie.trailerId}
                onClick={() => movie.trailerId && setTrailer(movie)}
              >
                <img src={iconPlay} alt="" />
                <span>{t('trailer')}</span>
                <span className="more-like-this__trailer-dot" />
                <span>00:31</span>
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

export default MoreLikeThis
