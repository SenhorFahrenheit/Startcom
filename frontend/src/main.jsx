import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Modal from 'react-modal';

import { AuthProvider } from "./contexts/AuthContext.jsx";

// Set root element for accessibility with react-modal
Modal.setAppElement('#root');

// Create React root and render the app
createRoot(document.getElementById('root')).render(
  <StrictMode> {/* Enable strict mode for highlighting potential problems */}
    <AuthProvider> {/* Provides authentication context to the app */}
      <App /> {/* Main app component */}
    </AuthProvider>
  </StrictMode>,
);