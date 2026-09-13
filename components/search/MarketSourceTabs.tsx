"use client";

import { useLanguage } from "@/lib/i18n";
import { Layers } from "lucide-react";

export interface MarketSource {
  id: string; // "all" | "encar" | "kbchachacha" | "kcar"
  nameEn: string;
  nameAr: string;
  subEn: string;
  subAr: string;
  badgeEn: string;
  badgeAr: string;
  accentColor: string;
  hoverBorder: string;
  bgActive: string;
  tagColor: string;
}

export const MARKET_SOURCES: MarketSource[] = [
  {
    id: "all",
    nameEn: "All Korean Markets",
    nameAr: "جميع الأسواق الكورية",
    subEn: "300,000+ Live Cars",
    subAr: "أكثر من 300,000 سيارة",
    badgeEn: "Unified Feed",
    badgeAr: "تغذية موحدة",
    accentColor: "from-blue-600 to-indigo-600",
    hoverBorder: "hover:border-blue-500/40",
    bgActive: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25",
    tagColor: "bg-blue-500/10 text-blue-600 dark:text-sky-400 border-blue-500/20",
  },
  {
    id: "encar",
    nameEn: "Encar (엔카)",
    nameAr: "إنكار (Encar)",
    subEn: "Korea's #1 Certified Market",
    subAr: "السوق الكوري المعتمد #1",
    badgeEn: "Diagnosis 150-Pt",
    badgeAr: "فحص 150 نقطة",
    accentColor: "from-red-600 to-rose-600",
    hoverBorder: "hover:border-red-500/40",
    bgActive: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25",
    tagColor: "bg-red-500/10 text-red-600 dark:text-rose-400 border-red-500/20",
  },
  {
    id: "kbchachacha",
    nameEn: "KB ChaChaCha (KB차차차)",
    nameAr: "كي بي تشاتشاتشا (KB)",
    subEn: "KB Financial Group Direct",
    subAr: "مجموعة KB المالية المباشرة",
    badgeEn: "Verified Mileage",
    badgeAr: "ممشى معتمد",
    accentColor: "from-amber-500 to-yellow-500",
    hoverBorder: "hover:border-amber-500/40",
    bgActive: "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/25",
    tagColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: "kcar",
    nameEn: "K-Car (케이카)",
    nameAr: "كي-كار (K-Car)",
    subEn: "100% Owned Inspected Fleet",
    subAr: "أسطول مملوك ومفحوص 100%",
    badgeEn: "Zero Middleman",
    badgeAr: "بدون وسطاء",
    accentColor: "from-sky-500 to-cyan-600",
    hoverBorder: "hover:border-sky-500/40",
    bgActive: "bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/25",
    tagColor: "bg-sky-500/10 text-sky-600 dark:text-cyan-400 border-sky-500/20",
  },
];

interface MarketSourceTabsProps {
  selectedSource: string;
  onSelectSource: (sourceId: string) => void;
  className?: string;
  compact?: boolean;
}

export default function MarketSourceTabs({
  selectedSource,
  onSelectSource,
  className = "",
  compact = false,
}: MarketSourceTabsProps) {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";

  return (
    <div dir={dir} className={`w-full ${className}`}>
      {/* Label & Live Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white font-sans flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
            {isAr ? "مصدر المركبات (الأسواق الكورية المعتمدة)" : "Vehicle Source / Certified Korean Market"}
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          {isAr ? "بحث متزامن فوري ومباشر" : "Direct Live Multi-Source Search"}
        </span>
      </div>

      {/* Tabs Container */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-[#070e1b] border border-slate-200/80 dark:border-white/10 ${compact ? "p-1" : ""}`}>
        {MARKET_SOURCES.map((source) => {
          const isActive = (selectedSource || "all") === source.id;

          return (
            <button
              key={source.id}
              onClick={() => onSelectSource(source.id)}
              className={`relative flex flex-col items-start justify-between p-3 rounded-xl transition-all duration-300 text-left border cursor-pointer ${
                isActive
                  ? `${source.bgActive} border-transparent scale-[1.01]`
                  : `bg-white/80 dark:bg-[#0b1528]/80 text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-white/5 ${source.hoverBorder} hover:bg-white dark:hover:bg-[#0f1b33]`
              }`}
            >
              {/* Top Row: Name + Badge */}
              <div className="w-full flex items-center justify-between gap-1.5">
                <span className={`text-xs sm:text-sm font-extrabold truncate ${isActive ? "text-white font-black" : "text-slate-900 dark:text-white"}`}>
                  {isAr ? source.nameAr : source.nameEn}
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : source.tagColor
                  }`}
                >
                  {isAr ? source.badgeAr : source.badgeEn}
                </span>
              </div>

              {/* Subtitle description */}
              <div className={`text-[10px] sm:text-[11px] font-medium mt-1 truncate w-full ${isActive ? "text-white/85" : "text-slate-500 dark:text-slate-400"}`}>
                {isAr ? source.subAr : source.subEn}
              </div>

              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/60 blur-[1px]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
