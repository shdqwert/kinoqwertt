import { useEffect, useState } from 'react'
import iconDot from './assets/icon-dot.svg'
import iconArrowLink from './assets/icon-arrow-link.svg'
import arrowPrev from './assets/arrow-prev.svg'
import arrowNext from './assets/arrow-next.svg'
import photoPerson from './assets/photo-person.png'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js'
import { getPopularPeople, getImageUrl, IMAGE_SIZES } from '../../services/tmdb.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './BornToday.css'

function BornToday() {
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll()
  const { t, lang } = useLanguage()
  const [people, setPeople] = useState([])
  const todayLabel = new Date().toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
    month: 'long',
    day: 'numeric',
  })

  useEffect(() => {
    let cancelled = false
    getPopularPeople()
      .then((data) => {
        if (cancelled) return
        const list = (data.results || []).slice(0, 10).map((person) => ({
          key: String(person.id),
          photo: getImageUrl(person.profile_path, IMAGE_SIZES.profile.medium) || photoPerson,
          name: person.name,
        }))
        setPeople(list)
      })
      .catch(() => {
        if (!cancelled) setPeople([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="born-today">
      <div className="born-today__header">
        <div className="born-today__heading">
          <div className="born-today__title">
            <img src={iconDot} alt="" className="born-today__title-dot" />
            <h2>{t('trending_people_title')}</h2>
            <img src={iconArrowLink} alt="" className="born-today__title-arrow" />
          </div>
          <p className="born-today__subtitle">{t('trending_people_subtitle')} {todayLabel}</p>
        </div>
        <div className="born-today__nav">
          <button type="button" className="born-today__arrow born-today__arrow--prev" aria-label={t('aria_previous')} onClick={scrollPrev} disabled={!canPrev}>
            <img src={arrowPrev} alt="" />
          </button>
          <button type="button" className="born-today__arrow" aria-label={t('aria_next')} onClick={scrollNext} disabled={!canNext}>
            <img src={arrowNext} alt="" />
          </button>
        </div>
      </div>

      <div className="born-today__list" ref={ref}>
        {people.map((person) => (
          <div className="born-today__card" key={person.key}>
            <div className="born-today__avatar">
              <img src={person.photo} alt="" />
            </div>
            <div className="born-today__info">
              <p className="born-today__name">{person.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BornToday
