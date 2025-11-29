import { createContext, useState, useContext, useEffect, useCallback } from "react";

// Context for global modal management
const ModalContext = createContext();

export function ModalProvider({ children }) {
  // Stores the active modal key
  const [activeModal, setActiveModal] = useState(null);

  // Stores data passed to the active modal
  const [modalData, setModalData] = useState({});

  // Opens a modal with optional data
  const open = useCallback((key, data = {}) => {
    setActiveModal(key);
    setModalData(data);
  }, []);

  // Closes the active modal and clears data
  const close = useCallback(() => {
    setActiveModal(null);
    setModalData({});
  }, []);

  // Listens for global modal events
  useEffect(() => {
    const handler = (e) => {
      open("message", e.detail);
    };

    window.addEventListener("modal", handler);
    return () => window.removeEventListener("modal", handler);
  }, [open]);

  return (
    <ModalContext.Provider value={{ activeModal, modalData, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

// Hook to access modal context
export function useModals() {
  return useContext(ModalContext);
}