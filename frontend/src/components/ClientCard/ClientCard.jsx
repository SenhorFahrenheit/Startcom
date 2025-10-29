import "./ClientCard.css"

const ClientCard = ({icon, value, description, color}) => {
  return (
    <div className="ClientCard">
        <div className={`client-icon-card client-card-${color}`}>{icon}</div>
        <p className="client-value-card">{value}</p>
        <p className="client-description-card">{description}</p>
    </div>
  )
}

export default ClientCard