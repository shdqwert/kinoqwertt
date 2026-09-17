import { useState } from 'react'
import logoAppleTv from './assets/logo-appletv.png'
import logoPrimeVideo from './assets/logo-primevideo.svg'
import logoYoutube from './assets/logo-youtube.svg'
import logoGooglePlay from './assets/logo-googleplay.svg'
import logoFandango from './assets/logo-fandango.png'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './WhereToWatch.css'

const TABS = [
  { key: 'buy', labelKey: 'wtw_tab_buy' },
  { key: 'rent', labelKey: 'wtw_tab_rent' },
  { key: 'stream', labelKey: 'wtw_tab_stream' },
]
const FILTERS = [
  { key: 'country', labelKey: 'wtw_filter_country' },
  { key: 'price', labelKey: 'wtw_filter_price' },
  { key: 'quality', labelKey: 'wtw_filter_quality' },
]

const PROVIDERS = [
  { key: 'appletv', logo: logoAppleTv, name: 'Apple TV', price: '$19.99' },
  { key: 'primevideo', logo: logoPrimeVideo, name: 'Prime Video', price: '$19.99' },
  { key: 'googleplay', logo: logoGooglePlay, name: 'Google Play', price: '$19.99' },
  { key: 'youtube', logo: logoYoutube, name: 'YouTube', price: '$19.99' },
  { key: 'fandango', logo: logoFandango, name: 'Fandango at Home', price: '$19.99' },
]

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WhereToWatch() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(TABS[0].key)

  return (
    <section className="where-to-watch">
      <h2>{t('where_to_watch')}</h2>

      <div className="where-to-watch__bar">
        <div className="where-to-watch__tabs">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.key}
              className={`where-to-watch__tab${tab.key === activeTab ? ' where-to-watch__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
        <div className="where-to-watch__filters">
          {FILTERS.map((filter) => (
            <button type="button" className="where-to-watch__filter" key={filter.key}>
              <span>{t(filter.labelKey)}</span>
              <ChevronDown />
            </button>
          ))}
        </div>
      </div>

      <div className="where-to-watch__providers">
        {PROVIDERS.map((provider) => (
          <div className="where-to-watch__provider" key={provider.key}>
            <div className="where-to-watch__logo">
              <img src={provider.logo} alt={provider.name} />
            </div>
            <span className="where-to-watch__price">{provider.price}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WhereToWatch
