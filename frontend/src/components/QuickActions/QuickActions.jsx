import "./QuickActions.css";

/**
 * Displays a quick action item with icon and description
 */
const QuickActions = ({ icon, name, description }) => {
  return (
    <div className="quick-action">
      {/* Main content alignment */}
      <div className="align-quick-action-items">
        {/* Action icon */}
        <div className="quick-action-icon">{icon}</div>

        {/* Action text content */}
        <div className="quick-action-text-part">
          <p className="title-quick-action">{name}</p>
          <p className="description-quick-action">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;