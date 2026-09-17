import { useState } from 'react'
import iconDot from './assets/icon-dot.svg'
import iconArrow from './assets/icon-arrow.svg'
import iconPlay from './assets/icon-play.svg'
import iconDotSeparator from './assets/icon-dot-separator.svg'
import arrowPrev from './assets/arrow-prev.svg'
import arrowNext from './assets/arrow-next.svg'
import photoVideoFallback from './assets/photo-video.png'
import TrailerModal from '../TrailerModal/TrailerModal.jsx'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './VideosGallery.css'

function VideosGallery({ movie, onSeeAll }) {
  const { t } = useLanguage()
  const [activeKey, setActiveKey] = useState(null)
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll()
  const photo = movie?.backdrop || photoVideoFallback
  const caption = movie ? `${movie.title} (${movie.year})` : 'Dune: Part Two (2024)'
  const videos = movie?.videos?.length
    ? movie.videos.slice(0, 6).map((v) => ({ key: v.key, photo, title: v.name || caption, duration: '' }))
    : movie?.trailerId
      ? [{ key: movie.trailerId, photo, title: caption, duration: '00:31' }]
      : []

  if (videos.length === 0) return null

  return (
    <section className="videos-gallery">
      <div className="videos-gallery__header">
        <div className="videos-gallery__title">
          <img src={iconDot} alt="" className="videos-gallery__title-dot" />
          <h2>{t('videos_title')}</h2>
          <button type="button" className="videos-gallery__see-all" onClick={() => onSeeAll?.()} disabled={!onSeeAll}>
            <span>{t('see_all')} {videos.length}</span>
            <img src={iconArrow} alt="" />
          </button>
        </div>
        <div className="videos-gallery__nav">
          <button type="button" className="videos-gallery__arrow videos-gallery__arrow--prev" aria-label={t('aria_previous')} onClick={scrollPrev} disabled={!canPrev}>
            <img src={arrowPrev} alt="" />
          </button>
          <button type="button" className="videos-gallery__arrow" aria-label={t('aria_next')} onClick={scrollNext} disabled={!canNext}>
            <img src={arrowNext} alt="" />
          </button>
        </div>
      </div>

      <div className="videos-gallery__list" ref={ref}>
        {videos.map((video) => (
          <button
            type="button"
            className="videos-gallery__card"
            key={video.key}
            onClick={() => video.key && setActiveKey(video.key)}
          >
            <div className="videos-gallery__card-image">
              <img src={video.photo} alt="" />
              <span className="videos-gallery__badge">
                <img src={iconPlay} alt="" />
                {t('trailer')}
                <img src={iconDotSeparator} alt="" />
                <span className="videos-gallery__duration">{video.duration}</span>
              </span>
            </div>
            <p className="videos-gallery__caption">{video.title}</p>
          </button>
        ))}
      </div>

      {activeKey && (
        <TrailerModal videoId={activeKey} title={movie?.title} onClose={() => setActiveKey(null)} />
      )}
    </section>
  )
}

export default VideosGallery
