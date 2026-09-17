import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './SpiderManMascot.css'

const ACTIONS = {
  shoot: 1300,
  swing: 1600,
  drop: 1400,
  hide: 2200,
}
const ACTION_NAMES = Object.keys(ACTIONS)

const CORNERS = [
  { top: 0, right: 64, left: 'auto' },
  { top: 0, left: 64, right: 'auto' },
  { top: '32vh', right: 90, left: 'auto' },
  { top: '28vh', left: 90, right: 'auto' },
]

function SpiderBody({ size = 42 }) {
  return (
    <svg viewBox="0 0 60 70" width={size} height={(size * 70) / 60}>
      <ellipse cx="30" cy="46" rx="13" ry="18" fill="#e0102a" />
      <path d="M30 30 Q22 46 24 62 M30 30 Q38 46 36 62" stroke="#1b1b3a" strokeWidth="1.4" fill="none" opacity="0.55" />
      <circle cx="30" cy="16" r="12" fill="#e0102a" />
      <path d="M20 12 Q30 4 40 12" stroke="#1b1b3a" strokeWidth="1.6" fill="none" opacity="0.5" />
      <ellipse cx="24" cy="15" rx="5.5" ry="4.2" fill="#f5f5f5" transform="rotate(-12 24 15)" />
      <ellipse cx="36" cy="15" rx="5.5" ry="4.2" fill="#f5f5f5" transform="rotate(12 36 15)" />
      <line x1="18" y1="38" x2="2" y2="24" stroke="#1b1b3a" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="16" y1="46" x2="0" y2="42" stroke="#1b1b3a" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="16" y1="54" x2="2" y2="62" stroke="#1b1b3a" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="42" y1="38" x2="58" y2="24" stroke="#1b1b3a" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="44" y1="46" x2="60" y2="42" stroke="#1b1b3a" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="44" y1="54" x2="58" y2="62" stroke="#1b1b3a" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function EntranceLeap({ onDone }) {
  return (
    <div className="spiderman-entrance" onAnimationEnd={onDone} aria-hidden="true">
      <div className="spiderman-entrance__body">
        <SpiderBody size={220} />
      </div>
      <svg className="spiderman-entrance__web" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#f5f5f5" strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>
    </div>
  )
}

function SpiderManMascot() {
  const [entranceDone, setEntranceDone] = useState(false)
  const finishEntrance = useCallback(() => setEntranceDone(true), [])

  // Safety net: if animations are disabled (prefers-reduced-motion, etc.)
  // onAnimationEnd never fires, so fall back to a plain timer.
  useEffect(() => {
    const timeout = setTimeout(finishEntrance, 1400)
    return () => clearTimeout(timeout)
  }, [finishEntrance])

  const [action, setAction] = useState(null)
  const [runId, setRunId] = useState(0)
  const busyRef = useRef(false)
  const roamTimerRef = useRef(null)
  const cornerIndexRef = useRef(0)
  const mascotRef = useRef(null)

  // Roam to a different corner every so often, on its own — driven by GSAP
  // so the move has weight (elastic overshoot) instead of a flat CSS ease.
  useEffect(() => {
    if (!entranceDone) return
    const node = mascotRef.current
    if (!node) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const scheduleNext = () => {
      const delay = 6000 + Math.random() * 5000
      roamTimerRef.current = setTimeout(() => {
        if (!busyRef.current) {
          let next = cornerIndexRef.current
          while (next === cornerIndexRef.current) next = Math.floor(Math.random() * CORNERS.length)
          cornerIndexRef.current = next
          const target = CORNERS[next]
          if (reduced) {
            gsap.set(node, target)
          } else {
            gsap.to(node, { ...target, duration: 1.8, ease: 'elastic.out(1, 0.55)' })
            gsap.fromTo(
              node,
              { rotate: -6 },
              { rotate: 0, duration: 1.6, ease: 'elastic.out(1, 0.4)' }
            )
          }
        }
        scheduleNext()
      }, delay)
    }
    scheduleNext()
    return () => clearTimeout(roamTimerRef.current)
  }, [entranceDone])

  const trigger = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const next = ACTION_NAMES[Math.floor(Math.random() * ACTION_NAMES.length)]
    setAction(next)
    setRunId((id) => id + 1)
    setTimeout(() => {
      setAction(null)
      busyRef.current = false
    }, ACTIONS[next])
  }, [])

  if (!entranceDone) {
    return <EntranceLeap onDone={finishEntrance} />
  }

  return (
    <div ref={mascotRef} className="spiderman-mascot" style={CORNERS[0]} aria-hidden="true">
      <div
        key={runId}
        className={`spiderman-mascot__rig${action ? ` spiderman-mascot__rig--${action}` : ''}`}
      >
        <span className="spiderman-mascot__thread" />
        <button
          type="button"
          className="spiderman-mascot__body"
          onClick={trigger}
          aria-label="Spider mascot — click for a surprise"
          title="Click me"
        >
          <SpiderBody />
        </button>
        <svg className="spiderman-mascot__web-shot" viewBox="0 0 10 220" preserveAspectRatio="none" aria-hidden="true">
          <line x1="5" y1="0" x2="5" y2="220" stroke="#f5f5f5" strokeWidth="2" strokeDasharray="6 4" />
        </svg>
        <svg className="spiderman-mascot__web-splat" viewBox="0 0 80 80" aria-hidden="true">
          <g stroke="#f5f5f5" strokeWidth="1.4" fill="none">
            <circle cx="40" cy="40" r="10" />
            <circle cx="40" cy="40" r="20" />
            <line x1="40" y1="0" x2="40" y2="80" />
            <line x1="0" y1="40" x2="80" y2="40" />
            <line x1="8" y1="8" x2="72" y2="72" />
            <line x1="72" y1="8" x2="8" y2="72" />
          </g>
        </svg>
      </div>
    </div>
  )
}

export default SpiderManMascot
