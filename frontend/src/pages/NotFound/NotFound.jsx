// React & Router
import { useNavigate } from "react-router-dom"; // Navigation hook

// Icons
import { Home, SearchX } from "lucide-react"; // Home and search icons

// Components
import Button from "../../components/Button/Button"; // Reusable button

import "./NotFound.css"; // Page-specific styles

const NotFound = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  return (
    <div className="notfound-wrapper"> {/* Page wrapper */}
      <div className="notfound-box"> {/* Main content box */}
        <div className="notfound-icon">
          <SearchX size={48} strokeWidth={1.4} /> {/* 404 icon */}
        </div>

        <h1 className="notfound-title">404</h1> {/* Page title */}
        <p className="notfound-subtitle">
          Opa... essa página não existe no StartCom.
        </p> {/* Subtitle message */}

        <Button
          label={<><Home size={18}/> Voltar para o início</>} // Button label with icon
          onClick={() => navigate("/")} // Navigate to home
          height="48px"
          width="220px"
        />
      </div>
    </div>
  );
};

export default NotFound; // Export 404 page component