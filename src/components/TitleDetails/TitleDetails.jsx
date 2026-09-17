import TitleInfoSection, { InfoRow, DotList } from '../TitleInfoSection/TitleInfoSection.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

function TitleDetails({ movie }) {
  const { t } = useLanguage()
  const d = movie.details

  if (!d) return null

  return (
    <TitleInfoSection title={t('details_title')}>
      {d.releaseDate && <InfoRow label={t('label_release_date')}>{d.releaseDate}</InfoRow>}
      {d.countries?.length > 0 && (
        <InfoRow label={t('label_countries')}>
          <DotList items={d.countries} />
        </InfoRow>
      )}
      {d.officialSite && (
        <InfoRow label={t('label_official_site')}>
          <a className="title-info__link" href={d.officialSite} target="_blank" rel="noreferrer">
            {t('label_official_site')}
          </a>
        </InfoRow>
      )}
      {d.language && (
        <InfoRow label={t('label_language')}>
          <span className="title-info__dot-item">{d.language}</span>
        </InfoRow>
      )}
      {d.akaTitle && <InfoRow label={t('label_aka')}>{d.akaTitle}</InfoRow>}
      {d.filmingLocations && <InfoRow label={t('label_filming_locations')}>{d.filmingLocations}</InfoRow>}
      {d.productionCompanies?.length > 0 && (
        <InfoRow label={t('label_production_companies')}>
          <DotList items={d.productionCompanies} />
        </InfoRow>
      )}
      <InfoRow label="">
        <a className="title-info__link" href="https://pro.imdb.com" target="_blank" rel="noreferrer">
          {t('imdbpro_link')}
        </a>
      </InfoRow>
    </TitleInfoSection>
  )
}

export default TitleDetails
