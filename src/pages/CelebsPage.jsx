import { useEffect, useState } from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { getPopularPeople, getImageUrl, IMAGE_SIZES } from '../services/tmdb.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import './SimpleGridPage.css'

function CelebsPage(props) {
  const { onBack, onOpenPerson } = props
  const { t } = useLanguage()
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getPopularPeople()
      .then((data) => {
        if (!cancelled) setPeople(data.results || [])
      })
      .catch(() => {
        if (!cancelled) setPeople([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Header {...props} />
      <div className="simple-grid-page__back-bar">
        <button type="button" className="simple-grid-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="simple-grid-page">
        <div className="simple-grid-page__heading">
          <p className="simple-grid-page__eyebrow">TMDB</p>
          <h1>{t('celebs_heading')}</h1>
          <p className="simple-grid-page__subtitle">{t('celebs_subtitle')}</p>
        </div>

        {loading ? (
          <p className="simple-grid-page__status">{t('loading')}</p>
        ) : (
          <div className="simple-grid-page__grid">
            {people.map((person) => (
              <button
                type="button"
                className="simple-grid-page__card simple-grid-page__card--clickable"
                key={person.id}
                onClick={() => onOpenPerson?.(person.id)}
              >
                <div className="simple-grid-page__poster simple-grid-page__poster--round">
                  <img src={getImageUrl(person.profile_path, IMAGE_SIZES.profile.medium)} alt="" />
                </div>
                <p className="simple-grid-page__title">{person.name}</p>
                {person.known_for?.length > 0 && (
                  <p className="simple-grid-page__subtext">
                    {person.known_for.map((w) => w.title || w.name).filter(Boolean).slice(0, 2).join(', ')}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}

export default CelebsPage
