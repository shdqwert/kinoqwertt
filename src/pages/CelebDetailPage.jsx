import { useEffect, useState } from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { getPersonDetails, getImageUrl, IMAGE_SIZES } from '../services/tmdb.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import iconStar from '../assets/movie-ui/icon-star.svg'
import './CelebDetailPage.css'

function creditSlug(credit) {
  return credit.media_type === 'tv' ? `tv-${credit.id}` : String(credit.id)
}

function formatDate(iso, lang) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function CelebDetailPage({ personId, onBack, onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson }) {
  const { t, lang } = useLanguage()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- React's documented data-fetching pattern; see react.dev/learn/synchronizing-with-effects#fetching-data
    setLoading(true)
    getPersonDetails(personId)
      .then((data) => {
        if (!cancelled) setPerson(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [personId])

  const headerProps = { onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson }

  if (loading) {
    return (
      <>
        <Header {...headerProps} />
        <div className="celeb-page__back-bar">
          <button type="button" className="celeb-page__back" onClick={onBack}>
            {t('back_to_imdb')}
          </button>
        </div>
        <p className="celeb-page__status">{t('loading')}</p>
      </>
    )
  }

  if (!person) {
    return (
      <>
        <Header {...headerProps} />
        <div className="celeb-page__back-bar">
          <button type="button" className="celeb-page__back" onClick={onBack}>
            {t('back_to_imdb')}
          </button>
        </div>
        <p className="celeb-page__status">{error || t('no_trailers_found')}</p>
      </>
    )
  }

  const credits = (person.combined_credits?.cast || [])
    .filter((c) => c.poster_path && (c.title || c.name))
    .filter((c, i, arr) => arr.findIndex((x) => x.id === c.id && x.media_type === c.media_type) === i)

  // "Best movie" — the highest-rated credit with a real vote count behind it,
  // so a single stray 10/10 on an obscure short doesn't win by accident.
  const bestCredit = credits
    .filter((c) => (c.vote_count || 0) >= 50)
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))[0]

  const filmography = credits
    .slice()
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .slice(0, 24)

  return (
    <>
      <Header {...headerProps} />
      <div className="celeb-page__back-bar">
        <button type="button" className="celeb-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="celeb-page">
        <div className="celeb-page__top">
          <div className="celeb-page__photo">
            <img src={getImageUrl(person.profile_path, IMAGE_SIZES.profile.medium) || undefined} alt="" />
          </div>
          <div className="celeb-page__identity">
            <h1>{person.name}</h1>
            {person.known_for_department && <p className="celeb-page__department">{t(person.known_for_department)}</p>}
            <div className="celeb-page__facts">
              {person.birthday && (
                <div className="celeb-page__fact">
                  <span className="celeb-page__fact-label">{t('celeb_born')}</span>
                  <span>{formatDate(person.birthday, lang)}{person.place_of_birth ? ` · ${person.place_of_birth}` : ''}</span>
                </div>
              )}
              {person.deathday && (
                <div className="celeb-page__fact">
                  <span className="celeb-page__fact-label">{t('celeb_died')}</span>
                  <span>{formatDate(person.deathday, lang)}</span>
                </div>
              )}
            </div>
            {person.biography && <p className="celeb-page__bio">{person.biography}</p>}
          </div>
        </div>

        {bestCredit && (
          <div className="celeb-page__best">
            <p className="celeb-page__best-label">{t('celeb_best_work')}</p>
            <button type="button" className="celeb-page__best-card" onClick={() => onOpenTitle?.(creditSlug(bestCredit))}>
              <img src={getImageUrl(bestCredit.poster_path, IMAGE_SIZES.poster.medium)} alt="" />
              <div className="celeb-page__best-info">
                <p className="celeb-page__best-title">{bestCredit.title || bestCredit.name}</p>
                {bestCredit.character && <p className="celeb-page__best-role">{bestCredit.character}</p>}
                <div className="celeb-page__best-rating">
                  <img src={iconStar} alt="" />
                  <span>{bestCredit.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </button>
          </div>
        )}

        {filmography.length > 0 && (
          <div className="celeb-page__filmography">
            <h2>{t('celeb_filmography')}</h2>
            <div className="celeb-page__grid">
              {filmography.map((credit) => (
                <button
                  type="button"
                  className="celeb-page__credit"
                  key={`${credit.media_type}-${credit.id}`}
                  onClick={() => onOpenTitle?.(creditSlug(credit))}
                >
                  <div className="celeb-page__credit-poster">
                    <img src={getImageUrl(credit.poster_path, IMAGE_SIZES.poster.medium)} alt="" />
                  </div>
                  <p className="celeb-page__credit-title">{credit.title || credit.name}</p>
                  <div className="celeb-page__credit-meta">
                    <img src={iconStar} alt="" />
                    <span>{credit.vote_average ? credit.vote_average.toFixed(1) : '—'}</span>
                    <span className="celeb-page__credit-year">
                      {(credit.release_date || credit.first_air_date || '').slice(0, 4)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}

export default CelebDetailPage
