import "./SalesCard.css"

const SalesCard = ({icon, description, value, information}) => {
  return (
    <div className="SalesCard">
        <div className="sales-card-block">
            <p className="sales-description">{description}</p>
            <p className="sales-value">{value}</p>
            <p className="sales-information">{information}</p>
        </div>
        <div className="sales-card-icon">{icon}</div>
    </div>
  )
}

export default SalesCard