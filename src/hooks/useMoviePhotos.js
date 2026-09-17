import { useEffect, useState } from 'react'
import { getPhotosFor } from '../components/PhotosGallery/photos.js'
import { searchMovies, getMovieImages, getImageUrl, IMAGE_SIZES } from '../services/tmdb.js'

const cache = new Map()

// The local mock catalog only ships a poster + one backdrop per title (two
// images repeated as its whole "photo gallery"), which reads as the same
// picture over and over. Real TMDB-sourced movies already carry a full
// gallery via mapTmdbMovieToViewModel, so this only kicks in for the mock
// titles: look the movie up on TMDB by name once and pull its actual still
// gallery, keyed by slug so every page reading this movie sees the same set.
export function useMoviePhotos(movie) {
  const fallback = movie ? (movie.photos?.length ? movie.photos : getPhotosFor(movie)) : []
  const needsEnrichment = Boolean(movie) && !movie.photos?.length
  const [photos, setPhotos] = useState(() => (needsEnrichment ? cache.get(movie.slug) : null) || fallback)

  useEffect(() => {
    if (!needsEnrichment || cache.has(movie.slug)) return

    let cancelled = false
    searchMovies(movie.title)
      .then((data) => {
        const match = data.results?.[0]
        if (!match) return null
        return getMovieImages(match.id)
      })
      .then((images) => {
        if (cancelled || !images) return
        const stills = [...(images.backdrops || []), ...(images.posters || [])]
          .slice(0, 12)
          .map((img) => getImageUrl(img.file_path, IMAGE_SIZES.backdrop.large))
        if (!stills.length) return
        cache.set(movie.slug, stills)
        setPhotos(stills)
      })
      .catch(() => {
        // TMDB has nothing under this title — keep the poster/backdrop fallback
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by the movie this hook was mounted for
  }, [movie?.slug])

  return photos
}
