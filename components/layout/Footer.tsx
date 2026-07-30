"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { MapPin, Mail, Phone, Globe, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/seo";

export default function Footer() {
  const { t, dir, language } = useLanguage();

  return (
    <footer id="contact-section" dir={dir} className="relative bg-slate-50 dark:bg-[#020a18] border-t border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-colors duration-300">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Logo & Social Links */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-white border border-slate-200/60 dark:border-white/10 shadow-md transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Advanced Koryo Logo"
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <span className="text-xl font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase font-sans">
                ADVANCED KORYO
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium font-sans">
              {t.footer.tagline}
            </p>
            
            {/* Social Redirect Icons */}
            <div className="flex items-center gap-3.5 pt-1">
              <a href="https://www.facebook.com/share/18jPAK8aH2/" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/5 hover:border-[#0066ff] hover:bg-[#0066ff] hover:text-white text-slate-600 dark:text-slate-400 flex items-center justify-center transition shadow-sm" title="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/advancedkoryo" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/5 hover:border-[#0066ff] hover:bg-[#0066ff] hover:text-white text-slate-600 dark:text-slate-400 flex items-center justify-center transition shadow-sm" title="Instagram">
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@advancedk_ayman" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/5 hover:border-[#0066ff] hover:bg-[#0066ff] hover:text-white text-slate-600 dark:text-slate-400 flex items-center justify-center transition shadow-sm" title="TikTok">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.92-1.88 2.63-5.3 3.61-8.21 2.72-2.9-.89-4.99-3.78-4.94-6.85.06-3.14 2.25-5.9 5.31-6.61.98-.23 2-.22 2.98-.03V10.1c-1.39-.42-2.9-.17-4 .77-1.12.95-1.54 2.58-1.1 4 1 3.23 5.48 4.24 7.6 1.83.94-1.07 1.27-2.52 1.23-3.93-.04-4.83-.02-9.66-.02-14.49z"/>
                </svg>
              </a>
              <span className="h-8 w-8 rounded-lg bg-slate-200/20 dark:bg-slate-950/40 text-slate-400 dark:text-slate-700 flex items-center justify-center cursor-not-allowed border border-dashed border-slate-300 dark:border-white/5" title="LinkedIn (Coming Soon)">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-800 dark:text-white">
              <ShieldCheck className="h-4 w-4 text-[#0066ff] shrink-0" />
              <span className="font-bold">{language === "ar" ? "فحص وتصدير كوري معتمد 100%" : "100% Certified Korean Auto Export"}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white font-sans">
              {language === "ar" ? "روابط السريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600 dark:text-slate-450">
              <li>
                <Link href="/" className="transition hover:text-[#0066ff] dark:hover:text-sky-400">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="#inventory-section" className="transition hover:text-[#0066ff] dark:hover:text-sky-400">
                  {t.nav.inventory}
                </Link>
              </li>
              <li>
                <Link href="#shipping-calculator" className="transition hover:text-[#0066ff] dark:hover:text-sky-400">
                  {t.nav.shippingCalculator}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Ports */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white font-sans">
              {language === "ar" ? "موانئ الوصول الشائعة" : "Popular Destination Ports"}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-1.5 font-sans">
                <span>🇸🇦 Jeddah & Dammam</span>
                <span className="text-[10px] font-mono text-slate-900 dark:text-white font-bold">Saudi Arabia</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-1.5 font-sans">
                <span>🇦🇪 Jebel Ali Port</span>
                <span className="text-[10px] font-mono text-slate-900 dark:text-white font-bold">UAE</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-1.5 font-sans">
                <span>🇯🇴 Aqaba Port</span>
                <span className="text-[10px] font-mono text-slate-900 dark:text-white font-bold">Jordan</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-1.5 font-sans">
                <span>🇶🇦 Hamad Port</span>
                <span className="text-[10px] font-mono text-slate-900 dark:text-white font-bold">Qatar</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-1.5 font-sans">
                <span>🇰🇼 Shuwaikh Port</span>
                <span className="text-[10px] font-mono text-slate-900 dark:text-white font-bold">Kuwait</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white font-sans">
              {language === "ar" ? "المقر والخدمة" : "Contact & Support"}
            </h4>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#0066ff] dark:text-sky-400 shrink-0 mt-0.5" />
                <span className="font-sans text-slate-800 dark:text-slate-300">{t.contact.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#0066ff] dark:text-sky-400 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[#0066ff] dark:hover:text-sky-400 transition font-mono text-slate-800 dark:text-slate-300">
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#0066ff] dark:text-sky-400 shrink-0" />
                <a href={`https://wa.me/821072290580`} target="_blank" rel="noopener noreferrer" className="hover:text-[#0066ff] dark:hover:text-sky-400 transition font-mono text-slate-800 dark:text-slate-300">
                  {siteConfig.phone} (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-[#0066ff] dark:text-sky-400 shrink-0" />
                <span className="font-mono text-slate-800 dark:text-slate-300">mykoryo.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-6 text-xs text-slate-500 font-medium sm:flex-row font-sans">
          <p>© {new Date().getFullYear()} ADVANCED KORYO Automotive Export ({siteConfig.domain}). {t.footer.rights} <span className="text-[9px] opacity-70 ml-2 font-mono">by <a href="https://rinevolabs.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0066ff] transition">Rinevolabs.com</a></span></p>
          <div className="font-mono text-xs text-slate-500 font-bold">
            mykoryo.com
          </div>
        </div>
      </div>
    </footer>
  );
}
