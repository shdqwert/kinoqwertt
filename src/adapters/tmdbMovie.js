import { getImageUrl, IMAGE_SIZES } from '../services/tmdb.js'
import { pickTrailerKey } from '../utils/pickTrailerKey.js'

function formatRuntime(minutes) {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

function formatCount(n) {
  if (!n) return '0'
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
  return String(n)
}

function formatMoney(n) {
  if (!n) return ''
  return `$${n.toLocaleString('en-US')}`
}

function languageName(code) {
  if (!code) return ''
  try {
    return new Intl.DisplayNames(['ru'], { type: 'language' }).of(code)
  } catch {
    return code.toUpperCase()
  }
}

function findUsCertification(releaseDates) {
  const results = releaseDates?.results || []
  const us = results.find((r) => r.iso_3166_1 === 'US')
  const entry = us?.release_dates.find((d) => d.certification) || us?.release_dates?.[0]
  return entry?.certification || ''
}

function findUsContentRating(contentRatings) {
  const results = contentRatings?.results || []
  const us = results.find((r) => r.iso_3166_1 === 'US')
  return us?.rating || results[0]?.rating || ''
}

function mapCredits(credits) {
  const crew = credits?.crew || []
  const cast = credits?.cast || []
  const director = crew.find((c) => c.job === 'Director')?.name
  const writers = [...new Set(
    crew.filter((c) => ['Writer', 'Screenplay', 'Story'].includes(c.job)).map((c) => c.name)
  )]
  const stars = cast.slice(0, 5).map((c) => c.name)
  const castList = cast.slice(0, 24).map((c) => ({
    name: c.name,
    role: c.character,
    photo: getImageUrl(c.profile_path, IMAGE_SIZES.profile.medium),
  }))
  return { director, writers, stars, castList }
}

function mapPhotos(images) {
  const backdrops = images?.backdrops || []
  const posters = images?.posters || []
  return [...backdrops, ...posters]
    .slice(0, 20)
    .map((img) => getImageUrl(img.file_path, IMAGE_SIZES.backdrop.large))
}

function mapReviews(reviews) {
  const results = reviews?.results || []
  return results.map((r) => ({
    id: r.id,
    title: r.author,
    rating: r.author_details?.rating ?? '—',
    username: r.author,
    date: r.created_at ? new Date(r.created_at).toLocaleDateString('ru-RU') : '',
    body: r.content,
    helpful: 0,
  }))
}

// TMDB list/search/discover results carry only numeric `genre_ids`, not the
// named genres a detail response has — these are TMDB's own fixed id tables
// (movie and TV each define their own), used to turn those ids back into
// display names for card grids and genre filtering without an extra fetch
// per item.
const MOVIE_GENRE_NAMES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
  878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
}

const TV_GENRE_NAMES = {
  10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 10762: 'Kids', 9648: 'Mystery',
  10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
  10767: 'Talk', 10768: 'War & Politics', 37: 'Western',
}

function genresFromIds(ids, kind) {
  const table = kind === 'tv' ? TV_GENRE_NAMES : MOVIE_GENRE_NAMES
  return (ids || []).map((id) => table[id]).filter(Boolean)
}

// Card-shaped view-model for a TMDB list/search/discover result item (not a
// full detail response) — used anywhere we render a poster grid without
// fetching every item's full details. `kind` distinguishes movies from TV
// (different id namespaces on TMDB), so the resulting slug is prefixed
// `tv-` for shows — that's how the rest of the app tells a show apart from
// a movie that happens to share the same numeric id.
export function mapTmdbSummaryToCard(item, kind = 'movie') {
  return {
    slug: kind === 'tv' ? `tv-${item.id}` : String(item.id),
    tmdbId: item.id,
    kind,
    title: item.title || item.name || '',
    year: (item.release_date || item.first_air_date || '').slice(0, 4),
    rated: '',
    runtime: '',
    poster: getImageUrl(item.poster_path, IMAGE_SIZES.poster.medium),
    backdrop: getImageUrl(item.backdrop_path, IMAGE_SIZES.backdrop.medium),
    genres: item.genres?.map((g) => g.name) || genresFromIds(item.genre_ids, kind),
    plot: item.overview || '',
    score: item.vote_average ? item.vote_average.toFixed(1) : '—',
    scoreCount: formatCount(item.vote_count),
    trailerId: undefined,
  }
}

function mapSimilar(similar, kind) {
  const results = similar?.results || []
  return results.slice(0, 10).map((item) => mapTmdbSummaryToCard(item, kind))
}

function mapVideos(videos) {
  const results = (videos?.results || []).filter((v) => v.site === 'YouTube')
  return results.map((v) => ({ key: v.key, name: v.name, type: v.type }))
}

