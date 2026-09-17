import { useState } from 'react'
import iconLinkArrow from './assets/icon-link-arrow.svg'
import logoImdb from './assets/logo-imdb.svg'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthModal from '../AuthModal/AuthModal.jsx'
import './Footer.css'

const COLUMN_1 = [
  { key: 'footer_get_app', arrow: true },
  { key: 'footer_imdbpro', arrow: true },
  { key: 'footer_imdb_developer', arrow: true },
  { key: 'footer_box_office_mojo', arrow: true },
]

const COLUMN_2 = [
  { key: 'footer_advertising', arrow: true },
  { key: 'footer_jobs', arrow: true },
  { key: 'footer_press_room', arrow: false },
]

const COLUMN_3 = [
  { key: 'footer_help', arrow: true },
  { key: 'footer_site_index', arrow: true },
  { key: 'footer_conditions', arrow: false },
  { key: 'footer_privacy', arrow: false },
  { key: 'footer_ads_privacy', arrow: false },
]

function FooterLink({ label, arrow }) {
  return (
    <a href="#" className="footer__link" onClick={(e) => e.preventDefault()}>
      <span>{label}</span>
      {arrow && <img src={iconLinkArrow} alt="" className="footer__link-arrow" />}
    </a>
  )
}

function Footer() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <footer className="footer">
      {!user && (
        <button type="button" className="footer__cta" onClick={() => setAuthOpen(true)}>
          {t('footer_cta')}
        </button>
      )}

      <div className="footer__content">
        <div className="footer__columns">
          <div className="footer__column">
            {COLUMN_1.map((item) => (
              <FooterLink key={item.key} label={t(item.key)} arrow={item.arrow} />
            ))}
          </div>
          <div className="footer__column">
            {COLUMN_2.map((item) => (
              <FooterLink key={item.key} label={t(item.key)} arrow={item.arrow} />
            ))}
          </div>
          <div className="footer__column">
            {COLUMN_3.map((item) => (
              <FooterLink key={item.key} label={t(item.key)} arrow={item.arrow} />
            ))}
          </div>
        </div>

        <div className="footer__brand">
          <img src={logoImdb} alt="IMDb" className="footer__logo" />
          <p className="footer__copyright">© 1990-2024 by IMDb.com, Inc.</p>
        </div>
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </footer>
  )
}

export default Footer
