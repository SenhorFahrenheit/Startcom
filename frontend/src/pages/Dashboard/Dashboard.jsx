import formattedDate from "../../utils/formattedDate"

import "./Dashboard.css"
import "../commonStyle.css"

import Sidebar from "../../layouts/Sidebar/Sidebar"
import FilterDateButton from "../../components/filterDateButton/filterDateButton"
import MetricCard from "../../components/MetricCard/MetricCard"

// Icons
import { LuDollarSign } from 'react-icons/lu';
import { LuTrendingUp } from 'react-icons/lu';
import { LuUsers } from 'react-icons/lu';
import { LuPackage } from 'react-icons/lu';
import SalesChart from "../../components/SalesChart/SalesChart"

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
            
            <div>
              <h1>Ações Rápidas</h1>
            
            
            </div>
          </section>
        </div>
    </section>
  )
}

export default Dashboard