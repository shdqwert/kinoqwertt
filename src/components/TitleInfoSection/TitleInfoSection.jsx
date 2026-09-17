import './TitleInfoSection.css'

export function InfoRow({ label, children }) {
  return (
    <div className="title-info__row">
      <span className="title-info__label">{label}</span>
      <div className="title-info__value">{children}</div>
    </div>
  )
}

export function PillList({ items }) {
  return (
    <div className="title-info__pills">
      {items.map((item, i) => (
        <span className="title-info__pill" key={`${item}-${i}`}>{item}</span>
      ))}
    </div>
  )
}

export function DotList({ items }) {
  return (
    <span className="title-info__dot-list">
      {items.map((item, i) => (
        <span key={`${item}-${i}`}>
          <span className="title-info__dot-item">{item}</span>
          {i < items.length - 1 && <span className="title-info__dot" />}
        </span>
      ))}
    </span>
  )
}

function TitleInfoSection({ title, children }) {
  return (
    <section className="title-info">
      <div className="title-info__header">
        <div className="title-info__title-group">
          <h2>{title}</h2>
        </div>
      </div>
      <div className="title-info__body">{children}</div>
    </section>
  )
}

export default TitleInfoSection
