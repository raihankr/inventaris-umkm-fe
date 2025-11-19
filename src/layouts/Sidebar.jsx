import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/reusable/button";
import ProjectLogo from "@/assets/image/hugeicons--note-edit.svg";
import DashboardLogo from "@/components/ui/icons/tabler--align-box-bottom-center.svg";
import StokLogo from "@/components/ui/icons/fluent-mdl2--product-catalog.svg";
import TransaksiLogo from "@/components/ui/icons/solar--hand-money-broken.svg";

export default function AppSidebar() {
  const { open } = useSidebar(); // status sidebar (buka/tutup)

  // Daftar menu sidebar
  const menuItems = [
    { icon: DashboardLogo, label: "Dashboard", href: "/dashboard" },
    { icon: StokLogo, label: "Transaksi", href: "/transaksi" },
    { icon: TransaksiLogo, label: "Stok Barang", href: "/stok" },
    { icon: Settings, label: "Settings", href: "/settings" },
    
  ];

  // Data user untuk footer
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://ui.shadcn.com/avatars/01.png",
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header: logo + nama proyek (teks hilang saat collapse) */}
      <SidebarHeader className="px-0 py-2 h-12">
        <div className="w-full px-4 flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={ProjectLogo}
              alt="Invertaris UMKM"
              className="h-5 w-5 object-contain"
            />
            <span
              className={`font-semibold text-sm mt-1 transition-all duration-200 whitespace-nowrap ${
                open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              INVERTARIS UMKM
            </span>
          </Link>
        </div>
      </SidebarHeader>

      {/* Daftar menu utama */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link
                      to={item.href}
                      className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-muted"
                    >
                      {typeof item.icon === "string" ? (
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="h-4 w-4 object-contain"
                        />
                      ) : (
                        <item.icon size={18} />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: info user (nama & email hilang saat collapse) */}
      <SidebarFooter className="p-0 border-t">
        <div className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-md cursor-pointer">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div
            className={`flex flex-col text-sm transition-all duration-300 ${
              open ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
