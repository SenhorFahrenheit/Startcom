import { GiHamburgerMenu } from "react-icons/gi";
import "./HeaderMobile.css";

// Mobile header with a sidebar toggle button
const HeaderMobile = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      {/* Hamburger menu button to toggle sidebar */}
      <button className="menu-button" onClick={onToggleSidebar}>
        <GiHamburgerMenu size={22} />
      </button>
    </header>
  );
};

export default HeaderMobile;