import "./ReportCard.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ReportCard = ({ icon, value, description, information, loading }) => {
  return (
    <div className="ReportCard">
      <div className="report-icon-item">
        {loading ? <Skeleton circle width={52} height={52} /> : icon}
      </div>

      <p className="report-value-item">
        {loading ? <Skeleton width={120} /> : value}
      </p>

      <p className="report-description-item">
        {loading ? <Skeleton width={140} /> : description}
      </p>

      <p className="report-information-item">
        {loading ? <Skeleton width={160} /> : information}
      </p>
    </div>
  );
};

export default ReportCard;
