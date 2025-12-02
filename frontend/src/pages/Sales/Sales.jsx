// Styles
import "./Sales.css";
import "../commonStyle.css";

// React
import { useState, useEffect } from "react";

// Utils
import { formatCurrency, formatPercent } from '../../utils/format';
import api from "../../services/api";

// Hooks
import { useAuthModals } from "../../hooks/useAuthModals";
import { useAuth } from "../../contexts/AuthContext";

// Layouts
import Sidebar from "../../layouts/Sidebar/Sidebar";
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile";

// Components
import SalesCard from "../../components/SalesCard/SalesCard";
import Button from "../../components/Button/Button";
import FilterDateButton from "../../components/FilterDateButton/FilterDateButton";
import NewSaleModal from "../../components/Modals/NewSaleModal";
import SalesTable from "../../components/SalesTable/SalesTable";

// Icons
import { LuPlus, LuDollarSign, LuShoppingCart, LuTrendingUp } from "react-icons/lu";

// Skeleton CSS
import "react-loading-skeleton/dist/skeleton.css";

const Sales = () => {
  const { token, user, isAuthenticated, pageLoading } = useAuth(); // Auth state
  const companyId = user?.companyId;

  const { activeModal, openSale, closeModal } = useAuthModals(); // Modal control

  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle
  const [skeletonLoading, setSkeletonLoading] = useState(false); // Loading skeleton
  const [dateFilter, setDateFilter] = useState("Este Mês"); // Selected date filter
  const [statusFilter, setStatusFilter] = useState({ // Status filters
    "Concluído": true,
    "Pendente": true,
    "Cancelada": true,
  });
  const [search, setSearch] = useState(""); // Search query
  const [overview, setOverview] = useState({ // Sales overview data
    todayTotal: 0,
    todayComparison: 0,
    totalSales: 0,
    weekSales: 0,
    averageTicket: 0,
    averageTicketComparison: 0,
  });
  const [refreshSales, setRefreshSales] = useState(0); // Trigger to refresh table

  const toggleSidebar = () => setSidebarOpen(prev => !prev); // Toggle sidebar visibility

  // Fetch sales overview from API
  const fetchOverview = async () => {
    try {
      setSkeletonLoading(true);
      const response = await api.get("/Company/sales/overview");
      const data = response.data.overview;

      setOverview({
        todayTotal: data.today.total,
        todayComparison: data.today.comparison,
        totalSales: data.sales.total,
        weekSales: data.sales.week,
        averageTicket: data.ticket.average,
        averageTicketComparison: data.ticket.comparison,
      });
    } catch (error) {
      console.error("Error fetching sales overview:", error);
    } finally {
      setSkeletonLoading(false);
    }
  };

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!pageLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [pageLoading, isAuthenticated]);

  // Fetch overview on mount
  useEffect(() => {
    if (!pageLoading && isAuthenticated && companyId) {
      fetchOverview();
    }
  }, [pageLoading, isAuthenticated, companyId]);

  return (
    <section className="body-section">
      <HeaderMobile onToggleSidebar={toggleSidebar} /> {/* Mobile header */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} /> {/* Sidebar layout */}

      <div className="content-page-section">
        {/* Page header */}
        <div className="align-heading">
          <div>
            <h1 className="title-page-section">Vendas</h1>
            <p className="description-page-section">Gerencie todas as suas vendas e transações</p>
          </div>

          <div className="button-shadown">
            <Button 
              className="hover-dashboard" 
              onClick={openSale} // Open New Sale Modal
              height={"auto"} 
              width={160} 
              label={<><LuPlus size={"1.5rem"}/>Nova Venda</>} 
            />
          </div>
        </div>

        {/* Sales overview cards */}
        <section className="salesCards">
          {skeletonLoading ? (
            [0,1,2].map(idx => (
              <SalesCard key={idx} loading={true} /> // Loading placeholders
            ))
          ) : (
            <>
              <SalesCard 
                icon={<LuDollarSign size={24}/>} 
                description="Vendas Hoje" 
                value={formatCurrency(overview.todayTotal)} 
                information={`${overview.todayComparison > 0 ? "+" : ""}${formatPercent(overview.todayComparison)} vs ontem`}
                progress={overview.todayComparison > 0 ? "good-progress" : overview.todayComparison < 0 ? "bad-progress" : "neutral-progress"}
              />
              <SalesCard 
                icon={<LuShoppingCart size={24}/>} 
                description="Total de Vendas" 
                value={overview.totalSales} 
                information={overview.weekSales + " esta semana"}
                progress={overview.weekSales > 0 ? "good-progress" : overview.weekSales < 0 ? "bad-progress" : "neutral-progress"}
              />
              <SalesCard 
                icon={<LuTrendingUp size={24}/>} 
                description="Ticket Médio" 
                value={formatCurrency(overview.averageTicket)} 
                information={`${overview.averageTicketComparison > 0 ? "+" : ""}${formatPercent(overview.averageTicketComparison)} este mês`}
                progress={overview.averageTicketComparison > 0 ? "good-progress" : overview.averageTicketComparison < 0 ? "bad-progress" : "neutral-progress"}
              />
            </>
          )}
        </section>

        {/* Filters and search */}
        <div className="filter-search">
          <input 
            style={{ fontSize: 14, paddingLeft: 16 }} 
            className="InputDashboard" 
            type="text" 
            placeholder="Buscar Vendas por cliente, ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filters-block">
            <FilterDateButton 
              options={["Hoje", "Esta Semana", "Este Mês", "Este Ano"]}
              defaultValue="Este Mês"
              onSelect={setDateFilter} // Date filter
            />
          </div>
        </div>

        {/* Recent sales table */}
        <div className="recent-sells">
          <div className="recentSells-title">
            <h3>Vendas Recentes</h3>
          </div>

          <SalesTable
            dateFilter={dateFilter}
            statusFilter={statusFilter}
            search={search}
            refreshTrigger={refreshSales} // Trigger to refresh table after new sale
          />
        </div>
      </div>

      {/* New Sale Modal */}
      <NewSaleModal
        isOpen={activeModal === "sale"}
        onClose={closeModal}
        onSuccess={() => {
          fetchOverview(); // Refresh overview after new sale
          setRefreshSales(prev => prev + 1); // Trigger table refresh
        }}
      />
    </section>
  );
};

export default Sales; // Export Sales page component