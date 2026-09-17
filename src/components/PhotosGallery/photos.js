import photo1 from './assets/photo-1.png'
import photo2 from './assets/photo-2.png'
import photo3 from './assets/photo-3.png'
import photo4 from './assets/photo-4.png'

const DUNE_PHOTOS = [photo2, photo3, photo4, photo1]

export function getPhotosFor(movie) {
  if (movie.slug === 'dune-part-two') return DUNE_PHOTOS
  return [movie.poster, movie.backdrop]
}
