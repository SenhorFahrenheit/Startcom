import './ProductCard.css'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCard = ({ title, value, extra, color, icon, loading }) => {
  return (
    <div className="ProductCard">
      <div className="product-informations-card">
        <p className="product-title-card">{loading ? <Skeleton width={100}/> : title}</p>
        <p className="product-value-card">{loading ? <Skeleton width={60}/> : value}</p>
        <p className={`product-extra-card ${color}`}>
          {loading ? <Skeleton width={80}/> : extra}
        </p>
      </div>

      <div className={`product-icon-card ${color}`}>
        {loading ? <Skeleton square borderRadius={10} width={48} height={48}/> : icon}
      </div>
    </div>
  );
};

export default ProductCard;
