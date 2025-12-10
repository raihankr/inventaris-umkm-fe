import {Navigate} from "react-router-dom";
import {useAuth} from "@/contexts/AuthContext.js";
import LoadingPage from "../pages/Loading/loading.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, userInfo } = useAuth();

  if (isLoading) {
    // TODO: Isi page/animasi loading di sini
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "Harap login terlebih dahulu untuk mengakses website!",
        }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          message: "Anda tidak memilizi izin untuk melihat halaman tersebut.",
        }}
      />
    );
  }

  return children;
}
