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
        <div className="logo-sidebar">
            <h2>StartCom</h2>
        </div>

        <nav className="nav-sidebar">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                <BiHomeAlt /> Início
            </NavLink>

            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                <FaChartColumn /> Dashboard
            </NavLink>

            <NavLink to="/vendas" className={({ isActive }) => isActive ? "active" : ""}>
                <FiShoppingCart /> Vendas
            </NavLink>

            <NavLink to="/clientes" className={({ isActive }) => isActive ? "active" : ""}>
                <GoPeople /> Clientes
            </NavLink>

            <NavLink to="/estoque" className={({ isActive }) => isActive ? "active" : ""}>
                <BsBoxSeam /> Estoque
            </NavLink>
            
            <NavLink to="/relatorios" className={({ isActive }) => isActive ? "active" : ""}>
                <FaRegClipboard /> Relatórios
            </NavLink>
        </nav>

        <div>
            <div>
                <div></div>
                <div>
                    <p>Usuário</p>
                    <p>usuario@gmail.com</p>
                </div>
            </div>
            <button><LuLogOut/> Sair</button>
        </div>
    </aside>
  )
}

export default Sidebar