import './App.css'
import AppRoutes from './routes/AppRoutes';

// Libs
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppRoutes />
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
    </>
  )
}

export default App