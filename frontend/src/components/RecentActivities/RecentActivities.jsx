
import "./RecentActivities.css"

const RecentActivities = ({icon, color, transparentColor, type, time, action, entity, extra}) => {
  return (
    <div className="recent-action-component">
        <div className="recent-action-block">
            <div className={`recent-activities-icon ${color}`}>{icon}</div>
            <div className={`recent-action-type ${transparentColor}`}>{type}</div>
            <div className="recent-action-time">{time}</div>
        </div>

        <p className="recent-action-text">{action} {entity ? `- ${entity}` : null}</p>
        <p className="recent-action-extra">{extra}</p>
    </div>
  )
}

export default RecentActivities