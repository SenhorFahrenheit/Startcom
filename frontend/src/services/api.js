import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Backend URL
  headers: {
    "Content-Type": "application/json"
  }
});

export const registerAPI = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error("Dados inválidos para registro");
  }
  try {
    const response = await api.post("/cadastro/cadastrarUsuario", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};

export const loginAPI = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error("Dados inválidos para login");
  }
  try {
    const response = await api.post("/login", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    throw error;
  }
};

export default api;
