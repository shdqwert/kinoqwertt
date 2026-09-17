import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { MOVIES } from '../data/movies.js'
import { getReviewsFor } from '../components/UserReviews/reviews.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import iconStar from '../components/TitleHeader/assets/icon-star.svg'
import './SimpleGridPage.css'
import './CommunityPage.css'

const FEED_SLUGS = [
  'dune-part-two',
  'spider-man-across-the-spider-verse',
  'interstellar',
  'the-lord-of-the-rings-the-two-towers',
  'kung-fu-panda-4',
  'bob-marley-one-love',
]

function buildFeed(lang) {
  return FEED_SLUGS.map((slug) => {
    const movie = MOVIES[slug]
    if (!movie) return null
    const review = getReviewsFor(movie, lang)[0]
    return { movie, review }
  }).filter(Boolean)
}

function CommunityPage(props) {
  const { onBack, onOpenTitle } = props
  const { t, lang } = useLanguage()
  const feed = buildFeed(lang)

  return (
    <>
      <Header {...props} />
      <div className="simple-grid-page__back-bar">
        <button type="button" className="simple-grid-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="simple-grid-page community-page">
        <div className="simple-grid-page__heading">
          <p className="simple-grid-page__eyebrow">{t('nav_community')}</p>
          <h1>{t('community_heading')}</h1>
          <p className="simple-grid-page__subtitle">{t('community_subtitle')}</p>
        </div>

        <div className="community-page__feed">
          {feed.map(({ movie, review }) => (
            <button
              type="button"
              className="community-page__card"
              key={movie.slug}
              onClick={() => onOpenTitle?.(movie.slug)}
            >
              <img className="community-page__poster" src={movie.poster} alt="" />
              <div className="community-page__body">
                <div className="community-page__movie-row">
                  <span className="community-page__movie-title">{movie.title}</span>
                  <span className="community-page__movie-year">({movie.year})</span>
                </div>
                <div className="community-page__rating">
                  <img src={iconStar} alt="" />
                  <span>{review.rating}/10</span>
                  <span className="community-page__username">{t('by_prefix')} {review.username}</span>
                </div>
                <h3 className="community-page__review-title">{review.title}</h3>
                <p className="community-page__review-body">{review.body}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default CommunityPage
