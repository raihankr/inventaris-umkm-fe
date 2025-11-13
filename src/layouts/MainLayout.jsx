export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow p-4">
        <h1 className="font-semibold text-lg">Inventaris UMKM</h1>
      </header>
    
      <main className="flex-1">{children}</main>

      <footer className="bg-gray-100 text-center p-2 text-sm text-gray-600">
        © 2025 Inventaris UMKM
      </footer>
    </div>
  );
}
