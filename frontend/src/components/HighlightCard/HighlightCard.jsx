import "./HighlightCard.css"

const HighlightCard = ({title, highlight, value, extra}) => {
  return (
    <div className="HighlightCard">
        <div className="highlight-block">
            <p className="highlight-title">{title}</p>
            <p className="highlight-name">{highlight}</p>
        </div>

        <div className="highlight-block">
            <p className="highlight-value">{value}</p>
            <p className="highlight-extra">{extra}</p>
        </div>
    </div>
  )
}

export default HighlightCard