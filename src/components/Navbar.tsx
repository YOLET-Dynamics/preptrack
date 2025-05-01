"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="relative flex items-center justify-between px-6 md:px-18 py-4 md:py-8 bg-black">
        <Link href="/" className="z-50">
          <span className="text-xl md:text-3xl font-funnel-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            preptrack.app
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-24 font-funnel-sans">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#why-preptrack">Why PrepTrack</NavLink>
        </div>

        <div className="hidden md:block z-50 font-funnel-sans">
          <Link href="/signup">
            <Button className="hidden md:flex bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:opacity-90 transition-all duration-300 hover:scale-105 font-funnel-sans">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden z-50 text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <div
          className={cn(
            "fixed inset-0 bg-black transition-all duration-300 ease-in-out",
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 pt-20 font-funnel-sans">
            <MobileNavLink href="#features" onClick={toggleMenu}>
              Features
            </MobileNavLink>
            <MobileNavLink href="#why-preptrack" onClick={toggleMenu}>
              Why PrepTrack
            </MobileNavLink>
            <div className="mt-8">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-cyan-400 to-teal-400 text-black px-8 py-6 text-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="group relative text-white hover:text-cyan-400 transition-colors duration-300 flex items-center"
    >
      <span>{children}</span>
      <ArrowUpRight className="h-4 w-0 ml-1 opacity-0 group-hover:opacity-100 group-hover:w-4 transition-all duration-300" />
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="group text-white hover:text-cyan-400 transition-colors duration-300 text-2xl flex items-center"
      onClick={onClick}
    >
      <span>{children}</span>
      <ArrowUpRight className="h-5 w-0 ml-1 opacity-0 group-hover:opacity-100 group-hover:w-5 transition-all duration-300" />
    </Link>
  );
}
