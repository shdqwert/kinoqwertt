import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage.jsx'
import TitlePage from './pages/TitlePage.jsx'
import TrailersPage from './pages/TrailersPage.jsx'
import TopListPage from './pages/TopListPage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import PhotoViewerPage from './pages/PhotoViewerPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import TvPage from './pages/TvPage.jsx'
import CelebsPage from './pages/CelebsPage.jsx'
import AwardsPage from './pages/AwardsPage.jsx'
import CommunityPage from './pages/CommunityPage.jsx'
import CelebDetailPage from './pages/CelebDetailPage.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { WatchlistProvider } from './context/WatchlistContext.jsx'
import { RatingsProvider } from './context/RatingsContext.jsx'
import './App.css'

function AppShell() {
  const [openMovieSlug, setOpenMovieSlug] = useState(null)
  const [openPersonId, setOpenPersonId] = useState(null)
  const [view, setView] = useState('home')
  const [genreFilter, setGenreFilter] = useState(null)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [openMovieSlug, openPersonId, view, showAllReviews, photoIndex])

  const closeOverlays = () => {
    setShowAllReviews(false)
    setPhotoIndex(null)
  }

  const navigateTo = (nextView) => {
    setOpenMovieSlug(null)
    setOpenPersonId(null)
    closeOverlays()
    setGenreFilter(null)
    setView(nextView)
  }

  const openWatch = () => navigateTo('trailers')
  const openMovies = () => navigateTo('toplist')
  const openWatchlist = () => navigateTo('watchlist')
  const openProfile = () => navigateTo('profile')
  const openTv = () => navigateTo('tv')
  const openCelebs = () => navigateTo('celebs')
  const openAwards = () => navigateTo('awards')
  const openCommunity = () => navigateTo('community')

  const openGenre = (genre) => {
    setOpenMovieSlug(null)
    closeOverlays()
    setGenreFilter(genre)
    setView('toplist')
  }

  const openTitle = (slug) => {
    setView('home')
    closeOverlays()
    setOpenPersonId(null)
    setOpenMovieSlug(slug)
  }

  const openPerson = (id) => {
    setView('home')
    closeOverlays()
    setOpenMovieSlug(null)
    setOpenPersonId(id)
  }

  const goHome = () => {
    setOpenMovieSlug(null)
    setOpenPersonId(null)
    closeOverlays()
    setGenreFilter(null)
    setView('home')
  }

  const navProps = {
    onOpenWatch: openWatch,
    onOpenMovies: openMovies,
    onOpenWatchlist: openWatchlist,
    onOpenProfile: openProfile,
    onOpenTitle: openTitle,
    onOpenTv: openTv,
    onOpenCelebs: openCelebs,
    onOpenAwards: openAwards,
    onOpenCommunity: openCommunity,
    onOpenGenre: openGenre,
    onOpenPerson: openPerson,
  }

  let page
  if (openPersonId) {
    page = <CelebDetailPage personId={openPersonId} onBack={() => setOpenPersonId(null)} {...navProps} />
  } else if (openMovieSlug && showAllReviews) {
    page = (
      <ReviewsPage
        movieSlug={openMovieSlug}
        onBack={() => setShowAllReviews(false)}
        {...navProps}
      />
    )
  } else if (openMovieSlug && photoIndex !== null) {
    page = (
      <PhotoViewerPage
        movieSlug={openMovieSlug}
        initialIndex={photoIndex}
        onBack={() => setPhotoIndex(null)}
        {...navProps}
      />
    )
  } else if (openMovieSlug) {
    page = (
      <TitlePage
        movieSlug={openMovieSlug}
        onBack={() => setOpenMovieSlug(null)}
        onOpenTitle={openTitle}
        onSeeAllReviews={() => setShowAllReviews(true)}
        onOpenPhoto={(i) => setPhotoIndex(i)}
        {...navProps}
      />
    )
  } else if (view === 'trailers') {
    page = <TrailersPage onBack={goHome} {...navProps} />
  } else if (view === 'toplist') {
    page = <TopListPage onBack={goHome} initialGenre={genreFilter} {...navProps} />
  } else if (view === 'watchlist') {
    page = <WatchlistPage onBack={goHome} {...navProps} />
  } else if (view === 'profile') {
    page = <ProfilePage onBack={goHome} {...navProps} />
  } else if (view === 'tv') {
    page = <TvPage onBack={goHome} {...navProps} />
  } else if (view === 'celebs') {
    page = <CelebsPage onBack={goHome} {...navProps} />
  } else if (view === 'awards') {
    page = <AwardsPage onBack={goHome} {...navProps} />
  } else if (view === 'community') {
    page = <CommunityPage onBack={goHome} {...navProps} />
  } else {
    page = <HomePage {...navProps} />
  }

  const overlayKey = showAllReviews ? '-reviews' : photoIndex !== null ? '-photo' : ''
  const genreKey = genreFilter ? `-${genreFilter}` : ''

  return (
    <div key={(openPersonId ? `person-${openPersonId}` : openMovieSlug || view) + genreKey + overlayKey} className="page-transition">
      {page}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <WatchlistProvider>
            <RatingsProvider>
              <AppShell />
            </RatingsProvider>
          </WatchlistProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
