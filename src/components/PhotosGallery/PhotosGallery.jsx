import iconDot from './assets/icon-dot.svg'
import iconArrow from './assets/icon-arrow.svg'
import arrowPrev from './assets/arrow-prev.svg'
import arrowNext from './assets/arrow-next.svg'
import { useMoviePhotos } from '../../hooks/useMoviePhotos.js'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './PhotosGallery.css'

function PhotosGallery({ movie, onOpenPhoto }) {
  const { t } = useLanguage()
  const photos = useMoviePhotos(movie)
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll()
  return (
    <section className="photos-gallery">
      <div className="photos-gallery__header">
        <div className="photos-gallery__title">
          <img src={iconDot} alt="" className="photos-gallery__title-dot" />
          <h2>{t('photos_title')}</h2>
          <button type="button" className="photos-gallery__see-all" onClick={() => onOpenPhoto?.(0)}>
            <span>{t('see_all')} 1.3K</span>
            <img src={iconArrow} alt="" />
          </button>
        </div>
        <div className="photos-gallery__nav">
          <button type="button" className="photos-gallery__arrow photos-gallery__arrow--prev" aria-label={t('aria_previous')} onClick={scrollPrev} disabled={!canPrev}>
            <img src={arrowPrev} alt="" />
          </button>
          <button type="button" className="photos-gallery__arrow" aria-label={t('aria_next')} onClick={scrollNext} disabled={!canNext}>
            <img src={arrowNext} alt="" />
          </button>
        </div>
      </div>

      <div className="photos-gallery__list" ref={ref}>
        {photos.map((photo, i) => (
          <button type="button" className="photos-gallery__tile" key={i} onClick={() => onOpenPhoto?.(i)}>
            <img src={photo} alt="" />
          </button>
        ))}
      </div>
    </section>
  )
}

export default PhotosGallery
