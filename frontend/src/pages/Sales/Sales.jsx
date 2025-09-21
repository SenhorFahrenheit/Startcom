import "./Sales.css"
import "../commonStyle.css"

import { useAuthModals } from "../../hooks/useAuthModals"
import NewSaleModal from "../../components/Modals/NewSaleModal"

import Sidebar from "../../layouts/Sidebar/Sidebar"
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile"
import SalesCard from "../../components/SalesCard/SalesCard"
import Button from "../../components/Button/Button"
import FilterDateButton from "../../components/filterDateButton/filterDateButton"
import FilterStatusButton from "../../components/FilterStatusButton/FilterStatusButton"

import { LuPlus } from "react-icons/lu"
import { LuDollarSign } from 'react-icons/lu';
import { LuShoppingCart } from 'react-icons/lu';
import { LuTrendingUp } from 'react-icons/lu';

import { useState } from "react"

const Sales = () => {
  const { activeModal, openSale, closeModal, } = useAuthModals();
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
              <h1 className="title-page-section">Vendas</h1>
              <p className="description-page-section">Gerencie todas as suas vendas e transações</p>
            </div>

            <div className="button-shadown">
              <Button className="hover-dashboard" onClick={openSale} height={40} width={140} label={<><LuPlus size={16}/>Nova Venda</>}/>
            </div>
          </div>

          <section className="salesCards">
            <SalesCard icon={<LuDollarSign size={24}/>} description="Vendas Hoje" value="R$ 1.247,50" information="+12.5% vs ontem"/>
            <SalesCard icon={<LuShoppingCart size={24}/>} description="Total de Vendas" value="156" information="+8 esta semana"/>
            <SalesCard icon={<LuTrendingUp size={24}/>} description="Ticket Médio" value="R$ 89,50" information="+5.2% este mês"/>
          </section>

          <div className="filter-search">
            <input style={{fontSize: 14, paddingLeft: 16}} className="InputDashboard" type="text" placeholder="Buscar Vendas por cliente, ID..." />
            <div className="filters-block">
              <FilterDateButton 
                options={["Hoje", "Esta Semana", "Este Mês", "Este Ano"]}
                defaultValue="Este Mês"
                onSelect={(val) => console.log("Tempo escolhido:", val)}
              />

              <FilterStatusButton 
                options={["Concluído", "Pendente", "Cancelada"]}
                onSelect={(val) => console.log("Filtro escolhido:", val)}
              />
            </div>
          </div>
        </div>

        <NewSaleModal
          isOpen={activeModal === "sale"}
          onClose={closeModal}
        />
    </section>
  )
}

export default Sales