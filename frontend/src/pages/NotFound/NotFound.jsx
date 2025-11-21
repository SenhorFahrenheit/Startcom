import { useNavigate } from "react-router-dom";
import { Home, SearchX } from "lucide-react";
import Button from "../../components/Button/Button";

import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-wrapper">
      <div className="notfound-box">
        <div className="notfound-icon">
          <SearchX size={48} strokeWidth={1.4} />
        </div>

        <h1 className="notfound-title">404</h1>
        <p className="notfound-subtitle">
          Opa... essa página não existe no StartCom.
        </p>

        <Button
          label={<><Home size={18}/> Voltar para o início</>}
          onClick={() => navigate("/")}
          height="48px"
          width="220px"
        />
      </div>
    </div>
  );
};

export default NotFound;
