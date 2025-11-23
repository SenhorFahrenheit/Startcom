import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import Button from "../../components/Button/Button";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setStatus("error");
        setMessage("Token de verificação não encontrado na URL.");
        return;
      }

      try {
        const response = await api.post("/User/verify-email/confirm", null, {
          params: { token },
        });

        setStatus("success");
        setMessage(response.data?.message || "Email verificado com sucesso!");
      } catch (error) {
        setStatus("error");

        if (error.response?.status === 400) {
          setMessage("Token inválido ou malformado.");
        } else if (error.response?.status === 410) {
          setMessage("Token expirado. Solicite um novo email de verificação.");
        } else if (error.response?.status === 404) {
          setMessage("Token não encontrado. Verifique o link enviado por email.");
        } else {
          setMessage("Erro inesperado ao verificar seu email.");
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="email-verification-page">
      <div className="verification-container">
        <div className="verification-content">
          {/* Loading State */}
          {status === "loading" && (
            <>
              <ImSpinner8 className="icon icon-loading" />
              <h1>Verificando seu email...</h1>
              <p>Aguarde um momento enquanto confirmamos sua conta.</p>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <FaCheckCircle className="icon icon-success" />
              <h1>Email Verificado!</h1>
              <p>{message}</p>
              <Button 
                label="IR PARA LOGIN" 
                onClick={handleGoToLogin}
                type="button"
              />
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <FaTimesCircle className="icon icon-error" />
              <h1>Ops! Algo deu errado</h1>
              <p>{message}</p>
              <div className="button-group">
                <Button 
                  label="VOLTAR PARA LOGIN" 
                  onClick={handleGoToLogin}
                  type="button"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;