import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Modal from 'react-modal';

// import { AuthProvider } from "./contexts/AuthContext";

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<AuthProvider><App /></AuthProvider>*/}
    <App />
  </StrictMode>,
);
