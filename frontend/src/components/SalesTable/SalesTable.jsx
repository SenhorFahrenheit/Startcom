import "./SalesTable.css";
import { useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import formatCurrency from "../../utils/format";

const SalesTable = ({ dateFilter, statusFilter, search }) => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);

  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/Company/sales/get_all",
          { companyId: "69019f25b407b09e0d09cff5" }
        );

        console.log("API response:", response.data);

        if (!response.data.sales) return;

        const data = response.data.sales.map((sale) => ({
          id: sale._id,
          client: sale.clientName,
          date: new Date(sale.date), // mantemos como Date para filtro
          amount: sale.total,
          items: sale.items.reduce((acc, item) => acc + item.quantity, 0),
        }));

        setSales(data);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      }
    }

    fetchSales();
  }, []);

  useEffect(() => {
    let result = [...sales];

    // Filtrar por busca
    if (search.trim() !== "") {
      result = result.filter(
        (sale) =>
          sale.client.toLowerCase().includes(search.toLowerCase()) ||
          String(sale.id).includes(search) ||
          sale.date.toLocaleDateString("pt-BR").includes(search)
      );
    }

    // Filtrar por data
    const today = new Date();
    result = result.filter((sale) => {
      const saleDate = sale.date;

      if (dateFilter === "Hoje") {
        return saleDate.toDateString() === today.toDateString();
      }
      if (dateFilter === "Esta Semana") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return saleDate >= weekAgo && saleDate <= today;
      }
      if (dateFilter === "Este Mês") {
        return (
          saleDate.getMonth() === today.getMonth() &&
          saleDate.getFullYear() === today.getFullYear()
        );
      }
      if (dateFilter === "Este Ano") {
        return saleDate.getFullYear() === today.getFullYear();
      }
      return true;
    });

    setFilteredSales(result);
  }, [sales, dateFilter, statusFilter, search]);

  return (
    <div className="sales-table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Valor</th>
            <th>Itens</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <tr key={sale.id}>
                <td>#{String(sale.id).slice(-4).toUpperCase()}</td>
                <td>{sale.client}</td>
                <td>{sale.date.toLocaleDateString("pt-BR")}</td>
                <td style={{ color: "var(--primary-color)", fontWeight: 600 }}>
                  {formatCurrency(sale.amount)}
                </td>
                <td>{sale.items} itens</td>
                <td>
                  <button className="view-btn">
                    <LuEye color="var(--primary-color)" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "16px" }}>
                Nenhuma venda encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
