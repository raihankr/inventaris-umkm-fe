import {useState} from "react";
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
  DialogOverlay,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {useAuth} from "@/contexts/AuthContext"; // untuk ambil data user

import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {MoreVertical, Tag} from "lucide-react";
import {Link, NavLink} from "react-router-dom";

import Profile from "@/pages/Profile/Profile.jsx";
import EditProfile from "@/pages/Profile/EditProfile.jsx";
import Logout from "@/pages/Login/logout.jsx";
import Settings from "@/pages/Settings/Settings";

import ProjectLogo from "@/assets/icons/company-logo/FaStock.png";
import DashboardLogo from "@/assets/icons/material-symbols--dashboard-outline-rounded.svg?react";
import StokLogo from "@/assets/icons/game-icons--sell-card.svg?react";
import TransaksiLogo from "@/assets/icons/fluent--money-16-filled.svg?react";
import UserLogo from "@/assets/icons/mingcute--user-3-fill.svg?react";

export default function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar(); // open close status sidebar
  const [showEditProfile, setShowEditProfile] = useState(false); // dialog edit profile
  const [showSettings, setShowSettings] = useState(false); // dialog settings
  const { userInfo } = useAuth();

  // Daftar menu sidebar
  const menuItems = [
    { icon: DashboardLogo, label: "Dashboard", href: "/dashboard" },
    { icon: TransaksiLogo, label: "Transaksi", href: "/transaksi" },
    { icon: StokLogo, label: "Stok Barang", href: "/stok" },
     { icon: Tag, label: "Kategori", href: "/kategori" },
  ];

  if (userInfo.role === "admin")
    menuItems.push({ icon: UserLogo, label: "Manajemen User", href: "/users" });
  // Ambil data user dari context
  const user = userInfo || {
    username: "loading...",
    name: "Loading...",
    email: "",
    image: "",
    role: "",
  };

  // Update data user setelah edit profile
  const handleUpdateProfile = (updatedUser) => {
    // setUser(updatedUser);
    setShowEditProfile(false);
  };

  return (
    <>
      {/* Sidebar utama */}
      <Sidebar collapsible="icon">
        {/* Header sidebar */}
        <SidebarHeader className="px-0 py-2 h-12 border-b ">
          <div className={`w-full ${open ? "px-4 justify-start" : "px-2 justify-center"} flex items-center`}>
            <Link to="/dashboard" className={`flex items-center ${open ? "gap-3" : "gap-0"}`} onClick={() => isMobile && setOpenMobile(false)}>
              <img src={ProjectLogo} className="h-6 w-6" />
              <span className={`font-semibold text-base mt-1 transition-all duration-200 whitespace-nowrap overflow-hidden ${open ? "opacity-100 max-w-xs ml-2" : "opacity-0 max-w-0 w-0"}`}>
                FaStock
              </span>
            </Link>
          </div>
        </SidebarHeader>

        {/* Konten menu */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="py-0 gap-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <NavLink to={item.href} onClick={() => isMobile && setOpenMobile(false)}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          asChild
                          tooltip={item.label}
                          data-active={isActive ? "true" : "false"}
                        >
                          <div
                            className={`flex items-center rounded-md transition-all duration-200 ${open ? "px-4 py-2 gap-3 justify-start" : "p-2 justify-center"}`}
                          >
                            {typeof item.icon === "string" ? (
                              <item.icon className="h-5 w-5 icon text-foreground" />
                            ) : (
                              <item.icon size={20} />
                            )}
                            {open && (
                              <span className="text-base">{item.label}</span>
                            )}
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
            <div
              className={`flex items-center rounded-md px-2 py-2 transition-colors duration-200 hover:bg-sidebar-accent group ${open ? "justify-between" : "justify-center"}`}
            >
              {/* Profile Section */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`flex items-center ${open ? "gap-2 flex-1 text-left min-w-0" : "justify-center w-full"}`}
                  >
                    {/* Avatar*/}
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            user.image || "https://ui.shadcn.com/avatars/01.png"
                          }
                        />
                        <AvatarFallback>
                          {user.name ? user.name[0] : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Text Info */}
                    <div
                      className={`flex flex-col transition-all duration-300 overflow-hidden ${open ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"}`}
                    >
                      <span className="font-semibold text-sm leading-tight">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight mt-0.5">
                        @{user.username}
                      </span>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 ml-3">
                  <Profile
                    user={userInfo}
                    onEdit={() => setShowEditProfile(true)} // Buka dialog edit profile
                  />
                </PopoverContent>
              </Popover>

              {/* More Options */}
              <div
                className={`transition-all duration-300 ${open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-sidebar-hover">
                      <MoreVertical size={14} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2">
                    <div className="flex flex-col space-y-1">
                      {/* Edit Profile */}
                      <button
                        className="px-3 py-2 rounded-md hover:bg-accent text-sm text-left w-full"
                        onClick={() => setShowEditProfile(true)}
                      >
                        Edit Profile
                      </button>

                      {/* Settings */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="px-3 py-2 rounded-md hover:bg-accent text-sm text-left w-full"
                            onClick={() => setShowSettings(true)}
                          >
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

        <DialogOverlay className="bg-black/50 backdrop-blur-sm" />

        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Ubah nama, email, atau avatar Anda di sini.
            </DialogDescription>
          </DialogHeader>

          <EditProfile
            onUpdate={handleUpdateProfile}
            onClose={() => setShowEditProfile(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog settings */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>

        <DialogOverlay className="bg-black/50 backdrop-blur-sm" />

        <DialogContent
          className="sm:max-w-[600px]"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >

          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Settings />
        </DialogContent>
      </Dialog>
    </>
  );
}
