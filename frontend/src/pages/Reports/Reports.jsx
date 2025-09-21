import './Reports.css'
import "../commonStyle.css"

import Sidebar from '../../layouts/Sidebar/Sidebar'
import HeaderMobile from '../../layouts/HeaderMobile/HeaderMobile';

import { useState } from 'react';

const Reports = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  }

  return (
    <section className="body-section">
        <HeaderMobile onToggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
    </section>
  )
}

export default Reports