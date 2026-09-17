import StarWarsDogfight from './StarWarsDogfight.jsx'
import InterstellarShip from './InterstellarShip.jsx'
import KungFuPandaScene from './KungFuPandaScene.jsx'

const SCENES = {
  'starwars-dogfight': StarWarsDogfight,
  'interstellar-ship': InterstellarShip,
  'kungfupanda-action': KungFuPandaScene,
}

function MovieScene({ scene }) {
  const Scene = SCENES[scene]
  if (!Scene) return null
  return <Scene />
}

export default MovieScene
