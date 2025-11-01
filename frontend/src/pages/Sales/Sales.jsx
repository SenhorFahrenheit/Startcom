import "./Sales.css";
import "../commonStyle.css";
import { useState, useEffect } from "react";
import axios from "axios";

import formatCurrency from '../../utils/format';
import { useAuthModals } from "../../hooks/useAuthModals";
import NewSaleModal from "../../components/Modals/NewSaleModal";
import Sidebar from "../../layouts/Sidebar/Sidebar";
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile";
import SalesCard from "../../components/SalesCard/SalesCard";
import Button from "../../components/Button/Button";
import FilterDateButton from "../../components/FilterDateButton/FilterDateButton";
import SalesTable from "../../components/SalesTable/SalesTable";

import { LuPlus, LuDollarSign, LuShoppingCart, LuTrendingUp } from "react-icons/lu";

const Sales = () => {

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("company_id");

  const { activeModal, openSale, closeModal } = useAuthModals();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("Este Mês");
  const [statusFilter, setStatusFilter] = useState({
    "Concluído": true,
    "Pendente": true,
    "Cancelada": true,
  });
  const [search, setSearch] = useState("");
  const [overview, setOverview] = useState({
    todayTotal: 0,
    todayComparison: 0,
    totalSales: 0,
    weekSales: 0,
    averageTicket: 0,
    averageTicketComparison: 0,
  });

  const [refreshSales, setRefreshSales] = useState(0);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const fetchOverview = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/Company/sales/overview",
        { companyId }
      );
      const data = response.data.overview.overview;

      setOverview({
        todayTotal: data.today.total,
        todayComparison: data.today.comparison,
        totalSales: data.sales.total,
        weekSales: data.sales.week,
        averageTicket: data.ticket.average,
        averageTicketComparison: data.ticket.comparison,
      });
    } catch (error) {
      console.error("Erro ao buscar overview de vendas:", error);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <section className="body-section">
      <HeaderMobile onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      <div className="content-page-section">
        <div className="align-heading">
          <div>
            <h1 className="title-page-section">Vendas</h1>
            <p className="description-page-section">Gerencie todas as suas vendas e transações</p>
          </div>

          <div className="button-shadown">
            <Button 
              className="hover-dashboard" 
              onClick={openSale} 
              height={"auto"} 
              width={160} 
              label={<><LuPlus size={"1.5rem"}/>Nova Venda</>} 
            />
          </div>
        </div>

        <section className="salesCards">
          <SalesCard 
            icon={<LuDollarSign size={24}/>} 
            description="Vendas Hoje" 
            value={formatCurrency(overview.todayTotal)} 
            information={`${overview.todayComparison > 0 ? "+" : ""}${overview.todayComparison}% vs ontem`}
            progress={
              overview.todayComparison > 0
                ? "good-progress"
                : overview.todayComparison < 0
                ? "bad-progress"
                : "neutral-progress"
            }
          />
          <SalesCard 
            icon={<LuShoppingCart size={24}/>} 
            description="Total de Vendas" 
            value={formatCurrency(overview.totalSales)} 
            information={`+${formatCurrency(overview.weekSales)} esta semana`}
            progress={
              overview.weekSales > 0
                ? "good-progress"
                : overview.weekSales < 0
                ? "bad-progress"
                : "neutral-progress"
            }
          />
          <SalesCard 
            icon={<LuTrendingUp size={24}/>} 
            description="Ticket Médio" 
            value={formatCurrency(overview.averageTicket)} 
            information={`${overview.averageTicketComparison > 0 ? "+" : ""}${overview.averageTicketComparison}% este mês`}
            progress={
              overview.averageTicketComparison > 0
                ? "good-progress"
                : overview.averageTicketComparison < 0
                ? "bad-progress"
                : "neutral-progress"
            }
          />
        </section>

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
              onSelect={setDateFilter}
            />
          </div>
        </div>

        <div className="recent-sells">
          <div className="recentSells-title">
            <h3>Vendas Recentes</h3>
          </div>

          <SalesTable
            dateFilter={dateFilter}
            statusFilter={statusFilter}
            search={search}
            refreshTrigger={refreshSales}
          />
        </div>
      </div>

      <NewSaleModal
        isOpen={activeModal === "sale"}
        onClose={closeModal}
        onSuccess={() => {
          fetchOverview();
          setRefreshSales(prev => prev + 1);
        }}
      />
    </section>
  );
};

export default Sales;
