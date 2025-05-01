"use client";
import Link from "next/link";
import { Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto px-8 md:px-24 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-funnel-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                preptrack.app
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-[300px] font-funnel-sans">
              Precision learning for radiation therapy professionals.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white font-funnel-sans">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-funnel-sans"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#why"
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-funnel-sans"
                  >
                    Why PrepTrack
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white font-funnel-sans">
                Help
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/coming-soon"
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-funnel-sans"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/coming-soon"
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-funnel-sans"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="space-y-4">
            <div className="flex space-x-8">
              <Link
                href="/coming-soon"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="/coming-soon"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="/coming-soon"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
            <p className="text-sm text-gray-400 font-funnel-sans">
              &copy; {new Date().getFullYear()} PrepTrack. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
