import { useState } from "react";
import { toast } from "react-toastify";
import { loginAPI } from "../services/api";

export const useLoginForm = (onSuccess) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);

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
      const response = await loginAPI(data);

      if (!response) {
        throw new Error("Resposta de login inválida.");
      }

      localStorage.setItem("token", response.access_token.access_token);
      localStorage.setItem("company_id", response.access_token.company_id);

      toast.success("Login realizado!", { containerId: "toast-root" });

      setTimeout(() => {
        window.location.href = "/painel";
      }, 1000);
    } catch (error) {
      toast.error("Erro ao realizar login: " + error.message, {
        position: "top-center",
        containerId: "toast-root",
      });
      return;
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
  };
};
