import "./ReportCard.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Displays a report summary card with loading state
 */
const ReportCard = ({ icon, value, description, information, loading, progress }) => {
  return (
    <div className="ReportCard">
      {/* Report icon */}
      <div className="report-icon-item">
        {loading ? (
          <Skeleton circle width={52} height={52} />
        ) : (
          icon
        )}
      </div>

      {/* Main report value */}
      <p className="report-value-item">
        {loading ? <Skeleton width={120} /> : value}
      </p>

      {/* Short description */}
      <p className="report-description-item">
        {loading ? <Skeleton width={140} /> : description}
      </p>

      {/* Additional information */}
      <p className={`report-information-item ${progress}`}>
        {loading ? <Skeleton width={160} /> : information}
      </p>
    </div>
  );
};

export default ReportCard;