import "../commonStyle.css"
import "./Inventory.css"

import Sidebar from "../../layouts/Sidebar/Sidebar"
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile"
import Button from "../../components/Button/Button"
import NewProductModal from "../../components/Modals/NewProductModal"

import { LuPlus } from "react-icons/lu"

import { useAuthModals } from "../../hooks/useAuthModals"

import { useState } from "react"

const Inventory = () => {

  const { activeModal, openProduct, closeModal } = useAuthModals();

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
              <h1 className="title-page-section">Estoque</h1>
              <p className="description-page-section">Controle completo do seu inventário</p>
            </div>
            <div className="button-shadown">
            <Button 
              className="hover-dashboard" 
              onClick={openProduct} 
              height={40} 
              width={140} 
              label={<><LuPlus size={16}/>Novo Produto</>} 
            />
          </div>
          </div>
        </div>

        <NewProductModal
          isOpen={activeModal === "inventory"}
          onClose={closeModal}
        />
    </section>
  )
}

export default Inventory