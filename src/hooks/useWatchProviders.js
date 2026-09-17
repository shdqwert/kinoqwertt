import { useEffect, useState } from 'react'
import { searchMovies, searchTv, getWatchProviders, getTvWatchProviders, getImageUrl, IMAGE_SIZES } from '../services/tmdb.js'

const cache = new Map()
const REGION = 'US'
const TV_SLUG_RE = /^tv-(\d+)$/

function mapCategory(list) {
  return (list || []).map((p) => ({
    id: p.provider_id,
    name: p.provider_name,
    logo: getImageUrl(p.logo_path, IMAGE_SIZES.profile.medium),
  }))
}

// WhereToWatch used to show the exact same five providers at the exact same
// $19.99 for every single movie, with no connection to which title's page
// it was on. This resolves the specific movie or show (by its TMDB id, or
// by searching its title when only the local mock catalog has it) and
// fetches its real buy/rent/stream availability.
export function useWatchProviders(movie) {
  const [data, setData] = useState(() => (movie ? cache.get(movie.slug) : null) || null)

  useEffect(() => {
    if (!movie || cache.has(movie.slug)) return

    let cancelled = false
    const tvMatch = TV_SLUG_RE.exec(movie.slug)
    const isTv = Boolean(tvMatch)
    const knownId = tvMatch?.[1] || movie.tmdbId || (/^\d+$/.test(movie.slug) ? movie.slug : null)
    const resolveId = knownId
      ? Promise.resolve(knownId)
      : (isTv ? searchTv(movie.title) : searchMovies(movie.title)).then((res) => res.results?.[0]?.id)

    resolveId
      .then((id) => (id ? (isTv ? getTvWatchProviders(id) : getWatchProviders(id)) : null))
      .then((result) => {
        if (cancelled) return
        const region = result?.results?.[REGION]
        const mapped = region
          ? {
              link: region.link,
              flatrate: mapCategory(region.flatrate),
              rent: mapCategory(region.rent),
              buy: mapCategory(region.buy),
            }
          : { link: null, flatrate: [], rent: [], buy: [] }
        cache.set(movie.slug, mapped)
        setData(mapped)
      })
      .catch(() => {
        if (!cancelled) setData({ link: null, flatrate: [], rent: [], buy: [] })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by the movie this hook was mounted for
  }, [movie?.slug])

  return data
}
