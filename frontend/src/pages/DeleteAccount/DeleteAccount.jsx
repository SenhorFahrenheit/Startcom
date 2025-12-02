import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

import "../auth/VerifyEmail.css"; // reaproveita o mesmo CSS

const DeleteAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmDelete = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Token de confirmação não encontrado.");
        return;
      }

      try {
        await api.delete("/User/delete-account", {
          params: { token },
        });

        setStatus("success");
        setMessage(
          "Sua conta foi excluída com sucesso. Todos os seus dados foram removidos."
        );
      } catch (error) {
        setStatus("error");

        if (error.response?.status === 400) {
          setMessage("Token inválido ou mal formatado.");
        } else if (error.response?.status === 410) {
          setMessage("Este link de exclusão expirou.");
        } else if (error.response?.status === 404) {
          setMessage("Token não encontrado.");
        } else {
          setMessage(
            "Não foi possível concluir a exclusão da conta. Tente novamente mais tarde."
          );
        }
      }
    };

    confirmDelete();
  }, [searchParams]);

  return (
    <div className="email-verification-page">
      <div className="verification-container">
        <div className="verification-content">
          
          {/* Loading */}
          {status === "loading" && (
            <>
              <ImSpinner8 className="icon icon-loading" />
              <h1>Excluindo sua conta...</h1>
              <p>Estamos processando a exclusão. Isso pode levar alguns segundos.</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <FaCheckCircle className="icon icon-success" />
              <h1>Conta Excluída</h1>
              <p>{message}</p>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <FaTimesCircle className="icon icon-error" />
              <h1>A exclusão falhou</h1>
              <p>{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;