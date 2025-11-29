import { useEffect } from "react";
import { useModals } from "../contexts/ModalContext";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Get auth token from localStorage
  const { open } = useModals(); // Get modal control function

  useEffect(() => {
    const sessionExpired = sessionStorage.getItem("session_expired"); // Check if session has expired
    
    // Show forbidden modal if no token and session not expired
    if (!token && !sessionExpired) {
      open("message", { code: "forbidden", action: "login" });
    }
  }, [token, open]);

  if (!token) {
    return null; // Prevent rendering if user is not authenticated
  }

  return children; // Render child components if authenticated
};

export default PrivateRoute;