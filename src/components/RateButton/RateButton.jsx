import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
 *
 * The popover is rendered through a portal into document.body and
 * positioned with `position: fixed` from the trigger's own bounding rect.
 * Every usage sits inside a horizontally-scrolling list (carousels, ranked
 * lists), and those lists set `overflow-x: auto`, which per the CSS spec
 * forces `overflow-y` to `auto` too — turning them into clipping scroll
 * containers that would otherwise cut off a normally-positioned popover.
 */
function RateButton({ slug, className }) {
  const { t } = useLanguage()
  const { getRating, setRatingFor } = useRatings()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(0)
  const [coords, setCoords] = useState(null)
  const triggerRef = useRef(null)
  const popoverRef = useRef(null)
  const rating = getRating(slug)

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const btn = triggerRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      let top = rect.bottom + 8
      let left = rect.left + rect.width / 2
      let flip = false

      const pop = popoverRef.current
      if (pop) {
        const popRect = pop.getBoundingClientRect()
        const halfWidth = popRect.width / 2 || 100
        left = Math.min(Math.max(left, halfWidth + 8), window.innerWidth - halfWidth - 8)
        if (rect.bottom + 8 + popRect.height > window.innerHeight - 8) {
          flip = true
          top = rect.top - 8
        }
      }

      setCoords({ top, left, flip })
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDocMouseDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return
      if (popoverRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={className}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
        }}
      >
        <img src={rating ? iconStar : iconStarOutline} alt="" />
        <span>{rating ? `${rating}/10` : t('rate')}</span>
      </button>
      {open && createPortal(
        <div
          ref={popoverRef}
          className={`rate-button__popover${coords?.flip ? ' rate-button__popover--flip' : ''}`}
          style={coords ? { top: coords.top, left: coords.left, visibility: 'visible' } : { visibility: 'hidden' }}
          onClick={(e) => e.stopPropagation()}
        >
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
        </div>,
        document.body
      )}
    </>
  )
}

export default RateButton
