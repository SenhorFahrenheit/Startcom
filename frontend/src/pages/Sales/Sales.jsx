import "./Sales.css"
import "../commonStyle.css"

import { useAuthModals } from "../../hooks/useAuthModals"
import NewSaleModal from "../../components/Modals/NewSaleModal"

import Sidebar from "../../layouts/Sidebar/Sidebar"
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile"
import SalesCard from "../../components/SalesCard/SalesCard"
import Button from "../../components/Button/Button"
import { LuPlus } from "react-icons/lu"

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
        </div>

        <NewSaleModal
          isOpen={activeModal === "sale"}
          onClose={closeModal}
        />
    </section>
  )
}

export default Sales