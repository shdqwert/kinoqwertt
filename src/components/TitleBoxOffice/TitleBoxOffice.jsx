import TitleInfoSection, { InfoRow } from '../TitleInfoSection/TitleInfoSection.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

function TitleBoxOffice({ movie }) {
  const { t } = useLanguage()
  const b = movie.boxOffice

  if (!b) return null

  return (
    <TitleInfoSection title={t('boxoffice_section_title')}>
      {b.budget && <InfoRow label={t('label_budget')}>{b.budget}</InfoRow>}
      {b.openingWeekendUS && <InfoRow label={t('label_opening_weekend')}>{b.openingWeekendUS}</InfoRow>}
      {b.grossUS && <InfoRow label={t('label_gross_us')}>{b.grossUS}</InfoRow>}
      {b.grossWorldwide && <InfoRow label={t('label_gross_worldwide')}>{b.grossWorldwide}</InfoRow>}
      <InfoRow label="">
        <a className="title-info__link" href="https://pro.imdb.com" target="_blank" rel="noreferrer">
          {t('imdbpro_link')}
        </a>
      </InfoRow>
    </TitleInfoSection>
  )
}

export default TitleBoxOffice
