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
import Logout from "@/pages/Login/logout.jsx";
import Settings from "@/pages/Settings/Settings";
import { Button } from "@/components/ui/button";

import ProjectLogo from "@/assets/icons/academicons--open-data.svg";
import DashboardLogo from "@/assets/icons/material-symbols--dashboard-outline-rounded.svg";
import StokLogo from "@/assets/icons//game-icons--sell-card.svg";
import TransaksiLogo from "@/assets/icons/fluent--money-16-filled.svg";
import SettingsLogo from "@/assets/icons//material-symbols--settings.svg";

export default function AppSidebar() {
  const { open } = useSidebar(); // open close status sidebar
  const [showEditProfile, setShowEditProfile] = useState(false); // dialog edit profile
  const [showSettings, setShowSettings] = useState(false); // dialog settings


  // Daftar menu sidebar
  const menuItems = [
    { icon: DashboardLogo, label: "Dashboard", href: "/dashboard" },
    { icon: TransaksiLogo, label: "Transaksi", href: "/transaksi" },
    { icon: StokLogo, label: "Stok Barang", href: "/stok" },
  ];

  // State user (nama, email, avatar, role)
  const [user, setUser] = useState({
    username: "johndoe69",
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
          <div className="p-2">
            <div className="flex items-center justify-between rounded-md px-2 py-2 transition-colors duration-200 hover:bg-sidebar-accent group">

              {/* Profile Section */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 flex-1 text-left min-w-0">
                    {/* Avatar*/}
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      <Avatar className="h-8 w-8 min-h-6 min-w-6">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-[8px]">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Text Info */}
                    <div className={`flex flex-col transition-all duration-300 overflow-hidden ${open ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"}`}>
                      <span className="font-semibold text-sm leading-tight">{user.name}</span>
                      <span className="text-xs text-muted-foreground leading-tight mt-0.5">@{user.username}</span>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 ml-3">
                  <Profile
                    user={user}
                    onEdit={() => setShowEditProfile(true)}
                  />
                </PopoverContent>
              </Popover>

              {/* More Options */}
              <div className={`transition-all duration-300 ${open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-accent">
                      <MoreVertical size={14} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2">
                    <div className="flex flex-col space-y-1">

                      {/* Edit Profile */}
                      <button
                        className="px-3 py-2 rounded-md hover:bg-accent text-sm text-left w-full"
                        onClick={() => setShowEditProfile(true)}>
                        Edit Profile
                      </button>

                      {/* Settings */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="px-3 py-2 rounded-md hover:bg-accent text-sm text-left w-full"
                            onClick={() => setShowSettings(true)}>
                            Settings
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-52 p-3">
                          <Settings />
                        </PopoverContent>
                      </Popover>

                      {/* Logout - Pastikan konsisten padding */}
                      <div className="w-full">
                        <Logout />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Dialog edit profile */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()} // biar tombol ESC tidak close
        >
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

      {/* Dialog settings */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent
          className="sm:max-w-[400px]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <Settings />
        </DialogContent>
      </Dialog>
    </>
  );
}
