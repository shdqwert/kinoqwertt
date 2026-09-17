import { getMovie } from '../data/movies.js'
import { getCachedMovie } from '../services/tmdbMovieCache.js'

// Local mock titles use slugs like "dune-part-two"; movies opened from
// search carry a TMDB numeric id (as a string) and only live in the runtime
// cache. Checking the mock catalog first keeps existing links working.
export function resolveMovie(slug) {
  return getMovie(slug) || getCachedMovie(slug)
}
