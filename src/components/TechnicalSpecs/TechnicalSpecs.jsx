import TitleInfoSection, { InfoRow, DotList } from '../TitleInfoSection/TitleInfoSection.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

function TechnicalSpecs({ movie }) {
  const { t } = useLanguage()
  const specs = movie.technicalSpecs

  return (
    <TitleInfoSection title={t('techspecs_title')}>
      <InfoRow label={t('label_runtime')}>{movie.runtime}</InfoRow>
      {specs?.color?.length > 0 && (
        <InfoRow label={t('label_color')}>
          <DotList items={specs.color} />
        </InfoRow>
      )}
      {specs?.soundMix?.length > 0 && (
        <InfoRow label={t('label_sound_mix')}>
          <DotList items={specs.soundMix} />
        </InfoRow>
      )}
    </TitleInfoSection>
  )
}

export default TechnicalSpecs
