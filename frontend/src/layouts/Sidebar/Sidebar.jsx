import "./Sidebar.css"

import { NavLink } from "react-router-dom";

// Icons
import { BiHomeAlt } from 'react-icons/bi';
import { FaChartColumn } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';
import { GoPeople } from 'react-icons/go';
import { BsBoxSeam } from 'react-icons/bs';
import { FaRegClipboard } from 'react-icons/fa';
import { LuSettings } from 'react-icons/lu';
import { LuLogOut, LuX } from 'react-icons/lu';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={isOpen ? "open" : ""}>
        <div className="sidebar-header">
            <div className="logo-sidebar">
            <h3>StartCom</h3>
            </div>
            <button className="close-sidebar" onClick={onClose}>
            <LuX size={24} color="#fff" />
            </button>
        </div>

        {/* Container que faz a nav ocupar todo o espaço entre header e footer */}
        <div className="sidebar-main">
            <nav className="nav-sidebar">
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                    <BiHomeAlt size={22} /> Início
                </NavLink>

                <NavLink to="/painel" className={({ isActive }) => isActive ? "active" : ""}>
                    <FaChartColumn size={20} /> Dashboard
                </NavLink>

                <NavLink to="/vendas" className={({ isActive }) => isActive ? "active" : ""}>
                    <FiShoppingCart size={20} /> Vendas
                </NavLink>

                <NavLink to="/clientes" className={({ isActive }) => isActive ? "active" : ""}>
                    <GoPeople size={20} /> Clientes
                </NavLink>

                <NavLink to="/estoque" className={({ isActive }) => isActive ? "active" : ""}>
                    <BsBoxSeam size={20} /> Estoque
                </NavLink>

                <NavLink to="/relatorios" className={({ isActive }) => isActive ? "active" : ""}>
                    <FaRegClipboard size={20} /> Relatórios
                </NavLink>

                <NavLink to="/configuracoes" className={({ isActive }) => isActive ? "active" : ""}>
                    <LuSettings size={20} /> Configurações
                </NavLink>
            </nav>
        </div>

        <div className="account-block">
            <div className="account-view">
                <div className="circle-img">U</div>
                <div className="user-info">
                    <p className="user-name-sidebar">Usuário</p>
                    <p className="email-sidebar">usuario@gmail.com</p>
                </div>
            </div>
            <button className="logout-button"><LuLogOut/> Sair</button>
        </div>
    </aside>
  )
}

export default Sidebar
