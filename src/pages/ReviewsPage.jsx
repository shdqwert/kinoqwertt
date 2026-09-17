import { useMemo, useState } from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { getReviewsFor } from '../components/UserReviews/reviews.js'
import { resolveMovie } from '../utils/resolveMovie.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import iconStar from '../components/TitleHeader/assets/icon-star.svg'
import iconArrow from '../components/CastList/assets/icon-arrow.svg'
import './ReviewsPage.css'

function ReviewsPage({ movieSlug, onBack, onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson }) {
  const movie = resolveMovie(movieSlug)
  const { t, lang } = useLanguage()
  const baseReviews = useMemo(
    () => (movie ? (movie.reviewsList?.length ? movie.reviewsList : getReviewsFor(movie, lang)) : []),
    [movie, lang]
  )
  const [sortBy, setSortBy] = useState('featured')
  const [hideSpoilers, setHideSpoilers] = useState(false)
  const [votedHelpful, setVotedHelpful] = useState({})
  const [shared, setShared] = useState(false)

  const reviews = useMemo(() => {
    const list = [...baseReviews]
    if (sortBy === 'rating') list.sort((a, b) => Number(b.rating) - Number(a.rating))
    return list
  }, [baseReviews, sortBy])

  const toggleHelpful = (id) => {
    setVotedHelpful((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: movie ? `${movie.title} — Reviews` : 'Reviews', url: window.location.href })
        return
      }
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      // share sheet dismissed or clipboard unavailable — ignore
    }
    setShared(true)
    setTimeout(() => setShared(false), 1800)
  }

  return (
    <>
      <Header onOpenTitle={onOpenTitle} onOpenWatch={onOpenWatch} onOpenMovies={onOpenMovies} onOpenWatchlist={onOpenWatchlist} onOpenProfile={onOpenProfile} onOpenTv={onOpenTv} onOpenCelebs={onOpenCelebs} onOpenAwards={onOpenAwards} onOpenCommunity={onOpenCommunity} onOpenPerson={onOpenPerson} />
      <div className="reviews-page__back-bar">
        <button type="button" className="reviews-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="reviews-page">
        <div className="reviews-page__title-row">
          <h1>{movie ? `${movie.title} (${movie.year})` : t('user_reviews_title')}</h1>
          <button type="button" className="reviews-page__review-btn">
            <span>{t('review_this_title')}</span>
          </button>
        </div>

        <h2 className="reviews-page__heading">{t('user_reviews_title')}</h2>

        <div className="reviews-page__toolbar">
          <button
            type="button"
            className={`reviews-page__toolbar-btn${sortBy === 'featured' ? ' reviews-page__toolbar-btn--active' : ''}`}
            onClick={() => setSortBy('featured')}
          >
            {t('sort_by_featured')}
          </button>
          <button
            type="button"
            className={`reviews-page__toolbar-btn${sortBy === 'rating' ? ' reviews-page__toolbar-btn--active' : ''}`}
            onClick={() => setSortBy('rating')}
          >
            {t('rating_label')}
          </button>
          <label className="reviews-page__spoilers">
            <input type="checkbox" checked={hideSpoilers} onChange={(e) => setHideSpoilers(e.target.checked)} />
            <span>{t('hide_spoilers')}</span>
          </label>
          <button type="button" className="reviews-page__toolbar-btn reviews-page__toolbar-btn--ghost" onClick={handleShare}>
            {shared ? t('link_copied') : t('share')}
          </button>
          <span className="reviews-page__count">{reviews.length} {t('reviews_count')}</span>
        </div>

        <div className="reviews-page__list">
          {reviews.map((review) => (
            <article className="reviews-page__card" key={review.id}>
              <div className="reviews-page__rating">
                <img src={iconStar} alt="" />
                <span>{review.rating}/10</span>
              </div>
              <h3 className="reviews-page__card-title">{review.title}</h3>
              <div className="reviews-page__meta">
                <span className="reviews-page__username">{review.username}</span>
                <span className="reviews-page__meta-dot" />
                <span className="reviews-page__date">{review.date}</span>
              </div>
              <p className="reviews-page__body">{review.body}</p>
              <button
                type="button"
                className={`reviews-page__helpful${votedHelpful[review.id] ? ' reviews-page__helpful--voted' : ''}`}
                onClick={() => toggleHelpful(review.id)}
              >
                <span>{Number(review.helpful) + (votedHelpful[review.id] ? 1 : 0)}</span>
                <span className="reviews-page__helpful-dot" />
                <span>{t('helpful')}</span>
                <img src={iconArrow} alt="" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default ReviewsPage
