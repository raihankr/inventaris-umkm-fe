import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const message = location.state?.message;
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (message) setShowPopup(true);
  }, [message]);

  const baseUrl = import.meta.env.VITE_BASE_URL_API_DOMAIN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        alert("Login gagal. Periksa username/password.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.data.token);

      setShowPopup(false);
      window.history.replaceState({}, "");

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saat login:", error);
      alert("Terjadi kesalahan. Coba beberapa saat lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">

      {/* Popup protected route */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white px-8 py-6 rounded-xl shadow-xl text-center max-w-sm">
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              Peringatan
            </h2>
            <p className="text-gray-700">
              {message || "Harap login untuk melanjutkan."}
            </p>
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

      {/* Form login - kiri */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-black">Login</h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-800">
                Username
              </label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none pr-11"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`block w-full text-center py-2 rounded-lg text-white transition-all
                ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
              style={!loading ? { backgroundColor: "var(--foreground)" } : {}}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>

      {/* kanan */}
      <div
        className="hidden md:flex flex-1 items-center justify-center p-10"
        style={{ backgroundColor: "var(--foreground)" }}
      >
        <div className="max-w-md text-white">
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
