import iconDot from './assets/icon-dot.svg'
import arrowPrev from './assets/arrow-prev.svg'
import arrowNext from './assets/arrow-next.svg'
import iconPlay from './assets/icon-play.svg'
import photoVideo from './assets/photo-video.png'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './ImdbOriginals.css'

const VIDEOS = [
  { key: 'women-directors', duration: '2:50', titleKey: 'originals_women_title' },
  { key: 'oscars-photos', duration: '2:50', titleKey: 'originals_oscars_title' },
  { key: 'red-carpet', duration: '2:50', titleKey: 'originals_redcarpet_title' },
  { key: 'staff-picks', duration: '2:50', titleKey: 'originals_staffpicks_title' },
]

function ImdbOriginals() {
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll()
  const { t } = useLanguage()

  return (
    <section className="imdb-originals">
      <div className="imdb-originals__header">
        <div className="imdb-originals__heading">
          <div className="imdb-originals__title">
            <img src={iconDot} alt="" className="imdb-originals__title-dot" />
            <h2>{t('imdb_originals_title')}</h2>
          </div>
          <p className="imdb-originals__subtitle">{t('imdb_originals_subtitle')}</p>
        </div>
        <div className="imdb-originals__nav">
          <button type="button" className="imdb-originals__arrow imdb-originals__arrow--prev" aria-label={t('aria_previous')} onClick={scrollPrev} disabled={!canPrev}>
            <img src={arrowPrev} alt="" />
          </button>
          <button type="button" className="imdb-originals__arrow" aria-label={t('aria_next')} onClick={scrollNext} disabled={!canNext}>
            <img src={arrowNext} alt="" />
          </button>
        </div>
      </div>

      <div className="imdb-originals__list" ref={ref}>
        {VIDEOS.map((video) => (
          <div key={video.key} className="imdb-originals__card">
            <div className="imdb-originals__card-image">
              <img src={photoVideo} alt="" />
              <span className="imdb-originals__badge">
                <img src={iconPlay} alt="" />
                {video.duration}
              </span>
            </div>
            <div className="imdb-originals__caption">
              <p className="imdb-originals__caption-title">{t(video.titleKey)}</p>
              <p className="imdb-originals__caption-cta">{t('watch_now')}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ImdbOriginals
