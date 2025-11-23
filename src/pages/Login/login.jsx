import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://dev-inventaris-umkm-be.vercel.app/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">

      {/* kiri */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-black">Login</h1>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium text-gray-800">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="Masukkan username (admumkm)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="block w-full text-center py-2 rounded-lg text-white"
              style={{ backgroundColor: "var(--foreground)" }}
              disabled={loading}
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
