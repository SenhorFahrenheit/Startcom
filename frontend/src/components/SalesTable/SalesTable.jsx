import "./SalesTable.css";
import { useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";

const SalesTable = ({ dateFilter, statusFilter, search }) => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = {
          data: [
            { id: 1, client: "Maria Silva", date: "21/09/2025", amount: 256.80, status: "completed", items: 3 },
            { id: 2, client: "João Santos", date: "20/09/2025", amount: 189.50, status: "pending", items: 2 },
            { id: 3, client: "Ana Costa", date: "15/09/2025", amount: 445.29, status: "completed", items: 5 },
            { id: 4, client: "Carlos Souza", date: "05/08/2025", amount: 89.99, status: "canceled", items: 1 }
          ]
        };
        setSales(res.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...sales];

    if (search.trim() !== "") {
      result = result.filter(sale =>
      sale.client.toLowerCase().includes(search.toLowerCase()) ||
      String(sale.id).padStart(3, "0").includes(search) || 
      sale.date.includes(search)
      );
    }

    result = result.filter(sale => {
      if (sale.status === "completed" && !statusFilter["Concluído"]) return false;
      if (sale.status === "pending" && !statusFilter["Pendente"]) return false;
      if (sale.status === "canceled" && !statusFilter["Cancelada"]) return false;
      return true;
    });

    const today = new Date();
    result = result.filter(sale => {
      const [day, month, year] = sale.date.split("/");
      const saleDate = new Date(`${year}-${month}-${day}`);

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
            <th>Status</th>
            <th>Itens</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale.id}>
              <td>#{String(sale.id).padStart(3, "0")}</td>
              <td>{sale.client}</td>
              <td>{sale.date}</td>
              <td style={{color: "var(--primary-color)", fontWeight: 600}}>
                R$ {sale.amount.toLocaleString("pt-BR")}
              </td>
              <td>
                <span className={`status ${sale.status}`}>
                  {sale.status === "completed" 
                    ? "Concluída" 
                    : sale.status === "pending" 
                    ? "Pendente" 
                    : "Cancelada"}
                </span>
              </td>
              <td>{sale.items} itens</td>
              <td>
                <button className="view-btn">
                  <LuEye color="var(--primary-color)" />
                </button>
              </td>
            </tr>
          ))}
          {filteredSales.length === 0 && (
            <tr>
              <td colSpan="7" style={{textAlign: "center", padding: "16px"}}>
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
