// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "../pages/auth/Auth";
// import DashboardPage from "../pages/Dashboard/DashboardPage";
import Home from "../pages/Home/Home";
//import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/auth" element={<Auth/>}/>
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
