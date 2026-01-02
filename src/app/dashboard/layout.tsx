"use client";

import React, { useState } from "react";
import { useAuth } from "@/provider/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MenuIcon,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  BarChart2,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName || !lastName) return "U";
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: LayoutDashboard,
    description: "Overview",
  },
  {
    href: "/dashboard/test-paths",
    label: "Practice",
    icon: ClipboardList,
    description: "Assessments",
  },
  {
    href: "/dashboard/study-guides",
    label: "Learn",
    icon: BookOpen,
    description: "Study guides",
  },
  {
    href: "/dashboard/track",
    label: "Progress",
    icon: BarChart2,
    description: "Analytics",
  },
  {
    href: "/dashboard/profile",
    label: "Account",
    icon: User,
    description: "Settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully.");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsLogoutDialogOpen(false);
    }
  };

  const SideNavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="flex flex-col gap-1 p-3 flex-grow">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <button
            key={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl transition-all duration-200 font-dm-sans text-left",
              isSheetOpen || isMobile
                ? "w-full px-4 py-3"
                : "w-12 h-12 px-0 justify-center",
              isActive
                ? "bg-gradient-to-r from-brand-green/10 to-brand-green/5 text-brand-green border border-brand-green/20"
                : "text-brand-indigo/60 hover:bg-brand-indigo/5 hover:text-brand-indigo border border-transparent"
            )}
            onClick={() => {
              router.push(item.href);
              if (isMobile) setIsMobileSheetOpen(false);
            }}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-lg transition-all",
                isSheetOpen || isMobile ? "w-9 h-9" : "w-full h-full",
                isActive
                  ? "bg-brand-green/10"
                  : "bg-brand-indigo/5 group-hover:bg-brand-indigo/10"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] transition-all",
                  isActive
                    ? "text-brand-green"
                    : "text-brand-indigo/50 group-hover:text-brand-indigo"
                )}
              />
            </div>
            {(isSheetOpen || isMobile) && (
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm leading-tight">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "text-xs leading-tight truncate",
                    isActive ? "text-brand-green/70" : "text-brand-indigo/40"
                  )}
                >
                  {item.description}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-white font-dm-sans">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-brand-indigo/10 bg-gradient-to-b from-white to-gray-50/50 transition-all duration-300 ease-out",
          isSheetOpen ? "w-72" : "w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-brand-indigo/5 h-16 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-20">
          {isSheetOpen && (
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo/PrepTrack_LogoDesign_01-01.png"
                alt="PrepTrack"
                width={120}
                height={36}
                className="h-8 w-auto transition-transform group-hover:scale-[1.02]"
              />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSheetOpen(!isSheetOpen)}
            className="hover:bg-brand-indigo/5 text-brand-indigo/40 hover:text-brand-indigo transition-all duration-200 rounded-lg h-9 w-9"
          >
            {isSheetOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex flex-col flex-grow overflow-y-auto">
          {isSheetOpen && (
            <div className="px-4 pt-4 pb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand-indigo/40 font-inter">
                Menu
              </span>
            </div>
          )}
          <SideNavContent />

          {isSheetOpen && (
            <div className="mt-auto p-4 border-t border-brand-indigo/5">
              <div className="flex items-center gap-2 text-[11px] text-brand-indigo/40 font-dm-sans">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></div>
                <span>&copy; {new Date().getFullYear()} PrepTrack</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="w-full border-b border-brand-indigo/10 h-16 flex items-center px-4 sm:px-6 justify-between lg:justify-end bg-white sticky top-0 z-10">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-brand-indigo/60 hover:text-brand-indigo hover:bg-brand-indigo/5 rounded-lg"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] p-0 border-r border-brand-indigo/10 bg-gradient-to-b from-white to-gray-50/50 flex flex-col"
              >
                <SheetHeader className="p-4 border-b border-brand-indigo/5 bg-white/80 backdrop-blur-sm">
                  <SheetTitle className="flex items-center">
                    <Image
                      src="/logo/PrepTrack_LogoDesign_01-01.png"
                      alt="PrepTrack"
                      width={120}
                      height={36}
                      className="h-8 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 pt-4 pb-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-brand-indigo/40 font-inter">
                    Menu
                  </span>
                </div>
                <SideNavContent isMobile={true} />
                <div className="mt-auto p-4 border-t border-brand-indigo/5">
                  <div className="flex items-center gap-2 text-[11px] text-brand-indigo/40 font-dm-sans">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></div>
                    <span>&copy; {new Date().getFullYear()} PrepTrack</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-brand-indigo/10">
              <AvatarImage src={user?.user_info?.profile_url || undefined} />
              <AvatarFallback className="bg-brand-green/10 text-brand-green text-sm font-semibold font-inter">
                {getInitials(
                  user?.user_info?.first_name,
                  user?.user_info?.last_name
                )}
              </AvatarFallback>
            </Avatar>

            <Dialog
              open={isLogoutDialogOpen}
              onOpenChange={setIsLogoutDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-brand-indigo/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] max-w-[400px] bg-white border-brand-indigo/10 text-brand-indigo rounded-2xl p-6 shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-brand-indigo font-inter">
                    Sign Out
                  </DialogTitle>
                  <DialogDescription className="text-brand-indigo/60 pt-2 font-dm-sans">
                    Are you sure you want to sign out of your account?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 sm:justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsLogoutDialogOpen(false)}
                    className="border-brand-indigo/20 bg-white text-brand-indigo hover:bg-brand-indigo/5 px-4 py-2 rounded-xl font-dm-sans"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-dm-sans"
                  >
                    Sign Out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
