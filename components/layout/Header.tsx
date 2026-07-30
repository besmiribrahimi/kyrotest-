"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Globe, Menu, X, PhoneCall, Sun, Moon } from "lucide-react";

export default function Header() {
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/inventory", label: t.nav.inventory },
    { href: "/about", label: language === "ar" ? "من نحن" : "About Us" },
    { href: "/shipping-calculator", label: t.nav.shippingCalculator },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header
      dir={dir}
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#020a18]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-md dark:shadow-lg py-3.5"
          : "bg-white dark:bg-[#020a18] border-b border-slate-100 dark:border-white/5 py-4.5"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
        
        {/* Logo and Brand Title */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0066ff] font-black text-white text-base tracking-tighter shadow-md shadow-[#0066ff]/20 transition-transform duration-300 group-hover:scale-105">
            AK
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase font-sans">
              ADVANCED KORYO
            </span>
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              {language === "ar" ? "تصدير السيارات الكورية" : "Automotive Export"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/95 transition-colors hover:text-[#0066ff] dark:hover:text-sky-400 py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0066ff] dark:bg-sky-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Action Widgets: Theme, Language & Contact */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-all shadow-sm"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-slate-700" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-2 rounded-full bg-slate-50 dark:bg-slate-900/60 px-4 py-2 text-xs font-bold text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-all shadow-sm"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-slate-600 dark:text-white" />
            <span>{language === "en" ? "العربية" : "English"}</span>
          </button>

          {/* Primary Phone WhatsApp CTA */}
          <a
            href="https://wa.me/821072290580"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#000000] dark:bg-white text-white dark:text-[#020a18] px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition hover:bg-[#0066ff] dark:hover:bg-[#0066ff] dark:hover:text-white shadow-sm md:flex"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>{t.nav.getQuote}</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 lg:hidden shadow-sm"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white dark:bg-[#020a18] border-b border-slate-200 dark:border-white/10 lg:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6" dir={dir}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white hover:text-[#0066ff] dark:hover:text-sky-400 transition"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/821072290580"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-[#020a18] py-3 text-xs font-bold uppercase tracking-wider transition hover:bg-[#0066ff] dark:hover:bg-[#0066ff] dark:hover:text-white"
              >
                <PhoneCall className="h-4 w-4" />
                <span>{t.nav.getQuote}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
