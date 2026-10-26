"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Home, CarFront, Calculator, MessageSquare, PhoneCall } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isAr = language === "ar";

  // On vehicle detail pages, show the vehicle-specific quick inquiry bar instead
  if (pathname.startsWith("/vehicle")) {
    return null;
  }

  const navItems = [
    {
      href: "/",
      label: isAr ? "كتالوج السيارات" : "Catalog",
      icon: CarFront,
      isActive: pathname === "/" || pathname === "/catalog" || pathname.startsWith("/vehicle"),
      badge: "LIVE",
    },
    {
      href: "https://wa.me/821072290580?text=" + encodeURIComponent(
        isAr
          ? "مرحباً أدفانسد كوريو 🇰🇷 أود الاستفسار عن استيراد وشراء سيارة."
          : "Hello Advanced Koryo 🇰🇷 I would like to inquire about purchasing an export vehicle."
      ),
      label: isAr ? "واتساب مباشر" : "WhatsApp",
      icon: MessageSquare,
      isExternal: true,
      isWhatsApp: true,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-[95] md:hidden bg-white/95 dark:bg-[#070e1b]/95 backdrop-blur-lg border-t border-slate-200 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-2 h-16 items-center px-6">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 py-1 text-slate-700 dark:text-slate-300 hover:text-[#25D366] transition group active:scale-95"
              >
                <div className="relative flex items-center justify-center h-7 w-7 rounded-full bg-[#25D366] text-white shadow-sm shadow-emerald-500/30">
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <PhoneCall className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-bold text-[#25D366] leading-none">
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 transition group active:scale-95 relative ${
                item.isActive
                  ? "text-[#0066ff] dark:text-sky-400 font-extrabold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${item.isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 bg-red-600 text-white text-[8px] font-black px-1 py-0.2 rounded-full leading-tight shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-none">
                {item.label}
              </span>
              {item.isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-[#0066ff] dark:bg-sky-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
