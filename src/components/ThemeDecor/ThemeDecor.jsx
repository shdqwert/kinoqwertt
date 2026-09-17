import { useMemo } from 'react'
import './ThemeDecor.css'

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function ParticleField({ count, className, build }) {
  const particles = useMemo(
    () => Array.from({ length: count }, (_, i) => build(i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  return (
    <div className={className} aria-hidden="true">
      {particles.map((style, i) => (
        <span key={i} style={style} />
      ))}
    </div>
  )
}

function Embers() {
  return (
    <ParticleField
      count={22}
      className="theme-decor theme-decor--embers"
      build={() => ({
        left: `${rand(0, 100)}%`,
        width: `${rand(2, 5)}px`,
        height: `${rand(2, 5)}px`,
        animationDuration: `${rand(5, 11)}s`,
        animationDelay: `${rand(0, 8)}s`,
        opacity: rand(0.3, 0.9),
      })}
    />
  )
}

function Stars() {
  return (
    <>
      <ParticleField
        count={45}
        className="theme-decor theme-decor--stars"
        build={() => ({
          left: `${rand(0, 100)}%`,
          top: `${rand(0, 70)}%`,
          width: `${rand(1, 3)}px`,
          height: `${rand(1, 3)}px`,
          animationDuration: `${rand(2, 5)}s`,
          animationDelay: `${rand(0, 4)}s`,
        })}
      />
      <span className="theme-decor__shooting-star" aria-hidden="true" />
    </>
  )
}

function Mist() {
  return (
    <ParticleField
      count={4}
      className="theme-decor theme-decor--mist"
      build={(i) => ({
        top: `${10 + i * 20}%`,
        width: `${rand(280, 460)}px`,
        height: `${rand(90, 160)}px`,
        animationDuration: `${rand(18, 30)}s`,
        animationDelay: `${rand(-10, 0)}s`,
        opacity: rand(0.12, 0.28),
      })}
    />
  )
}

function Leaves() {
  return (
    <ParticleField
      count={14}
      className="theme-decor theme-decor--leaves"
      build={() => ({
        left: `${rand(0, 100)}%`,
        animationDuration: `${rand(7, 14)}s`,
        animationDelay: `${rand(0, 10)}s`,
        opacity: rand(0.5, 0.95),
      })}
    />
  )
}

function Snow() {
  return (
    <ParticleField
      count={35}
      className="theme-decor theme-decor--snow"
      build={() => ({
        left: `${rand(0, 100)}%`,
        width: `${rand(2, 5)}px`,
        height: `${rand(2, 5)}px`,
        animationDuration: `${rand(6, 13)}s`,
        animationDelay: `${rand(0, 10)}s`,
        opacity: rand(0.4, 0.9),
      })}
    />
  )
}

function LightRays() {
  return <div className="theme-decor theme-decor--light" aria-hidden="true" />
}

function Webs() {
  return (
    <>
      <svg className="theme-decor__web theme-decor__web--tl" viewBox="0 0 200 200" aria-hidden="true">
        <use href="#spider-web-shape" />
      </svg>
      <svg className="theme-decor__web theme-decor__web--tr" viewBox="0 0 200 200" aria-hidden="true">
        <use href="#spider-web-shape" />
      </svg>
      <svg className="theme-decor__web theme-decor__web--bl" viewBox="0 0 200 200" aria-hidden="true">
        <use href="#spider-web-shape" />
      </svg>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <g id="spider-web-shape">
            <g fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M0 0 L200 200 M40 0 L200 160 M100 0 L200 100 M160 0 L200 40 M0 40 L160 200 M0 100 L100 200 M0 160 L40 200" />
              <path d="M0 0 Q40 40 40 80 Q40 130 90 150 Q140 170 200 200" />
              <path d="M0 0 Q0 60 30 100 Q65 145 120 165 Q160 180 200 200" />
              <path d="M0 0 Q80 10 120 50 Q160 90 170 140 Q175 170 200 200" />
              <path d="M0 0 Q20 90 60 130 Q100 170 140 185 Q170 195 200 200" />
            </g>
          </g>
        </defs>
      </svg>
    </>
  )
}

const MOTIFS = {
  embers: Embers,
  stars: Stars,
  mist: Mist,
  leaves: Leaves,
  snow: Snow,
  light: LightRays,
  webs: Webs,
}

function ThemeDecor({ motif }) {
  const Motif = MOTIFS[motif]
  if (!Motif) return null
  return <Motif />
}

export default ThemeDecor
