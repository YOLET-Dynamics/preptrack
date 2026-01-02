"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-brand-indigo/10 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-12 lg:px-18 py-10 md:py-16">
        <div className="grid gap-10 md:gap-12 grid-cols-2 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo/PrepTrack_LogoDesign_01-01.png"
                alt="PrepTrack"
                width={140}
                height={42}
                className="h-9 md:h-10 w-auto"
                priority
              />
            </Link>
            <p className="text-brand-indigo/60 font-dm-sans max-w-sm text-sm md:text-base">
              Precision learning for radiation therapy professionals. Master complex concepts and ace your exams with confidence.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              <SocialLink href="/coming-soon" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
              <SocialLink href="/coming-soon" icon={<Instagram className="h-4 w-4" />} label="Instagram" />
              <SocialLink href="/coming-soon" icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" />
              <SocialLink href="/coming-soon" icon={<Youtube className="h-4 w-4" />} label="YouTube" />
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-brand-indigo font-inter uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2.5">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#why-preptrack">Why PrepTrack</FooterLink>
              <FooterLink href="/coming-soon">Pricing</FooterLink>
              <FooterLink href="/coming-soon">FAQ</FooterLink>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-brand-indigo font-inter uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2.5">
              <FooterLink href="/coming-soon">About Us</FooterLink>
              <FooterLink href="/coming-soon">Contact</FooterLink>
              <FooterLink href="/coming-soon">Privacy Policy</FooterLink>
              <FooterLink href="/coming-soon">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-brand-indigo/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs md:text-sm text-brand-indigo/50 font-dm-sans">
            &copy; {new Date().getFullYear()} PrepTrack. All rights reserved.
          </p>
          <p className="text-xs md:text-sm text-brand-indigo/50 font-dm-sans">
            Built by <span className="font-medium text-brand-indigo/70">YOLET Labs</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-brand-indigo/60 hover:text-brand-green transition-colors font-dm-sans text-sm"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="w-9 h-9 rounded-full bg-brand-indigo/5 flex items-center justify-center text-brand-indigo/60 hover:bg-brand-green/10 hover:text-brand-green transition-all"
      aria-label={label}
    >
      {icon}
    </Link>
  );
}
