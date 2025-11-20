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
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/reusable/button";
import ProjectLogo from "@/assets/image/academicons--open-data.svg";
import DashboardLogo from "@/components/ui/icons/material-symbols--dashboard-outline-rounded.svg";
import StokLogo from "@/components/ui/icons/game-icons--sell-card.svg";
import TransaksiLogo from "@/components/ui/icons/fluent--money-16-filled.svg";
import SettingsLogo from "@/components/ui/icons/material-symbols--settings.svg";

export default function AppSidebar() {
  const { open } = useSidebar(); // status sidebar (buka/tutup)

  // Daftar menu sidebar
  const menuItems = [
    { icon: DashboardLogo, label: "Dashboard", href: "/dashboard" },
    { icon: TransaksiLogo, label: "Transaksi", href: "/transaksi" },
    { icon: StokLogo, label: "Stok Barang", href: "/stok" },
    { icon: SettingsLogo, label: "Settings", href: "/settings" },
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
      <SidebarHeader className="px-0 py-2 h-12 border-b ">
        <div className="w-full px-4 flex items-center">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img
              src={ProjectLogo}
              alt="Invertaris UMKM"
              className="h-6 w-6 object-contain"
            />
            <span
              className={`font-semibold text-base mt-1 transition-all duration-200 whitespace-nowrap ${open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
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
            <SidebarMenu className="py-0 gap-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <NavLink to={item.href}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        data-active={isActive ? "true" : "false"} >
                        <div className="flex items-center rounded-md px-4 py-5">
                          {typeof item.icon === "string" ? (
                            <img
                              src={item.icon}
                              alt={item.label}
                              className="h-5 w-5 object-contain"/>
                          ) : (
                            <item.icon size={20} />
                          )}
                          <span className="text-base">{item.label}</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: info user (button profil)*/}
      <SidebarFooter className="p-0 border-t">
        <Link
          to="/profile"
          className="block w-full"
          title={open ? undefined : `${user.name} — ${user.email}`}
          aria-label={`${user.name} — ${user.email}`}
        >
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-md cursor-pointer">
            <div className="relative h-10 w-10 flex-shrink-0">
              <img // nanti ini diubah pakai avatar user dari backend
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              {/* dot status online/offline */}
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" aria-hidden="true" />
            </div>

            <div
              className={`flex flex-col transition-all duration-300 ${open ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                }`}
            >
              <span className="font-medium text-base">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
