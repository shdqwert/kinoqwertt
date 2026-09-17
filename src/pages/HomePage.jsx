import Header from '../components/Header/Header.jsx'
import HomepageHero from '../components/HomepageHero/HomepageHero.jsx'
import FeaturedToday from '../components/FeaturedToday/FeaturedToday.jsx'
import TopPicks from '../components/TopPicks/TopPicks.jsx'
import TopOnImdbWeek from '../components/TopOnImdbWeek/TopOnImdbWeek.jsx'
import ImdbOriginals from '../components/ImdbOriginals/ImdbOriginals.jsx'
import StreamingNow from '../components/StreamingNow/StreamingNow.jsx'
import BoxOffice from '../components/BoxOffice/BoxOffice.jsx'
import ComingSoon from '../components/ComingSoon/ComingSoon.jsx'
import BornToday from '../components/BornToday/BornToday.jsx'
import TopNews from '../components/TopNews/TopNews.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Reveal from '../components/Reveal/Reveal.jsx'

function HomePage({ onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson }) {
  return (
    <>
      <Header onOpenTitle={onOpenTitle} onOpenWatch={onOpenWatch} onOpenMovies={onOpenMovies} onOpenWatchlist={onOpenWatchlist} onOpenProfile={onOpenProfile} onOpenTv={onOpenTv} onOpenCelebs={onOpenCelebs} onOpenAwards={onOpenAwards} onOpenCommunity={onOpenCommunity} onOpenPerson={onOpenPerson} />
      <HomepageHero onOpenWatch={onOpenWatch} onOpenTitle={onOpenTitle} />
      <Reveal><FeaturedToday /></Reveal>
      <Reveal><TopPicks onOpenTitle={onOpenTitle} /></Reveal>
      <Reveal><TopOnImdbWeek onOpenTitle={onOpenTitle} /></Reveal>
      <Reveal><ImdbOriginals /></Reveal>
      <Reveal><StreamingNow onOpenTitle={onOpenTitle} /></Reveal>
      <Reveal><BoxOffice onOpenTitle={onOpenTitle} /></Reveal>
      <Reveal><ComingSoon onOpenTitle={onOpenTitle} /></Reveal>
      <Reveal><BornToday /></Reveal>
      <Reveal><TopNews /></Reveal>
      <Footer />
    </>
  )
}

export default HomePage
