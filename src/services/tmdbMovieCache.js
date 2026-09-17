// In-memory cache of TMDB movies mapped to the app's view-model shape,
// keyed by slug (== String(tmdbId)). Populated once a title page fetches a
// movie, so pages reached from it (reviews, photo viewer) can read the same
// data synchronously instead of re-fetching.
const cache = new Map()

export function getCachedMovie(slug) {
  return cache.get(slug)
}

export function setCachedMovie(movie) {
  cache.set(movie.slug, movie)
}
