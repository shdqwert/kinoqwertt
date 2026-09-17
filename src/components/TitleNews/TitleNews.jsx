import iconArrow from '../CastList/assets/icon-arrow.svg'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './TitleNews.css'

function TitleNews({ movie }) {
  const { t } = useLanguage()
  const news = movie.news

  if (!news || news.length === 0) return null

  return (
    <section className="title-news">
      <div className="title-news__header">
        <h2>{t('title_news_heading')}</h2>
        <button type="button" className="title-news__see-all">
          <span>{t('see_all')}</span>
          <img src={iconArrow} alt="" />
        </button>
      </div>

      <div className="title-news__grid">
        {news.map((item, i) => (
          <article className="title-news__card" key={i}>
            {item.photo && <img className="title-news__photo" src={item.photo} alt="" />}
            <div className="title-news__info">
              <h3 className="title-news__title">{item.title}</h3>
              <div className="title-news__meta">
                <span>{item.date}</span>
                <span className="title-news__meta-dot" />
                <span className="title-news__source">{item.source}</span>
              </div>
              <p className="title-news__body">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TitleNews
