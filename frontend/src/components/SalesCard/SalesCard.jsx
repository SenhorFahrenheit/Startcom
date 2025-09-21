import "./SalesCard.css"

const SalesCard = ({icon, description, value, information}) => {
  return (
    <div className="SalesCard">
        <div className="sales-card-block">
            <p>{description}</p>
            <p>{value}</p>
            <p>{information}</p>
        </div>
        <div>{icon}</div>
    </div>
  )
}

export default SalesCard