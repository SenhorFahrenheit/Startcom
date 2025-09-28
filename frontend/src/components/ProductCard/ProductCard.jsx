import "./ProductCard.css"

const ProductCard = ({title, value, extra, color, icon}) => {
  return (
    <div className="ProductCard">
        <div className="product-informations-card">
            <p className="product-title-card">{title}</p>
            <p className="product-value-card">{value}</p>
            <p className={`product-extra-card ${color}`}>{extra}</p>
        </div>

        <div className={`product-icon-card ${color}`}>{icon}</div>
    </div>
  )
}

export default ProductCard