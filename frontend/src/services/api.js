import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Backend URL
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
