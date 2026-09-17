import Header from '../components/Header/Header.jsx'
import TitleHeader from '../components/TitleHeader/TitleHeader.jsx'
import VideosGallery from '../components/VideosGallery/VideosGallery.jsx'
import PhotosGallery from '../components/PhotosGallery/PhotosGallery.jsx'
import CastList from '../components/CastList/CastList.jsx'
import UserReviews from '../components/UserReviews/UserReviews.jsx'
import WhereToWatch from '../components/WhereToWatch/WhereToWatch.jsx'
import TitleNews from '../components/TitleNews/TitleNews.jsx'
import Storyline from '../components/Storyline/Storyline.jsx'
import DidYouKnow from '../components/DidYouKnow/DidYouKnow.jsx'
import TitleDetails from '../components/TitleDetails/TitleDetails.jsx'
import TitleBoxOffice from '../components/TitleBoxOffice/TitleBoxOffice.jsx'
import TechnicalSpecs from '../components/TechnicalSpecs/TechnicalSpecs.jsx'
import MoreLikeThis from '../components/MoreLikeThis/MoreLikeThis.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Reveal from '../components/Reveal/Reveal.jsx'
import { useMovieDetails } from '../hooks/useMovieDetails.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import './TitlePage.css'

function TitlePage({ movieSlug, onBack, onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenGenre, onOpenPerson, onSeeAllReviews, onOpenPhoto }) {
  const { movie, loading, error } = useMovieDetails(movieSlug)
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="title-page__back-bar">
        <button type="button" className="title-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
        <p style={{ color: '#797979' }}>Loading…</p>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="title-page__back-bar">
        <button type="button" className="title-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
        <p style={{ color: '#797979' }}>{error || 'Title not found.'}</p>
      </div>
    )
  }

  return (
    <>
      <Header onOpenTitle={onOpenTitle} onOpenWatch={onOpenWatch} onOpenMovies={onOpenMovies} onOpenWatchlist={onOpenWatchlist} onOpenProfile={onOpenProfile} onOpenTv={onOpenTv} onOpenCelebs={onOpenCelebs} onOpenAwards={onOpenAwards} onOpenCommunity={onOpenCommunity} onOpenPerson={onOpenPerson} />
      <div className="title-page__back-bar">
        <button type="button" className="title-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>
      <TitleHeader movie={movie} onOpenGenre={onOpenGenre} />
      <Reveal><VideosGallery movie={movie} onSeeAll={onOpenWatch} /></Reveal>
      <Reveal><PhotosGallery movie={movie} onOpenPhoto={onOpenPhoto} /></Reveal>
      <Reveal><CastList movie={movie} /></Reveal>
      <Reveal><UserReviews movie={movie} onSeeAll={onSeeAllReviews} /></Reveal>
      <Reveal><WhereToWatch /></Reveal>
      <Reveal><TitleNews movie={movie} /></Reveal>
      <Reveal><Storyline movie={movie} /></Reveal>
      <Reveal><DidYouKnow movie={movie} /></Reveal>
      <Reveal><TitleDetails movie={movie} /></Reveal>
      <Reveal><TitleBoxOffice movie={movie} /></Reveal>
      <Reveal><TechnicalSpecs movie={movie} /></Reveal>
      <Reveal><MoreLikeThis movie={movie} onOpenTitle={onOpenTitle} /></Reveal>
      <Footer />
    </>
  )
}

export default TitlePage
