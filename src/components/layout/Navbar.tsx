"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Skills", href: "/skills" },
  { name: "Research", href: "/research" },
  { name: "Blog", href: "/blog" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-16 md:h-[72px] items-center transition-all duration-300",
        isScrolled || isMobileMenuOpen
          ? "bg-bg-elevated/80 backdrop-blur-xl shadow-level-2 border-b border-border-card"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-5 md:px-20 flex items-center justify-between h-full">
        <Link 
          href="/" 
          className="text-xl font-display font-semibold tracking-tight z-50 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Signal<span className="text-electric-blue-500">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-md"
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-electric-blue-500 rounded-t-full"
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/contact"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-md"
          >
            Contact
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium bg-electric-blue-500 text-white rounded-xl hover:bg-electric-blue-400 hover:-translate-y-px hover:shadow-level-3 transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          >
            Resume
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4 z-50">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-text-secondary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-md"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[64px] z-40 bg-bg-base/95 backdrop-blur-xl md:hidden flex flex-col p-6 border-t border-border-card overflow-y-auto">
          <nav className="flex flex-col gap-4 pb-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-xl font-medium py-3 border-b border-border-card/50 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm",
                  pathname === link.href ? "text-electric-blue-500" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-medium py-3 border-b border-border-card/50 text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-sm"
            >
              Contact
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 px-6 py-4 text-center font-medium bg-electric-blue-500 text-white rounded-xl hover:bg-electric-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              Download Resume
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
