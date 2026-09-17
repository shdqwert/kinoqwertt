import './KungFuPandaScene.css'

function Bamboo({ className }) {
  return (
    <svg viewBox="0 0 20 220" width="20" height="220" className={className}>
      <g fill="#2e7d32" opacity="0.55">
        <rect x="7" y="0" width="6" height="220" rx="3" />
        <rect x="4" y="30" width="12" height="4" rx="2" />
        <rect x="4" y="90" width="12" height="4" rx="2" />
        <rect x="4" y="150" width="12" height="4" rx="2" />
      </g>
    </svg>
  )
}

function KungFuPandaScene() {
  return (
    <div className="kfp-scene" aria-hidden="true">
      <Bamboo className="kfp-scene__bamboo kfp-scene__bamboo--1" />
      <Bamboo className="kfp-scene__bamboo kfp-scene__bamboo--2" />
      <Bamboo className="kfp-scene__bamboo kfp-scene__bamboo--3" />
      <Bamboo className="kfp-scene__bamboo kfp-scene__bamboo--4" />
      <div className="kfp-scene__pow">POW!</div>
    </div>
  )
}

export default KungFuPandaScene
