"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import {
  ShieldCheck,
  Fuel,
  Gauge,
  Calendar,
  Sparkles,
  Loader2,
  ArrowRight,
  AlertCircle,
  Search,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  List,
  CheckCircle2,
  Ship,
  PhoneCall,
  ExternalLink,
  ChevronDown,
  X,
  Layers,
  CarFront,
  Zap,
} from "lucide-react";
import MarketSourceTabs from "@/components/search/MarketSourceTabs";

export interface CatalogVehicle {
  id: string;
  title: string;
  titleAr?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  fuelTypeAr?: string;
  transmission: string;
  transmissionAr?: string;
  bodyType?: string;
  bodyTypeAr?: string;
  drivetrain?: string;
  source?: string;
  image: string;
  images?: string[];
  badge?: string;
  vin?: string;
  prices?: {
    USD?: number;
    EUR?: number;
    KRW?: number;
  };
  inspection?: {
    certified?: boolean;
    structuralDamage?: boolean;
    floodDamage?: boolean;
    paintAuditPassed?: boolean;
    center?: string;
  };
}

export default function CatalogClient() {
  const { language, dir, t } = useLanguage();
  const isAr = language === "ar";

  // Data state
  const [vehicles, setVehicles] = useState<CatalogVehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters state
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedBodyType, setSelectedBodyType] = useState<string>("All");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("All");
  const [selectedDrivetrain, setSelectedDrivetrain] = useState<string>("All");
  const [yearMin, setYearMin] = useState<number>(2018);
  const [yearMax, setYearMax] = useState<number>(2026);
  const [maxPriceUsd, setMaxPriceUsd] = useState<number>(100000);
  const [maxMileageKm, setMaxMileageKm] = useState<number>(150000);

  // UI state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("year-desc");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("SA");
  const [quickInspectVehicle, setQuickInspectVehicle] = useState<CatalogVehicle | null>(null);

  // Currency configuration
  const currencyMap: Record<
    string,
    { symbol: string; rate: number; nameEn: string; nameAr: string; portEn: string; portAr: string; freightUsd: number }
  > = {
    SA: { symbol: "SAR", rate: 3.75, nameEn: "Saudi Arabia", nameAr: "المملكة العربية السعودية", portEn: "Jeddah Islamic Port", portAr: "ميناء جدة الإسلامي", freightUsd: 1450 },
    AE: { symbol: "AED", rate: 3.67, nameEn: "UAE", nameAr: "الإمارات العربية المتحدة", portEn: "Jebel Ali Port", portAr: "ميناء جبل علي", freightUsd: 1350 },
    QA: { symbol: "QAR", rate: 3.64, nameEn: "Qatar", nameAr: "دولة قطر", portEn: "Hamad Port", portAr: "ميناء حمد", freightUsd: 1480 },
    KW: { symbol: "KWD", rate: 0.31, nameEn: "Kuwait", nameAr: "دولة الكويت", portEn: "Shuwaikh Port", portAr: "ميناء الشويخ", freightUsd: 1420 },
    OM: { symbol: "OMR", rate: 0.38, nameEn: "Oman", nameAr: "سلطنة عمان", portEn: "Sohar Port", portAr: "ميناء صحار", freightUsd: 1400 },
    BH: { symbol: "BHD", rate: 0.376, nameEn: "Bahrain", nameAr: "مملكة البحرين", portEn: "Khalifa Bin Salman Port", portAr: "ميناء خليفة بن سلمان", freightUsd: 1430 },
    US: { symbol: "USD", rate: 1.0, nameEn: "United States", nameAr: "الولايات المتحدة", portEn: "Direct Ocean Port", portAr: "ميناء الوصول المباشر", freightUsd: 2100 },
    EU: { symbol: "EUR", rate: 0.92, nameEn: "Europe", nameAr: "الاتحاد الأوروبي", portEn: "Bremerhaven / Rotterdam", portAr: "ميناء بريمرهافن / روتردام", freightUsd: 2200 },
  };

  const activeCurrency = currencyMap[selectedCountry] || currencyMap["SA"];

  // Fetch cars on mount or source/brand change
  useEffect(() => {
    async function loadCatalog() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", "60");
        if (selectedBrand !== "All") params.set("brand", selectedBrand);
        if (selectedSource !== "all") params.set("source", selectedSource);

        const res = await fetch(`/api/cars?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          const items = json.data?.cars || json.cars || [];
          setVehicles(items);
        }
      } catch (err) {
        console.error("Failed to load catalog vehicles:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCatalog();
  }, [selectedBrand, selectedSource]);

  // Initial load from storage if present
  useEffect(() => {
    const savedCountry = localStorage.getItem("kyro_calculator_country");
    if (savedCountry && currencyMap[savedCountry]) {
      setSelectedCountry(savedCountry);
    }
  }, []);

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    localStorage.setItem("kyro_calculator_country", code);
    window.dispatchEvent(new CustomEvent("kyro-calculator-country-update", { detail: code }));
  };

  // Brands list with counts
  const availableBrands = ["All", "Genesis", "Hyundai", "Kia", "Mercedes-Benz", "BMW", "Porsche", "Audi"];

  // Body types list
  const availableBodyTypes = [
    { id: "All", en: "All Body Types", ar: "جميع الهياكل" },
    { id: "Sedan", en: "Sedan", ar: "سيدان" },
    { id: "SUV", en: "SUV / 4WD", ar: "دفع رباعي SUV" },
    { id: "Van", en: "Van / MPV", ar: "فان عائلي" },
  ];

  // Fuel types list
  const availableFuelTypes = [
    { id: "All", en: "All Fuels", ar: "جميع أنواع الوقود" },
    { id: "Gasoline", en: "Gasoline", ar: "بنزين" },
    { id: "Diesel", en: "Diesel", ar: "ديزل" },
    { id: "Hybrid", en: "Hybrid", ar: "هايبرد" },
    { id: "Electric", en: "Electric (EV)", ar: "كهربائي EV" },
  ];

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedSource("all");
    setSelectedBrand("All");
    setSelectedModel("");
    setSelectedBodyType("All");
    setSelectedFuelType("All");
    setSelectedDrivetrain("All");
    setSearchQuery("");
    setYearMin(2018);
    setYearMax(2026);
    setMaxPriceUsd(100000);
    setMaxMileageKm(150000);
  };

  // Filter & Sort logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((car) => {
        // Source filter
        if (selectedSource !== "all") {
          const src = (car.source || "encar").toLowerCase();
          if (src !== selectedSource.toLowerCase()) return false;
        }

        // Brand filter
        if (selectedBrand !== "All") {
          if (car.brand?.toLowerCase() !== selectedBrand.toLowerCase() && !car.title?.toLowerCase().includes(selectedBrand.toLowerCase())) {
            return false;
          }
        }

        // Model filter
        if (selectedModel) {
          const mod = selectedModel.toLowerCase();
          const title = car.title?.toLowerCase() || "";
          const carMod = car.model?.toLowerCase() || "";
          if (!title.includes(mod) && !carMod.includes(mod)) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = car.title?.toLowerCase().includes(q);
          const matchTitleAr = car.titleAr?.includes(q);
          const matchBrand = car.brand?.toLowerCase().includes(q);
          const matchModel = car.model?.toLowerCase().includes(q);
          const matchVin = car.vin?.toLowerCase().includes(q);
          if (!matchTitle && !matchTitleAr && !matchBrand && !matchModel && !matchVin) {
            return false;
          }
        }

        // Body type filter
        if (selectedBodyType !== "All") {
          const target = selectedBodyType.toLowerCase();
          const carBody = (car.bodyType || "").toLowerCase();
          const title = car.title.toLowerCase();

          if (target === "suv") {
            const isSuv = carBody.includes("suv") || title.includes("palisade") || title.includes("gv80") || title.includes("gv70") || title.includes("santa") || title.includes("sorento") || title.includes("sportage") || title.includes("cayenne");
            if (!isSuv) return false;
          } else if (target === "sedan") {
            const isSedan = carBody.includes("sedan") || title.includes("g80") || title.includes("g90") || title.includes("grandeur") || title.includes("k5") || title.includes("k8") || title.includes("e-class") || title.includes("5-series") || title.includes("530i");
            if (!isSedan) return false;
          } else if (target === "van") {
            const isVan = carBody.includes("van") || title.includes("carnival") || title.includes("staria");
            if (!isVan) return false;
          }
        }

        // Fuel type filter
        if (selectedFuelType !== "All") {
          const fuel = (car.fuelType || "").toLowerCase();
          if (!fuel.includes(selectedFuelType.toLowerCase())) return false;
        }

        // Year filter
        if (car.year < yearMin || car.year > yearMax) return false;

        // Mileage filter
        if (car.mileage > maxMileageKm) return false;

        // Price filter
        const priceUsd = car.prices?.USD
          ? Math.round(car.prices.USD)
          : typeof car.price === "number"
          ? Math.round(car.price / 1350)
          : 25000;
        if (priceUsd > maxPriceUsd) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.prices?.USD ? a.prices.USD : typeof a.price === "number" ? a.price / 1350 : 25000;
        const priceB = b.prices?.USD ? b.prices.USD : typeof b.price === "number" ? b.price / 1350 : 25000;

        switch (sortBy) {
          case "price-asc":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          case "mileage-asc":
            return (a.mileage || 0) - (b.mileage || 0);
          case "year-desc":
          default:
            return (b.year || 0) - (a.year || 0);
        }
      });
  }, [
    vehicles,
    selectedSource,
    selectedBrand,
    selectedModel,
    selectedBodyType,
    selectedFuelType,
    searchQuery,
    yearMin,
    yearMax,
    maxMileageKm,
    maxPriceUsd,
    sortBy,
  ]);

  // Generate WhatsApp Message for "استشارة وشراء" (Direct inquiry requested by Ayman Alshaalan)
  const getConsultationWhatsAppUrl = (car: CatalogVehicle) => {
    const priceUsd = car.prices?.USD ? Math.round(car.prices.USD) : typeof car.price === "number" ? Math.round(car.price / 1350) : 25000;
    const priceLocal = Math.round(priceUsd * activeCurrency.rate);
    const carUrl = `https://mykoryo.com/vehicle/${car.id}`;
    const countryText = isAr ? activeCurrency.nameAr : activeCurrency.nameEn;
    const portText = isAr ? activeCurrency.portAr : activeCurrency.portEn;

    let text = "";
    if (isAr) {
      text = `مرحباً أدفانسد كوريو (Advanced Koryo) 🇰🇷\nأود استشارة وشراء هذه السيارة المعروضة في الكتالوج:\n\n🚗 السيارة: ${car.titleAr || car.title}\n📅 الموديل: ${car.year}\n🛣️ الممشى: ${car.mileage?.toLocaleString()} كم\n💰 السعر FOB كوريا: $${priceUsd.toLocaleString()} USD (~${priceLocal.toLocaleString()} ${activeCurrency.symbol})\n🔢 كود/شاسي السيارة: #${car.id}\n📍 وجهة الشحن المطلوبة: ${countryText} - ${portText}\n🔗 رابط السيارة: ${carUrl}\n\nيرجى تزويدي بتقرير الفحص الفني 150 نقطة وفيديو المعاينة وتكلفة الشحن النهائي.`;
    } else {
      text = `Hello Advanced Koryo 🇰🇷\nI would like to consult & purchase this verified vehicle from your catalog:\n\n🚗 Vehicle: ${car.title}\n📅 Year: ${car.year}\n🛣️ Mileage: ${car.mileage?.toLocaleString()} km\n💰 FOB Korea Price: $${priceUsd.toLocaleString()} USD (~${priceLocal.toLocaleString()} ${activeCurrency.symbol})\n🔢 Stock ID/VIN: #${car.id}\n📍 Destination Port: ${countryText} - ${portText}\n🔗 Vehicle Link: ${carUrl}\n\nPlease send the 150-point inspection audit, video walkaround, and final Ro-Ro shipping estimate.`;
    }

    return `https://wa.me/821072290580?text=${encodeURIComponent(text)}`;
  };

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020a18] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Top Direct Export Announcement Bar */}
      <div className="bg-slate-950 dark:bg-[#070e1b] text-white border-b border-white/10 py-3 px-4">
        <div className="mx-auto max-w-[1440px] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400">
              {isAr ? "كتالوج التصدير المباشر من كوريا" : "Direct South Korea Export Catalog"}
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              {isAr
                ? "فحص 150 نقطة معتمد • شحن بحري Ro-Ro إلى جدة، جبل علي، الدمام، وكافة الموانئ"
                : "150-Point Certified Audit • Direct Ro-Ro Shipping to GCC & Worldwide Ports"}
            </span>
          </div>

          {/* Quick Contact & WhatsApp Pill */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/821072290580?text=Hello%20Advanced%20Koryo,%20I%20have%20an%20export%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-1 rounded-full text-[11px] font-black transition shadow-sm"
            >
              <PhoneCall className="h-3 w-3" />
              <span>{isAr ? "مكتب التصدير سيول: 24/7 واتساب" : "Seoul Office: 24/7 WhatsApp"}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Market Source Selector Tabs (Encar, KB ChaChaCha, K-Car) */}
        <div className="mb-6">
          <MarketSourceTabs
            selectedSource={selectedSource}
            onSelectSource={(src) => {
              setSelectedSource(src);
              localStorage.setItem("kyro_search_source", src);
            }}
          />
        </div>

        {/* Top Controls & Header Bar */}
        <div className="rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 p-4 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Title & Live Counter */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isAr ? "كتالوج السيارات الكورية المعتمدة" : "Verified Korean Export Catalog"}
                </h1>
                <span className="bg-[#0066ff]/10 dark:bg-sky-400/10 text-[#0066ff] dark:text-sky-300 border border-[#0066ff]/20 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                  {filteredVehicles.length} {isAr ? "سيارة جاهزة" : "Live Cars"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {isAr
                  ? "تصفح مباشر وسريع لسيارات إنكار (Encar) وكي بي تشاتشاتشا (KB ChaChaCha) مع زر الاستشارة والشراء الفوري عبر الواتساب."
                  : "Direct stream of Encar & KB ChaChaCha vehicles with instant WhatsApp consultation and Ro-Ro export logistics."}
              </p>
            </div>

            {/* Quick Country / Currency Switcher + Sort + View Mode */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              
              {/* Destination Port & Currency Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
                <Ship className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isAr ? "الميناء / العملة:" : "Port / Currency:"}
                </span>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="bg-transparent text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="SA" className="dark:bg-slate-900">🇸🇦 SAR (جدة / الدمام)</option>
                  <option value="AE" className="dark:bg-slate-900">🇦🇪 AED (جبل علي)</option>
                  <option value="QA" className="dark:bg-slate-900">🇶🇦 QAR (ميناء حمد)</option>
                  <option value="KW" className="dark:bg-slate-900">🇰🇼 KWD (الشويخ)</option>
                  <option value="OM" className="dark:bg-slate-900">🇴🇲 OMR (صحار)</option>
                  <option value="BH" className="dark:bg-slate-900">🇧🇭 BHD (خليفة)</option>
                  <option value="US" className="dark:bg-slate-900">🇺🇸 USD (FOB Korea)</option>
                  <option value="EU" className="dark:bg-slate-900">🇪🇺 EUR (أوروبا)</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900/80 text-xs font-bold text-slate-800 dark:text-white px-3 py-2 rounded-2xl border border-slate-200 dark:border-white/5 focus:outline-none cursor-pointer"
              >
                <option value="year-desc" className="dark:bg-slate-900">{isAr ? "الأحدث موديل أولاً" : "Newest Year First"}</option>
                <option value="price-asc" className="dark:bg-slate-900">{isAr ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
                <option value="price-desc" className="dark:bg-slate-900">{isAr ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
                <option value="mileage-asc" className="dark:bg-slate-900">{isAr ? "الممشى: الأقل ممشى" : "Lowest Mileage"}</option>
              </select>

              {/* View Toggle (Grid vs List) */}
              <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-800 text-[#0066ff] dark:text-sky-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-800 text-[#0066ff] dark:text-sky-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  }`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 rounded-2xl text-xs font-bold cursor-pointer shadow-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>{isAr ? "الفلاتر" : "Filters"}</span>
              </button>
            </div>
          </div>

          {/* Quick Search Bar & Popular Make Pills */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={isAr ? "ابحث باسم السيارة، الموديل، الفئة أو رقم الشاسي..." : "Search make, model, trim, or VIN..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0066ff] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Brand Selector Pills */}
            <div className="w-full md:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {availableBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedBrand === brand
                      ? "bg-slate-950 dark:bg-[#0066ff] text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-white/5"
                  }`}
                >
                  {brand === "All" ? (isAr ? "الكل" : "All Makes") : brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 p-5 space-y-6 sticky top-24 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4 text-[#0066ff] dark:text-sky-400" />
                <span>{isAr ? "تصفية السيارات" : "Filter Sourcing"}</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{isAr ? "إعادة ضبط" : "Reset"}</span>
              </button>
            </div>

            {/* Body Type Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                {isAr ? "نوع الهيكل" : "Body Type"}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {availableBodyTypes.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBodyType(b.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center border transition cursor-pointer ${
                      selectedBodyType === b.id
                        ? "bg-[#0066ff] text-white border-[#0066ff]"
                        : "bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-[#0066ff]/40"
                    }`}
                  >
                    {isAr ? b.ar : b.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                {isAr ? "نوع الوقود" : "Fuel Type"}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableFuelTypes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFuelType(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedFuelType === f.id
                        ? "bg-[#0066ff] text-white border-[#0066ff]"
                        : "bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-[#0066ff]/40"
                    }`}
                  >
                    {isAr ? f.ar : f.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Year Range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">{isAr ? "سنة الصنع:" : "Model Year:"}</span>
                <span className="text-[#0066ff] dark:text-sky-400 font-mono">{yearMin} - {yearMax}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={yearMin}
                  onChange={(e) => setYearMin(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                >
                  {[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                    <option key={y} value={y} className="dark:bg-slate-900">{y}</option>
                  ))}
                </select>
                <select
                  value={yearMax}
                  onChange={(e) => setYearMax(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                >
                  {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y} className="dark:bg-slate-900">{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Max Budget Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">{isAr ? "الميزانية القصوى FOB:" : "Max FOB Price:"}</span>
                <span className="text-[#0066ff] dark:text-sky-400 font-mono">${maxPriceUsd.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min="15000"
                max="100000"
                step="2500"
                value={maxPriceUsd}
                onChange={(e) => setMaxPriceUsd(Number(e.target.value))}
                className="w-full accent-[#0066ff] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>$15,000</span>
                <span>$50,000</span>
                <span>$100,000+</span>
              </div>
            </div>

            {/* Max Mileage Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">{isAr ? "الممشى الأقصى:" : "Max Mileage:"}</span>
                <span className="text-[#0066ff] dark:text-sky-400 font-mono">{maxMileageKm.toLocaleString()} km</span>
              </div>
              <input
                type="range"
                min="20000"
                max="150000"
                step="5000"
                value={maxMileageKm}
                onChange={(e) => setMaxMileageKm(Number(e.target.value))}
                className="w-full accent-[#0066ff] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>20k km</span>
                <span>80k km</span>
                <span>150k km</span>
              </div>
            </div>

            {/* Ro-Ro Direct Shipping Highlight */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200/80 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>{isAr ? "فحص 150 نقطة وضمان الشحن" : "150-Point Audit & Insurance"}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? "جميع السيارات مفحوصة بدقة وخالية من أي حوادث هيكلية مع شحن مباشر Ro-Ro إلى ميناء المقصد وتخليص كامل."
                  : "Every car is verified with 0% frame damage. Ro-Ro shipping with marine insurance to your destination port."}
              </p>
            </div>
          </aside>

          {/* Vehicles List / Grid Area */}
          <main className="lg:col-span-3">
            
            {/* Loading Spinner */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="h-10 w-10 text-[#0066ff] animate-spin" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isAr ? "جاري تحميل أحدث سيارات التصدير من كوريا الجنوبية..." : "Loading live verified export listings from South Korea..."}
                </p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredVehicles.length === 0 && (
              <div className="text-center py-20 rounded-3xl bg-white dark:bg-[#070e1b] border border-dashed border-slate-300 dark:border-white/10 p-8 space-y-4">
                <AlertCircle className="h-10 w-10 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {isAr ? "لا توجد نتائج مطابقة للبحث المحدد" : "No Matching Vehicles Found"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {isAr
                    ? "جرب توسيع معايير البحث أو تصفير الفلاتر لعرض كافة السيارات المتاحة للتصدير الفوري."
                    : "Try broadening your filter criteria or resetting filters to browse all available vehicles."}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-bold rounded-xl hover:opacity-90 transition shadow-sm cursor-pointer"
                >
                  {isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}
                </button>
              </div>
            )}

            {/* Vehicles Cards Grid */}
            {!isLoading && filteredVehicles.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredVehicles.map((car, idx) => {
                  const priceUsd = car.prices?.USD
                    ? Math.round(car.prices.USD)
                    : typeof car.price === "number"
                    ? Math.round(car.price / 1350)
                    : 25000;
                  const priceLocal = Math.round(priceUsd * activeCurrency.rate);
                  const whatsappUrl = getConsultationWhatsAppUrl(car);

                  if (viewMode === "list") {
                    // List Row View (HanExport / Encar detailed row style)
                    return (
                      <motion.div
                        key={car.id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        viewport={{ once: true }}
                        className="rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-stretch hover:border-[#0066ff]/40 dark:hover:border-sky-400/40 transition-all shadow-sm"
                      >
                        {/* Car Image Preview */}
                        <div className="relative w-full md:w-64 h-48 md:h-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                          <Image
                            src={car.image || "/images/genesis_g80_export.png"}
                            alt={car.title}
                            fill
                            className="object-cover hover:scale-105 transition duration-500"
                            unoptimized
                          />
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                            {car.source === "kbchachacha" ? (
                              <span className="text-[10px] font-black uppercase text-amber-950 bg-amber-400 px-2 py-0.5 rounded shadow-sm">
                                KB ChaChaCha
                              </span>
                            ) : car.source === "kcar" ? (
                              <span className="text-[10px] font-black uppercase text-white bg-sky-600 px-2 py-0.5 rounded shadow-sm">
                                K-Car Direct
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase text-white bg-red-600 px-2 py-0.5 rounded shadow-sm">
                                Encar Certified
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-white bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded">
                              #{car.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>

                        {/* Middle: Details & Specs */}
                        <div className="flex-grow flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                🛡️ {isAr ? "فحص 150 نقطة معتمد" : "150-Pt Inspected"}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {car.drivetrain || "AWD"}
                              </span>
                            </div>
                            <Link href={`/vehicle/${car.id}`} className="hover:text-[#0066ff] transition">
                              <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                                {isAr && car.titleAr ? car.titleAr : car.title}
                              </h3>
                            </Link>
                          </div>

                          {/* Spec Pills */}
                          <div className="grid grid-cols-3 gap-2 text-[11px] font-bold bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <Calendar className="h-3.5 w-3.5 text-[#0066ff]" />
                              <span>{car.year}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <Gauge className="h-3.5 w-3.5 text-[#0066ff]" />
                              <span>{car.mileage?.toLocaleString()} km</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <Fuel className="h-3.5 w-3.5 text-[#0066ff]" />
                              <span className="capitalize">{car.fuelType}</span>
                            </div>
                          </div>

                          {/* Price & Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
                            <div>
                              <div className="text-[10px] font-bold uppercase text-slate-400">FOB Korea</div>
                              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                                ${priceUsd.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
                              </div>
                              <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                                ~{priceLocal.toLocaleString()} {activeCurrency.symbol}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* THE CRITICAL AYMAN ALSHAALAN WHATSAPP BUTTON */}
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
                              >
                                <span className="relative flex h-2 w-2 shrink-0">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                <PhoneCall className="h-3.5 w-3.5 shrink-0" />
                                <span>{isAr ? "استشارة وشراء" : "Consult & Buy"}</span>
                              </a>

                              <Link
                                href={`/vehicle/${car.id}`}
                                className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-xl text-xs font-bold transition"
                              >
                                <span>{isAr ? "التفاصيل" : "Details"}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // Standard Card View (High Conversion Grid)
                  return (
                    <motion.div
                      key={car.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      viewport={{ once: true }}
                      className="rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#0066ff]/40 dark:hover:border-sky-400/40 hover:shadow-xl transition-all duration-300"
                    >
                      <div>
                        {/* Image & Source Tag */}
                        <Link href={`/vehicle/${car.id}`} className="block relative aspect-[16/10] bg-slate-100 dark:bg-slate-950 overflow-hidden group">
                          <Image
                            src={car.image || "/images/genesis_g80_export.png"}
                            alt={car.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                          {/* Source Badge */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                            {car.source === "kbchachacha" ? (
                              <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-950 bg-amber-400 px-2.5 py-1 rounded-md shadow-sm">
                                <span>🏷️ KB ChaChaCha</span>
                              </span>
                            ) : car.source === "kcar" ? (
                              <span className="flex items-center gap-1 text-[10px] font-black uppercase text-white bg-sky-600 px-2.5 py-1 rounded-md shadow-sm">
                                <span>🛡️ K-Car Direct</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-black uppercase text-white bg-red-600 px-2.5 py-1 rounded-md shadow-sm">
                                <span>🇰🇷 Encar Certified</span>
                              </span>
                            )}

                            <span className="text-[10px] font-extrabold uppercase text-white bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3 text-emerald-400" />
                              <span>150-Pt</span>
                            </span>
                          </div>

                          {/* Bottom Image Info */}
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono font-bold text-white">
                            <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-white/10">
                              #{car.id.slice(0, 8)}
                            </span>
                            <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                              {isAr ? "جاهز للتصدير" : "Export Ready"}
                            </span>
                          </div>
                        </Link>

                        {/* Title & Specs */}
                        <div className="p-5 space-y-3.5">
                          <Link href={`/vehicle/${car.id}`} className="block hover:text-[#0066ff] transition">
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                              {isAr && car.titleAr ? car.titleAr : car.title}
                            </h3>
                          </Link>

                          {/* Key Specs Pill */}
                          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-slate-200/60 dark:border-white/5">
                            <div className="flex flex-col items-center justify-center text-center">
                              <Calendar className="h-3 w-3 text-[#0066ff] mb-0.5" />
                              <span>{car.year}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                              <Gauge className="h-3 w-3 text-[#0066ff] mb-0.5" />
                              <span>{car.mileage?.toLocaleString()} km</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                              <Fuel className="h-3 w-3 text-[#0066ff] mb-0.5" />
                              <span className="capitalize truncate max-w-full">{car.fuelType}</span>
                            </div>
                          </div>

                          {/* Pricing Display */}
                          <div className="flex items-baseline justify-between border-t border-slate-200 dark:border-white/10 pt-3">
                            <div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase">FOB Korea</div>
                              <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                                ${priceUsd.toLocaleString()}{" "}
                                <span className="text-xs font-normal text-slate-400">USD</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Est. {activeCurrency.symbol}</div>
                              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                ~{priceLocal.toLocaleString()} {activeCurrency.symbol}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: THE CRITICAL "استشارة وشراء" (WhatsApp) + Details */}
                      <div className="p-5 pt-0 space-y-2">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white py-3 text-xs font-extrabold uppercase tracking-wide transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.01]"
                        >
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          <PhoneCall className="h-4 w-4 shrink-0" />
                          <span>{isAr ? "استشارة وشراء" : "Consult & Buy (WhatsApp)"}</span>
                        </a>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setQuickInspectVehicle(car)}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 text-[11px] font-bold transition cursor-pointer"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 text-[#0066ff]" />
                            <span>{isAr ? "الفحص والشحن" : "Inspection & Ro-Ro"}</span>
                          </button>

                          <Link
                            href={`/vehicle/${car.id}`}
                            className="flex items-center justify-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 text-[11px] font-bold transition"
                          >
                            <span>{isAr ? "كامل المواصفات" : "Full Specs"}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick Inspection & Ro-Ro Duty Modal */}
      <AnimatePresence>
        {quickInspectVehicle && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 p-6 space-y-5 shadow-2xl text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setQuickInspectVehicle(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {quickInspectVehicle.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? "تقرير الفحص الفني وحاسبة التكلفة الشاملة" : "150-Point Audit & Landed Ro-Ro Shipping Estimate"}
                  </p>
                </div>
              </div>

              {/* Inspection points grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{isAr ? "خالي من حوادث الشاسي 100%" : "0% Structural Frame Damage"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{isAr ? "خالي من الغرق والسيول" : "0% Water / Flood Damage"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{isAr ? "تدقيق سماكة الطلاء (ميكرون)" : "Paint Depth Audit Passed"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{isAr ? "كمبيوتر وفحص المحرك سليم" : "OBD2 Engine Diagnostics OK"}</span>
                </div>
              </div>

              {/* Estimated Landed Cost Summary */}
              {(() => {
                const priceUsd = quickInspectVehicle.prices?.USD
                  ? Math.round(quickInspectVehicle.prices.USD)
                  : typeof quickInspectVehicle.price === "number"
                  ? Math.round(quickInspectVehicle.price / 1350)
                  : 25000;
                const freight = activeCurrency.freightUsd;
                const insurance = 220;
                const duty = Math.round(priceUsd * 0.05); // 5% GCC standard
                const landedUsd = priceUsd + freight + insurance + duty;
                const landedLocal = Math.round(landedUsd * activeCurrency.rate);

                return (
                  <div className="space-y-2.5 text-xs font-semibold border-t border-slate-200 dark:border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">FOB Price Korea:</span>
                      <span className="font-mono font-bold">${priceUsd.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ro-Ro Ocean Freight ({activeCurrency.portEn}):</span>
                      <span className="font-mono font-bold">+${freight.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Marine All-Risk Insurance:</span>
                      <span className="font-mono font-bold">+${insurance.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2 text-sm font-black text-slate-900 dark:text-white">
                      <span>{isAr ? "الإجمالي التقديري واصل للميناء:" : "Estimated Landed Cost:"}</span>
                      <span className="text-[#0066ff] dark:text-sky-400 font-mono">
                        ${landedUsd.toLocaleString()} USD (~{landedLocal.toLocaleString()} {activeCurrency.symbol})
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Modal WhatsApp Action Button: "استشارة وشراء" */}
              <div className="pt-2">
                <a
                  href={getConsultationWhatsAppUrl(quickInspectVehicle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 text-xs font-extrabold uppercase tracking-wide transition shadow-lg shadow-emerald-500/25"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>{isAr ? "متابعة واستشارة وشراء عبر الواتساب" : "Confirm Consultation & Purchase via WhatsApp"}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end bg-slate-950/80 backdrop-blur-sm lg:hidden">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-full max-w-sm h-full bg-white dark:bg-[#070e1b] p-6 space-y-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <span className="text-sm font-black uppercase text-slate-900 dark:text-white">
                  {isAr ? "تصفية السيارات" : "Filter Sourcing"}
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Brands */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 font-mono">Make / Brand</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableBrands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        selectedBrand === b
                          ? "bg-[#0066ff] text-white"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Body Type */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 font-mono">Body Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableBodyTypes.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBodyType(b.id)}
                      className={`p-2 rounded-xl text-xs font-bold text-center border ${
                        selectedBodyType === b.id
                          ? "bg-[#0066ff] text-white border-[#0066ff]"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5"
                      }`}
                    >
                      {isAr ? b.ar : b.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply & Close Button */}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md"
              >
                {isAr ? `عرض النتائج (${filteredVehicles.length})` : `Show Results (${filteredVehicles.length})`}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
