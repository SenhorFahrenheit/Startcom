import "./ReportCard.css"

const ReportCard = ({icon, value, description, information}) => {
  return (
    <div className="ReportCard">
        <div className="report-icon-item">{icon}</div>
        <p className="report-value-item">{value}</p>
        <p className="report-description-item">{description}</p>
        <p className="report-information-item">{information}</p>
    </div>
  )
}

export default ReportCard