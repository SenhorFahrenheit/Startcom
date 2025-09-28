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
          { id: 1, product: "Camiseta Premium", code: "CAM001", category: "Roupas", quantity: 45, price: 59.99, status: "Normal", totalValue: 2695.50},
          { id: 2, product: "Tênis Esportivo", code: "TEN001", category: "Calçados", quantity: 8, price: 189.99, status: "Baixo", totalValue: 1519.20},
          { id: 3, product: "Mochila Executiva", code: "MOC001", category: "Acessórios", quantity: 3, price: 129.99, status: "Baixo", totalValue: 389.70},
          { id: 4, product: "Relógio Digital", code: "REL001", category: "Eletrônicos", quantity: 22, price: 299.99, status: "Normal", totalValue: 6597.80},
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
        String(product.id).includes(search)
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
              <td>{product.category}</td>
              <td>{product.quantity}</td>
              <td>R$ {product.price}</td>
              <td>{product.status}</td>
              <td>{product.totalValue}</td>
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