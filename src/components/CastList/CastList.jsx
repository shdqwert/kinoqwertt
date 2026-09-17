import { useEffect, useState } from 'react'
import iconDot from './assets/icon-dot.svg'
import iconArrow from './assets/icon-arrow.svg'
import photoTimothee from './assets/photo-timothee.png'
import photoZendaya from './assets/photo-zendaya.png'
import photoRebecca from './assets/photo-rebecca.png'
import photoJavier from './assets/photo-javier.png'
import photoJosh from './assets/photo-josh.png'
import photoAustin from './assets/photo-austin.png'
import { searchPeople, getImageUrl, IMAGE_SIZES } from '../../services/tmdb.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './CastList.css'

const DUNE_CAST = [
  { photo: photoTimothee, name: 'Timothée Chalamet', role: 'Paul Atreides' },
  { photo: photoZendaya, name: 'Zendaya', role: 'Chani' },
  { photo: photoRebecca, name: 'Rebecca Ferguson', role: 'Jessica' },
  { photo: photoJavier, name: 'Javier Bardem', role: 'Stilgar' },
  { photo: photoJosh, name: 'Josh Brolin', role: 'Gurney Halleck' },
  { photo: photoAustin, name: 'Austin Butler', role: 'Feyd-Rautha' },
]

// The local mock catalog only ships bundled photos for Dune's cast, so
// every other mock title's stars (plain name strings, no photo) would
// otherwise show initials forever. Look their real photo up on TMDB once,
// keyed by name, and share the result across every title page instance.
const personPhotoCache = new Map()

function usePersonPhotos(names) {
  const [, setVersion] = useState(0)

  useEffect(() => {
    const missing = names.filter((name) => !personPhotoCache.has(name))
    if (!missing.length) return

    let cancelled = false
    Promise.all(
      missing.map((name) =>
        searchPeople(name)
          .then((data) => {
            const photo = getImageUrl(data.results?.[0]?.profile_path, IMAGE_SIZES.profile.medium)
            personPhotoCache.set(name, photo || null)
          })
          .catch(() => personPhotoCache.set(name, null))
      )
    ).then(() => {
      if (!cancelled) setVersion((v) => v + 1)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the actual name list changes, not on every render's new array identity
  }, [names.join('|')])

  return (name) => personPhotoCache.get(name)
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const COLLAPSED_COUNT = 6

function CastList({ movie }) {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const fullCast = movie.cast?.length
    ? movie.cast
    : movie.slug === 'dune-part-two'
      ? DUNE_CAST
      : movie.stars.map((name) => ({ name }))
  const hasMore = fullCast.length > COLLAPSED_COUNT
  const cast = expanded ? fullCast : fullCast.slice(0, COLLAPSED_COUNT)

  const namesNeedingPhotos = cast.filter((p) => !p.photo).map((p) => p.name)
  const lookupPhoto = usePersonPhotos(namesNeedingPhotos)

  return (
    <section className="cast-list">
      <div className="cast-list__header">
        <div className="cast-list__title">
          <img src={iconDot} alt="" className="cast-list__title-dot" />
          <h2>{t('cast_title')}</h2>
          {hasMore && (
            <button type="button" className="cast-list__see-all" onClick={() => setExpanded((v) => !v)}>
              <span>{expanded ? t('show_less') : t('see_all')}</span>
              <img src={iconArrow} alt="" className={expanded ? 'cast-list__see-all-icon--up' : ''} />
            </button>
          )}
        </div>
      </div>

      <div className="cast-list__grid">
        {cast.map((person) => {
          const photo = person.photo || lookupPhoto(person.name)
          return (
          <div className="cast-list__card" key={person.name}>
            <div className="cast-list__avatar">
              {photo ? (
                <img src={photo} alt="" />
              ) : (
                <span className="cast-list__initials">{initials(person.name)}</span>
              )}
            </div>
            <div className="cast-list__info">
              <p className="cast-list__name">{person.name}</p>
              {person.role && <p className="cast-list__role">{person.role}</p>}
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}

export default CastList
