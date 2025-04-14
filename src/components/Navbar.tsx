"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-8 md:px-24 py-6 md:py-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl md:text-3xl font-funnel tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            preptrack.app
          </span>
        </Link>
        <nav className="hidden md:flex space-x-24">
          <Link
            href="#features"
            className="group text-sm text-white/80 hover:text-white transition-all duration-300 flex items-center gap-1 font-raleway"
          >
            Features
            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="#why"
            className="group text-sm text-white/80 hover:text-white transition-all duration-300 flex items-center gap-1 font-raleway"
          >
            Why PrepTrack
            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="#testimonials"
            className="group text-sm text-white/80 hover:text-white transition-all duration-300 flex items-center gap-1 font-raleway"
          >
            Testimonials
            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button className="hidden md:flex bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:opacity-90 transition-all duration-300 hover:scale-105 font-raleway">
            Join Waitlist
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <div className="py-8 px-4">
          <nav className="flex flex-col space-y-8">
            <Link
              href="#features"
              className="group text-2xl text-white/80 hover:text-white transition-all duration-300 flex items-center gap-2 font-raleway transform"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
              <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="#why"
              className="group text-2xl text-white/80 hover:text-white transition-all duration-300 flex items-center gap-2 font-raleway transform"
              onClick={() => setIsMenuOpen(false)}
            >
              Why PrepTrack
              <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="#testimonials"
              className="group text-2xl text-white/80 hover:text-white transition-all duration-300 flex items-center gap-2 font-raleway transform transition-transform"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
              <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </nav>
          <div className="mt-8">
            <Button className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:opacity-90 transition-all duration-300 hover:scale-105 font-raleway text-lg py-6">
              Join Waitlist
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
