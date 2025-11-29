// Styles
import "./Reports.css";
import "../commonStyle.css";

// Layouts
import Sidebar from "../../layouts/Sidebar/Sidebar"; // Sidebar layout
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile"; // Mobile header

// Components
import FilterDateButton from "../../components/FilterDateButton/FilterDateButton"; // Date filter
import Button from "../../components/Button/Button"; // Reusable button
import NewReportModal from "../../components/Modals/NewReportModal"; // Modal to create new report
import ReportCard from "../../components/ReportCard/ReportCard"; // Metric card
import GeneratedReport from "../../components/GeneratedReport/GeneratedReport"; // Generated reports list
import LineSalesChart from "../../components/LineSalesChart/LineSalesChart"; // Line chart component
import CategoryPieChart from "../../components/CategoryPieChart/CategoryPieChart"; // Pie chart by category

// Icons
import { LuChartColumn, LuDollarSign, LuTrendingUp, LuUsers, LuPackage } from "react-icons/lu";

// Hooks & Utils
import { useAuthModals } from "../../hooks/useAuthModals"; // Modal management hook
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Auth context
import api from "../../services/api"; // API service
import { formatCurrency, formatPercent, pluralize } from "../../utils/format"; // Formatting helpers

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const { user, token, isAuthenticated, pageLoading } = useAuth(); // Auth state
  const companyId = user?.companyId;

  const { activeModal, openReport, closeModal } = useAuthModals(); // Modal controls

  const [period, setPeriod] = useState("6m"); // Selected period
  const [overview, setOverview] = useState(null); // Overview data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const toggleSidebar = () => setSidebarOpen(prev => !prev); // Toggle sidebar

  const periodMap = { // Map display labels to API periods
    "Últimos 7 dias": "7d",
    "Últimos 30 dias": "30d",
    "Últimos 6 meses": "6m",
    "Último 1 ano": "1y",
  };

  // Fetch overview data from API
  const fetchOverview = async (selectedPeriod) => {
    try {
      setLoading(true);
      const response = await api.post("/Company/report/sales/overview", {
        period: selectedPeriod,
      });
      const data = response.data;

      if (!data || typeof data !== "object") throw new Error("Invalid server response");

      setOverview(data.overview);
    } catch (err) {
      console.error("Error fetching overview:", err);
      setError("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!pageLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [pageLoading, isAuthenticated]);

  // Fetch overview on mount
  useEffect(() => {
    if (!pageLoading && isAuthenticated && companyId) {
      fetchOverview(period);
    }
  }, [pageLoading, isAuthenticated, companyId]);

  const handleSelectPeriod = (val) => { // Handle period selection
    const p = periodMap[val];
    setPeriod(p);
    fetchOverview(p);
  };

  
  const count = overview?.newCustomers ?? 0;
  const salesRealized = overview?.sales?.total ?? 0; 

  return (
    <section className="body-section">
      <HeaderMobile onToggleSidebar={toggleSidebar} /> {/* Mobile header */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} /> {/* Sidebar layout */}

      <div className="content-page-section">
        <div className="align-heading">
          <div>
            <h1 className="title-page-section">Relatórios</h1> {/* Page title */}
            <p className="description-page-section">Análises e insights do seu negócio</p> {/* Subtitle */}
          </div>

          <div className="report-buttons">
            <div className="button-shadown">
              <Button
                className="hover-dashboard"
                onClick={openReport} // Open new report modal
                height={"auto"}
                width={160}
                label={<><LuChartColumn size={"1.5rem"} />Novo Relatório</>} // Button label with icon
              />
            </div>

            <div className="filter-date">
              <FilterDateButton
                options={[
                  "Últimos 7 dias",
                  "Últimos 30 dias",
                  "Últimos 6 meses",
                  "Último 1 ano",
                ]}
                defaultValue="Últimos 6 meses"
                onSelect={handleSelectPeriod} // Handle period selection
              />
            </div>
          </div>
        </div>

        {/* Overview cards */}
        <section className="reportCards">
          {loading ? (
            <>
              <ReportCard loading /> {/* Placeholder cards */}
              <ReportCard loading />
              <ReportCard loading />
              <ReportCard loading />
            </>
          ) : (
            <>
              <ReportCard
                icon={<LuDollarSign size={24} />}
                value={formatCurrency(overview?.monthRevenue?.total || 0)}
                description="Faturamento este mês"
                information={`${formatPercent(overview?.monthRevenue?.comparison) || "0,00%"} vs mês anterior`}
              />

              <ReportCard
                icon={<LuTrendingUp size={24} />}
                value={overview?.sales?.total || 0}
                description={`${pluralize(
                  salesRealized,
                  "Venda realizada",
                  "Vendas realizadas"
                )}`}
                information={`${formatPercent(overview?.sales?.monthComparison) || "0,00%"} vs mês anterior`}
              />

              <ReportCard
                icon={<LuUsers size={24} />}
                value={overview?.activeCustomers || 0}
                description={`${pluralize(
                  count,
                  "Cliente ativo",
                  "Clientes ativos"
                )}`}
                information={`${count} ${pluralize(count, "novo cliente", "novos clientes")}`}
              />

              <ReportCard
                icon={<LuPackage size={24} />}
                value={formatCurrency(overview?.ticket?.average || 0)}
                description="Ticket médio"
                information={`${formatPercent(overview?.ticket?.comparison) || "0,00%"} vs mês anterior`}
              />
            </>
          )}
        </section>

        {/* Charts */}
        <section className="chart-section">
          <div className="chart-wrapper">
            <LineSalesChart data={overview?.salesTotals || {}} period={period} />
          </div>

          <div className="chart-wrapper">
            <CategoryPieChart data={overview?.categoryDistribution || {}} />
          </div>
        </section>

        {/* Generated reports */}
        <section className="reports-section">
          <div>
            <h3>Relatórios Gerados</h3>
          </div>

          <div className="generated-reports">
            <GeneratedReport
              icon={<LuChartColumn size={24} />}
              title="Vendas Mensais"
              description="Relatório completo das vendas do último mês"
              type="PDF"
              size="2.3 MB"
              date="16/07/2025"
              state="Pronto"
            />
            <GeneratedReport
              icon={<LuChartColumn size={24} />}
              title="Análise de Clientes"
              description="Perfil e comportamento dos clientes"
              type="Excel"
              size="1.8 MB"
              date="12/06/2025"
              state="Pronto"
            />
            <GeneratedReport
              icon={<LuChartColumn size={24} />}
              title="Controle de Estoque"
              description="Situação atual do inventário"
              type="PDF"
              size="3.1 MB"
              date="30/09/2025"
              state="Processando"
            />
            <GeneratedReport
              icon={<LuChartColumn size={24} />}
              title="Fluxo de Caixa"
              description="Entradas e saídas financeiras"
              type="Excel"
              size="2.7 MB"
              date="08/05/2025"
              state="Pronto"
            />
          </div>
        </section>
      </div>

      {/* New Report Modal */}
      <NewReportModal isOpen={activeModal === "report"} onClose={closeModal} />
    </section>
  );
};

export default Reports; // Export Reports page component