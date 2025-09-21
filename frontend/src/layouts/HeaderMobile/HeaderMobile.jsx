import { GiHamburgerMenu } from "react-icons/gi";
import "./HeaderMobile.css";

const HeaderMobile = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      <button className="menu-button" onClick={onToggleSidebar}>
        <GiHamburgerMenu size={22} />
      </button>
      <h2 className="header-logo">StartCom</h2>
    </header>
  );
};

export default HeaderMobile;
