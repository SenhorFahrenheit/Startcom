import { useState } from "react"; // <- importar useState
import formattedDate from "../../utils/formattedDate"
import "./Dashboard.css"
import "../commonStyle.css"

import { NavLink } from "react-router-dom"

// Components
import MetricCard from "../../components/MetricCard/MetricCard"
import SalesChart from "../../components/SalesChart/SalesChart"
import QuickActions from "../../components/QuickActions/QuickActions"
import HighlightCard from "../../components/HighlightCard/HighlightCard"

import FilterDateButton from "../../components/filterDateButton/filterDateButton";
import Sidebar from "../../layouts/Sidebar/Sidebar"
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile"

// Icons
import { LuDollarSign } from 'react-icons/lu';
import { LuTrendingUp } from 'react-icons/lu';
import { LuUsers } from 'react-icons/lu';
import { LuPackage } from 'react-icons/lu';
import { LuPlus } from 'react-icons/lu';
import { LuFileText } from 'react-icons/lu';
import { LuShoppingCart } from 'react-icons/lu';
import { LuClock4 } from 'react-icons/lu';
import { LuStar } from 'react-icons/lu';
import RecentActivities from "../../components/RecentActivities/RecentActivities"

const Dashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  }

  return (
    <section className="body-section">
      <HeaderMobile onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

        <div className="content-page-section">
          <div className="align-heading">
            <div>
              <h1 className="title-page-section">Dashboard</h1>
              <p className="description-page-section">Visão geral do seu negócio - {formattedDate()}</p>
            </div>
            <div className="filter-date">
              <FilterDateButton options={["Hoje", "7 dias", "30 dias", "1 ano", "Período completo"]}
                defaultValue="30 dias"
                onSelect={(val) => console.log("Período escolhido:", val)}
              />
            </div>
          </div>

          <section className="metricCards">
            <MetricCard icon={<LuDollarSign size={24}/>} state="good" description="Vendas Hoje" value="R$ 2.847.50" data="+12.5%" />
            <MetricCard icon={<LuTrendingUp size={24}/>} state="good" description="Faturamento Mensal" value="R$ 24.580,30" data="+8.2%" />
            <MetricCard icon={<LuUsers size={24}/>} state="good" description="Total de Clientes" value="156" data="+5 novos" />
            <MetricCard icon={<LuPackage size={24}/>} state="notgood" description="Itens em Baixa" value="8" data="Atenção necessária" />
          </section>

          <section className="chart-section">
            <div className="chart-dashboard">
              <SalesChart/>
            </div>
            
            <div className="chart-section-side">
              <div className="quickActions-title">
                <LuPlus color="var(--primary-color)" size={24}/>
                <h3>Ações Rápidas</h3>
              </div>

              <div className="quickActions">
                <NavLink to="/vendas"><QuickActions icon={<LuShoppingCart/>} name="Nova Venda" description="Registrar uma nova venda"/></NavLink>
                <NavLink to="/clientes"><QuickActions icon={<LuUsers/>} name="Cadastrar Cliente" description="Adicionar novo cliente"/></NavLink>
                <NavLink to="/estoque"><QuickActions icon={<LuPackage/>} name="Adicionar Produto" description="Cadastrar produto no estoque"/></NavLink>
                <NavLink to="/relatorios"><QuickActions icon={<LuFileText/>} name="Gerar Relatório" description="Criar novo relatório"/></NavLink>
              </div>
            </div>
          </section>

          <section className="recent-section">
              <div className="recent-activities">
                <div className="recentActivities-title">
                  <LuClock4 size={20} color="var(--primary-color)"/>
                  <h3>Atividades Recentes</h3>
                </div>

                <RecentActivities 
                  icon={<LuShoppingCart/>} 
                  color="green" transparentColor="transparent-green" 
                  type="Venda" time="há 2 minutos" 
                  action="Nova venda realizada" 
                  entity="Cliente Maria Silva"
                  extra="R$ 156,80"
                />

                <RecentActivities 
                  icon={<LuUsers/>} 
                  color="green" transparentColor="transparent-green"
                  type="Cliente" 
                  time="há 15 minutos" 
                  action="Novo cliente cadastrado" 
                  entity="João Santos"
                />
                <RecentActivities 
                  icon={<LuPackage/>} 
                  color="orange" transparentColor="transparent-orange" 
                  type="Estoque" 
                  time="há 1 hora" 
                  action="Estoque baixo" 
                  entity="Camiseta Básica (apenas 3 unidades)"
                />

                <RecentActivities 
                  icon={<LuFileText/>} 
                  color="gray" transparentColor="transparent-gray" 
                  type="Relatório" 
                  time="há 2 horas" 
                  action="Relatório mensal de vendas gerado"
                />
              </div>

              <div className="recent-activities-side">
                <div className="recentActivities-title">
                  <LuStar size={20} color="var(--primary-color)"/>
                  <h3>Destaques do Mês</h3>
                </div>

                <HighlightCard 
                  title="Produto Mais Vendido" 
                  highlight="Camiseta Premium"
                  value="47 vendas"
                />

                <HighlightCard 
                  title="Cliente Top" 
                  highlight="Ana Oliveira"
                  value="R$ 1.240"
                />

                <HighlightCard 
                  title="Ticket Médio" 
                  highlight="Último mês"
                  value="R$ 89,50"
                  extra="+15% vs anterior"
                />

                <HighlightCard 
                  title="Meta vs Realizado" 
                  highlight="Meta: R$ 45.000"
                  value="R$ 48.750"
                  extra="+8,3%"
                />

                <HighlightCard 
                  title="Maior Compra Individual" 
                  highlight="João Lima"
                  value="R$ 980"
                />

                <HighlightCard 
                  title="Novos Clientes" 
                  highlight="Último mês"
                  value="+42"
                  extra="+12% vs anterior"
                />
              </div>
          </section>
        </div>
    </section>
  )
}

export default Dashboard