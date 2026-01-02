"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav
          className={cn(
            "relative flex items-center justify-between px-5 sm:px-6 md:px-12 lg:px-18 py-4 md:py-5 transition-all duration-300",
            isScrolled
              ? "bg-white/90 backdrop-blur-xl border-b border-brand-indigo/10 shadow-sm"
              : "bg-white/50 backdrop-blur-sm",
            isMenuOpen && "bg-white border-b border-brand-indigo/10"
          )}
        >
          <Link href="/" className="z-[60]" onClick={closeMenu}>
            <Image
              src="/logo/PrepTrack_LogoDesign_01-01.png"
              alt="PrepTrack"
              width={140}
              height={42}
              className="h-8 sm:h-10 md:h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12 font-dm-sans">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#why-preptrack">Why PrepTrack</NavLink>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4 z-50 font-dm-sans">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-brand-indigo hover:text-brand-green hover:bg-brand-green/5 transition-colors duration-300"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-brand-indigo text-white hover:bg-brand-indigo/90 transition-all duration-300 hover:scale-105 font-medium px-5 lg:px-6 rounded-full">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Animated Hamburger Button */}
          <button
            className="md:hidden z-[60] w-10 h-10 relative flex items-center justify-center focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 flex flex-col items-center justify-center gap-1.5">
              <span
                className={cn(
                  "block h-0.5 w-6 bg-brand-indigo rounded-full transition-all duration-300 ease-out origin-center",
                  isMenuOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 bg-brand-indigo rounded-full transition-all duration-300 ease-out",
                  isMenuOpen && "opacity-0 scale-0"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 bg-brand-indigo rounded-full transition-all duration-300 ease-out origin-center",
                  isMenuOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Menu - Full screen overlay with solid white background */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden bg-white transition-all duration-300 ease-out",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Menu Content */}
        <div
          className={cn(
            "flex flex-col h-full pt-24 pb-8 px-6 transition-all duration-400 ease-out",
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-8 opacity-0"
          )}
        >
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <MobileNavLink href="#features" onClick={closeMenu}>
              Features
            </MobileNavLink>
            <MobileNavLink href="#why-preptrack" onClick={closeMenu}>
              Why PrepTrack
            </MobileNavLink>

            <div className="h-px bg-brand-indigo/10 my-4" />

            <MobileNavLink href="/login" onClick={closeMenu}>
              Login
            </MobileNavLink>
          </div>

          {/* Mobile CTA */}
          <div
            className={cn(
              "pt-6 transition-all duration-400 ease-out",
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: isMenuOpen ? "150ms" : "0ms" }}
          >
            <Link href="/signup" onClick={closeMenu}>
              <Button className="w-full bg-brand-indigo text-white py-6 text-lg font-medium hover:bg-brand-indigo/90 rounded-2xl group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-center text-brand-indigo/40 text-sm mt-4 font-dm-sans">
              Free to start • No credit card required
            </p>
          </div>
        </div>
      </div>
    </>
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
      className="relative text-brand-indigo/70 hover:text-brand-indigo transition-colors duration-300 text-sm tracking-wide font-medium group"
    >
      <span>{children}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green rounded-full transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between py-4 px-4 rounded-xl border border-brand-indigo/10 hover:border-brand-green/30 hover:bg-brand-green/5 transition-all duration-300"
      onClick={onClick}
    >
      <span className="text-xl font-medium text-brand-indigo font-inter tracking-tight group-hover:text-brand-green transition-colors">
        {children}
      </span>
      <ArrowRight className="h-5 w-5 text-brand-indigo/30 group-hover:text-brand-green group-hover:translate-x-1 transition-all duration-300" />
    </Link>
  );
}