// Produces an object shaped like the local mock entries in src/data/movies.js
// so every title-page component can render TMDB data without knowing where
// it came from.
export function mapTmdbMovieToViewModel(data) {
  const { director, writers, stars, castList } = mapCredits(data.credits)

  return {
    slug: String(data.id),
    kind: 'movie',
    title: data.title,
    year: data.release_date ? data.release_date.slice(0, 4) : '',
    rated: findUsCertification(data.release_dates) || 'NR',
    runtime: formatRuntime(data.runtime),
    score: data.vote_average ? data.vote_average.toFixed(1) : '—',
    scoreCount: formatCount(data.vote_count),
    poster: getImageUrl(data.poster_path, IMAGE_SIZES.poster.large),
    backdrop: getImageUrl(data.backdrop_path, IMAGE_SIZES.backdrop.original),
    genres: data.genres?.map((g) => g.name) || [],
    plot: data.overview || '',
    director: director || '—',
    writers: writers.length ? writers : ['—'],
    stars: stars.length ? stars : ['—'],
    awards: undefined,
    reviews: { user: formatCount(data.vote_count), critic: '—', metascore: undefined },
    trailerId: pickTrailerKey(data.videos),
    storyline: {
      summary: data.overview || '',
      synopsis: data.overview || '',
      keywords: data.keywords?.keywords?.map((k) => k.name) || [],
      tagline: data.tagline || '',
      parentsGuide: '',
    },
    details: {
      releaseDate: data.release_date || '',
      countries: data.production_countries?.map((c) => c.name) || [],
      officialSite: data.homepage || '',
      language: languageName(data.original_language),
      akaTitle: '',
      filmingLocations: '',
      productionCompanies: data.production_companies?.map((c) => c.name) || [],
    },
    boxOffice: {
      budget: formatMoney(data.budget),
      openingWeekendUS: '',
      grossUS: '',
      grossWorldwide: formatMoney(data.revenue),
    },
    technicalSpecs: undefined,
    news: undefined,
    didYouKnow: undefined,
    cast: castList,
    photos: mapPhotos(data.images),
    reviewsList: mapReviews(data.reviews),
    similarMovies: mapSimilar(data.similar, 'movie'),
    videos: mapVideos(data.videos),
  }
}

// Same idea as mapTmdbMovieToViewModel but for a /tv/{id} detail response.
// TV has no box office or runtime-per-film concept, so those fields are
// left undefined — every component that reads them already treats an
// absent value as "hide this section" rather than rendering it empty.
export function mapTmdbTvToViewModel(data) {
  const { writers, stars, castList } = mapCredits(data.credits)
  const creators = data.created_by?.map((c) => c.name) || []

  return {
    slug: `tv-${data.id}`,
    kind: 'tv',
    title: data.name,
    year: data.first_air_date ? data.first_air_date.slice(0, 4) : '',
    rated: findUsContentRating(data.content_ratings) || 'NR',
    runtime: formatRuntime(data.episode_run_time?.[0] || data.last_episode_to_air?.runtime),
    score: data.vote_average ? data.vote_average.toFixed(1) : '—',
    scoreCount: formatCount(data.vote_count),
    poster: getImageUrl(data.poster_path, IMAGE_SIZES.poster.large),
    backdrop: getImageUrl(data.backdrop_path, IMAGE_SIZES.backdrop.original),
    genres: data.genres?.map((g) => g.name) || [],
    plot: data.overview || '',
    director: creators.length ? creators.join(', ') : '—',
    writers: writers.length ? writers : ['—'],
    stars: stars.length ? stars : ['—'],
    awards: undefined,
    reviews: { user: formatCount(data.vote_count), critic: '—', metascore: undefined },
    trailerId: pickTrailerKey(data.videos),
    storyline: {
      summary: data.overview || '',
      synopsis: data.overview || '',
      keywords: data.keywords?.results?.map((k) => k.name) || [],
      tagline: data.tagline || '',
      parentsGuide: '',
    },
    details: {
      releaseDate: data.first_air_date || '',
      countries: data.production_countries?.map((c) => c.name) || data.origin_country || [],
      officialSite: data.homepage || '',
      language: languageName(data.original_language),
      akaTitle: '',
      filmingLocations: '',
      productionCompanies: data.production_companies?.map((c) => c.name) || [],
    },
    boxOffice: undefined,
    technicalSpecs: {
      color: [],
      soundMix: [],
    },
    news: undefined,
    didYouKnow: undefined,
    cast: castList,
    photos: mapPhotos(data.images),
    reviewsList: mapReviews(data.reviews),
    similarMovies: mapSimilar(data.similar, 'tv'),
    videos: mapVideos(data.videos),
    numberOfSeasons: data.number_of_seasons,
    numberOfEpisodes: data.number_of_episodes,
  }
}
