import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/layouts/Sidebar";
import Header from "@/layouts/Header";

// Layout utama aplikasi
export default function MainLayout({ children }) {
  return (
    // Membungkus layout dengan SidebarProvider supaya sidebar bisa diakses di seluruh layout
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar /> {/* Sidebar di sisi kiri */}

        {/* Kolom kanan: header di atas, konten di bawah */}
        <div className="flex-1 flex flex-col">
          <Header /> {/* Bagian atas layout */}
          
          <main className="flex-1 overflow-y-auto p-6">
            {children} {/* Halaman/konten utama */}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
