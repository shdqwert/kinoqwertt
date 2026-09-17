import { useEffect, useRef } from 'react'

/**
 * Attaches a scroll-linked translateY to an element for a lightweight
 * parallax effect. speed > 0 makes the element lag behind the scroll
 * (classic "background moves slower" feel).
 */
export function useParallax(speed = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false
    const update = () => {
      el.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return ref
}

export default useParallax
