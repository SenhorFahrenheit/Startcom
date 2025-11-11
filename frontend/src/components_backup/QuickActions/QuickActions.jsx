import "./QuickActions.css"

const QuickActions = ({icon, name, description}) => {
  return (
    <div className="quick-action">
        <div className="align-quick-action-items">
            <div className="quick-action-icon">{icon}</div>
            <div className="quick-action-text-part">
                <p className="title-quick-action">{name}</p>
                <p className="description-quick-action">{description}</p>
            </div>
        </div>
    </div>
  )
}

export default QuickActions