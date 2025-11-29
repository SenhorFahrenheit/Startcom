import { NavLink } from "react-router-dom";
import Logo from "../../assets/StartComLogo.svg";

import Button from "../../components/Button/Button";
import "./Header.css";

// Header component with logo, navigation links, and dashboard button
const Header = () => {
  return (
    <header>
      {/* Company logo */}
      <div className="logo">
        <img src={Logo} alt="Logotipo da empresa StartCom" />
      </div>

      {/* Navigation links */}
      <nav className="navigation">
        <a href="#resources">Recursos</a>
        <a href="#reviews">Depoimentos</a>
        <a href="mailto:startcomltda@gmail.com">Contato</a>
      </nav>

      {/* Dashboard access button */}
      <Button
        styles="mobile-button-none"
        height={"auto"}
        width={"170px"}
        label={
          <NavLink className="link-inside-button" to="/painel">
            Acessar Dashboard
          </NavLink>
        }
        type="button"
      />
    </header>
  );
};

export default Header;