import "./Clients.css"
import "../commonStyle.css"

import Sidebar from "../../layouts/Sidebar/Sidebar"
import HeaderMobile from "../../layouts/HeaderMobile/HeaderMobile";
import Button from "../../components/Button/Button";

import NewClientModal from "../../components/Modals/ClientModal";

import { useState } from "react";
import { useAuthModals } from "../../hooks/useAuthModals"

import { LuPlus } from "react-icons/lu";

const Clients = () => {
  const { activeModal, openClient, closeModal } = useAuthModals();
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
              <h1 className="title-page-section">Clientes</h1>
              <p className="description-page-section">Gerencie sua base de clientes e relacionamentos</p>
            </div>
            <div className="button-shadown">
              <Button 
                className="hover-dashboard" 
                onClick={openClient} 
                height={40} 
                width={140} 
                label={<><LuPlus size={16}/>Nova Cliente</>} 
              />
            </div>
          </div>
        </div>

      <NewClientModal
        isOpen={activeModal === "client"}
        onClose={closeModal}
      />
    </section>
  )
}

export default Clients