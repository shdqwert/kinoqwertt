import { useState } from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { useMoviePhotos } from '../hooks/useMoviePhotos.js'
import { resolveMovie } from '../utils/resolveMovie.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import './PhotoViewerPage.css'

function PhotoViewerPage({ movieSlug, initialIndex, onBack, onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson }) {
  const movie = resolveMovie(movieSlug)
  const photos = useMoviePhotos(movie)
  const [index, setIndex] = useState(initialIndex || 0)
  const [shared, setShared] = useState(false)
  const { t } = useLanguage()

  const goTo = (i) => photos.length && setIndex((i + photos.length) % photos.length)

  const handleShare = async () => {
    const shareData = {
      title: movie ? `${movie.title} — Photos` : 'Photos',
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(shareData.url)
    } catch {
      // user cancelled the share sheet, or clipboard access was denied — ignore
    }
    setShared(true)
    setTimeout(() => setShared(false), 1800)
  }

  return (
    <>
      <Header onOpenTitle={onOpenTitle} onOpenWatch={onOpenWatch} onOpenMovies={onOpenMovies} onOpenWatchlist={onOpenWatchlist} onOpenProfile={onOpenProfile} onOpenTv={onOpenTv} onOpenCelebs={onOpenCelebs} onOpenAwards={onOpenAwards} onOpenCommunity={onOpenCommunity} onOpenPerson={onOpenPerson} />
      <div className="photo-viewer-page__back-bar">
        <button type="button" className="photo-viewer-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="photo-viewer-page">
        <div className="photo-viewer-page__title-row">
          <h1>{movie ? `${movie.title} (${movie.year})` : t('photos_title')}</h1>
          <button type="button" className="photo-viewer-page__share" onClick={handleShare}>
            {shared ? t('link_copied') : t('share')}
          </button>
        </div>

        {movie?.stars?.[0] && (
          <p className="photo-viewer-page__caption">
            {movie.stars[0]} in {movie.title} ({movie.year})
          </p>
        )}

        <div className="photo-viewer-page__main">
          <button
            type="button"
            className="photo-viewer-page__nav photo-viewer-page__nav--prev"
            onClick={() => goTo(index - 1)}
            aria-label={t('aria_previous')}
          >
            ‹
          </button>
          <img src={photos[index]} alt="" className="photo-viewer-page__image" />
          <button
            type="button"
            className="photo-viewer-page__nav photo-viewer-page__nav--next"
            onClick={() => goTo(index + 1)}
            aria-label={t('aria_next')}
          >
            ›
          </button>
        </div>

        {movie?.slug === 'dune-part-two' && (
          <p className="photo-viewer-page__credit">Photo by Courtesy of Warner Media - © Warner Media</p>
        )}

        <div className="photo-viewer-page__gallery-header">
          <h2>{t('photo_gallery_heading')}</h2>
          <button
            type="button"
            className="photo-viewer-page__view-all"
            onClick={() => document.getElementById('photo-viewer-thumbs')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
          >
            {t('view_all')}
          </button>
        </div>

        <div className="photo-viewer-page__thumbs" id="photo-viewer-thumbs">
          {photos.map((photo, i) => (
            <button
              type="button"
              key={i}
              className={`photo-viewer-page__thumb${i === index ? ' photo-viewer-page__thumb--active' : ''}`}
              onClick={() => setIndex(i)}
            >
              <img src={photo} alt="" />
            </button>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default PhotoViewerPage
