import './InterstellarShip.css'

function Ship() {
  return (
    <svg viewBox="0 0 100 40" width="100" height="40">
      <g fill="none" stroke="#dbe4f0" strokeWidth="1.4" opacity="0.85">
        <ellipse cx="50" cy="20" rx="38" ry="9" />
        <ellipse cx="50" cy="20" rx="10" ry="9" fill="#dbe4f0" stroke="none" opacity="0.5" />
        <circle cx="18" cy="20" r="3" fill="#dbe4f0" stroke="none" />
        <circle cx="82" cy="20" r="3" fill="#dbe4f0" stroke="none" />
      </g>
    </svg>
  )
}

function InterstellarShip() {
  return (
    <div className="is-scene" aria-hidden="true">
      <div className="is-scene__ship is-scene__ship--a">
        <Ship />
      </div>
      <div className="is-scene__ship is-scene__ship--b">
        <Ship />
      </div>
    </div>
  )
}

export default InterstellarShip
