"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import {
  ShieldCheck,
  Fuel,
  Gauge,
  Calendar,
  PhoneCall,
  Sparkles,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import MarketSourceTabs from "@/components/search/MarketSourceTabs";

interface RealCarItem {
  id: string;
  title: string;
  brand: string;
  model: string;
  source?: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  image: string;
  prices?: {
    USD?: number;
    EUR?: number;
    KRW?: number;
  };
}

export default function MyKoryoInventory() {
  const { t, language, dir } = useLanguage();
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedMake, setSelectedMake] = useState<string>("All");
  const [realCars, setRealCars] = useState<RealCarItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchFilters, setSearchFilters] = useState<any>(null);
  const [countryCode, setCountryCode] = useState<string>("SA");

  const currencyMap: Record<string, { symbol: string, rate: number }> = {
    SA: { symbol: "SAR", rate: 3.75 },
    AE: { symbol: "AED", rate: 3.67 },
    QA: { symbol: "QAR", rate: 3.64 },
    KW: { symbol: "KWD", rate: 0.31 },
    DE: { symbol: "EUR", rate: 0.92 },
    NL: { symbol: "EUR", rate: 0.92 },
  };

  const makesList = ["All", "Hyundai", "Kia", "Genesis", "Audi", "BMW", "Mercedes-Benz"];

  // Fetch cars from API (fetching up to 48 cars to allow solid multi-source client filtering)
  useEffect(() => {
    async function loadRealCars() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", "48");
        if (selectedMake !== "All") params.set("brand", selectedMake);
        if (selectedSource && selectedSource !== "all") params.set("source", selectedSource);

        const res = await fetch(`/api/cars?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.cars) {
            setRealCars(json.data.cars);
          } else if (Array.isArray(json.cars)) {
            setRealCars(json.cars);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live vehicles:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRealCars();
  }, [selectedMake, selectedSource]);

  // Sync brand and search filters on mount, listen to events
  useEffect(() => {
    // Check for saved wizard make
    const savedWizardMake = localStorage.getItem("kyro_wizard_make");
    if (savedWizardMake) {
      setSelectedMake(savedWizardMake);
    }

    // Check for saved search source
    const savedSource = localStorage.getItem("kyro_search_source") || "all";
    if (savedSource) {
      setSelectedSource(savedSource);
    }

    // Check for saved search filters
    const savedSearchBrand = localStorage.getItem("kyro_search_brand") || "";
    if (savedSearchBrand) {
      setSelectedMake(savedSearchBrand);
    }

    // Check for saved country
    const savedCountry = localStorage.getItem("kyro_calculator_country");
    if (savedCountry) {
      setCountryCode(savedCountry);
    }
    
    const loadSavedFilters = () => {
      const brand = localStorage.getItem("kyro_search_brand") || "";
      const model = localStorage.getItem("kyro_search_model") || "";
      const bodyType = localStorage.getItem("kyro_search_bodyType") || "";
      const yearFrom = localStorage.getItem("kyro_search_yearFrom") || "";
      const yearTo = localStorage.getItem("kyro_search_yearTo") || "";
      const maxMileage = localStorage.getItem("kyro_search_maxMileage") || "";
      const minPrice = localStorage.getItem("kyro_search_minPrice") || "";
      const maxPrice = localStorage.getItem("kyro_search_maxPrice") || "";
      const fuelType = localStorage.getItem("kyro_search_fuelType") || "";
      const drivetrain = localStorage.getItem("kyro_search_drivetrain") || "";
      
      if (brand || model || bodyType || yearFrom || yearTo || maxMileage || minPrice || maxPrice || fuelType || drivetrain) {
        setSearchFilters({
          brand,
          model,
          bodyType,
          yearFrom,
          yearTo,
          maxMileage,
          minPrice,
          maxPrice,
          fuelType,
          drivetrain
        });
      } else {
        setSearchFilters(null);
      }
    };
    
    loadSavedFilters();

    // Listen to custom source select events
    const handleSourceSelect = (e: Event) => {
      const src = (e as CustomEvent).detail;
      if (src) {
        setSelectedSource(src);
      }
    };

    // Listen to custom search events
    const handleSearchApply = (e: Event) => {
      const filters = (e as CustomEvent).detail;
      setSearchFilters(filters);
      if (filters.source) {
        setSelectedSource(filters.source);
      }
      if (filters.brand) {
        setSelectedMake(filters.brand);
      } else {
        setSelectedMake("All");
      }
    };

    const handleSearchClear = () => {
      setSearchFilters(null);
      setSelectedMake("All");
      setSelectedSource("all");
    };

    const handleWizardComplete = (e: Event) => {
      const { make } = (e as CustomEvent).detail;
      if (make) {
        setSelectedMake(make);
      }
    };

    const handleWizardMakeUpdate = (e: Event) => {
      setSelectedMake((e as CustomEvent).detail);
    };

    const handleCalculatorCountryUpdate = (e: Event) => {
      const code = (e as CustomEvent).detail;
      if (code) {
        setCountryCode(code);
      }
    };

    window.addEventListener("kyro-source-select", handleSourceSelect);
    window.addEventListener("kyro-search-apply", handleSearchApply);
    window.addEventListener("kyro-search-clear", handleSearchClear);
    window.addEventListener("kyro-wizard-complete", handleWizardComplete);
    window.addEventListener("kyro-wizard-update-make", handleWizardMakeUpdate);
    window.addEventListener("kyro-calculator-country-update", handleCalculatorCountryUpdate);

    return () => {
      window.removeEventListener("kyro-source-select", handleSourceSelect);
      window.removeEventListener("kyro-search-apply", handleSearchApply);
      window.removeEventListener("kyro-search-clear", handleSearchClear);
      window.removeEventListener("kyro-wizard-complete", handleWizardComplete);
      window.removeEventListener("kyro-wizard-update-make", handleWizardMakeUpdate);
      window.removeEventListener("kyro-calculator-country-update", handleCalculatorCountryUpdate);
    };
  }, []);

  const handleSelectMake = (make: string) => {
    setSelectedMake(make);
    localStorage.setItem("kyro_wizard_make", make === "All" ? "" : make);
    localStorage.setItem("kyro_search_brand", make === "All" ? "" : make);
    
    // Update active search filters
    if (searchFilters) {
      if (make === "All") {
        setSearchFilters(null);
        // Clear all search filters from storage too
        localStorage.removeItem("kyro_search_brand");
        localStorage.removeItem("kyro_search_model");
        localStorage.removeItem("kyro_search_bodyType");
        localStorage.removeItem("kyro_search_maxPrice");
      } else {
        setSearchFilters({ ...searchFilters, brand: make, model: "" });
        localStorage.setItem("kyro_search_brand", make);
        localStorage.removeItem("kyro_search_model");
      }
    }
  };

  // Client-side filtering logic
  const filteredCars = realCars.filter((car) => {
    // 0. Filter by Selected Market Source
    if (selectedSource && selectedSource !== "all") {
      const carSource = (car.source || "encar").toLowerCase();
      if (carSource !== selectedSource.toLowerCase()) {
        return false;
      }
    }

    // 1. Filter by Selected Make Button (if it's not All)
    if (selectedMake !== "All" && car.brand?.toLowerCase() !== selectedMake.toLowerCase() && !car.title?.toLowerCase().includes(selectedMake.toLowerCase())) {
      return false;
    }

    if (!searchFilters) return true;

    // 2. Filter by Model
    if (searchFilters.model && car.model && !car.model.toLowerCase().includes(searchFilters.model.toLowerCase()) && !car.title.toLowerCase().includes(searchFilters.model.toLowerCase())) {
      return false;
    }

    // 3. Filter by Body Type (approximate matching based on model names and fuel type)
    if (searchFilters.bodyType) {
      const type = searchFilters.bodyType.toLowerCase();
      const title = car.title.toLowerCase();
      const model = (car.model || "").toLowerCase();
      const fuel = (car.fuelType || "").toLowerCase();

      if (type.includes("suv") || type.includes("رباعي")) {
        const isSuv = title.includes("palisade") || title.includes("sorento") || title.includes("sportage") || 
                      title.includes("santa fe") || title.includes("tucson") || title.includes("cayenne") || 
                      title.includes("macan") || title.includes("gv70") || title.includes("gv80") || 
                      title.includes("kona") || title.includes("seltos") || title.includes("mohave") ||
                      title.includes("creta") || title.includes("terracan") || title.includes("rangerover") ||
                      model.includes("palisade") || model.includes("sorento") || model.includes("gv80") || model.includes("gv70") ||
                      model.includes("cayenne") || model.includes("sportage") || model.includes("tucson") || model.includes("santa");
        if (!isSuv) return false;
      } else if (type.includes("ev") || type.includes("hybrid") || type.includes("كهرب") || type.includes("هجين")) {
        const isEv = fuel.includes("electric") || fuel.includes("hybrid") || title.includes("ev6") || 
                     title.includes("ioniq") || title.includes("tesla") || title.includes("hybrid") || 
                     title.includes("⚡") || model.includes("ev6") || model.includes("ioniq");
        if (!isEv) return false;
      } else if (type.includes("truck") || type.includes("commercial") || type.includes("شاحن")) {
        const isTruck = title.includes("truck") || title.includes("bongo") || title.includes("porter") || 
                        title.includes("commercial") || title.includes("van") || title.includes("pickup") ||
                        model.includes("bongo") || model.includes("porter");
        if (!isTruck) return false;
      } else if (type.includes("sedan") || type.includes("سيدان")) {
        const isSedan = title.includes("g80") || title.includes("g70") || title.includes("g90") || 
                        title.includes("sonata") || title.includes("elantra") || title.includes("grandeur") || 
                        title.includes("avante") || title.includes("k5") || title.includes("k7") || 
                        title.includes("k8") || title.includes("stinger") || title.includes("e-class") || 
                        title.includes("c-class") || title.includes("s-class") || title.includes("3 series") || 
                        title.includes("5 series") || title.includes("7 series") || title.includes("panamera") ||
                        model.includes("g80") || model.includes("g70") || model.includes("sonata") || model.includes("elantra") ||
                        model.includes("k5") || model.includes("grandeur") || model.includes("avante") || model.includes("e-class");
        if (!isSedan) return false;
      }
    }

    // 4. Filter by Price
    const priceUsd = car.prices?.USD ? Math.round(car.prices.USD) : typeof car.price === 'number' ? Math.round(car.price / 1350) : 24000;
    if (searchFilters.minPrice) {
      const minVal = Number(searchFilters.minPrice);
      if (!isNaN(minVal) && priceUsd < minVal) return false;
    }
    if (searchFilters.maxPrice) {
      const maxVal = Number(searchFilters.maxPrice);
      if (!isNaN(maxVal) && priceUsd > maxVal) return false;
    }

    // 5. Filter by Mileage
    if (searchFilters.maxMileage) {
      const maxMil = Number(searchFilters.maxMileage);
      if (!isNaN(maxMil) && car.mileage > maxMil) return false;
    }

    // 6. Filter by Production Year
    if (searchFilters.yearFrom) {
      const yrFrom = Number(searchFilters.yearFrom);
      if (!isNaN(yrFrom) && car.year < yrFrom) return false;
    }
    if (searchFilters.yearTo) {
      const yrTo = Number(searchFilters.yearTo);
      if (!isNaN(yrTo) && car.year > yrTo) return false;
    }

    // 7. Filter by Fuel Type
    if (searchFilters.fuelType && car.fuelType && car.fuelType.toLowerCase() !== searchFilters.fuelType.toLowerCase()) {
      return false;
    }

    // 8. Filter by Drivetrain (AWD, FWD, RWD)
    if (searchFilters.drivetrain && car.title && !car.title.toLowerCase().includes(searchFilters.drivetrain.toLowerCase())) {
      const titleLower = car.title.toLowerCase();
      const drive = searchFilters.drivetrain.toLowerCase();
      if (drive === "awd" && !titleLower.includes("awd") && !titleLower.includes("4wd") && !titleLower.includes("htrac")) {
        return false;
      }
    }

    return true;
  });

  return (
    <section id="inventory-section" dir={dir} className="relative py-20 bg-slate-50 dark:bg-[#020a18] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        
        {/* Top Multi-Market Source Selector */}
        <div className="mb-10">
          <MarketSourceTabs
            selectedSource={selectedSource}
            onSelectSource={(src) => {
              setSelectedSource(src);
              localStorage.setItem("kyro_search_source", src);
              window.dispatchEvent(new CustomEvent("kyro-source-select", { detail: src }));
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 dark:bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white dark:text-slate-950 mb-3 transition shadow-sm">
              <Sparkles className="h-4 w-4 text-sky-400 dark:text-[#0066ff]" />
              <span>Live Korea Sourcing Feed</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white transition">
              {t.inventory.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium transition">
              {t.inventory.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {makesList.map((m) => (
              <button
                key={m}
                onClick={() => handleSelectMake(m)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedMake === m
                    ? "bg-slate-900 dark:bg-[#0066ff] text-white font-extrabold border border-slate-900 dark:border-[#0066ff]"
                    : "bg-white dark:bg-[#0b1528] border border-slate-300 dark:border-white/5 text-slate-800 dark:text-white hover:border-[#0066ff]/40 dark:hover:border-sky-400 shadow-sm"
                }`}
              >
                {m === "All" ? t.inventory.allBrands : m}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {searchFilters && (
          <div className="mb-10 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-white/10 pt-4 transition-colors">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              {language === "ar" ? "الفلاتر النشطة:" : "Active Filters:"}
            </span>
            {searchFilters.model && (
              <span className="bg-[#0066ff]/10 dark:bg-sky-400/10 text-[#0066ff] dark:text-sky-300 border border-[#0066ff]/20 text-[10px] font-bold px-2.5 py-1 rounded-md">
                Trim: {searchFilters.model}
              </span>
            )}
            {searchFilters.bodyType && (
              <span className="bg-[#0066ff]/10 dark:bg-sky-400/10 text-[#0066ff] dark:text-sky-300 border border-[#0066ff]/20 text-[10px] font-bold px-2.5 py-1 rounded-md">
                Body: {searchFilters.bodyType}
              </span>
            )}
            {(searchFilters.minPrice || searchFilters.maxPrice) && (
              <span className="bg-[#0066ff]/10 dark:bg-sky-400/10 text-[#0066ff] dark:text-sky-300 border border-[#0066ff]/20 text-[10px] font-bold px-2.5 py-1 rounded-md font-mono">
                Budget: {searchFilters.minPrice ? `$${Number(searchFilters.minPrice).toLocaleString()}` : "$0"} - {searchFilters.maxPrice ? `$${Number(searchFilters.maxPrice).toLocaleString()}` : "Max"}
              </span>
            )}
            {searchFilters.fuelType && (
              <span className="bg-[#0066ff]/10 dark:bg-sky-400/10 text-[#0066ff] dark:text-sky-300 border border-[#0066ff]/20 text-[10px] font-bold px-2.5 py-1 rounded-md">
                Fuel: {searchFilters.fuelType}
              </span>
            )}
            {searchFilters.drivetrain && (
              <span className="bg-[#0066ff]/10 dark:bg-sky-400/10 text-[#0066ff] dark:text-sky-300 border border-[#0066ff]/20 text-[10px] font-bold px-2.5 py-1 rounded-md">
                Drivetrain: {searchFilters.drivetrain}
              </span>
            )}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("kyro-search-clear"));
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-[10px] font-extrabold px-2.5 py-1 rounded-md transition cursor-pointer"
            >
              ✕ {language === "ar" ? "إلغاء الفلترة" : "Clear Filters"}
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-slate-800 dark:text-[#0066ff] animate-spin" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 transition">
              {language === "ar" ? "جاري جلب أحدث السيارات المتاحة من كوريا..." : "Fetching live vehicles directly from South Korea..."}
            </p>
          </div>
        )}

        {/* Real Cars Grid */}
        {!isLoading && filteredCars.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, idx) => {
              const priceUsd = car.prices?.USD ? Math.round(car.prices.USD) : typeof car.price === 'number' ? Math.round(car.price / 1350) : 24000;
              const activeCurrency = currencyMap[countryCode] || currencyMap["SA"];
              const priceLocal = Math.round(priceUsd * activeCurrency.rate);

              return (
                <motion.div
                  key={car.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="koryo-card-white rounded-3xl overflow-hidden flex flex-col justify-between koryo-card-white-hover"
                >
                  <div>
                    <Link href={`/vehicle/${car.id}`} className="block relative aspect-[16/10] bg-slate-100 dark:bg-[#070d19] overflow-hidden border-b border-slate-200 dark:border-white/5 group transition">
                      <Image
                        src={car.image || "/images/genesis_g80_export.png"}
                        alt={car.title || "Korean Export Vehicle"}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 dark:from-[#000000]/80 via-transparent to-transparent opacity-85" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        {car.source === "kbchachacha" ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-950 bg-amber-400 px-2.5 py-1 rounded-md border border-amber-300 shadow-sm">
                            <span>🏷️ KB ChaChaCha</span>
                          </span>
                        ) : car.source === "kcar" ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white bg-sky-600 px-2.5 py-1 rounded-md border border-sky-400 shadow-sm">
                            <span>🛡️ K-Car Direct</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white bg-red-600 px-2.5 py-1 rounded-md border border-red-500 shadow-sm">
                            <span>🇰🇷 Encar Certified</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-white bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-md border border-white/10">
                          <ShieldCheck className="h-3 w-3 text-emerald-400" />
                          <span>150-Pt Inspected</span>
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="font-mono text-[10px] font-bold text-white bg-slate-950/85 backdrop-blur px-2 py-0.5 rounded border border-white/10">
                          ID: #{car.id.slice(0, 8)}
                        </div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 backdrop-blur px-2 py-0.5 rounded border border-emerald-500/30">
                          {t.inventory.exportReady}
                        </div>
                      </div>
                    </Link>

                    <div className="p-6 space-y-4">
                      <Link href={`/vehicle/${car.id}`} className="block hover:text-[#0066ff] dark:hover:text-sky-400 transition">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 transition font-sans">
                          {car.title}
                        </h3>
                      </Link>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700 dark:text-slate-350 font-semibold bg-slate-100/60 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-200/60 dark:border-white/5 transition">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Calendar className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400 mb-1" />
                          <span>{car.year || 2022}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                          <Gauge className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400 mb-1" />
                          <span>{car.mileage?.toLocaleString() || 0} km</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                          <Fuel className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400 mb-1" />
                          <span className="capitalize">{car.fuelType || "Gasoline"}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between border-t border-slate-200 dark:border-white/10 pt-4 transition-colors">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">FOB Price (Korea)</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono transition">
                            ${priceUsd.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">USD</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Est. {activeCurrency.symbol}</div>
                          <div className="text-sm font-extrabold text-white dark:text-slate-900 font-mono bg-slate-950 dark:bg-white px-2.5 py-0.5 rounded border border-white/10 dark:border-transparent transition shadow-sm">
                            ~{priceLocal.toLocaleString()} {activeCurrency.symbol}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex gap-2">
                    <Link
                      href={`/vehicle/${car.id}`}
                      className="w-full flex items-center justify-center gap-2 rounded-xl koryo-btn-black py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition"
                    >
                      <span>{language === "ar" ? "عرض التفاصيل الكاملة" : "View Full Specs"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty Search/Filter State Container */}
        {!isLoading && filteredCars.length === 0 && (
          <div className="text-center py-20 rounded-3xl bg-slate-100/50 dark:bg-slate-950/45 border border-dashed border-slate-300 dark:border-white/10 p-8 space-y-4 transition">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto animate-bounce animate-duration-1000" />
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white transition">
                {language === "ar" ? "لا توجد نتائج مطابقة" : "No Matching Vehicles Found"}
              </h4>
              <p className="text-xs text-slate-555 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed transition">
                {language === "ar" 
                  ? "لم نجد سيارات مطابقة للفلاتر المحددة حالياً. جرب توسيع خيارات البحث أو إعادة ضبط الفلترة."
                  : "We couldn't find any vehicles matching your active filters. Try expanding your search or resetting filters."}
              </p>
            </div>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("kyro-search-clear"));
              }}
              className="px-6 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-bold rounded-xl hover:opacity-90 transition shadow-sm"
            >
              {language === "ar" ? "إعادة ضبط الفلترة" : "Reset Sourcing Filters"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
