import { createContext, useState, useContext, useEffect, useCallback } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({});

  const open = useCallback((key, data = {}) => {
    setActiveModal(key);
    setModalData(data);
  }, []);

  const close = useCallback(() => {
    setActiveModal(null);
    setModalData({});
  }, []);

  useEffect(() => {
    const handler = () => {
      open("message", {
        code: "unauthorized",
        action: "login",
      });
    };

    window.addEventListener("unauthorized", handler);

    return () => {
      window.removeEventListener("unauthorized", handler);
    };
  }, [open]);

  return (
    <ModalContext.Provider value={{ activeModal, modalData, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModals() {
  return useContext(ModalContext);
}