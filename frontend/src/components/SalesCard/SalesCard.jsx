import "./SalesCard.css"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const SalesCard = ({ icon, description, value, information, progress, loading }) => {
  return (
    <div className="SalesCard">
      <div className="sales-card-block">
        <p className="sales-description">{loading ? <Skeleton width={100} /> : description}</p>
        <p className="sales-value">{loading ? <Skeleton width={80} /> : value}</p>
        <p className={`sales-information ${progress}`}>
          {loading ? <Skeleton width={120} /> : information}
        </p>
      </div>
      <div className="sales-card-icon">{loading ? <Skeleton width={52} height={52} borderRadius={10} /> : icon}</div>
    </div>
  );
};


export default SalesCard