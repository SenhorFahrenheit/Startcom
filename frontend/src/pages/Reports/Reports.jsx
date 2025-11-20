import "./Reports.css";
import "../commonStyle.css";

import Sidebar from "../../layouts/Sidebar/Sidebar";
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile";
import FilterDateButton from "../../components/FilterDateButton/FilterDateButton";
import Button from "../../components/Button/Button";

import NewReportModal from "../../components/Modals/NewReportModal";
import ReportCard from "../../components/ReportCard/ReportCard";
import GeneratedReport from "../../components/GeneratedReport/GeneratedReport";
import LineSalesChart from "../../components/LineSalesChart/LineSalesChart";
import CategoryPieChart from "../../components/CategoryPieChart/CategoryPieChart";

import { LuChartColumn, LuDollarSign, LuTrendingUp, LuUsers, LuPackage } from "react-icons/lu";

import { useAuthModals } from "../../hooks/useAuthModals";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { formatCurrency, formatPercent } from "../../utils/format";

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, token, isAuthenticated, pageLoading } = useAuth();
  const companyId = user?.companyId;

  const { activeModal, openReport, closeModal } = useAuthModals();

  const [period, setPeriod] = useState("6m");
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const periodMap = {
    "Últimos 7 dias": "7d",
    "Últimos 30 dias": "30d",
    "Últimos 6 meses": "6m",
    "Último 1 ano": "1y",
  };

  const fetchOverview = async (selectedPeriod) => {
    try {
      setLoading(true);

      const response = await api.post("/Company/report/sales/overview", {
        period: selectedPeriod,
      });

      const data = response.data;

      if (!data || typeof data !== "object") {
        throw new Error("Resposta inválida do servidor");
      }

      setOverview(data.overview);
    } catch (err) {
      console.error("Erro ao buscar overview:", err);
      setError("Erro ao carregar relatório");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pageLoading && !isAuthenticated) {
      window.location.href = "/login";
    }

    if (!pageLoading && isAuthenticated && companyId) {
      fetchOverview(period);
    }
  }, [pageLoading, isAuthenticated, companyId]);

  const handleSelectPeriod = (val) => {
    const p = periodMap[val];
    setPeriod(p);
    fetchOverview(p);
  };

  return (
    <section className="body-section">
      <HeaderMobile onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      <div className="content-page-section">
        <div className="align-heading">
          <div>
            <h1 className="title-page-section">Relatórios</h1>
            <p className="description-page-section">Análises e insights do seu negócio</p>
          </div>

          <div className="report-buttons">
            <div className="filter-date">
              <FilterDateButton
                options={[
                  "Últimos 7 dias",
                  "Últimos 30 dias",
                  "Últimos 6 meses",
                  "Último 1 ano",
                ]}
                defaultValue="Últimos 6 meses"
                onSelect={handleSelectPeriod}
              />
            </div>

            <div className="button-shadown">
              <Button
                className="hover-dashboard"
                onClick={openReport}
                height={"auto"}
                width={160}
                label={<><LuChartColumn size={"1.5rem"} />Novo Relatório</>}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p>Carregando dados...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <section className="reportCards">
              <ReportCard
                icon={<LuDollarSign size={24} />}
                value={formatCurrency(overview?.monthRevenue?.total || 0)}
                description="Faturamento este mês"
                information={`${formatPercent(overview?.monthRevenue?.comparison) || "0,00%"} vs mês anterior`}
              />

              <ReportCard
                icon={<LuTrendingUp size={24} />}
                value={overview?.sales?.total || 0}
                description="Vendas realizadas"
                information={`${formatPercent(overview?.sales?.monthComparison) || "0,00%"} vs mês anterior`}
              />

              <ReportCard
                icon={<LuUsers size={24} />}
                value={overview?.activeCustomers || 0}
                description="Clientes ativos"
                information={`${overview?.newCustomers || 0} novos clientes`}
              />

              <ReportCard
                icon={<LuPackage size={24} />}
                value={formatCurrency(overview?.ticket?.average || 0)}
                description="Ticket médio"
                information={`${formatPercent(overview?.ticket?.comparison) || "0,00%"} vs mês anterior`}
              />
            </section>

            <section className="chart-section">
              <div className="chart-wrapper">
                <LineSalesChart data={overview?.salesTotals || {}} />
              </div>

              <div className="chart-wrapper">
                <CategoryPieChart data={overview?.categoryDistribution || {}} />
              </div>
            </section>
          </>
        )}

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

      <NewReportModal
        isOpen={activeModal === "report"}
        onClose={closeModal}
      />
    </section>
  );
};

export default Reports;
