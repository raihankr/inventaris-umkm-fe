import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { apiPost } from "../../lib/api.js";
import { useAuth } from "../../contexts/AuthContext.js";
import LoadingPage from "../Loading/loading.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx"; // ⬅️ add this

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { refetchAuthStatus, isAuthenticated, isLoading } = useAuth();
  const { darkMode } = useTheme(); // ⬅️ ambil darkMode

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const message = location.state?.message;
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (message) setShowPopup(true);
  }, [message]);

  // useEffect(() => {
  //   if (isAuthenticated && !isLoading)
  //     navigate("/dashboard", { replace: true });
  // }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const response = await apiPost("/auth/login", { username, password });

    if (response.status >= 500) {
      setErrorMessage("Terjadi kesalahan pada server. Coba lagi nanti");
      setLoading(false);
      return;
    }

    if (response.status == 400) {
      setErrorMessage("Username atau Password salah.");
      setLoading(false);
      return;
    }

    setShowPopup(false);
    window.history.replaceState({}, "");

    refetchAuthStatus();

    navigate("/dashboard");
  };

  if (isLoading) return <LoadingPage />;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div
      className={`
        min-h-screen flex flex-col md:flex-row 
        ${darkMode ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
      {/* Popup protected route */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className={`px-8 py-6 rounded-xl shadow-xl text-center max-w-sm
              ${darkMode ? "bg-neutral-900 text-white" : "bg-white text-black"}`}
          >
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              Peringatan
            </h2>
            <p>{message || "Harap login untuk melanjutkan."}</p>
            <button
              onClick={() => {
                setShowPopup(false);
                window.history.replaceState({}, "");
              }}
              className="mt-4 px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: "var(--foreground)" }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* LEFT - FORM LOGIN */}
      <div
        className={`
          flex-1 flex items-center justify-center p-8
          ${darkMode ? "bg-black text-white" : "bg-white text-black"}
        `}
      >
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Login</h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                className={`
                  w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none
                  ${darkMode ? "bg-neutral-800 text-white border-neutral-700" : ""}
                `}
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`
                    w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none pr-11
                    ${darkMode ? "bg-neutral-800 text-white border-neutral-700" : ""}
                  `}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`
                    absolute right-3 top-2.5 
                    ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"}
                  `}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-600 text-sm -mt-2">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`
                block w-full text-center py-2 rounded-lg transition-all
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : darkMode
                      ? "bg-white text-black"
                      : "bg-black text-white"
                }
              `}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT - INFO PANEL */}
      <div
        className={`
          hidden md:flex flex-1 items-center justify-center p-10
          ${darkMode ? "bg-neutral-900 text-white" : "bg-black text-white"}
        `}
      >
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4">Inventaris UMKM</h2>
          <p className="text-lg opacity-90">
            Sistem inventaris sederhana untuk membantu UMKM mengelola barang,
            stok, dan aset usaha dengan mudah dan efisien.
          </p>
        </div>
      </div>
    </div>
  );
}
