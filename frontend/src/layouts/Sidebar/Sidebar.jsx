import "./Sidebar.css"

import { NavLink } from "react-router-dom";

// Icons
import { BiHomeAlt } from 'react-icons/bi';
import { FaChartColumn } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';
import { GoPeople } from 'react-icons/go';
import { BsBoxSeam } from 'react-icons/bs';
import { FaRegClipboard } from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';

const Sidebar = () => {
  return (
    <aside>
        <div>
            <div className="logo-sidebar">
                <h2>StartCom</h2>
            </div>

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