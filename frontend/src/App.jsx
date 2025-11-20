import { BrowserRouter } from "react-router-dom";
import './App.css';
import AppRoutes from './routes/AppRoutes';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ModalProvider, useModals } from "./contexts/ModalContext";
import MessageModal from "./components/Modals/MessageModal";

function AppContent() {
  const { activeModal, modalData, close } = useModals();

  return (
    <>
      <AppRoutes />

      <MessageModal
        isOpen={activeModal === "message"}
        code={modalData?.code}
        action={modalData?.action}
        message={modalData?.message}
        onClose={close}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <AppContent />
      </ModalProvider>

      <ToastContainer
        containerId="toast-root"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        autoFocus={false}
      />
    </BrowserRouter>
  );
}
