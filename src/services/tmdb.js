const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// Kept in sync with the header's EN/RU toggle (see LanguageContext) so TMDB
// data — titles, overviews, cast names — matches whichever language the UI
// chrome is currently showing instead of always coming back in Russian.
// Read straight from storage at module init (rather than waiting for
// LanguageProvider's effect to fire) so the very first fetch already uses
// the right language instead of a one-request flash of the wrong one.
function readInitialTmdbLang() {
  try {
    return localStorage.getItem('imdb-clone-lang') === 'ru' ? 'ru-RU' : 'en-US'
  } catch {
    return 'en-US'
  }
}

let tmdbLanguage = readInitialTmdbLang()

export function setTmdbLanguage(lang) {
  tmdbLanguage = lang === 'ru' ? 'ru-RU' : 'en-US'
}

export const IMAGE_SIZES = {
  poster: { small: 'w185', medium: 'w342', large: 'w500', original: 'original' },
  backdrop: { small: 'w300', medium: 'w780', large: 'w1280', original: 'original' },
  profile: { small: 'w45', medium: 'w185', original: 'original' },
  still: { small: 'w92', medium: 'w185', large: 'w300', original: 'original' },
}

export function getImageUrl(path, size = 'original') {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', tmdbLanguage)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, value)
  }

  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.status_message || `TMDB request failed: ${res.status}`)
  }
  return res.json()
}

// Russian localization on TMDB is often missing overview/title text for
// smaller titles, so movie-detail calls also fetch the en-US overview and
// fall back to it whenever the ru-RU one comes back empty.
async function withEnglishFallback(data, endpoint, params) {
  if (data.overview) return data
  const en = await tmdbFetch(endpoint, { ...params, language: 'en-US' }).catch(() => null)
  if (en?.overview) return { ...data, overview: en.overview }
  return data
}

export async function searchMovies(query, page = 1) {
  if (!query?.trim()) return { results: [], total_pages: 0, total_results: 0 }
  return tmdbFetch('/search/movie', { query, page, include_adult: false })
}

export async function searchTv(query, page = 1) {
  if (!query?.trim()) return { results: [], total_pages: 0, total_results: 0 }
  return tmdbFetch('/search/tv', { query, page, include_adult: false })
}

export async function searchPeople(query, page = 1) {
  if (!query?.trim()) return { results: [], total_pages: 0, total_results: 0 }
  return tmdbFetch('/search/person', { query, page, include_adult: false })
}

export async function searchMulti(query, page = 1) {
  if (!query?.trim()) return { results: [], total_pages: 0, total_results: 0 }
  return tmdbFetch('/search/multi', { query, page, include_adult: false })
}

export async function getMovieImages(id) {
  return tmdbFetch(`/movie/${id}/images`, { include_image_language: 'en,null' })
}

export async function getMovieVideos(id) {
  const data = await tmdbFetch(`/movie/${id}/videos`)
  if (data.results?.length) return data
  return tmdbFetch(`/movie/${id}/videos`, { language: 'en-US' }).catch(() => data)
}

export async function getPopularTv(page = 1) {
  return tmdbFetch('/tv/popular', { page })
}

export async function getTopRatedTv(page = 1) {
  return tmdbFetch('/tv/top_rated', { page })
}

export async function getTvDetails(id) {
  const data = await tmdbFetch(`/tv/${id}`, {
    append_to_response: 'credits,videos,images,keywords,reviews,similar,content_ratings',
  })
  return withEnglishFallback(data, `/tv/${id}`, {
    append_to_response: 'credits,videos,images,keywords,reviews,similar,content_ratings',
  })
}

export async function getTvVideos(id) {
  const data = await tmdbFetch(`/tv/${id}/videos`)
  if (data.results?.length) return data
  return tmdbFetch(`/tv/${id}/videos`, { language: 'en-US' }).catch(() => data)
}

export async function getPopularPeople(page = 1) {
  return tmdbFetch('/person/popular', { page })
}

export async function getPersonDetails(id) {
  const data = await tmdbFetch(`/person/${id}`, {
    append_to_response: 'combined_credits,images',
  })
  if (data.biography) return data
  const en = await tmdbFetch(`/person/${id}`, {
    append_to_response: 'combined_credits,images',
    language: 'en-US',
  }).catch(() => null)
  if (en?.biography) return { ...data, biography: en.biography }
  return data
}

export async function getMovieDetails(id) {
  const data = await tmdbFetch(`/movie/${id}`, {
    append_to_response: 'credits,videos,images,keywords,reviews,similar,release_dates',
  })
  return withEnglishFallback(data, `/movie/${id}`, {
    append_to_response: 'credits,videos,images,keywords,reviews,similar,release_dates',
  })
}

export async function getPopularMovies(page = 1) {
  return tmdbFetch('/movie/popular', { page })
}

export async function getTopRatedMovies(page = 1) {
  return tmdbFetch('/movie/top_rated', { page })
}

export async function getNowPlayingMovies(page = 1) {
  return tmdbFetch('/movie/now_playing', { page })
}

export async function getUpcomingMovies(page = 1) {
  return tmdbFetch('/movie/upcoming', { page })
}
