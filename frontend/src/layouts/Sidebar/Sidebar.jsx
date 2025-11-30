import "./Sidebar.css";
import Logo from "../../assets/StartComLogo.svg";
import LogoutModal from "../../components/Modals/LogoutModal";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthModals } from "../../hooks/useAuthModals";

import { BiHomeAlt } from 'react-icons/bi';
import { FaChartColumn } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';
import { GoPeople } from 'react-icons/go';
import { BsBoxSeam } from 'react-icons/bs';
import { FaRegClipboard } from 'react-icons/fa';
import { LuSettings } from 'react-icons/lu';
import { LuLogOut, LuX } from 'react-icons/lu';

// Sidebar component with navigation and account info
const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { activeModal, openLogout, closeModal } = useAuthModals();

  return (
    <aside className={isOpen ? "open" : ""}>
      {/* Sidebar header with logo and close button */}
      <div className="sidebar-header">
        <div className="logo-sidebar logo">
          <img src={Logo} alt="StartCom Logo" />
        </div>
        <button className="close-sidebar" onClick={onClose}>
          <LuX size={24} color="#fff" />
        </button>
      </div>

      {/* Main navigation */}
      <div className="sidebar-main">
        <nav className="nav-sidebar">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            <BiHomeAlt size={22} /> Início
          </NavLink>
          <NavLink to="/painel" className={({ isActive }) => isActive ? "active" : ""}>
            <FaChartColumn size={20} /> Dashboard
          </NavLink>
          <NavLink to="/clientes" className={({ isActive }) => isActive ? "active" : ""}>
            <GoPeople size={20} /> Clientes
          </NavLink>
          <NavLink to="/estoque" className={({ isActive }) => isActive ? "active" : ""}>
            <BsBoxSeam size={20} /> Estoque
          </NavLink>
          <NavLink to="/vendas" className={({ isActive }) => isActive ? "active" : ""}>
            <FiShoppingCart size={20} /> Vendas
          </NavLink>
          <NavLink to="/relatorios" className={({ isActive }) => isActive ? "active" : ""}>
            <FaRegClipboard size={20} /> Relatórios
          </NavLink>
          <NavLink to="/configuracoes" className={({ isActive }) => isActive ? "active" : ""}>
            <LuSettings size={20} /> Configurações
          </NavLink>
        </nav>
      </div>

      {/* Account info and logout button */}
      <div className="account-block">
        <div className="account-view">
          <div className="circle-img">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div className="user-info">
            <p className="user-name-sidebar nowrap-text-sidebar">{user?.name || "Usuário"}</p>
            <p className="email-sidebar nowrap-text-sidebar">{user?.email || "usuario@gmail.com"}</p>
          </div>
        </div>

        <button className="logout-button" onClick={openLogout}>
          <LuLogOut /> Sair
        </button>
      </div>

      <LogoutModal
        isOpen={activeModal === "logout"}
        onClose={closeModal}
      />
    </aside>
  );
};

export default Sidebar;