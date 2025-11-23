import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { loginAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const useLoginForm = (onSuccess) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);

  const [buttonLoadingLogin, setButtonLoadingLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Preencha e-mail e senha para entrar.", {
        position: "top-center",
        containerId: "toast-root",
      });
      return;
    }

    const data = { email: loginEmail, password: loginPassword, keepLogged };

    try {
      setButtonLoadingLogin(true)
      const response = await loginAPI(data);

      if (!response) {
        throw new Error("Resposta de login inválida.");
      }

      const token = response.access_token.access_token;
      const companyId = response.access_token.company_id;
      login(token, { companyId });

      toast.success("Login realizado!", { containerId: "toast-root" });

      setTimeout(() => {
        navigate("/painel");
      }, 1000);

    } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("E-mail ou senha incorretos.", {
            position: "top-right",
            containerId: "toast-root",
          });
          return;
        }

        toast.error("Erro ao realizar login. Tente novamente.", {
          position: "top-right",
          containerId: "toast-root",
        });
    } finally {
      setTimeout(() => setButtonLoadingLogin(false), 1500);
    } 
  };

  return {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    keepLogged,
    setKeepLogged,
    handleLogin,
    buttonLoadingLogin,
  };
};
