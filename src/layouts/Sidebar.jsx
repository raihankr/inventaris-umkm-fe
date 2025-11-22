// AppSidebar.jsx
import { useState } from "react";
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MoreVertical } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import Profile from '@/pages/Profile/Profile.jsx';
import EditProfile from '@/pages/Profile/EditProfile.jsx';
import { Button } from "@/components/reusable/button";

import ProjectLogo from "@/assets/image/academicons--open-data.svg";
import DashboardLogo from "@/components/ui/icons/material-symbols--dashboard-outline-rounded.svg";
import StokLogo from "@/components/ui/icons/game-icons--sell-card.svg";
import TransaksiLogo from "@/components/ui/icons/fluent--money-16-filled.svg";
import SettingsLogo from "@/components/ui/icons/material-symbols--settings.svg";

export default function AppSidebar() {
  // Status sidebar dari context (open/close)
  const { open } = useSidebar();
  
  // State untuk menampilkan dialog edit profile
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Daftar menu sidebar
  const menuItems = [
    { icon: DashboardLogo, label: "Dashboard", href: "/dashboard" },
    { icon: TransaksiLogo, label: "Transaksi", href: "/transaksi" },
    { icon: StokLogo, label: "Stok Barang", href: "/stok" },
    { icon: SettingsLogo, label: "Settings", href: "/settings" },
  ];

  // State user (nama, email, avatar, role)
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://ui.shadcn.com/avatars/01.png",
    role: "Admin",
  });

  // Update data user setelah edit profile
  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    setShowEditProfile(false);
  };

  return (
    <>
      {/* Sidebar utama */}
      <Sidebar collapsible="icon">
        {/* Header sidebar */}
        <SidebarHeader className="px-0 py-2 h-12 border-b ">
          <div className="w-full px-4 flex items-center">
            <Link to="/dashboard" className="flex items-center gap-3">
              <img
                src={ProjectLogo}
                alt="Invertaris UMKM"
                className="h-6 w-6 object-contain"
              />
              <span className={`font-semibold text-base mt-1 transition-all duration-200 whitespace-nowrap ${open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                INVERTARIS UMKM
              </span>
            </Link>
          </div>
        </SidebarHeader>

        {/* Konten menu */}
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
                          data-active={isActive ? "true" : "false"}
                        >
                          <div className="flex items-center rounded-md px-4 py-5">
                            {typeof item.icon === "string" ? (
                              <img src={item.icon} alt={item.label} className="h-5 w-5 object-contain" />
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

        {/* Footer: profile + logout */}
        <SidebarFooter className="p-0 border-t">
          <div className="flex items-center justify-between px-4 py-3 hover:bg-muted rounded-md">
            
            {/* Popover profile */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="flex items-center gap-3 flex-1 text-left"
                  title={open ? undefined : `${user.name} — ${user.email}`}
                >
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
                  </div>
                  <div className={`flex flex-col transition-all duration-300 ${open ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                    <span className="font-medium text-base">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                </button>
              </PopoverTrigger>

              {/* Konten popover profile */}
              <PopoverContent className="w-56 p-4 ml-3">
                <Profile
                  user={user}
                  onEdit={() => setShowEditProfile(true)}
                />
              </PopoverContent>
            </Popover>

            {/* Popover opsi lainnya */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-2 rounded-md hover:bg-accent flex-shrink-0" aria-label="More options">
                  <MoreVertical size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="flex flex-col">
                  <button
                    className="px-3 py-2 rounded-md hover:bg-accent text-sm text-left"
                    onClick={() => setShowEditProfile(true)}
                  >
                    Edit Profile
                  </button>
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

      {/* Dialog edit profile */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Ubah nama, email, atau avatar Anda di sini.
            </DialogDescription>
          </DialogHeader>

          <EditProfile
            user={user}
            onUpdate={handleUpdateProfile}
            onClose={() => setShowEditProfile(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
