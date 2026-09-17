import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Gives a horizontally-scrolling row (a plain `overflow-x: auto` container)
 * working prev/next arrow buttons: smooth-scrolls by ~90% of the visible
 * width per click, and reports whether there is more content in either
 * direction so the arrow buttons can disable themselves at the edges.
 */
export function useHorizontalScroll() {
  const ref = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateEdges = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    updateEdges()

    el.addEventListener('scroll', updateEdges, { passive: true })
    const resizeObserver = new ResizeObserver(updateEdges)
    resizeObserver.observe(el)

    return () => {
      el.removeEventListener('scroll', updateEdges)
      resizeObserver.disconnect()
    }
  }, [updateEdges])

  const scrollByAmount = useCallback((direction) => {
    const el = ref.current
    if (!el) return
    const amount = el.clientWidth * 0.9 * direction
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }, [])

  const scrollPrev = useCallback(() => scrollByAmount(-1), [scrollByAmount])
  const scrollNext = useCallback(() => scrollByAmount(1), [scrollByAmount])

  return { ref, canPrev, canNext, scrollPrev, scrollNext }
}

export default useHorizontalScroll
