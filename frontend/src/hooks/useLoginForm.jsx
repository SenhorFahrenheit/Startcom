import { useState } from "react";
import { toast } from "react-toastify";

export const useLoginForm = (onSuccess) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Preencha e-mail e senha para entrar.", {
        position: "top-center",
        containerId: "toast-root",
      });
      return;
    }

    console.log("Login:", { loginEmail, loginPassword, keepLogged });
    toast.success("Login realizado!", {
      position: "top-center",
      containerId: "toast-root",
    });

    if (onSuccess) onSuccess({ email: loginEmail });
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
