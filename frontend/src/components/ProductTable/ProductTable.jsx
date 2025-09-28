import "./ProductTable.css";
import { useEffect, useState } from "react";
import { LuBarcode, LuPackage } from "react-icons/lu";

const ProductTable = ({ categoryFilter, statusFilter, search }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = {
        data: [
          { id: 1, product: "Camiseta Premium", code: "CAM001", category: "Roupas", quantity: 45, min: 10, price: 59.99, status: "Normal", totalValue: 2695.59},
          { id: 2, product: "Tênis Esportivo", code: "TEN001", category: "Calçados", quantity: 8, min: 15, price: 189.99, status: "Baixo", totalValue: 1519.29},
          { id: 3, product: "Mochila Executiva", code: "MOC001", category: "Acessórios", quantity: 1, min: 5, price: 129.99, status: "Crítico", totalValue: 389.79},
          { id: 4, product: "Relógio Digital", code: "REL001", category: "Eletrônicos", quantity: 0, min: 10, price: 299.99, status: "Esgotado", totalValue: 6597.89},
        ]
      };
      setProducts(res.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (search.trim() !== "") {
      result = result.filter(product =>
        product.product.toLowerCase().includes(search.toLowerCase()) ||
        String(product.code).toLowerCase().includes(search.toLowerCase())
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
            <th>Código</th>
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td className="product-cell">
                <div className="product-content">
                    <div className="product-icon"><LuPackage size={24}/></div>
                    <span>{product.product}</span>
                </div>
              </td>
              <td className="product-barcode-item"><LuBarcode/>{product.code}</td>
              <td className="product-category-item"><div>{product.category}</div></td>
              <td>
                <div className="product-quantity-item">
                    <p>{product.quantity}</p>
                    <p>mín: {product.min}</p>
                </div>
              </td>
              <td className="product-price-item">R$ {product.price}</td>
              <td><p className={`product-status-item ${product.status}`}>{product.status}</p></td>
              <td className="product-totalValue-item">R$ {product.totalValue}</td>
            </tr>
          ))}
          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan="8" style={{textAlign: "center", padding: "16px"}}>
                Nenhuma venda encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;