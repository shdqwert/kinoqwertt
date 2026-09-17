import TitleInfoSection, { InfoRow, PillList } from '../TitleInfoSection/TitleInfoSection.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

function Storyline({ movie }) {
  const { t } = useLanguage()
  const s = movie.storyline || {}
  const translatedGenres = movie.genres.map((g) => t(g))

  return (
    <TitleInfoSection title={t('storyline_title')}>
      <InfoRow label={t('label_summary')}>{s.summary || movie.plot}</InfoRow>
      {s.synopsis && <InfoRow label={t('label_synopsis')}>{s.synopsis}</InfoRow>}
      {s.keywords?.length > 0 && (
        <InfoRow label={t('label_keywords')}>
          <PillList items={s.keywords} />
        </InfoRow>
      )}
      {s.tagline && <InfoRow label={t('label_taglines')}>{s.tagline}</InfoRow>}
      <InfoRow label={t('label_genres')}>
        <PillList items={translatedGenres} />
      </InfoRow>
      {s.parentsGuide && <InfoRow label={t('label_parents_guide')}>{s.parentsGuide}</InfoRow>}
    </TitleInfoSection>
  )
}

export default Storyline
