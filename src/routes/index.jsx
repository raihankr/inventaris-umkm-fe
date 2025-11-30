import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// pages
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Stok from "@/pages/Stok/Stok";
import Transaksi from "@/pages/Transaksi/Transaksi";
import Login from "@/pages/Login/login";
import Users from "../pages/Users/Users.jsx";
import {AuthProvider} from "@/contexts/AuthProvider";
import NotFound from "@/pages/NotFound/NotFound";

export default function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Landing Page */}
          <Route path="/"  element={
            <Navigate to={ "/login" } />
          } />

          {/* Main Layout + Protected */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stok" element={<Stok />} />
            <Route path="/transaksi" element={<Transaksi />} />
          </Route>

          <Route element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/users" element={<Users/>} />
          </Route>

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </AuthProvider>
    </Router>
  );
}
