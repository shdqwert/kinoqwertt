import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useWatchlist } from '../context/WatchlistContext.jsx'
import { useRatings } from '../context/RatingsContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import iconWatchlist from '../components/Header/assets/icon-watchlist.svg'
import iconStar from '../assets/movie-ui/icon-star.svg'
import './ProfilePage.css'

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatJoinDate(iso, lang) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return null
  }
}

function ProfilePage({ onBack, onOpenTitle, onOpenWatch, onOpenMovies, onOpenWatchlist, onOpenProfile, onOpenTv, onOpenCelebs, onOpenAwards, onOpenCommunity, onOpenPerson }) {
  const { user, signOut, toggleSubscription } = useAuth()
  const { count } = useWatchlist()
  const { count: ratingsCount } = useRatings()
  const { t, lang } = useLanguage()

  if (!user) {
    return (
      <>
        <Header onOpenTitle={onOpenTitle} onOpenWatch={onOpenWatch} onOpenMovies={onOpenMovies} onOpenWatchlist={onOpenWatchlist} onOpenProfile={onOpenProfile} onOpenTv={onOpenTv} onOpenCelebs={onOpenCelebs} onOpenAwards={onOpenAwards} onOpenCommunity={onOpenCommunity} onOpenPerson={onOpenPerson} />
        <div className="profile-page__back-bar">
          <button type="button" className="profile-page__back" onClick={onBack}>
            {t('back_to_imdb')}
          </button>
        </div>
        <section className="profile-page">
          <div className="profile-page__empty">
            <h1>{t('profile_signed_out_title')}</h1>
            <p>{t('profile_signed_out_body')}</p>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  const joinDate = formatJoinDate(user.joinedAt, lang)

  return (
    <>
      <Header onOpenTitle={onOpenTitle} onOpenWatch={onOpenWatch} onOpenMovies={onOpenMovies} onOpenWatchlist={onOpenWatchlist} onOpenProfile={onOpenProfile} onOpenTv={onOpenTv} onOpenCelebs={onOpenCelebs} onOpenAwards={onOpenAwards} onOpenCommunity={onOpenCommunity} onOpenPerson={onOpenPerson} />
      <div className="profile-page__back-bar">
        <button type="button" className="profile-page__back" onClick={onBack}>
          {t('back_to_imdb')}
        </button>
      </div>

      <section className="profile-page">
        <div className="profile-page__card">
          <div className="profile-page__avatar">{initials(user.name) || '?'}</div>
          <div className="profile-page__identity">
            <h1>{user.name}</h1>
            <p className="profile-page__email">{user.email}</p>
            {joinDate && (
              <p className="profile-page__joined">
                {t('profile_member_since')} {joinDate}
              </p>
            )}
          </div>
          <button type="button" className="profile-page__signout" onClick={signOut}>
            {t('sign_out')}
          </button>
        </div>

        <div className="profile-page__grid">
          <div className="profile-page__panel">
            <h2>{t('profile_membership_title')}</h2>
            <div className={`profile-page__plan${user.subscribed ? ' profile-page__plan--pro' : ''}`}>
              <div>
                <p className="profile-page__plan-name">
                  {user.subscribed ? t('profile_plan_pro') : t('profile_plan_free')}
                </p>
                <p className="profile-page__plan-desc">
                  {user.subscribed ? t('profile_plan_pro_desc') : t('profile_plan_free_desc')}
                </p>
              </div>
              <button type="button" className="profile-page__plan-btn" onClick={toggleSubscription}>
                {user.subscribed ? t('profile_cancel_plan') : t('profile_upgrade_plan')}
              </button>
            </div>
            <p className="profile-page__demo-note">{t('profile_demo_note')}</p>
          </div>

          <div className="profile-page__panel">
            <h2>{t('profile_activity_title')}</h2>
            <button type="button" className="profile-page__stat" onClick={onOpenWatchlist}>
              <img src={iconWatchlist} alt="" />
              <span className="profile-page__stat-value">{count}</span>
              <span className="profile-page__stat-label">{t('watchlist')}</span>
            </button>
            <div className="profile-page__stat profile-page__stat--static">
              <img src={iconStar} alt="" />
              <span className="profile-page__stat-value">{ratingsCount}</span>
              <span className="profile-page__stat-label">{t('profile_ratings')}</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default ProfilePage
