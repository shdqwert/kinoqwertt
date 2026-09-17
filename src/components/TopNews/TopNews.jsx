import iconDot from './assets/icon-dot.svg'
import iconArrowLink from './assets/icon-arrow-link.svg'
import arrowPrev from './assets/arrow-prev.svg'
import arrowNext from './assets/arrow-next.svg'
import iconBullet from './assets/icon-bullet.svg'
import photoDune2 from './assets/photo-dune2.png'
import photoArthurking from './assets/photo-arthurking.png'
import photoFeydrautha from './assets/photo-feydrautha.png'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './TopNews.css'

const ARTICLES = [
  {
    key: 'dune2-characters',
    photo: photoDune2,
    titleKey: 'news_dune2chars_title',
    date: '20 Feb 2024',
    user: 'username',
    source: 'Comic book resources',
  },
  {
    key: 'arthur-king',
    photo: photoArthurking,
    titleKey: 'news_arthurking_title',
    date: '15 March 2024',
    user: 'username',
    source: 'Variety - Film News',
  },
  {
    key: 'feyd-rautha',
    photo: photoFeydrautha,
    titleKey: 'news_feydrautha_title',
    date: '20 Feb 2024',
    user: 'username',
    source: 'Comic book resources',
  },
]

function TopNews() {
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll()
  const { t } = useLanguage()
  return (
    <section className="top-news">
      <div className="top-news__header">
        <div className="top-news__title">
          <img src={iconDot} alt="" className="top-news__title-dot" />
          <h2>{t('topnews_title')}</h2>
          <img src={iconArrowLink} alt="" className="top-news__title-arrow" />
        </div>
        <div className="top-news__nav">
          <button type="button" className="top-news__arrow top-news__arrow--prev" aria-label={t('aria_previous')} onClick={scrollPrev} disabled={!canPrev}>
            <img src={arrowPrev} alt="" />
          </button>
          <button type="button" className="top-news__arrow" aria-label={t('aria_next')} onClick={scrollNext} disabled={!canNext}>
            <img src={arrowNext} alt="" />
          </button>
        </div>
      </div>

      <div className="top-news__list" ref={ref}>
        {ARTICLES.map((article) => (
          <a href="#" className="top-news__card" key={article.key} onClick={(e) => e.preventDefault()}>
            <img src={article.photo} alt="" className="top-news__photo" />
            <div className="top-news__body">
              <p className="top-news__title-text">{t(article.titleKey)}</p>
              <div className="top-news__meta">
                <span className="top-news__date">{article.date}</span>
                <img src={iconBullet} alt="" className="top-news__bullet" />
                <span className="top-news__user">{article.user}</span>
                <span className="top-news__source">{article.source}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default TopNews
