import { useEffect, useState } from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Reveal from '../components/Reveal/Reveal.jsx'
import { useWatchlist } from '../context/WatchlistContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getMovie } from '../data/movies.js'
import { getCachedMovie, setCachedMovie } from '../services/tmdbMovieCache.js'
import { getMovieDetails, getTvDetails } from '../services/tmdb.js'
import { mapTmdbMovieToViewModel, mapTmdbTvToViewModel } from '../adapters/tmdbMovie.js'
import iconBookmark from '../assets/movie-ui/icon-bookmark.svg'
import iconStar from '../assets/movie-ui/icon-star.svg'
import './WatchlistPage.css'

const TV_SLUG_RE = /^tv-(\d+)$/

// The watchlist only stores ids (see WatchlistContext, which does persist
// them to localStorage correctly). Movies/shows pulled in from TMDB — the
// vast majority of what's bookmarkable now — live only in the in-memory
// tmdbMovieCache, which is empty again after a reload, so this resolves any
// id missing from both the local catalog and that cache by fetching it
// fresh, instead of silently dropping it from the list.
function useResolvedWatchlist(ids) {
  const [, bump] = useState(0)

  useEffect(() => {
    const toFetch = ids.filter((slug) => !getMovie(slug) && !getCachedMovie(slug))
    if (toFetch.length === 0) return

    let cancelled = false
    Promise.all(
      toFetch.map((slug) => {
        const tvMatch = TV_SLUG_RE.exec(slug)
        const request = tvMatch
          ? getTvDetails(tvMatch[1]).then(mapTmdbTvToViewModel)
          : getMovieDetails(slug).then(mapTmdbMovieToViewModel)
        return request.then(setCachedMovie).catch(() => null)
      })
    ).then(() => {
      if (!cancelled) bump((n) => n + 1)
    })

    return () => {
      cancelled = true
    }
  }, [ids])

  return ids.map((slug) => getMovie(slug) || getCachedMovie(slug)).filter(Boolean).reverse()
}

function WatchlistPage({ onBack, onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson }) {
  const { ids, toggleSave } = useWatchlist()
  const { t } = useLanguage()

  const movies = useResolvedWatchlist(ids)
  const stillResolving = movies.length < ids.length

  return (
    <>
      <Header onOpenTitle={onOpenTitle} onOpenWatch={onOpenWatch} onOpenMovies={onOpenMovies} onOpenWatchlist={onOpenWatchlist} onOpenProfile={onOpenProfile} onOpenTv={onOpenTv} onOpenCelebs={onOpenCelebs} onOpenAwards={onOpenAwards} onOpenCommunity={onOpenCommunity} onOpenPerson={onOpenPerson} />
      <div className="watchlist-page__back-bar">
        <button type="button" className="watchlist-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="watchlist-page">
        <div className="watchlist-page__heading">
          <h1>{t('watchlist_heading')}</h1>
          <p className="watchlist-page__subtitle">{t('watchlist_subtitle')}</p>
          {movies.length > 0 && (
            <p className="watchlist-page__count">
              {movies.length} {t('watchlist_count')}{stillResolving ? ` · ${t('loading')}` : ''}
            </p>
          )}
        </div>

        {ids.length === 0 ? (
          <div className="watchlist-page__empty">
            <img src={iconBookmark} alt="" className="watchlist-page__empty-icon" />
            <h2>{t('watchlist_empty_title')}</h2>
            <p>{t('watchlist_empty_body')}</p>
            <button type="button" className="watchlist-page__empty-cta" onClick={onOpenMovies}>
              {t('watchlist_empty_cta')}
            </button>
          </div>
        ) : (
          <ol className="watchlist-page__list">
            {movies.map((movie) => (
              <Reveal key={movie.slug}>
                <li className="watchlist-page__card">
                  <div className="watchlist-page__poster" onClick={() => onOpenTitle?.(movie.slug)}>
                    <img src={movie.poster} alt="" />
                    <button
                      type="button"
                      className="watchlist-page__bookmark watchlist-page__bookmark--saved"
                      aria-label={t('in_watchlist')}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSave(movie.slug)
                      }}
                      title={t('in_watchlist')}
                    >
                      <img src={iconBookmark} alt="" />
                    </button>
                  </div>

                  <div className="watchlist-page__info">
                    <button
                      type="button"
                      className="watchlist-page__title"
                      onClick={() => onOpenTitle?.(movie.slug)}
                    >
                      {movie.title}
                    </button>
                    <div className="watchlist-page__meta">
                      <span>{movie.year}</span>
                      {movie.rated && (
                        <>
                          <span className="watchlist-page__meta-dot" />
                          <span>{movie.rated}</span>
                        </>
                      )}
                      {movie.runtime && (
                        <>
                          <span className="watchlist-page__meta-dot" />
                          <span>{movie.runtime}</span>
                        </>
                      )}
                    </div>
                    <div className="watchlist-page__genres">
                      {movie.genres.map((genre) => (
                        <span className="watchlist-page__genre-pill" key={genre}>{t(genre)}</span>
                      ))}
                    </div>
                    <p className="watchlist-page__plot">{movie.plot}</p>
                  </div>

                  <div className="watchlist-page__side">
                    <div className="watchlist-page__rating">
                      <img src={iconStar} alt="" />
                      <span>{movie.score}</span>
                    </div>
                    <button
                      type="button"
                      className="watchlist-page__remove"
                      onClick={() => toggleSave(movie.slug)}
                    >
                      {t('remove')}
                    </button>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        )}
      </section>

      <Footer />
    </>
  )
}

export default WatchlistPage
