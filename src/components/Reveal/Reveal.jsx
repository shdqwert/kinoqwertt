import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Reveal.css'

gsap.registerPlugin(ScrollTrigger)

let revealCount = 0

/**
 * Fades/slides its children into view the first time they scroll into the
 * viewport, using GSAP + ScrollTrigger for smoother, spring-like easing
 * than a plain CSS transition can give.
 */
function Reveal({ children, className = '', delay }) {
  const ref = useRef(null)
  const stagger = useRef((revealCount++ % 4) * 0.06)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(node, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: delay != null ? delay / 1000 : stagger.current,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 90%',
            once: true,
          },
        }
      )
    }, node)

    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

export default Reveal
