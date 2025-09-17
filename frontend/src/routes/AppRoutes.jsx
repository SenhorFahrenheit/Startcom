// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Auth from "../pages/auth/Auth";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import Sales from "../pages/Sales/Sales";
import Clients from "../pages/Clients/Clients";
import Inventory from "../pages/Inventory/Inventory"
import Reports from "../pages/Reports/Reports";
//import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Auth/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/vendas" element={<Sales/>}/>
        <Route path="/clientes" element={<Clients/>}/>
        <Route path="/estoque" element={<Inventory/>}/>
        <Route path="/relatorios" element={<Reports/>}/>
        {/*
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />*/}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
