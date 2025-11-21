import "./ProductTable.css";
import { useEffect, useState } from "react";
import { LuBarcode, LuPackage } from "react-icons/lu";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { formatCurrency } from "../../utils/format";
import api from "../../services/api";

const ProductTable = ({ categoryFilter, statusFilter, search, loading }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.post("/Company/inventory/overview"); 
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setProducts([]);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (search.trim() !== "") {
      result = result.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        String(product.code || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(product => product.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(result);
  }, [products, categoryFilter, statusFilter, search]);

  return (
    <div className="products-table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>Produto</th>
            {/*<th>Código</th>*/}
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Preço de Venda</th>
            <th>Status</th>
            <th>Valor Investido</th>
          </tr>
        </thead>

        <tbody>
          {loading
            ? [0,1,2,3,4].map((_, idx) => (
                <tr key={idx}>
                  <td className="product-cell">
                    <div className="product-content">
                      <div className="product-icon"><Skeleton borderRadius={10} width={44} height={44} /></div>
                      <span><Skeleton width={160} height={16} /></span>
                    </div>
                  </td>
                  <td className="product-category-item"><Skeleton width={70} height={18} borderRadius={10} /></td>
                  <td className="product-quantity-item">
                    <Skeleton width={40} />
                    <Skeleton width={30} />
                  </td>
                  <td className="product-price-item"><Skeleton width={70} /></td>
                  <td><Skeleton width={70} height={18} borderRadius={10} /></td>
                  <td className="product-totalValue-item"><Skeleton width={80} /></td>
                </tr>
              ))
            : filteredProducts.map((product) => (
                <tr key={product.name}>
                  <td className="product-cell">
                    <div className="product-content">
                      <div className="product-icon"><LuPackage size={24}/></div>
                      <span>{product.name}</span>
                    </div>
                  </td>

                  {/*<td className="product-barcode-item">
                    <LuBarcode /> {product.code}
                  </td>*/}

                  <td className="product-category-item">
                    <div>{product.category}</div>
                  </td>

                  <td>
                    <div className="product-quantity-item">
                        <p>{product.quantity}</p>
                        <p>mín: {product.minQuantity}</p>
                    </div>
                  </td>

                  <td className="product-price-item">
                    {formatCurrency(product.unitPrice)}
                  </td>

                  <td>
                    <p className={`product-status-item ${product.status}`}>
                      {product.status}
                    </p>
                  </td>

                  <td className="product-totalValue-item">
                    {formatCurrency(product.totalValue)}
                  </td>
                </tr>
              ))
          }

          {filteredProducts.length === 0 && !loading && (
            <tr>
              <td colSpan="6" style={{textAlign:"center", padding:"16px"}}>Nenhum produto encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
