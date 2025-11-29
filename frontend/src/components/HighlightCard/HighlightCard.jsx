import "./HighlightCard.css"

/**
 * HighlightCard component
 * Displays a highlighted label with related values.
 */
const HighlightCard = ({
  title,
  highlight,
  value,
  extra,
}) => {
  return (
    <div className="HighlightCard">
      {/* Highlight information */}
      <div className="highlight-block">
        <p className="highlight-title">{title}</p>
        <p className="highlight-name">{highlight}</p>
      </div>

      {/* Highlight values */}
      <div className="highlight-block">
        <p className="highlight-value">{value}</p>
        <p className="highlight-extra">{extra}</p>
      </div>
    </div>
  )
}

export default HighlightCard