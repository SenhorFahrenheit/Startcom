import "./ResourceCard.css";

/**
 * Displays a resource card with icon and text
 */
const ResourceCard = ({ icon, title, description }) => {
  return (
    <div className="card">
      {/* Resource icon */}
      <div className="icon-circle">
        {icon}
      </div>

      {/* Resource title */}
      <h3 className="title-card">
        {title}
      </h3>

      {/* Resource description */}
      <p className="description-card">
        {description}
      </p>
    </div>
  );
};

export default ResourceCard;