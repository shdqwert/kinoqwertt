import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './TrailerModal.css'

function TrailerModal({ videoId, title, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Render straight into <body> (not wherever this component happens to be
  // nested) and lock background scroll — see AuthModal for why: an
  // ancestor's CSS transform can otherwise trap this "position: fixed"
  // overlay away from the real viewport.
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  if (!videoId) return null

  return createPortal(
    <div className="trailer-modal__overlay" onClick={onClose}>
      <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="trailer-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="trailer-modal__frame">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title ? `${title} — Trailer` : 'Trailer'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TrailerModal
