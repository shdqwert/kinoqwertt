import iconDot from './assets/icon-dot.svg'
import iconArrowLink from './assets/icon-arrow-link.svg'
import arrowPrev from './assets/arrow-prev.svg'
import arrowNext from './assets/arrow-next.svg'
import iconBookmark from './assets/icon-bookmark.svg'
import iconCalendar from './assets/icon-calendar.svg'
import iconPlay from './assets/icon-play.svg'
import photoGodzilla from './assets/photo-godzilla.png'
import photoGhostbusters from './assets/photo-ghostbusters.png'
import photoImmaculate from './assets/photo-immaculate.png'
import photoChallengers from './assets/photo-challengers.png'
import { useWatchlist } from '../../context/WatchlistContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js'
import './ComingSoon.css'

const MOVIES = [
  { key: 'godzilla', photo: photoGodzilla, date: 'March 29', title: 'Godzilla x Kong: The New Empire', gradient: true, bookmark: true, titleSlug: 'godzilla-x-kong-the-new-empire' },
  { key: 'ghostbusters', photo: photoGhostbusters, date: 'March 22', title: 'Ghostbusters: Frozen Empire', titleSlug: 'ghostbusters-frozen-empire' },
  { key: 'immaculate', photo: photoImmaculate, date: 'March 22', title: 'Immaculate', titleSlug: 'immaculate' },
  { key: 'challengers', photo: photoChallengers, date: 'April 26', title: 'Challengers', titleSlug: 'challengers' },
]

function ComingSoon({ onOpenTitle }) {
  const { isSaved, toggleSave } = useWatchlist()
  const { t } = useLanguage()
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll()
  return (
    <section className="coming-soon">
      <div className="coming-soon__header">
        <div className="coming-soon__heading">
          <div className="coming-soon__title">
            <img src={iconDot} alt="" className="coming-soon__title-dot" />
            <h2>{t('comingsoon_title')}</h2>
            <img src={iconArrowLink} alt="" className="coming-soon__title-arrow" />
          </div>
          <p className="coming-soon__subtitle">{t('comingsoon_subtitle')}</p>
        </div>
        <div className="coming-soon__nav">
          <button type="button" className="coming-soon__arrow coming-soon__arrow--prev" aria-label={t('aria_previous')} onClick={scrollPrev} disabled={!canPrev}>
            <img src={arrowPrev} alt="" />
          </button>
          <button type="button" className="coming-soon__arrow" aria-label={t('aria_next')} onClick={scrollNext} disabled={!canNext}>
            <img src={arrowNext} alt="" />
          </button>
        </div>
      </div>

      <div className="coming-soon__list" ref={ref}>
        {MOVIES.map((movie) => (
          <div className="coming-soon__card" key={movie.key}>
            <div
              className={`coming-soon__card-image${movie.gradient ? ' coming-soon__card-image--gradient' : ''}${movie.titleSlug ? ' coming-soon__card-image--clickable' : ''}`}
              onClick={movie.titleSlug ? () => onOpenTitle?.(movie.titleSlug) : undefined}
            >
              <img src={movie.photo} alt="" />
              <span className="coming-soon__badge">
                <img src={iconPlay} alt="" />
                2:50
              </span>
              {movie.bookmark && (
                <button
                  type="button"
                  className={`coming-soon__bookmark${isSaved(movie.titleSlug) ? ' coming-soon__bookmark--saved' : ''}`}
                  aria-label={t('add_to_watchlist')}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSave(movie.titleSlug)
                  }}
                >
                  <img src={iconBookmark} alt="" />
                </button>
              )}
            </div>
            <div className="coming-soon__caption">
              <div className="coming-soon__date">
                <img src={iconCalendar} alt="" />
                <span>{movie.date}</span>
              </div>
              {movie.titleSlug ? (
                <button
                  type="button"
                  className="coming-soon__movie-title coming-soon__movie-title--link"
                  onClick={() => onOpenTitle?.(movie.titleSlug)}
                >
                  {movie.title}
                </button>
              ) : (
                <p className="coming-soon__movie-title">{movie.title}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ComingSoon
