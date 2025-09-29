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
    
    try {
      const login = await loginAPI({ email: loginEmail, password: loginPassword, keepLogged });

      if (!login) {
        throw new Error("Resposta de login inválida.");
      }
      
    } catch (error) {
      toast.error("Erro ao realizar login: " + error.message, {
        position: "top-center",
        containerId: "toast-root",
      });
      return;
    }

    toast.success("Login realizado!", {
      position: "top-center",
      containerId: "toast-root",
    });

    onSuccess({ email: loginEmail });

    window.location = "/painel";
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
