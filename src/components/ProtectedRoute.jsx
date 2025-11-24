import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ message: "Harap login terlebih dahulu untuk mengakses website!" }} />;
  }

  return children;
}
