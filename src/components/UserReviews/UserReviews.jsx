import { useState } from 'react'
import iconStar from '../TitleHeader/assets/icon-star.svg'
import iconArrow from '../CastList/assets/icon-arrow.svg'
import iconEdit from '../CastList/assets/icon-edit.svg'
import { getReviewsFor } from './reviews.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './UserReviews.css'

function UserReviews({ movie, onSeeAll }) {
  const { t, lang } = useLanguage()
  const reviews = movie.reviewsList?.length ? movie.reviewsList : getReviewsFor(movie, lang)
  const [votedHelpful, setVotedHelpful] = useState({})
  const toggleHelpful = (id) => setVotedHelpful((prev) => ({ ...prev, [id]: !prev[id] }))
  return (
    <section className="user-reviews">
      <div className="user-reviews__header">
        <div className="user-reviews__title-group">
          <h2>{t('user_reviews_title')}</h2>
          <button type="button" className="user-reviews__see-all" onClick={onSeeAll}>
            <span>{t('see_all')} 1.4K</span>
            <img src={iconArrow} alt="" />
          </button>
        </div>
        <button type="button" className="user-reviews__write" onClick={onSeeAll}>
          <span>{t('review_cta')}</span>
          <img src={iconEdit} alt="" />
        </button>
      </div>

      <div className="user-reviews__grid">
        {reviews.map((review) => (
          <article className="user-reviews__card" key={review.id}>
            <div className="user-reviews__rating">
              <img src={iconStar} alt="" />
              <span>{review.rating}/10</span>
            </div>
            <h3 className="user-reviews__title">{review.title}</h3>
            <div className="user-reviews__meta">
              <span className="user-reviews__username">{review.username}</span>
              <span className="user-reviews__meta-dot" />
              <span className="user-reviews__date">{review.date}</span>
            </div>
            <p className="user-reviews__body">{review.body}</p>
            <button
              type="button"
              className={`user-reviews__helpful${votedHelpful[review.id] ? ' user-reviews__helpful--voted' : ''}`}
              onClick={() => toggleHelpful(review.id)}
            >
              <span>{Number(review.helpful) + (votedHelpful[review.id] ? 1 : 0)}</span>
              <span className="user-reviews__helpful-dot" />
              <span>{t('helpful')}</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default UserReviews
