import formattedDate from "../../utils/formattedDate"
import "./Dashboard.css"
import "../commonStyle.css"

import { NavLink } from "react-router-dom"

// Components
import MetricCard from "../../components/MetricCard/MetricCard"
import SalesChart from "../../components/SalesChart/SalesChart"
import QuickActions from "../../components/QuickActions/QuickActions"

import Sidebar from "../../layouts/Sidebar/Sidebar"
import FilterDateButton from "../../components/filterDateButton/filterDateButton"

// Icons
import { LuDollarSign } from 'react-icons/lu';
import { LuTrendingUp } from 'react-icons/lu';
import { LuUsers } from 'react-icons/lu';
import { LuPackage } from 'react-icons/lu';
import { LuPlus } from 'react-icons/lu';
import { LuFileText } from 'react-icons/lu';
import { LuShoppingCart } from 'react-icons/lu';

const Dashboard = () => {
  return (
    <section className="body-section">
        <Sidebar/>

        <div className="content-page-section">
          <div className="align-heading">
            <div>
              <h1 className="title-page-section">Dashboard</h1>
              <p className="description-page-section">Visão geral do seu negócio - {formattedDate()}</p>
            </div>
            <FilterDateButton options={["Hoje", "7 dias", "30 dias", "1 ano", "Período completo"]}
              defaultValue="30 dias"
              onSelect={(val) => console.log("Período escolhido:", val)}
              />
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
        </div>
    </section>
  )
}

export default Dashboard