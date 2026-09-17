import iconDot from './assets/icon-dot.svg'
import arrowLeft from './assets/arrow-left.svg'
import arrowRight from './assets/arrow-right.svg'
import iconList from './assets/icon-list.svg'
import iconGallery from './assets/icon-gallery.svg'
import photo1 from './assets/photo-1.png'
import photo2 from './assets/photo-2.png'
import photo3 from './assets/photo-3.png'
import photo4 from './assets/photo-4.png'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './FeaturedToday.css'

const CARDS = [
  { key: 'picks', photo: photo1, icon: iconList, badgeKey: 'featured_badge_list', titleKey: 'featured_picks_title', ctaKey: 'featured_picks_cta' },
  { key: 'scream-queens', photo: photo2, icon: iconGallery, badgeKey: 'featured_badge_gallery', titleKey: 'featured_scream_title', ctaKey: 'featured_scream_cta' },
  { key: 'max', photo: photo3, icon: iconList, badgeKey: 'featured_badge_list', titleKey: 'featured_max_title', ctaKey: 'featured_max_cta' },
  { key: 'photos', photo: photo4, icon: iconGallery, badgeKey: 'featured_badge_gallery', titleKey: 'featured_photos_title', ctaKey: 'featured_photos_cta' },
]

function FeaturedToday() {
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll()
  const { t } = useLanguage()

  return (
    <section className="featured-today">
      <div className="featured-today__header">
        <div className="featured-today__title">
          <img src={iconDot} alt="" className="featured-today__title-dot" />
          <h2>{t('featured_today_title')}</h2>
        </div>
        <div className="featured-today__nav">
          <button type="button" className="featured-today__arrow featured-today__arrow--prev" aria-label={t('aria_previous')} onClick={scrollPrev} disabled={!canPrev}>
            <img src={arrowLeft} alt="" />
          </button>
          <button type="button" className="featured-today__arrow" aria-label={t('aria_next')} onClick={scrollNext} disabled={!canNext}>
            <img src={arrowRight} alt="" />
          </button>
        </div>
      </div>

      <div className="featured-today__list" ref={ref}>
        {CARDS.map((card) => (
          <a href="#" key={card.key} className="featured-today__card" onClick={(e) => e.preventDefault()}>
            <div className="featured-today__card-image">
              <img src={card.photo} alt="" />
              <span className="featured-today__badge">
                <img src={card.icon} alt="" />
                {t(card.badgeKey)}
              </span>
            </div>
            <div className="featured-today__caption">
              <p className="featured-today__caption-title">{t(card.titleKey)}</p>
              <p className="featured-today__caption-cta">{t(card.ctaKey)}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default FeaturedToday
