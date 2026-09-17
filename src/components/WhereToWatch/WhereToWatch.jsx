import { useState } from 'react'
import { useWatchProviders } from '../../hooks/useWatchProviders.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './WhereToWatch.css'

const TABS = [
  { key: 'flatrate', labelKey: 'wtw_tab_stream' },
  { key: 'rent', labelKey: 'wtw_tab_rent' },
  { key: 'buy', labelKey: 'wtw_tab_buy' },
]

function WhereToWatch({ movie }) {
  const { t } = useLanguage()
  const providers = useWatchProviders(movie)
  const availableTabs = TABS.filter((tab) => providers?.[tab.key]?.length > 0)
  const [activeTab, setActiveTab] = useState(null)
  const currentTab = activeTab && availableTabs.some((t2) => t2.key === activeTab) ? activeTab : availableTabs[0]?.key
  const list = currentTab ? providers?.[currentTab] || [] : []

  if (providers && availableTabs.length === 0) {
    return (
      <section className="where-to-watch">
        <h2>{t('where_to_watch')}</h2>
        <p className="where-to-watch__empty">{t('wtw_unavailable')}</p>
      </section>
    )
  }

  return (
    <section className="where-to-watch">
      <h2>{t('where_to_watch')}</h2>

      {availableTabs.length > 0 && (
        <div className="where-to-watch__bar">
          <div className="where-to-watch__tabs">
            {availableTabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                className={`where-to-watch__tab${tab.key === currentTab ? ' where-to-watch__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="where-to-watch__providers">
        {!providers && <p className="where-to-watch__status">{t('loading')}</p>}
        {list.map((provider) => (
          <a
            className="where-to-watch__provider"
            key={provider.id}
            href={providers.link}
            target="_blank"
            rel="noreferrer"
            title={provider.name}
          >
            <div className="where-to-watch__logo">
              <img src={provider.logo} alt={provider.name} />
            </div>
            <span className="where-to-watch__name">{provider.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default WhereToWatch
