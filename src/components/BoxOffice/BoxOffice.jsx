import iconDot from './assets/icon-dot.svg'
import iconArrowLink from './assets/icon-arrow-link.svg'
import posterKungfupanda from './assets/poster-kungfupanda.png'
import posterDune from './assets/poster-dune.png'
import posterImaginary from './assets/poster-imaginary.png'
import posterCabrini from './assets/poster-cabrini.png'
import posterBobmarley from './assets/poster-bobmarley.png'
import posterOrdinaryangels from './assets/poster-ordinaryangels.png'
import iconBookmark from '../../assets/movie-ui/icon-bookmark.svg'
import iconStar from '../../assets/movie-ui/icon-star.svg'
import RateButton from '../RateButton/RateButton.jsx'
import iconInfo from '../../assets/movie-ui/icon-info.svg'
import { useWatchlist } from '../../context/WatchlistContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './BoxOffice.css'

const MOVIES = [
  { rank: 1, poster: posterKungfupanda, title: 'Kung Fu Panda 4', gross: '$58M', rating: '6.6', titleSlug: 'kung-fu-panda-4' },
  { rank: 2, poster: posterDune, title: 'Dune: Part Two', gross: '$46M', rating: '8.9', titleSlug: 'dune-part-two' },
  { rank: 3, poster: posterImaginary, title: 'Imaginary', gross: '$9.9M', rating: '4.8', titleSlug: 'imaginary' },
  { rank: 4, poster: posterCabrini, title: 'Cabrini', gross: '$7.2M', rating: '8.0', titleSlug: 'cabrini' },
  { rank: 5, poster: posterBobmarley, title: 'Bob Marley: One Love', gross: '$4.1M', rating: '6.5', titleSlug: 'bob-marley-one-love' },
  { rank: 6, poster: posterOrdinaryangels, title: 'Ordinary Angels', gross: '$2M', rating: '7.8', titleSlug: 'ordinary-angels' },
]

function BoxOffice({ onOpenTitle }) {
  const { isSaved, toggleSave } = useWatchlist()
  const { t } = useLanguage()
  return (
    <section className="box-office">
      <div className="box-office__heading">
        <div className="box-office__title">
          <img src={iconDot} alt="" className="box-office__title-dot" />
          <h2>{t('boxoffice_title')}</h2>
          <img src={iconArrowLink} alt="" className="box-office__title-arrow" />
        </div>
        <p className="box-office__subtitle">{t('boxoffice_subtitle')}</p>
      </div>

      <div className="box-office__grid">
        {MOVIES.map((movie) => {
          const saved = isSaved(movie.titleSlug)
          return (
          <div className="box-office__card" key={movie.rank}>
            <div className="box-office__rank">
              <span>{movie.rank}</span>
              <div className="box-office__rank-bar" />
            </div>
            <div
              className={`box-office__poster${movie.titleSlug ? ' box-office__poster--clickable' : ''}`}
              onClick={movie.titleSlug ? () => onOpenTitle?.(movie.titleSlug) : undefined}
            >
              <img src={movie.poster} alt="" />
              <button
                type="button"
                className={`box-office__bookmark${saved ? ' box-office__bookmark--saved' : ''}`}
                aria-label={t('add_to_watchlist')}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSave(movie.titleSlug)
                }}
              >
                <img src={iconBookmark} alt="" />
              </button>
            </div>
            <div className="box-office__info">
              {movie.titleSlug ? (
                <button
                  type="button"
                  className="box-office__movie-title box-office__movie-title--link"
                  onClick={() => onOpenTitle?.(movie.titleSlug)}
                >
                  {movie.title}
                </button>
              ) : (
                <p className="box-office__movie-title">{movie.title}</p>
              )}
              <p className="box-office__gross">{movie.gross}</p>
              <div className="box-office__meta">
                <div className="box-office__rating">
                  <img src={iconStar} alt="" />
                  <span>{movie.rating}</span>
                </div>
                <RateButton slug={movie.titleSlug} className="box-office__rate" />
                <button
                  type="button"
                  className="box-office__info-btn"
                  aria-label={t('aria_more_info')}
                  disabled={!movie.titleSlug}
                  onClick={() => movie.titleSlug && onOpenTitle?.(movie.titleSlug)}
                >
                  <img src={iconInfo} alt="" />
                </button>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}

export default BoxOffice
