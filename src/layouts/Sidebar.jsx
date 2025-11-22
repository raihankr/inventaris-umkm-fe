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

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { MoreVertical } from "lucide-react";
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
      {/* Header: logo + nama proyek (teks-nya akan hilang saat collapse) */}
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
                              className="h-5 w-5 object-contain" />
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
        <div className="flex items-center justify-between px-4 py-3 hover:bg-muted rounded-md">

          {/* 1. Popover PROFILE PREVIEW */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-3 flex-1 text-left"
                title={open ? undefined : `${user.name} — ${user.email}`}
              >
                <div className="relative h-10 w-10 flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
                </div>

                <div
                  className={`flex flex-col transition-all duration-300 ${open ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                    }`}
                >
                  <span className="font-medium text-base">{user.name}</span>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-56 p-4 ml-3">
              <div className="flex flex-col items-center gap-3">
                <img
                  src={user.avatar}
                  className="w-16 h-16 rounded-full"
                  alt={user.name}
                />
                <div className="text-center">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <Link
                  to="/profile"
                  className="w-full mt-3 px-3 py-2 rounded-md bg-accent hover:bg-accent/80 text-sm text-center"
                >
                  View Profile
                </Link>
              </div>
            </PopoverContent>

          </Popover>

          {/* 2. Popover ACTION MENU === */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="p-2 rounded-md hover:bg-accent flex-shrink-0"
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-40 p-2">
              <div className="flex flex-col">
                <Link
                  to="profile/editprofile"
                  className="px-3 py-2 rounded-md hover:bg-accent text-sm"
                >
                  Edit Profile
                </Link>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                  className="px-3 py-2 rounded-md hover:bg-accent text-sm text-left text-red-600"
                >
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>

        </div>
      </SidebarFooter>

    </Sidebar>
  );
}
