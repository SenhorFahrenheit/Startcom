import './Reports.css'
import "../commonStyle.css"

import Sidebar from '../../layouts/Sidebar/Sidebar'
import HeaderMobile from '../../layouts/HeaderMobile/HeaderMobile';
import FilterDateButton from '../../components/FilterDateButton/FilterDateButton';
import Button from '../../components/Button/Button';

import NewReportModal from "../../components/Modals/NewReportModal"
import { LuChartColumn } from 'react-icons/lu';
import { useAuthModals } from "../../hooks/useAuthModals"

import { useState } from 'react';

const Reports = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { activeModal, openReport, closeModal } = useAuthModals();
  
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
                <h1 className="title-page-section">Relatórios</h1>
                <p className="description-page-section">Análises e insights do seu negócio</p>
              </div>
              <div className="report-buttons">
                <div className="filter-date">
                  <FilterDateButton options={["Últimos 7 dias", "Últimos 30 dias", "Últimos 6 meses", "Último 1 ano"]}
                    defaultValue="Últimos 6 meses"
                    onSelect={(val) => console.log("Período escolhido:", val)}
                  />
                </div>

                <div className="button-shadown">
                  <Button 
                    className="hover-dashboard" 
                    onClick={openReport} 
                    height={40} 
                    width={163} 
                    label={<><LuChartColumn size={16}/>Novo Relatório</>} 
                  />
              </div>
            </div>
          </div>
        </div>

        <NewReportModal
          isOpen={activeModal === "report"}
          onClose={closeModal}
        />
    </section>
  )
}

export default Reports