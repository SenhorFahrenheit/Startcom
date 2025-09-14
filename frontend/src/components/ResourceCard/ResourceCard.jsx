import "./ResourceCard.css"

const ResourceCard = ({icon, title, description}) => {
  return (
    <div className="card">
        <div className="icon-circle">{icon}</div>
        <h3 className="title-card">{title}</h3>
        <p className="description-card">{description}</p>
    </div>
  )
}

export default ResourceCard