"use client";

import React, { useState } from "react";
import { useAuth } from "@/provider/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
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
  X,
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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/test-paths", label: "Assessment", icon: ClipboardList },
  { href: "/dashboard/study-guides", label: "Study Guides", icon: BookOpen },
  { href: "/dashboard/track", label: "Track", icon: BarChart2 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
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
    <nav className="flex flex-col gap-2 p-3 flex-grow">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "group justify-start gap-3 h-11 rounded-md transition-all text-gray-100 hover:bg-cyan-500/10 hover:text-cyan-300",
            isSheetOpen || isMobile
              ? "w-full px-4"
              : "w-12 px-0 justify-center",
            pathname === item.href &&
              "bg-cyan-600/20 text-cyan-200 hover:bg-cyan-600/30"
          )}
          onClick={() => {
            router.push(item.href);
            if (isMobile) setIsMobileSheetOpen(false);
          }}
        >
          <item.icon
            className={cn(
              "h-5 w-5 transition-transform",
              isSheetOpen || isMobile ? "" : "group-hover:scale-110"
            )}
          />
          {(isSheetOpen || isMobile) && (
            <span className="font-medium text-sm">{item.label}</span>
          )}
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-950 to-black text-gray-200 font-funnel-sans">
      <div
        className={cn(
          "hidden lg:flex flex-col border-r border-gray-800 bg-black/50 backdrop-blur-lg transition-all duration-300 ease-in-out shadow-xl",
          isSheetOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-4 border-b border-gray-800 h-16 flex items-center justify-between sticky top-0 bg-black/70 backdrop-blur-md z-20">
          {isSheetOpen && (
            <Link href="/" passHref>
              <span className="font-semibold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 cursor-pointer">
                preptrack.app
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSheetOpen(!isSheetOpen)}
            className="hover:bg-gray-700/50 text-gray-400 hover:text-cyan-300 transition-all duration-200"
          >
            {isSheetOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto">
          <SideNavContent />

          {isSheetOpen && (
            <div className="mt-auto p-4 border-t border-gray-800 text-xs text-gray-500 space-y-1">
              <p>&copy; {new Date().getFullYear()} PrepTrack</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="w-full border-b border-gray-800 h-16 flex items-center px-4 justify-between lg:justify-end bg-black/60 backdrop-blur-md sticky top-0 z-10">
          <div className="lg:hidden">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-cyan-300"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] p-0 border-r border-gray-800 bg-black/80 backdrop-blur-lg flex flex-col"
              >
                <SheetHeader className="p-4 border-b border-gray-800 flex flex-row items-center justify-between">
                  <SheetTitle className="text-lg font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                    Links
                  </SheetTitle>
                </SheetHeader>
                <SideNavContent isMobile={true} />

                <div className="mt-auto p-4 border-t border-gray-800 text-xs text-gray-500 space-y-1">
                  <p>&copy; {new Date().getFullYear()} PrepTrack</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8 border border-gray-700">
              <AvatarImage src={user?.user_info?.profile_url || undefined} />
              <AvatarFallback className="bg-gray-700 text-gray-300 text-xs font-semibold">
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
                  className="text-gray-400 hover:text-red-400"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] max-w-[450px] bg-gray-900 border-gray-700 text-white rounded-lg p-6 shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-white">
                    Sign Out
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 pt-2">
                    Are you sure you want to sign out of your account?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 sm:justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsLogoutDialogOpen(false)}
                    className="border-gray-600 bg-white text-white hover:bg-gray-200 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Yes, Sign Out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
