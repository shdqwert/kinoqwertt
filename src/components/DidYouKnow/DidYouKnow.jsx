import TitleInfoSection, { InfoRow } from '../TitleInfoSection/TitleInfoSection.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

function DidYouKnow({ movie }) {
  const { t } = useLanguage()
  const d = movie.didYouKnow

  if (!d) return null

  return (
    <TitleInfoSection title={t('didyouknow_title')}>
      {d.trivia && <InfoRow label={t('label_trivia')}>{d.trivia}</InfoRow>}
      {d.goofs && <InfoRow label={t('label_goofs')}>{d.goofs}</InfoRow>}
      {d.quote && <InfoRow label={t('label_quotes')}>{d.quote}</InfoRow>}
      {d.crazyCredits && <InfoRow label={t('label_crazy_credits')}>{d.crazyCredits}</InfoRow>}
      {d.connections && <InfoRow label={t('label_connections')}>{d.connections}</InfoRow>}
    </TitleInfoSection>
  )
}

export default DidYouKnow
