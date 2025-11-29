import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { loginAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// Hook to manage login form state and submission
export const useLoginForm = (onSuccess) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form fields state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);

  // Loading state for login button
  const [buttonLoadingLogin, setButtonLoadingLogin] = useState(false);

  // Handles login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Preencha e-mail e senha para entrar.", {
        position: "top-center",
        containerId: "toast-root",
      });
      return;
    }

    const data = { email: loginEmail, password: loginPassword, keepLogged };

    try {
      setButtonLoadingLogin(true);

      // Call login API
      const response = await loginAPI(data);

      if (!response) {
        throw new Error("Invalid login response.");
      }

      const token = response.access_token;
      const companyId = response.companyId;
      const name = response.name;

      // Save token and user info in AuthContext
      login(token, {
        companyId,
        email: loginEmail,
        name: name,
      });

      toast.success("Login realizado!", { containerId: "toast-root" });

      // Navigate to dashboard after success
      setTimeout(() => {
        navigate("/painel");
      }, 1000);

    } catch (error) {
      // Handle invalid credentials
      if (error.response && error.response.status === 401) {
        toast.error("E-mail ou senha incorretos.", {
          position: "top-right",
          containerId: "toast-root",
        });
        return;
      }

      // Generic error
      toast.error("Erro ao realizar login. Tente novamente.", {
        position: "top-right",
        containerId: "toast-root",
      });
    } finally {
      // Reset button loading state
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