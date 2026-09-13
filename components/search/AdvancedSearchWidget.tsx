"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  CarFront,
  Calendar,
  Gauge,
  DollarSign,
  Fuel,
  RotateCcw,
  Search,
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
} from "lucide-react";
import carLogos from "@/lib/car-logos.json";
import MarketSourceTabs from "./MarketSourceTabs";

interface AdvancedSearchWidgetProps {
  onSearch?: (filters: any) => void;
}

export default function AdvancedSearchWidget({ onSearch }: AdvancedSearchWidgetProps) {
  const { language, dir } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [bodyType, setBodyType] = useState<string>("");
  const [yearFrom, setYearFrom] = useState<string>("");
  const [yearTo, setYearTo] = useState<string>("");
  const [maxMileage, setMaxMileage] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("");
  const [drivetrain, setDrivetrain] = useState<string>("");
  const [destinationPort, setDestinationPort] = useState<string>("");
  const [certification, setCertification] = useState<string>("");
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    // Read saved search parameters on mount
    const savedSource = localStorage.getItem("kyro_search_source") || "all";
    const savedBrand = localStorage.getItem("kyro_search_brand") || "";
    const savedModel = localStorage.getItem("kyro_search_model") || "";
    const savedBody = localStorage.getItem("kyro_search_bodyType") || "";
    const savedYearFrom = localStorage.getItem("kyro_search_yearFrom") || "";
    const savedYearTo = localStorage.getItem("kyro_search_yearTo") || "";
    const savedMaxMil = localStorage.getItem("kyro_search_maxMileage") || "";
    const savedMinPri = localStorage.getItem("kyro_search_minPrice") || "";
    const savedMaxPri = localStorage.getItem("kyro_search_maxPrice") || "";
    const savedFuel = localStorage.getItem("kyro_search_fuelType") || "";
    const savedDrive = localStorage.getItem("kyro_search_drivetrain") || "";
    const savedPort = localStorage.getItem("kyro_search_destinationPort") || "";
    const savedCert = localStorage.getItem("kyro_search_certification") || "";
    
    if (savedSource) setSelectedSource(savedSource);
    if (savedBrand) setSelectedBrand(savedBrand);
    if (savedModel) setSelectedModel(savedModel);
    if (savedBody) setBodyType(savedBody);
    if (savedYearFrom) setYearFrom(savedYearFrom);
    if (savedYearTo) setYearTo(savedYearTo);
    if (savedMaxMil) setMaxMileage(savedMaxMil);
    if (savedMinPri) setMinPrice(savedMinPri);
    if (savedMaxPri) setMaxPrice(savedMaxPri);
    if (savedFuel) setFuelType(savedFuel);
    if (savedDrive) setDrivetrain(savedDrive);
    if (savedPort) setDestinationPort(savedPort);
    if (savedCert) setCertification(savedCert);

    // Also listen to wizard selections to pre-populate search filters automatically!
    const handleWizardMake = (e: Event) => {
      const val = (e as CustomEvent).detail;
      setSelectedBrand(val);
      localStorage.setItem("kyro_search_brand", val);
    };
    const handleWizardBody = (e: Event) => {
      const val = (e as CustomEvent).detail;
      setBodyType(val);
      localStorage.setItem("kyro_search_bodyType", val);
    };
    const handleWizardPort = (e: Event) => {
      const val = (e as CustomEvent).detail;
      setDestinationPort(val);
      localStorage.setItem("kyro_search_destinationPort", val);
    };

    window.addEventListener("kyro-wizard-update-make", handleWizardMake);
    window.addEventListener("kyro-wizard-update-bodyType", handleWizardBody);
    window.addEventListener("kyro-wizard-update-destination", handleWizardPort);

    return () => {
      window.removeEventListener("kyro-wizard-update-make", handleWizardMake);
      window.removeEventListener("kyro-wizard-update-bodyType", handleWizardBody);
      window.removeEventListener("kyro-wizard-update-destination", handleWizardPort);
    };
  }, []);

  const brandOptions = [
    { name: "Hyundai", logoKey: "hyundai" },
    { name: "Kia", logoKey: "kia" },
    { name: "Genesis", logoKey: "genesis" },
    { name: "Mercedes-Benz", logoKey: "mercedesbenz" },
    { name: "BMW", logoKey: "bmw" },
    { name: "Audi", logoKey: "audi" },
    { name: "Porsche", logoKey: "porsche" },
    { name: "Lexus", logoKey: "lexus" },
    { name: "Land Rover", logoKey: "landrover" },
    { name: "Chevrolet", logoKey: "chevrolet" },
    { name: "Volkswagen", logoKey: "volkswagen" },
    { name: "Volvo", logoKey: "volvo" },
  ];

  const modelMap: Record<string, string[]> = {
    Hyundai: ["Sonata", "Elantra", "Santa Fe", "Tucson", "Palisade", "Grandeur", "Avante", "Kona", "Ioniq 5"],
    Kia: ["Sorento", "Sportage", "K5", "K7", "Carnival", "Stinger", "Telluride", "K8", "EV6"],
    Genesis: ["G70", "G80", "G90", "GV70", "GV80"],
    "Mercedes-Benz": ["E-Class", "C-Class", "S-Class", "GLE", "GLC", "AMG GT"],
    BMW: ["3 Series", "5 Series", "7 Series", "X3", "X5", "X7", "M5"],
    Audi: ["A4", "A6", "A7", "A8", "Q5", "Q7", "Q8"],
    Porsche: ["Cayenne", "Macan", "Panamera", "911", "Taycan"],
    Lexus: ["ES", "LS", "RX", "GX", "LX"],
  };

  const bodyTypes = [
    { nameEn: "Sedan", nameAr: "سيدان" },
    { nameEn: "SUV / Offroad", nameAr: "دفع رباعي" },
    { nameEn: "Luxury MPV / Van", nameAr: "عائلية فاخرة" },
    { nameEn: "EV / Hybrid", nameAr: "كهربائية / هجينة" },
    { nameEn: "Commercial Truck", nameAr: "شاحنة تجارية" },
  ];

  const destinationPorts = [
    { nameEn: "Jeddah Islamic Port (Saudi Arabia 🇸🇦)", nameAr: "ميناء جدة الإسلامي (السعودية 🇸🇦)" },
    { nameEn: "Jebel Ali Port (UAE 🇦🇪)", nameAr: "ميناء جبل علي (الإمارات 🇦🇪)" },
    { nameEn: "Hamad Port (Qatar 🇶🇦)", nameAr: "ميناء حمد (قطر 🇶🇦)" },
    { nameEn: "Shuwaikh Port (Kuwait 🇰🇼)", nameAr: "ميناء الشويخ (الكويت 🇰🇼)" },
    { nameEn: "Port of Bremerhaven (Germany 🇩🇪)", nameAr: "ميناء بريمرهافن (ألمانيا 🇩🇪)" },
    { nameEn: "Port of Rotterdam (Netherlands 🇳🇱)", nameAr: "ميناء روتردام (هولندا 🇳🇱)" },
  ];

  const yearsList = Array.from({ length: 16 }, (_, i) => String(2026 - i));

  // Count active secondary filters
  const activeSecondaryCount = [drivetrain, destinationPort, certification, bodyType].filter(Boolean).length;

  const handleSelectSource = (src: string) => {
    setSelectedSource(src);
    localStorage.setItem("kyro_search_source", src);
    window.dispatchEvent(new CustomEvent("kyro-source-select", { detail: src }));
    
    // Trigger auto-apply with new source
    const filters = {
      source: src,
      brand: selectedBrand,
      model: selectedModel,
      bodyType,
      yearFrom,
      yearTo,
      maxMileage,
      minPrice,
      maxPrice,
      fuelType,
      drivetrain,
      destinationPort,
      certification,
    };
    window.dispatchEvent(new CustomEvent("kyro-search-apply", { detail: filters }));
    if (onSearch) onSearch(filters);
  };

  const handleApply = () => {
    const filters = {
      source: selectedSource,
      brand: selectedBrand,
      model: selectedModel,
      bodyType,
      yearFrom,
      yearTo,
      maxMileage,
      minPrice,
      maxPrice,
      fuelType,
      drivetrain,
      destinationPort,
      certification,
    };

    // Save search filters in localStorage
    localStorage.setItem("kyro_search_source", selectedSource);
    localStorage.setItem("kyro_search_brand", selectedBrand);
    localStorage.setItem("kyro_search_model", selectedModel);
    localStorage.setItem("kyro_search_bodyType", bodyType);
    localStorage.setItem("kyro_search_yearFrom", yearFrom);
    localStorage.setItem("kyro_search_yearTo", yearTo);
    localStorage.setItem("kyro_search_maxMileage", maxMileage);
    localStorage.setItem("kyro_search_minPrice", minPrice);
    localStorage.setItem("kyro_search_maxPrice", maxPrice);
    localStorage.setItem("kyro_search_fuelType", fuelType);
    localStorage.setItem("kyro_search_drivetrain", drivetrain);
    localStorage.setItem("kyro_search_destinationPort", destinationPort);
    localStorage.setItem("kyro_search_certification", certification);

    // Dispatch global filter search update event
    window.dispatchEvent(new CustomEvent("kyro-search-apply", { detail: filters }));

    if (onSearch) {
      onSearch(filters);
    }
    const inventorySec = document.getElementById("inventory-section");
    if (inventorySec) {
      inventorySec.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setSelectedSource("all");
    setSelectedBrand("");
    setSelectedModel("");
    setBodyType("");
    setYearFrom("");
    setYearTo("");
    setMaxMileage("");
    setMinPrice("");
    setMaxPrice("");
    setFuelType("");
    setDrivetrain("");
    setDestinationPort("");
    setCertification("");

    // Clear saved filters from localStorage
    localStorage.setItem("kyro_search_source", "all");
    localStorage.removeItem("kyro_search_brand");
    localStorage.removeItem("kyro_search_model");
    localStorage.removeItem("kyro_search_bodyType");
    localStorage.removeItem("kyro_search_yearFrom");
    localStorage.removeItem("kyro_search_yearTo");
    localStorage.removeItem("kyro_search_maxMileage");
    localStorage.removeItem("kyro_search_minPrice");
    localStorage.removeItem("kyro_search_maxPrice");
    localStorage.removeItem("kyro_search_fuelType");
    localStorage.removeItem("kyro_search_drivetrain");
    localStorage.removeItem("kyro_search_destinationPort");
    localStorage.removeItem("kyro_search_certification");

    // Dispatch search clear event
    window.dispatchEvent(new CustomEvent("kyro-search-clear"));
  };

  const logoMap = carLogos as Record<string, string>;

  return (
    <div dir={dir} className="w-full koryo-card-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-white/10 transition-colors duration-300 space-y-6">
      
      {/* Search Header Bar with Quick Preset Tags */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0066ff]/10 text-[#0066ff] dark:text-sky-400">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase font-sans">
              {language === "ar" ? "محرك البحث والفلترة المتقدم" : "Advanced Vehicle Search Engine"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === "ar" ? "تصفية الفئات، الميزانية، سنة الصنع وميناء الوصول" : "Filter by make, model, budget, drivetrain & arrival port"}
            </p>
          </div>
        </div>

        {/* Quick Filter Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            {language === "ar" ? "فلاتر سريعة:" : "Presets:"}
          </span>
          <button
            onClick={() => handleSelectSource("encar")}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition border cursor-pointer ${
              selectedSource === "encar"
                ? "bg-red-600 text-white border-red-500 shadow-sm"
                : "bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 dark:text-rose-400 border-red-500/20"
            }`}
          >
            🇰🇷 {language === "ar" ? "سيارات إنكار" : "Encar Only"}
          </button>
          <button
            onClick={() => handleSelectSource("kbchachacha")}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition border cursor-pointer ${
              selectedSource === "kbchachacha"
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                : "bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            🏷️ {language === "ar" ? "كي بي تشاتشاتشا" : "KB ChaChaCha"}
          </button>
          <button
            onClick={() => {
              handleReset();
              setMaxPrice("20000");
            }}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-[#0066ff] hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-extrabold transition border border-slate-200 dark:border-white/5 cursor-pointer"
          >
            ⚡ {language === "ar" ? "أقل من 20,000$" : "Under $20k"}
          </button>
          <button
            onClick={() => {
              handleReset();
              setSelectedBrand("Genesis");
            }}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-[#0066ff] hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-extrabold transition border border-slate-200 dark:border-white/5 cursor-pointer"
          >
            👑 Genesis
          </button>
          <button
            onClick={() => {
              handleReset();
              setBodyType("SUV / Offroad");
            }}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-[#0066ff] hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-extrabold transition border border-slate-200 dark:border-white/5 cursor-pointer"
          >
            🚙 SUVs & 4x4
          </button>
          <button
            onClick={() => {
              handleReset();
              setFuelType("Electric");
            }}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-[#0066ff] hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-extrabold transition border border-slate-200 dark:border-white/5 cursor-pointer"
          >
            ⚡ EV & Hybrid
          </button>
        </div>
      </div>

      {/* Prominent Multi-Market Source Selector (Encar, KB ChaChaCha, K-Car, All) */}
      <MarketSourceTabs
        selectedSource={selectedSource}
        onSelectSource={handleSelectSource}
      />

      {/* Primary Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        
        {/* Brand Dropdown */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition">
            <Tag className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
            <span>{language === "ar" ? "ماركة السيارة" : "Car Brand"}</span>
          </label>

          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedModel("");
              }}
              className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-3.5 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 appearance-none transition-colors"
            >
              <option value="">{language === "ar" ? "جميع الماركات" : "All Car Brands"}</option>
              {brandOptions.map((b) => (
                <option key={b.name} value={b.name} className="bg-white dark:bg-[#070d19] text-slate-800 dark:text-white">
                  {b.name}
                </option>
              ))}
            </select>

            {selectedBrand && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                {(() => {
                  const key = selectedBrand.toLowerCase().replace(/[^a-z]/g, "");
                  const logoUrl = logoMap[key];
                  return logoUrl ? (
                    <Image src={logoUrl} alt={selectedBrand} width={18} height={18} className="object-contain" unoptimized />
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Model Dropdown */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition">
            <CarFront className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
            <span>{language === "ar" ? "موديل السيارة" : "Car Model"}</span>
          </label>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!mounted || !selectedBrand}
            className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-3.5 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 disabled:opacity-50 appearance-none transition-colors"
          >
            <option value="" className="bg-white dark:bg-[#070d19]">
              {selectedBrand
                ? language === "ar"
                  ? `جميع موديلات ${selectedBrand}`
                  : `All ${selectedBrand} Models`
                : language === "ar"
                ? "اختر الماركة أولاً"
                : "Select Brand First"}
            </option>
            {selectedBrand &&
              modelMap[selectedBrand]?.map((m) => (
                <option key={m} value={m} className="bg-white dark:bg-[#070d19] text-slate-800 dark:text-white">
                  {m}
                </option>
              ))}
          </select>
        </div>

        {/* Body Styling */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition">
            <LayoutGrid className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
            <span>{language === "ar" ? "نمط الهيكل" : "Body Type"}</span>
          </label>

          <select
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-3.5 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 appearance-none transition-colors"
          >
            <option value="" className="bg-white dark:bg-[#070d19]">{language === "ar" ? "جميع أنواع الهيكل" : "All Body Types"}</option>
            {bodyTypes.map((bt) => (
              <option key={bt.nameEn} value={bt.nameEn} className="bg-white dark:bg-[#070d19] text-slate-800 dark:text-white">
                {language === "ar" ? bt.nameAr : bt.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition">
            <DollarSign className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
            <span>{language === "ar" ? "نطاق السعر (USD)" : "Price Range (USD)"}</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-2.5 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 transition-colors"
            >
              <option value="" className="bg-white dark:bg-[#070d19]">Min</option>
              <option value="10000" className="bg-white dark:bg-[#070d19]">$10,000</option>
              <option value="20000" className="bg-white dark:bg-[#070d19]">$20,000</option>
              <option value="30000" className="bg-white dark:bg-[#070d19]">$30,000</option>
            </select>

            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-2.5 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 transition-colors"
            >
              <option value="" className="bg-white dark:bg-[#070d19]">Max</option>
              <option value="20000" className="bg-white dark:bg-[#070d19]">$20,000</option>
              <option value="35000" className="bg-white dark:bg-[#070d19]">$35,000</option>
              <option value="60000" className="bg-white dark:bg-[#070d19]">$60,000</option>
              <option value="100000" className="bg-white dark:bg-[#070d19]">$100,000+</option>
            </select>
          </div>
        </div>

        {/* Engine & Fuel */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition">
            <Fuel className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
            <span>{language === "ar" ? "نوع الوقود والمحرك" : "Engine & Fuel"}</span>
          </label>

          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-3.5 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 appearance-none transition-colors"
          >
            <option value="" className="bg-white dark:bg-[#070d19]">{language === "ar" ? "جميع المحركات" : "All Fuel Types"}</option>
            <option value="Gasoline" className="bg-white dark:bg-[#070d19]">Gasoline / بنزين</option>
            <option value="Diesel" className="bg-white dark:bg-[#070d19]">Diesel / ديزل</option>
            <option value="Hybrid" className="bg-white dark:bg-[#070d19]">Hybrid / هجين</option>
            <option value="Electric" className="bg-white dark:bg-[#070d19]">Electric / كهربائي</option>
            <option value="LPG" className="bg-white dark:bg-[#070d19]">LPG / غاز</option>
          </select>
        </div>

      </div>

      {/* Expandable Secondary Filters Drawer */}
      <AnimatePresence>
        {showMoreFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-slate-200 dark:border-white/10 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Production Year Range */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition">
                  <Calendar className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
                  <span>{language === "ar" ? "سنة الصنع" : "Production Year"}</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                    className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 transition-colors"
                  >
                    <option value="" className="bg-white dark:bg-[#070d19]">{language === "ar" ? "من" : "From"}</option>
                    {yearsList.map((y) => (
                      <option key={y} value={y} className="bg-white dark:bg-[#070d19] text-slate-800 dark:text-white">{y}</option>
                    ))}
                  </select>

                  <select
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                    className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 transition-colors"
                  >
                    <option value="" className="bg-white dark:bg-[#070d19]">{language === "ar" ? "إلى" : "To"}</option>
                    {yearsList.map((y) => (
                      <option key={y} value={y} className="bg-white dark:bg-[#070d19] text-slate-800 dark:text-white">{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Max Mileage */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition">
                  <Gauge className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
                  <span>{language === "ar" ? "العداد الأقصى (كم)" : "Max Mileage (km)"}</span>
                </label>

                <select
                  value={maxMileage}
                  onChange={(e) => setMaxMileage(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 appearance-none transition-colors"
                >
                  <option value="" className="bg-white dark:bg-[#070d19]">{language === "ar" ? "بدون حد أقصى" : "Any Mileage"}</option>
                  <option value="30000" className="bg-white dark:bg-[#070d19]">≤ 30,000 km</option>
                  <option value="60000" className="bg-white dark:bg-[#070d19]">≤ 60,000 km</option>
                  <option value="100000" className="bg-white dark:bg-[#070d19]">≤ 100,000 km</option>
                  <option value="150000" className="bg-white dark:bg-[#070d19]">≤ 150,000 km</option>
                </select>
              </div>

              {/* Drivetrain System */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition">
                  <Zap className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
                  <span>{language === "ar" ? "نظام الدفع (Drivetrain)" : "Drivetrain System"}</span>
                </label>

                <select
                  value={drivetrain}
                  onChange={(e) => setDrivetrain(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 appearance-none transition-colors"
                >
                  <option value="" className="bg-white dark:bg-[#070d19]">{language === "ar" ? "جميع الأنظمة" : "Any Drivetrain"}</option>
                  <option value="AWD" className="bg-white dark:bg-[#070d19]">AWD / 4WD (دفع رباعي)</option>
                  <option value="FWD" className="bg-white dark:bg-[#070d19]">FWD (دفع أمامي)</option>
                  <option value="RWD" className="bg-white dark:bg-[#070d19]">RWD (دفع خلفي)</option>
                </select>
              </div>

              {/* Target Arrival Port */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white transition">
                  <MapPin className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
                  <span>{language === "ar" ? "ميناء الشحن والوصول" : "Target Arrival Port"}</span>
                </label>

                <select
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 dark:bg-[#070d19] border border-slate-300 dark:border-white/10 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] dark:focus:border-sky-400 appearance-none transition-colors"
                >
                  <option value="" className="bg-white dark:bg-[#070d19]">{language === "ar" ? "جميع الموانئ" : "All Shipping Ports"}</option>
                  {destinationPorts.map((dp) => (
                    <option key={dp.nameEn} value={dp.nameEn} className="bg-white dark:bg-[#070d19] text-slate-800 dark:text-white">
                      {language === "ar" ? dp.nameAr : dp.nameEn}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Row with More Filters Drawer Toggle */}
      <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        
        {/* Toggle Button for More Filters */}
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="flex items-center gap-2 text-xs font-bold text-[#0066ff] dark:text-sky-400 hover:opacity-80 transition"
        >
          {showMoreFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>
            {showMoreFilters
              ? language === "ar" ? "إخفاء الفلاتر الإضافية" : "Hide Advanced Options"
              : language === "ar" ? "عرض المزيد من الفلاتر (سنة الصنع، الميناء، نوع الدفع)" : "More Filter Options (Year, Port, Drivetrain)"}
          </span>
          {activeSecondaryCount > 0 && (
            <span className="h-5 w-5 rounded-full bg-[#0066ff] text-white text-[10px] font-black flex items-center justify-center">
              {activeSecondaryCount}
            </span>
          )}
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleApply}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl koryo-btn-black px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition"
          >
            <Search className="h-4 w-4" />
            <span>{language === "ar" ? "تطبيق الفلاتر" : "Apply Search Filters"}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d19] px-4 py-3.5 text-xs font-bold text-slate-755 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{language === "ar" ? "إعادة ضبط" : "Reset"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
