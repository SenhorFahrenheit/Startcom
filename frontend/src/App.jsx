import { BrowserRouter } from "react-router-dom";
import './App.css';
import AppRoutes from './routes/AppRoutes';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ModalProvider, useModals } from "./contexts/ModalContext";
import MessageModal from "./components/Modals/MessageModal";

// Main content of the app, uses modals and routes
function AppContent() {
  const { activeModal, modalData, close } = useModals(); // Get modal state and actions

  return (
    <>
      <AppRoutes /> {/* App routes */}

      <MessageModal
        isOpen={activeModal === "message"} // Show modal if active
        code={modalData?.code} // Modal type code
        action={modalData?.action} // Action on modal close
        message={modalData?.message} // Optional modal message
        onClose={close} // Close modal callback
      />
    </>
  );
}

// Root component with router, modal provider, and toast notifications
export default function App() {
  return (
    <BrowserRouter> {/* Router for app navigation */}
      <ModalProvider> {/* Provides modal context */}
        <AppContent /> {/* Main app content */}
      </ModalProvider>

      <ToastContainer
        containerId="toast-root"
        position="top-right"
        autoClose={5000} // Auto close toasts after 5s
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        autoFocus={false} // Prevent auto focus for accessibility
      />
    </BrowserRouter>
  );
}