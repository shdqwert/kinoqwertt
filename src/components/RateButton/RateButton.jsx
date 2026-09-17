import { useEffect, useRef, useState } from 'react'
import { useRatings } from '../../context/RatingsContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import iconStarOutline from '../../assets/movie-ui/icon-star-outline.svg'
import iconStar from '../../assets/movie-ui/icon-star.svg'
import './RateButton.css'

const STARS = Array.from({ length: 10 }, (_, i) => i + 1)

/**
 * The star + "Rate" affordance shown on every poster across the app.
 * Opens a 1-10 picker and persists the choice (see RatingsContext) — once
 * rated, it shows the saved score instead of the generic prompt.
 */
function RateButton({ slug, className }) {
  const { t } = useLanguage()
  const { getRating, setRatingFor } = useRatings()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(0)
  const wrapRef = useRef(null)
  const rating = getRating(slug)

  useEffect(() => {
    if (!open) return
    const onDocMouseDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  return (
    <div className="rate-button" ref={wrapRef}>
      <button
        type="button"
        className={className}
        style={{ position: 'relative' }}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
      >
        <img src={rating ? iconStar : iconStarOutline} alt="" />
        <span>{rating ? `${rating}/10` : t('rate')}</span>
      </button>
      {open && (
        <div className="rate-button__popover" onClick={(e) => e.stopPropagation()}>
          <p className="rate-button__popover-title">{t('rate_this')}</p>
          <div className="rate-button__stars" onMouseLeave={() => setHovered(0)}>
            {STARS.map((n) => (
              <button
                type="button"
                key={n}
                className={`rate-button__star${n <= (hovered || rating) ? ' rate-button__star--active' : ''}`}
                onMouseEnter={() => setHovered(n)}
                onClick={() => {
                  setRatingFor(slug, n)
                  setOpen(false)
                }}
                aria-label={String(n)}
              >
                <img src={iconStar} alt="" />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <button
              type="button"
              className="rate-button__clear"
              onClick={() => {
                setRatingFor(slug, 0)
                setOpen(false)
              }}
            >
              {t('remove')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default RateButton
