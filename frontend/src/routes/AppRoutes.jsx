import { Routes, Route } from "react-router-dom";

import NotFound from "../pages/NotFound/NotFound";

import Auth from "../pages/auth/Auth";
import Home from "../pages/Home/Home";
import HelpCenter from "../pages/Support/HelpCenter";
import Contact from "../pages/Support/Contact";
import WhatsApp from "../pages/Support/WhatsApp";
import Privacy from "../pages/Support/Privacy";
import VerifyEmail from "../pages/auth/VerifyEmail";

import Dashboard from "../pages/Dashboard/Dashboard";
import Sales from "../pages/Sales/Sales";
import Clients from "../pages/Clients/Clients";
import Inventory from "../pages/Inventory/Inventory";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";

import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/ajuda" element={<HelpCenter />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/whatsapp" element={<WhatsApp />} />
      <Route path="/privacidade" element={<Privacy />} />
      <Route path="/verificar-email" element={<VerifyEmail />}/>
      <Route path="*" element={<NotFound />} />

      {/* Private Routes */}
      <Route
        path="/painel"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route path="/vendas"
        element={
          <PrivateRoute>
            <Sales />
          </PrivateRoute>
        }
      />

      <Route path="/clientes"
        element={
          <PrivateRoute>
            <Clients />
          </PrivateRoute>
        }
      />

      <Route path="/estoque"
        element={
          <PrivateRoute>
            <Inventory />
          </PrivateRoute>
        }
      />

      <Route path="/relatorios"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />

      <Route path="/configuracoes"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
