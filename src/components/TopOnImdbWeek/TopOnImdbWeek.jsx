import MovieCarousel from '../MovieCarousel/MovieCarousel.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import posterInception from '../../assets/movie-ui/poster-inception.png'
import posterSpiderman from '../../assets/movie-ui/poster-spiderman.png'
import posterStarwars from '../../assets/movie-ui/poster-starwars.png'
import posterLotr from '../../assets/movie-ui/poster-lotr.png'
import posterArrival from '../../assets/movie-ui/poster-arrival.png'
import posterInterstellar from '../../assets/movie-ui/poster-interstellar.png'

const MOVIES = [
  { key: 'inception', poster: posterInception, title: 'Inception', rating: '8.8', titleSlug: 'inception' },
  { key: 'spiderman', poster: posterSpiderman, title: 'Spider-Man: Across the Spider-Verse', rating: '8.6', titleSlug: 'spider-man-across-the-spider-verse' },
  { key: 'starwars', poster: posterStarwars, title: 'Star Wars: Episode V - The Empire Strikes', rating: '8.7', titleSlug: 'star-wars-episode-v' },
  { key: 'lotr', poster: posterLotr, title: 'The Lord of the Rings: The Two Towers', rating: '8.8', titleSlug: 'the-lord-of-the-rings-the-two-towers' },
  { key: 'arrival', poster: posterArrival, title: 'Arrival', rating: '7.9', titleSlug: 'arrival' },
  { key: 'interstellar', poster: posterInterstellar, title: 'Interstellar', rating: '8.7', titleSlug: 'interstellar' },
]

function TopOnImdbWeek({ onOpenTitle }) {
  const { t } = useLanguage()
  return <MovieCarousel title={t('top_week_title')} movies={MOVIES} onOpenTitle={onOpenTitle} />
}

export default TopOnImdbWeek
