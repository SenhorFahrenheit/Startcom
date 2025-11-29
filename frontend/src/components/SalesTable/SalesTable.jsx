import "./SalesTable.css";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import api from "../../services/api";
import { formatCurrency, formatDateBR } from "../../utils/format";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Component responsible for displaying and managing the sales table
const SalesTable = ({ dateFilter, statusFilter, search, refreshTrigger }) => {
  // Stores all fetched sales
  const [sales, setSales] = useState([]);

  // Stores sales after filters and sorting
  const [filteredSales, setFilteredSales] = useState([]);

  // Controls skeleton loading state
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  // Stores IDs of blurred sales, persisted in localStorage
  const [blurredRows, setBlurredRows] = useState(() => {
    const saved = localStorage.getItem("blurredSales");
    return saved ? JSON.parse(saved) : [];
  });

  // Blurs all currently filtered sales
  const hideAll = () => {
    const allIds = filteredSales.map(sale => sale.id);
    setBlurredRows(allIds);
  };

  // Reveals all sales
  const showAll = () => {
    setBlurredRows([]);
  };

  // Toggles blur state for a single sale
  const blurSale = (id) => {
    setBlurredRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Loads blurred sales state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("blurredSales");
    if (saved) {
      setBlurredRows(JSON.parse(saved));
    }
  }, []);

  // Persists blurred sales state whenever it changes
  useEffect(() => {
    localStorage.setItem("blurredSales", JSON.stringify(blurredRows));
  }, [blurredRows]);

  // Fetches all sales from the API
  const fetchSales = async () => {
    try {
      setSkeletonLoading(true);

      const response = await api.get("/Company/sales/get_all");
      if (!response.data.sales) return;

      // Normalizes API response into table-friendly structure
      const data = response.data.sales.map((sale) => {
        const dateObj = new Date(sale.date);

        return {
          id: sale._id,
          client: sale.clientName,
          date: dateObj,
          dateBR: formatDateBR(sale.date),
          amount: sale.total,
          items: sale.items.reduce((acc, item) => acc + item.quantity, 0),
        };
      });

      setSales(data);
    } catch (error) {
      console.error("Error while fetching sales:", error.response?.data || error);
    } finally {
      setSkeletonLoading(false);
    }
  };

  // Refetches sales when external refresh trigger changes
  useEffect(() => {
    fetchSales();
  }, [refreshTrigger]);

  // Applies search, date filters and sorting
  useEffect(() => {
    let result = [...sales];

    // Applies text search filter
    if (search.trim() !== "") {
      result = result.filter(
        (sale) =>
          sale.client.toLowerCase().includes(search.toLowerCase()) ||
          String(sale.id).includes(search) ||
          sale.dateBR.includes(search)
      );
    }

    // Applies date filter
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

    // Sorts sales by most recent date
    result.sort((a, b) => b.date - a.date);

    setFilteredSales(result);
  }, [sales, dateFilter, statusFilter, search]);

  // Skeleton placeholder rows
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="sales-table-container">
      <div className="sales-actions">
        {/* Toggle blur state for all rows */}
        {blurredRows.length === filteredSales.length && filteredSales.length > 0 ? (
          <button className="show-hide-btn" onClick={showAll}>
            Revelar Vendas
          </button>
        ) : (
          <button className="show-hide-btn" onClick={hideAll}>
            Ocultar Vendas
          </button>
        )}
      </div>

      <table className="sales-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Valor</th>
            <th>Itens</th>
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          {/* Loading state */}
          {skeletonLoading
            ? skeletonRows.map((_, idx) => (
                <tr key={idx}>
                  <td><Skeleton width={50} /></td>
                  <td><Skeleton width={120} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={40} /></td>
                </tr>
              ))
            : filteredSales.length > 0
            ? filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className={blurredRows.includes(sale.id) ? "blurred-row" : ""}
                >
                  <td>#{String(sale.id).slice(-4).toUpperCase()}</td>
                  <td>{sale.client}</td>
                  <td>{sale.dateBR}</td>
                  <td style={{ color: "var(--primary-color)", fontWeight: 600 }}>
                    {formatCurrency(sale.amount)}
                  </td>
                  <td>{sale.items} itens</td>
                  <td>
                    {/* Toggle visibility of individual sale */}
                    <button
                      className={`view-btn ${blurredRows.includes(sale.id) ? "view-btn-blurred" : ""}`}
                      onClick={() => blurSale(sale.id)}
                    >
                      {blurredRows.includes(sale.id) ? (
                        <EyeOff color="var(--primary-color)" />
                      ) : (
                        <Eye color="var(--primary-color)" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            : (
              // Empty state
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