import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 403) {
      window.dispatchEvent(
        new CustomEvent("modal", {
          detail: { code: "forbidden", action: "home" }
        })
      );
    }

    if (status === 419) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.dispatchEvent(
        new CustomEvent("modal", {
          detail: { code: "expired", action: "login" }
        })
      );
    }

    return Promise.reject(error);
  }
);

export const registerAPI = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error("Dados inválidos para registro");
  }

  try {
    const userData = {
      name: data.name,
      email: data.email,
      birth_date: new Date(data.date).toISOString(),
      phone_number: `+55${data.telefone.replace(/\D/g, '')}`,
      cpf_cnpj: (data.cpf || data.cnpj).replace(/\D/g, ''),
      password: data.password
    };

    const response = await api.post("/User/register", userData);

    if (response.data) return response.data;

    throw new Error("Erro ao registrar");
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.response?.data || error);
    throw error;
  }
};

export const loginAPI = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error("Dados inválidos para login");
  }

  try {
    const userData = {
      email: data.email,
      password: data.password
    };

    const response = await api.post("/Auth/login", userData);

    if (response.data) return response.data;

    throw new Error("Erro ao receber o token");
  } catch (error) {
    console.error("Erro ao realizar login:", error.response?.data || error);
    throw error;
  }
};

export default api;