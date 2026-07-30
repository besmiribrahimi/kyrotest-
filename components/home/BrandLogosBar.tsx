"use client";

import Image from "next/image";
import carLogos from "@/lib/car-logos.json";
import { useLanguage } from "@/lib/i18n";

interface BrandLogosBarProps {
  selectedBrand?: string;
  onSelectBrand?: (brand: string) => void;
}

export default function BrandLogosBar({ selectedBrand, onSelectBrand }: BrandLogosBarProps) {
  const { language, dir } = useLanguage();
  const logoMap = carLogos as Record<string, string>;

  const featuredBrands = [
    { name: "Hyundai", key: "hyundai" },
    { name: "Kia", key: "kia" },
    { name: "Genesis", key: "genesis" },
    { name: "Mercedes-Benz", key: "mercedesbenz" },
    { name: "BMW", key: "bmw" },
    { name: "Audi", key: "audi" },
    { name: "Porsche", key: "porsche" },
    { name: "Lexus", logoKey: "lexus", key: "lexus" },
    { name: "Land Rover", key: "landrover" },
    { name: "Volkswagen", key: "volkswagen" },
    { name: "Volvo", key: "volvo" },
    { name: "Chevrolet", key: "chevrolet" },
  ];

  return (
    <div dir={dir} className="w-full py-6 bg-white dark:bg-[#070d19] border-y border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white transition">
            {language === "ar" ? "تصفح حسب شعار الشركة المصنعة" : "Browse Vehicles by Manufacturer"}
          </span>
          <span className="text-[11px] font-mono text-slate-400">filippofilip95 / car-logos-dataset</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {featuredBrands.map((b) => {
            const logoUrl = logoMap[b.key];
            const isSelected = selectedBrand?.toLowerCase() === b.name.toLowerCase();

            return (
              <button
                key={b.name}
                onClick={() => {
                  if (onSelectBrand) {
                    onSelectBrand(isSelected ? "All" : b.name);
                  }
                  const inventorySec = document.getElementById("inventory-section");
                  if (inventorySec) {
                    inventorySec.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? "bg-slate-900 dark:bg-[#0066ff] border-slate-900 dark:border-[#0066ff] text-white shadow-md scale-105"
                    : "bg-slate-50 dark:bg-[#0b1528] border-slate-200 dark:border-white/5 text-slate-800 dark:text-white hover:border-[#0066ff]/40 hover:bg-white dark:hover:bg-[#0f1d3a] hover:scale-105 hover:-translate-y-0.5"
                }`}
              >
                <div className="relative h-9 w-9 mb-1.5 flex items-center justify-center">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={`${b.name} Official Logo`}
                      fill
                      className="object-contain filter group-hover:brightness-110 transition"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xs font-bold font-mono">{b.name.slice(0, 2)}</span>
                  )}
                </div>

                <span className="text-[10px] font-extrabold truncate max-w-full tracking-tight">
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
