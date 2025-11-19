import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// landing
import Landing from "@/pages/Landing/landing";

// pages
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Stok from "@/pages/Stok/Stok";
import Transaksi from "@/pages/Transaksi/Transaksi";
import Settings from "@/pages/Settings/Settings";
import Profile from "@/pages/Profile/Profile";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* path dasar adalah landing */}
        <Route
          path="/"
          element={
            <Landing />
          }
        />

        {/* Profile */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stok" element={<Stok />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
