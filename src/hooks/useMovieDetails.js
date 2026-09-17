import { useEffect, useState } from 'react'
import { getMovie } from '../data/movies.js'
import { getMovieDetails, getTvDetails } from '../services/tmdb.js'
import { mapTmdbMovieToViewModel, mapTmdbTvToViewModel } from '../adapters/tmdbMovie.js'
import { getCachedMovie, setCachedMovie } from '../services/tmdbMovieCache.js'

const TMDB_MOVIE_ID_RE = /^\d+$/
const TMDB_TV_ID_RE = /^tv-(\d+)$/

export function useMovieDetails(slug) {
  // The app remounts the title page's whole subtree whenever the movie
  // slug/id changes (see the keyed wrapper in App.jsx), so this hook never
  // needs to react to `slug` changing under an existing instance — only to
  // resolve the slug it was mounted with.
  const mockMovie = getMovie(slug)
  const cachedMovie = mockMovie ? null : getCachedMovie(slug)
  // Card grids (Top 250, Trailers, Awards…) cache lightweight summary
  // objects too — title/poster/score only, no cast/writers/reviews — so a
  // cached hit only counts as "immediate" once it's the full detail
  // shape (recognizable by having a `cast` array at all). Otherwise this
  // hook would skip fetching entirely and every field the title page
  // renders unconditionally (writers.join, stars.join, etc.) would crash.
  const cachedIsFull = cachedMovie && cachedMovie.cast !== undefined
  const immediate = mockMovie || (cachedIsFull ? cachedMovie : null)
  const tvMatch = TMDB_TV_ID_RE.exec(String(slug))
  const needsFetch = !immediate && (TMDB_MOVIE_ID_RE.test(String(slug)) || Boolean(tvMatch))

  const [movie, setMovie] = useState(immediate)
  const [loading, setLoading] = useState(needsFetch)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!needsFetch) return

    let cancelled = false

    const request = tvMatch
      ? getTvDetails(tvMatch[1]).then(mapTmdbTvToViewModel)
      : getMovieDetails(slug).then(mapTmdbMovieToViewModel)

    request
      .then((mapped) => {
        if (cancelled) return
        setCachedMovie(mapped)
        setMovie(mapped)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'Failed to load title')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resolves once per mounted slug, see comment above
  }, [slug, needsFetch])

  return { movie, loading, error }
}
