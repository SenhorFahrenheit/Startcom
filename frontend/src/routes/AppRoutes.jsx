import { Routes, Route } from "react-router-dom";

// Importing pages
import NotFound from "../pages/NotFound/NotFound";
import Auth from "../pages/auth/Auth";
import Home from "../pages/Home/Home";
import HelpCenter from "../pages/Support/HelpCenter";
import Contact from "../pages/Support/Contact";
import WhatsApp from "../pages/Support/WhatsApp";
import Privacy from "../pages/Support/Privacy";
import VerifyEmail from "../pages/auth/VerifyEmail";
import DeleteAccount from "../pages/DeleteAccount/DeleteAccount";
import Dashboard from "../pages/Dashboard/Dashboard";
import Sales from "../pages/Sales/Sales";
import Clients from "../pages/Clients/Clients";
import Inventory from "../pages/Inventory/Inventory";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";

// Importing route guard for private routes
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} /> {/* Home page */}
      <Route path="/login" element={<Auth />} /> {/* Authentication page */}
      <Route path="/ajuda" element={<HelpCenter />} /> {/* Help center page */}
      <Route path="/contato" element={<Contact />} /> {/* Contact page */}
      <Route path="/whatsapp" element={<WhatsApp />} /> {/* WhatsApp support page */}
      <Route path="/privacidade" element={<Privacy />} /> {/* Privacy policy page */}
      <Route path="/verificar-email" element={<VerifyEmail />} /> {/* Email verification page */}
      <Route path="/excluir-conta" element={<DeleteAccount/>} />
      <Route path="*" element={<NotFound />} /> {/* 404 - Page not found */}

      {/* Private Routes */}
      <Route
        path="/painel"
        element={
          <PrivateRoute>
            <Dashboard /> {/* Dashboard - requires authentication */}
          </PrivateRoute>
        }
      />

      <Route
        path="/vendas"
        element={
          <PrivateRoute>
            <Sales /> {/* Sales page - requires authentication */}
          </PrivateRoute>
        }
      />

      <Route
        path="/clientes"
        element={
          <PrivateRoute>
            <Clients /> {/* Clients page - requires authentication */}
          </PrivateRoute>
        }
      />

      <Route
        path="/estoque"
        element={
          <PrivateRoute>
            <Inventory /> {/* Inventory page - requires authentication */}
          </PrivateRoute>
        }
      />

      <Route
        path="/relatorios"
        element={
          <PrivateRoute>
            <Reports /> {/* Reports page - requires authentication */}
          </PrivateRoute>
        }
      />

      <Route
        path="/configuracoes"
        element={
          <PrivateRoute>
            <Settings /> {/* Settings page - requires authentication */}
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;