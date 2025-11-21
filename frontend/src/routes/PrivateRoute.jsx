import { useEffect } from "react";
import { useModals } from "../contexts/ModalContext";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const { open } = useModals();

  useEffect(() => {
    if (!token) {
      open("message", { code: "forbidden", action: "login" });
    }
  }, [token, open]);

  if (!token) {
    return null;
  }

  return children;
};

export default PrivateRoute;
