import './StarWarsDogfight.css'

function XWing() {
  return (
    <svg viewBox="0 0 60 40" width="60" height="40">
      <g fill="#d6d6d6" stroke="#8a8a8a" strokeWidth="0.6">
        <ellipse cx="30" cy="20" rx="16" ry="4" />
        <path d="M14 20 L2 4 L6 4 L18 18 Z" />
        <path d="M14 20 L2 36 L6 36 L18 22 Z" />
        <path d="M46 20 L58 4 L54 4 L42 18 Z" />
        <path d="M46 20 L58 36 L54 36 L42 22 Z" />
        <circle cx="34" cy="20" r="4" fill="#9fb8d9" stroke="none" />
      </g>
    </svg>
  )
}

function TieFighter() {
  return (
    <svg viewBox="0 0 60 46" width="52" height="40">
      <g fill="none" stroke="#3a3a3a" strokeWidth="2.4">
        <rect x="2" y="6" width="14" height="34" rx="2" fill="#2a2a2a" />
        <rect x="44" y="6" width="14" height="34" rx="2" fill="#2a2a2a" />
        <line x1="16" y1="23" x2="24" y2="23" />
        <line x1="36" y1="23" x2="44" y2="23" />
      </g>
      <circle cx="30" cy="23" r="8" fill="#4a4a4a" stroke="#1b1b1b" strokeWidth="1.4" />
      <circle cx="30" cy="23" r="3" fill="#1b1b1b" />
    </svg>
  )
}

function StarWarsDogfight() {
  return (
    <div className="sw-scene" aria-hidden="true">
      <div className="sw-scene__chase">
        <div className="sw-scene__xwing">
          <XWing />
        </div>
        <div className="sw-scene__tie">
          <TieFighter />
          <span className="sw-scene__laser sw-scene__laser--1" />
          <span className="sw-scene__laser sw-scene__laser--2" />
        </div>
      </div>
    </div>
  )
}

export default StarWarsDogfight
