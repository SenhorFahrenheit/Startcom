import "./Sidebar.css"
import Logo from "../../assets/StartComLogo.svg"

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
            <div className="logo-sidebar logo">
                <svg className="logo" xmlns="http://www.w3.org/2000/svg" version="1.0" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#FFFFFF" stroke="none"><path d="M2460 4744 c-147 -28 -297 -120 -386 -236 -266 -346 -116 -832 303 -979 83 -29 237 -36 328 -15 212 50 390 214 461 426 15 43 19 84 19 190 -1 129 -2 139 -34 217 -69 176 -206 307 -384 370 -55 19 -96 26 -177 28 -58 2 -116 1 -130 -1z m261 -144 c207 -70 340 -253 340 -470 0 -101 -11 -151 -51 -230 -135 -266 -481 -353 -728 -183 -132 90 -212 245 -212 408 0 216 132 402 338 472 90 30 227 32 313 3z"/><path d="M2527 4503 c-4 -3 -7 -23 -7 -43 0 -33 -4 -39 -32 -51 -81 -34 -127 -108 -112 -186 10 -51 68 -105 144 -134 104 -40 134 -85 89 -130 -19 -19 -30 -21 -83 -17 -34 3 -76 13 -94 22 l-33 17 -14 -35 c-30 -71 -21 -84 73 -106 50 -11 52 -13 52 -45 0 -41 19 -57 62 -53 31 3 33 5 36 46 3 38 7 44 45 63 80 41 109 83 109 161 0 79 -32 116 -149 175 -87 43 -98 52 -101 78 -3 19 2 33 14 42 24 18 96 16 141 -2 41 -18 46 -15 63 38 15 47 8 55 -57 72 -48 12 -51 16 -69 83 -3 12 -66 17 -77 5z"/><path d="M1727 4375 c-67 -23 -247 -129 -354 -208 -899 -667 -1077 -1942 -395 -2825 83 -108 99 -122 139 -122 43 0 73 30 73 73 0 26 -18 55 -84 141 -553 712 -506 1719 111 2386 131 142 304 272 496 375 59 31 112 65 117 75 36 68 -26 132 -103 105z"/><path d="M3307 4363 c-22 -25 -31 -68 -18 -91 6 -11 55 -43 108 -72 556 -295 908 -799 989 -1413 19 -146 14 -393 -11 -532 -55 -307 -177 -584 -361 -821 -66 -86 -84 -115 -84 -141 0 -44 30 -73 74 -73 29 0 42 9 86 58 135 151 287 421 360 640 86 256 122 536 102 782 -58 708 -443 1298 -1063 1629 -103 55 -154 64 -182 34z"/><path d="M1828 3188 c-70 -19 -112 -70 -373 -463 l-255 -384 0 -188 c0 -259 21 -335 121 -435 55 -55 128 -92 213 -109 113 -23 258 22 342 107 l42 42 47 -44 c157 -146 403 -146 549 -1 l44 45 47 -44 c157 -146 398 -146 550 0 l43 41 46 -42 c95 -86 225 -126 338 -105 84 16 163 56 219 113 98 97 119 175 119 432 l0 190 -255 383 c-158 237 -271 396 -296 417 -22 19 -60 40 -84 46 -56 14 -1403 13 -1457 -1z m242 -155 c0 -14 -202 -618 -209 -626 -4 -4 -103 -6 -219 -5 l-212 3 205 307 c112 168 212 311 222 317 20 12 213 15 213 4z m410 -313 l0 -320 -224 0 -224 0 106 320 107 320 117 0 118 0 0 -320z m502 0 l106 -320 -224 0 -224 0 0 320 0 320 118 0 117 0 107 -320z m279 309 c11 -5 112 -148 224 -317 l205 -307 -212 -3 c-116 -1 -215 1 -219 5 -7 8 -209 612 -209 626 0 11 189 8 211 -4z m-1423 -947 c-3 -157 -3 -159 -33 -208 -99 -160 -336 -149 -420 19 -23 48 -25 60 -25 199 l0 148 241 0 240 0 -3 -158z m640 0 c-3 -157 -3 -159 -33 -208 -99 -160 -336 -149 -420 19 -23 48 -25 60 -25 199 l0 148 241 0 240 0 -3 -158z m640 0 c-3 -157 -3 -159 -33 -208 -99 -160 -336 -149 -420 19 -23 48 -25 60 -25 199 l0 148 241 0 240 0 -3 -158z m642 16 c-1 -90 -6 -156 -14 -179 -33 -94 -125 -159 -223 -159 -95 0 -176 49 -218 133 -23 48 -25 60 -25 199 l0 148 240 0 240 0 0 -142z"/><path d="M1405 1428 c-42 -24 -44 -35 -45 -243 0 -170 3 -204 16 -224 25 -35 179 -133 309 -195 546 -265 1151 -273 1705 -22 131 60 289 154 338 202 l32 32 0 196 c0 212 -5 237 -51 256 -33 14 -62 6 -89 -23 -18 -19 -20 -36 -20 -192 l0 -172 -52 -35 c-92 -60 -180 -106 -296 -152 -63 -25 -118 -46 -123 -46 -5 0 -9 26 -9 58 -1 157 -56 290 -169 403 -225 225 -554 224 -782 -1 -112 -111 -168 -245 -169 -402 0 -32 -3 -58 -6 -58 -40 0 -306 123 -411 190 l-63 39 0 165 c0 176 -6 207 -47 225 -30 14 -43 13 -68 -1z m1309 -178 c44 -17 76 -39 125 -89 89 -90 113 -149 119 -292 l4 -106 -113 -19 c-155 -25 -422 -25 -576 0 l-113 18 0 87 c0 136 25 209 101 294 51 59 105 94 179 119 74 24 193 19 274 -12z"/></g></svg>
                <h2 className="logo-name">StartCom</h2>
            </div>
            <button className="close-sidebar" onClick={onClose}>
            <LuX size={24} color="#fff" />
            </button>
        </div>

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
