import axios from "axios";

// Create Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Backend URL from environment
  headers: {
    "Content-Type": "application/json" // Default content type
  }
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to headers
    }

    return config;
  },
  (error) => Promise.reject(error) // Forward request errors
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    const status = error?.response?.status;

    if (status === 403) {
      // Forbidden access
      window.dispatchEvent(
        new CustomEvent("modal", {
          detail: { code: "forbidden", action: "home" } // Trigger modal
        })
      );
    }

    if (status === 419) {
      // Session expired
      sessionStorage.setItem("session_expired", "true");

      window.dispatchEvent(
        new CustomEvent("modal", {
          detail: { code: "expired", action: "login" } // Show expired session modal
        })
      );

      localStorage.removeItem("token"); // Remove auth token
      localStorage.removeItem("user"); // Remove user info

      setTimeout(() => {
        sessionStorage.removeItem("session_expired"); // Clean up session flag
      }, 100);
    }

    return Promise.reject(error); // Forward error
  }
);

// API function to register a new user
export const registerAPI = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid registration data");
  }

  try {
    const userData = {
      name: data.name,
      email: data.email,
      birth_date: new Date(data.date).toISOString(), // Format date to ISO
      phone_number: `+55${data.telefone.replace(/\D/g, '')}`, // Format phone
      cpf_cnpj: (data.cpf || data.cnpj).replace(/\D/g, ''), // Format document
      password: data.password
    };

    const response = await api.post("/User/register", userData);

    if (response.data) return response.data; // Return user data

    throw new Error("Error registering user");
  } catch (error) {
    console.error("User registration error:", error.response?.data || error);
    throw error;
  }
};

// API function to log in a user
export const loginAPI = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid login data");
  }

  try {
    const userData = {
      email: data.email,
      password: data.password
    };

    const response = await api.post("/Auth/login", userData);

    if (response.data) return response.data; // Return login data (token etc.)

    throw new Error("Error receiving token");
  } catch (error) {
    console.error("Login error:", error.response?.data || error);
    throw error;
  }
};

export default api; // Export Axios instance