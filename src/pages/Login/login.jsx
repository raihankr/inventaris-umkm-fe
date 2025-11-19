import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
{/* form kiri */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-black">
            Login
          </h1>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-sm font-medium text-gray-800">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                placeholder="Masukkan password"
              />
            </div>

            <Link
              to="/dashboard"
              className="block w-full text-center py-2 rounded-lg text-white transition-all"
              style={{
                backgroundColor: "#222222ff",
              }}
            >
              Masuk
            </Link>
          </form>
        </div>
      </div>
      
{/* kanan */}
      <div
        className="hidden md:flex flex-1 items-center justify-center p-10"
        style={{
          backgroundColor: "#222222ff", 
        }}
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
