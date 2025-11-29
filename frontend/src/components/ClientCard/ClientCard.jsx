import "./ClientCard.css"

/**
 * ClientCard component
 * Displays an icon with a value and description.
 */
const ClientCard = ({ icon, value, description, color }) => {
  return (
    <div className="ClientCard">
      {/* Icon container with dynamic color */}
      <div className={`client-icon-card client-card-${color}`}>
        {icon}
      </div>

      {/* Main value displayed on the card */}
      <p className="client-value-card">{value}</p>

      {/* Supporting description text */}
      <p className="client-description-card">{description}</p>
    </div>
  )
}

export default ClientCard
