import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams(); // get URL query parameters
  const navigate = useNavigate(); // navigation hook
  
  const [status, setStatus] = useState("loading"); // current verification state: loading, success, error
  const [message, setMessage] = useState(""); // message to show to user
  
  useEffect(() => {
    // async function to verify email with API
    const verifyEmail = async () => {
      const token = searchParams.get("token"); // get token from URL
      
      if (!token) {
        setStatus("error");
        setMessage("Token de verificação não encontrado na URL"); // token missing
        return;
      }

      try {
        // call API to verify email
        const response = await api.post("/User/verify-email/confirm", null, {
          params: { token },
        });

        setStatus("success"); // verification successful
        setMessage(response.data?.message || "Email successfully verified!");
      } catch (error) {
        setStatus("error"); // verification failed

        // handle specific HTTP error codes
        if (error.response?.status === 400) {
          setMessage("Token Inválido ou Mal Formado.");
        } else if (error.response?.status === 410) {
          setMessage("Token expirado. Solicite um novo link de verificação.");
        } else if (error.response?.status === 404) {
          setMessage("Token não encontrado. Verifique o link de verificação.");
        } else {
          setMessage("Erro desconhecido ao verificar o email. Tente novamente mais tarde.");
        }
      }
    };

    verifyEmail(); // trigger verification on mount
  }, [searchParams]);

  // navigate to login page
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
              <ImSpinner8 className="icon icon-loading" /> {/* spinner icon */}
              <h1>Verificando o seu email...</h1>
              <p>Por favor, aguarde enquanto verificamos a sua conta.</p>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <FaCheckCircle className="icon icon-success" /> {/* success icon */}
              <h1>Email Verificado!</h1>
              <p>{message}</p>
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <FaTimesCircle className="icon icon-error" /> {/* error icon */}
              <h1>Oops! Alguma coisa deu errado...</h1>
              <p>{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;