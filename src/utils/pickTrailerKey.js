// Picks the best YouTube trailer key out of a TMDB /videos response, in the
// same "best available" order everywhere we need a single playable trailer.
export function pickTrailerKey(videos) {
  const results = videos?.results || []
  const youtube = results.filter((v) => v.site === 'YouTube')
  const trailer =
    youtube.find((v) => v.type === 'Trailer' && v.official) ||
    youtube.find((v) => v.type === 'Trailer') ||
    youtube.find((v) => v.type === 'Teaser') ||
    youtube[0]
  return trailer?.key
}
