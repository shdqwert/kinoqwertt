import './PosterAtmosphere.css'

// A tiny deterministic hash of the movie's own slug, used only to vary the
// *composition* (blob positions, gradient angle) from title to title so two
// movies that happen to share a similar palette still don't render as the
// same layout — everything it drives still comes from this specific movie.
function hashSlug(slug) {
  let h = 0
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0
  }
  return h
}

/**
 * The title page's cinematic background: extracts a real color palette from
 * this movie's own poster and composes it into layered gradients, a blurred
 * poster wash, a vignette and a grain pass — so the atmosphere is generated
 * from that specific poster's colors rather than any fixed template.
 */
function PosterAtmosphere({ poster, slug, palette }) {
  const ready = Boolean(palette)
  const colors = palette?.colors || ['#141414', '#0a0a0a', '#1c1c1c', '#050505']
  const isDark = palette?.isDark ?? true

  const h = hashSlug(slug || poster || '')
  const angle = h % 360
  const blobX1 = 15 + (h % 45)
  const blobY1 = 10 + ((h >> 3) % 35)
  const blobX2 = 55 + ((h >> 6) % 40)
  const blobY2 = 35 + ((h >> 9) % 45)
  const washOpacity = isDark ? 0.85 : 0.7
  const blurScale = 1.25 + ((h >> 12) % 10) / 100

  return (
    <div className={`poster-atmosphere${ready ? ' poster-atmosphere--ready' : ''}`} aria-hidden="true">
      <div className="poster-atmosphere__base" />
      {poster && (
        <img
          className="poster-atmosphere__blur"
          src={poster}
          alt=""
          crossOrigin="anonymous"
          style={{ transform: `scale(${blurScale})` }}
        />
      )}
      <div
        className="poster-atmosphere__wash"
        style={{
          background: `radial-gradient(circle at ${blobX1}% ${blobY1}%, ${colors[0]} 0%, transparent 60%)`,
          opacity: washOpacity,
        }}
      />
      <div
        className="poster-atmosphere__wash"
        style={{
          background: `radial-gradient(circle at ${blobX2}% ${blobY2}%, ${colors[1]} 0%, transparent 65%)`,
          opacity: washOpacity * 0.85,
        }}
      />
      <div
        className="poster-atmosphere__depth"
        style={{
          background: `linear-gradient(${angle}deg, ${colors[2]} 0%, transparent 55%, ${colors[3]} 100%)`,
        }}
      />
      <div className="poster-atmosphere__vignette" />
      <div className="poster-atmosphere__grain" />
      <div className="poster-atmosphere__bottom-fade" />
    </div>
  )
}

export default PosterAtmosphere
