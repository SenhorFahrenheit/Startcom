import "./RecentActivities.css";

/**
 * Displays a single recent activity item
 */
const RecentActivities = ({
  icon,
  color,
  transparentColor,
  type,
  time,
  action,
  entity,
  extra,
}) => {
  return (
    <div className="recent-action-component">
      {/* Activity header information */}
      <div className="recent-action-block">
        <div className={`recent-activities-icon ${color}`}>
          {icon}
        </div>

        <div className={`recent-action-type ${transparentColor}`}>
          {type}
        </div>

        <div className="recent-action-time">
          {time}
        </div>
      </div>

      {/* Activity description */}
      <p className="recent-action-text">
        {action} {entity ? `- ${entity}` : null}
      </p>

      {/* Additional activity information */}
      <p className="recent-action-extra">
        {extra}
      </p>
    </div>
  );
};

export default RecentActivities;