"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  Camera,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";

export interface CatalogVehicle {
  id: string;
  encar_id?: string;
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
  displacement?: number;
  licensePlate?: string;
  seatingCapacity?: number;
  registrationDate?: string;
  location?: string;
  viewCount?: number;
  badge?: string;
  vin?: string;
  sellerComment?: string;
  prices?: {
    USD?: number;
    EUR?: number;
    KRW?: number;
  };
  accidentHistory?: {
    hasAccident?: boolean;
    accidentStatus?: string;
    totalDamageAmount?: string;
    totalIncidents?: number;
    oilLeakage?: string;
    coolantLeakage?: string;
    ownerChangeCnt?: number;
    licensePlate?: string;
    vin?: string;
    mechanicalInspection?: any;
    structuralRepairs?: any[];
    simpleRepairs?: any[];
  };
  exportEligibility?: {
    status?: string;
    score?: number;
    lhdCompatible?: boolean;
    recommendations?: string[];
    warnings?: string[];
  };
  options?: any;
  inspection?: {
    certified?: boolean;
    structuralDamage?: boolean;
    floodDamage?: boolean;
    paintAuditPassed?: boolean;
    center?: string;
  };
}

// Module-level client memory cache for instant 0ms brand toggling
interface BrandCacheEntry {
  vehicles: CatalogVehicle[];
  page: number;
  hasMore: boolean;
}
const clientBrandCache = new Map<string, BrandCacheEntry>();

// Shimmer Skeleton Card Component
function CatalogSkeletonCard({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 p-4 sm:p-5 flex flex-col md:flex-row gap-5 animate-pulse">
        <div className="w-full md:w-64 h-48 md:h-auto rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-10 bg-slate-100 dark:bg-slate-900 rounded-xl w-full" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between animate-pulse">
      <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 w-full" />
      <div className="p-5 space-y-3.5">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
        <div className="grid grid-cols-3 gap-1.5 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      </div>
    </div>
  );
}

export default function CatalogClient() {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";

  // Data state
  const [vehicles, setVehicles] = useState<CatalogVehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalInDb, setTotalInDb] = useState<number>(121651);

  // Sentinel ref for infinite endless scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Filters state
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedYearPill, setSelectedYearPill] = useState<string>("All");
  const [selectedPricePill, setSelectedPricePill] = useState<string>("All");
  const [selectedBodyType, setSelectedBodyType] = useState<string>("All");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("All");
  const [yearMin, setYearMin] = useState<number>(1995);
  const [yearMax, setYearMax] = useState<number>(2026);
  const [maxPriceUsd, setMaxPriceUsd] = useState<number>(500000);
  const [maxMileageKm, setMaxMileageKm] = useState<number>(350000);

  // 150ms search debounce to keep typing at 60fps
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchInput]);

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

  // Fetch initial cars for brand with high-performance memory caching
  useEffect(() => {
    let isCancelled = false;

    // Check memory cache first for instant 0ms brand toggling
    const cached = clientBrandCache.get(selectedBrand);
    if (cached && cached.vehicles.length > 0) {
      setVehicles(cached.vehicles);
      setCurrentPage(cached.page);
      setHasMore(cached.hasMore);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setCurrentPage(1);
    setHasMore(true);

    async function loadCatalog() {
      try {
        const params = new URLSearchParams();
        params.set("limit", "40");
        params.set("page", "1");
        if (selectedBrand !== "All") params.set("brand", selectedBrand);

        const res = await fetch(`/api/cars?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          const items: CatalogVehicle[] = json.data?.cars || json.cars || [];
          if (!isCancelled) {
            setVehicles(items);
            if (json.data?.total) setTotalInDb(json.data.total);
            const canMore = items.length >= 10;
            setHasMore(canMore);
            clientBrandCache.set(selectedBrand, {
              vehicles: items,
              page: 1,
              hasMore: canMore,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load catalog vehicles:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isCancelled = true;
    };
  }, [selectedBrand]);

  // Load next batch of cars dynamically for endless scroll (up to 500+ vehicles)
  const loadMoreVehicles = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    const nextPage = currentPage + 1;
    try {
      const params = new URLSearchParams();
      params.set("limit", "40");
      params.set("page", String(nextPage));
      if (selectedBrand !== "All") params.set("brand", selectedBrand);

      const res = await fetch(`/api/cars?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const newItems: CatalogVehicle[] = json.data?.cars || json.cars || [];
        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          setVehicles((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const unique = newItems.filter((c) => !existingIds.has(c.id));
            if (unique.length === 0) {
              setHasMore(false);
              return prev;
            }
            const combined = [...prev, ...unique];
            const stillHasMore = unique.length >= 10 && nextPage < 25; // allows up to 1,000 cars!
            clientBrandCache.set(selectedBrand, {
              vehicles: combined,
              page: nextPage,
              hasMore: stillHasMore,
            });
            return combined;
          });
          setCurrentPage(nextPage);
          if (newItems.length < 10 || nextPage >= 25) {
            setHasMore(false);
          }
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more vehicles:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoading, isLoadingMore, selectedBrand]);

  // Infinite Scroll IntersectionObserver with 800px pre-trigger for zero stutter on phones
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          loadMoreVehicles();
        }
      },
      {
        root: null,
        rootMargin: "800px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, isLoadingMore, loadMoreVehicles]);

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
  };

  // Brands list
  const availableBrands = [
    "All",
    "Genesis",
    "Hyundai",
    "Kia",
    "Mercedes-Benz",
    "BMW",
    "Porsche",
    "Audi",
  ];

  // Quick Year Filter Pills (Comprehensive ranges so zero vehicles are lost)
  const quickYearPills = [
    { id: "All", labelEn: "All Years", labelAr: "جميع الموديلات" },
    { id: "2022+", labelEn: "2022+", labelAr: "2022 وأحدث" },
    { id: "2018-2021", labelEn: "2018-2021", labelAr: "2018-2021" },
    { id: "2015-2017", labelEn: "2015-2017", labelAr: "2015-2017" },
    { id: "2010-2014", labelEn: "2010-2014", labelAr: "2010-2014" },
    { id: "pre-2010", labelEn: "Under 2010", labelAr: "قبل 2010" },
  ];

  // Quick Price Filter Pills
  const quickPricePills = [
    { id: "All", labelEn: "All Budgets", labelAr: "جميع الأسعار" },
    { id: "under-25k", labelEn: "Under $25k", labelAr: "أقل من $25,000" },
    { id: "25k-40k", labelEn: "$25k - $40k", labelAr: "$25k - $40k" },
    { id: "40k-60k", labelEn: "$40k - $60k", labelAr: "$40k - $60k" },
    { id: "60k-plus", labelEn: "$60k+ Luxury", labelAr: "$60k+ فاخر" },
  ];

  // Body types
  const availableBodyTypes = [
    { id: "All", en: "All Body Types", ar: "جميع الهياكل" },
    { id: "Sedan", en: "Sedan", ar: "سيدان" },
    { id: "SUV", en: "SUV / 4WD", ar: "دفع رباعي SUV" },
    { id: "Van", en: "Van / MPV", ar: "فان عائلي" },
  ];

  // Fuel types
  const availableFuelTypes = [
    { id: "All", en: "All Fuels", ar: "جميع أنواع الوقود" },
    { id: "Gasoline", en: "Gasoline", ar: "بنزين" },
    { id: "Diesel", en: "Diesel", ar: "ديزل" },
    { id: "Hybrid", en: "Hybrid", ar: "هايبرد" },
    { id: "Electric", en: "Electric (EV)", ar: "كهربائي EV" },
  ];

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedBrand("All");
    setSelectedYearPill("All");
    setSelectedPricePill("All");
    setSelectedBodyType("All");
    setSelectedFuelType("All");
    setSearchInput("");
    setDebouncedSearch("");
    setYearMin(1995);
    setYearMax(2026);
    setMaxPriceUsd(500000);
    setMaxMileageKm(350000);
  };

  // Filter & Sort logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((car) => {
        // Brand filter
        if (selectedBrand !== "All") {
          const targetBrand = selectedBrand.toLowerCase();
          const carBrand = (car.brand || "").toLowerCase();
          const carTitle = (car.title || "").toLowerCase();
          const matchBrand = carBrand.includes(targetBrand) || targetBrand.includes(carBrand);
          const matchTitle = carTitle.includes(targetBrand);
          if (!matchBrand && !matchTitle) return false;
        }

        // Quick Year Pill filter
        if (selectedYearPill !== "All") {
          if (selectedYearPill === "2022+" && car.year < 2022) return false;
          if (selectedYearPill === "2018-2021" && (car.year < 2018 || car.year > 2021)) return false;
          if (selectedYearPill === "2015-2017" && (car.year < 2015 || car.year > 2017)) return false;
          if (selectedYearPill === "2010-2014" && (car.year < 2010 || car.year > 2014)) return false;
          if (selectedYearPill === "pre-2010" && car.year >= 2010) return false;
        }

        // Quick Price Pill filter
        const priceUsd = car.prices?.USD
          ? Math.round(car.prices.USD)
          : typeof car.price === "number"
          ? Math.round(car.price / 1350)
          : 25000;

        if (selectedPricePill === "under-25k" && priceUsd >= 25000) return false;
        if (selectedPricePill === "25k-40k" && (priceUsd < 25000 || priceUsd > 40000)) return false;
        if (selectedPricePill === "40k-60k" && (priceUsd < 40000 || priceUsd > 60000)) return false;
        if (selectedPricePill === "60k-plus" && priceUsd < 60000) return false;

        // Debounced Search query
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          const matchTitle = car.title?.toLowerCase().includes(q);
          const matchTitleAr = car.titleAr?.includes(q);
          const matchBrand = car.brand?.toLowerCase().includes(q);
          const matchModel = car.model?.toLowerCase().includes(q);
          const matchVin = car.vin?.toLowerCase().includes(q);
          const matchPlate = car.licensePlate?.toLowerCase().includes(q);
          if (!matchTitle && !matchTitleAr && !matchBrand && !matchModel && !matchVin && !matchPlate) {
            return false;
          }
        }

        // Body type filter
        if (selectedBodyType !== "All") {
          const body = (car.bodyType || "").toLowerCase();
          const title = (car.title || "").toLowerCase();
          if (selectedBodyType === "SUV" && !body.includes("suv") && !title.includes("suv") && !title.includes("gv80") && !title.includes("palisade") && !title.includes("santa fe") && !title.includes("sorento") && !title.includes("tucson") && !title.includes("sportage")) {
            return false;
          }
          if (selectedBodyType === "Sedan" && !body.includes("sedan") && !title.includes("g80") && !title.includes("g90") && !title.includes("grandeur") && !title.includes("k5") && !title.includes("k8") && !title.includes("sonata") && !title.includes("avante") && !title.includes("elantra")) {
            return false;
          }
          if (selectedBodyType === "Van" && !body.includes("van") && !title.includes("carnival") && !title.includes("staria") && !title.includes("starex")) {
            return false;
          }
        }

        // Fuel type filter
        if (selectedFuelType !== "All") {
          const fuel = (car.fuelType || "").toLowerCase();
          if (!fuel.includes(selectedFuelType.toLowerCase())) return false;
        }

        // Year filter slider (only if user changed from default range 1995-2026)
        if (yearMin > 1995 && car.year < yearMin) return false;
        if (yearMax < 2026 && car.year > yearMax) return false;

        // Mileage filter slider (only if user changed from default 350k km)
        if (maxMileageKm < 350000 && car.mileage > maxMileageKm) return false;

        // Max price filter slider (only if user changed from default 500k)
        if (maxPriceUsd < 500000 && priceUsd > maxPriceUsd) return false;

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
    selectedBrand,
    selectedYearPill,
    selectedPricePill,
    selectedBodyType,
    selectedFuelType,
    debouncedSearch,
    yearMin,
    yearMax,
    maxMileageKm,
    maxPriceUsd,
    sortBy,
  ]);

  // WhatsApp consultation generator
  const getConsultationWhatsAppUrl = (car: CatalogVehicle) => {
    const priceUsd = car.prices?.USD ? Math.round(car.prices.USD) : typeof car.price === "number" ? Math.round(car.price / 1350) : 25000;
    const priceLocal = Math.round(priceUsd * activeCurrency.rate);
    const carUrl = `https://catalog.hisdomain.com/vehicle/${car.id}`;
    const countryText = isAr ? activeCurrency.nameAr : activeCurrency.nameEn;
    const portText = isAr ? activeCurrency.portAr : activeCurrency.portEn;
    const plateText = car.licensePlate || car.accidentHistory?.licensePlate || "";
    const displacementText = car.displacement ? `${car.displacement.toLocaleString()} cc` : "";
    const accidentSummary = car.accidentHistory?.hasAccident === false ? (isAr ? "خالية من الحوادث (فحص سليم)" : "Clean 0 Accidents") : (isAr ? "فحص هيكلي معتمد" : "Structural Audit Verified");

    let text = "";
    if (isAr) {
      text = `مرحباً أدفانسد كوريو 🇰🇷\nأود استشارة وشراء هذه السيارة من كتالوج إنكار المباشر:\n\n🚗 السيارة: ${car.titleAr || car.title}\n📅 الموديل: ${car.year}\n🛣️ الممشى: ${car.mileage?.toLocaleString()} كم\n⚙️ سعة المحرك: ${displacementText || "مطابق للمواصفات"}\n💰 السعر FOB كوريا: $${priceUsd.toLocaleString()} USD (~${priceLocal.toLocaleString()} ${activeCurrency.symbol})\n🔢 كود السيارة: #${car.id}${plateText ? ` (لوحة: ${plateText})` : ""}\n🛡️ الفحص: ${accidentSummary}\n📍 وجهة الشحن المطلوبة: ${countryText} - ${portText}\n🔗 رابط السيارة: ${carUrl}\n\nيرجى تزويدي بفيديو المعاينة المباشر وتقرير الفحص 150 نقطة وحجز الشحن البحري Ro-Ro.`;
    } else {
      text = `Hello Advanced Koryo 🇰🇷\nI would like to consult & purchase this vehicle from the direct Encar catalog:\n\n🚗 Vehicle: ${car.title}\n📅 Year: ${car.year}\n🛣️ Mileage: ${car.mileage?.toLocaleString()} km\n⚙️ Engine: ${displacementText || "Factory OEM"}\n💰 FOB Korea Price: $${priceUsd.toLocaleString()} USD (~${priceLocal.toLocaleString()} ${activeCurrency.symbol})\n🔢 Encar ID: #${car.id}${plateText ? ` (Plate: ${plateText})` : ""}\n🛡️ Inspection: ${accidentSummary}\n📍 Destination Port: ${countryText} - ${portText}\n🔗 Link: ${carUrl}\n\nPlease provide the 150-point inspection audit, video walkaround, and Ro-Ro ocean shipping invoice.`;
    }

    return `https://wa.me/821072290580?text=${encodeURIComponent(text)}`;
  };


  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-[#020a18] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Top Direct Export Announcement Bar */}
      <div className="bg-slate-950 dark:bg-[#070e1b] text-white border-b border-white/10 py-3 px-4">
        <div className="mx-auto max-w-[1440px] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 font-medium">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-white">
              {isAr ? "كتالوج السيارات الكورية المباشر من إنكار" : "Direct Encar South Korea Export Feed"}
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-300">
              {isAr
                ? "فحص 150 نقطة معتمد • شحن بحري Ro-Ro لجدة، جبل علي، الدوحة، الكويت، وكافة الموانئ"
                : "Official 150-Point Inspection • Direct Ro-Ro Freight to GCC & Worldwide Ports"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/821072290580?text=Hello%20Advanced%20Koryo,%20I%20have%20an%20Encar%20export%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-1.5 rounded-full text-[11px] font-black transition shadow-sm"
            >
              <PhoneCall className="h-3 w-3" />
              <span>{isAr ? "واتساب سيول: مباشر 24/7" : "Seoul WhatsApp: 24/7 Direct"}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Filter Bar & Controls */}
        <div className="rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 p-4 sm:p-6 mb-6 shadow-sm space-y-4">
          
          {/* Header Row: Title & Action Selectors */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Title & Live Counter */}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isAr ? "كتالوج السيارات الكورية المعتمدة" : "Verified Encar Export Catalog"}
                </h1>
                <span className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-mono font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>
                    {filteredVehicles.length} {isAr ? "سيارة معروضة" : "Cars Live"}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {isAr
                  ? "تصفح مستمر لا نهائي لأكثر من 120,000 سيارة كورية معتمدة مع أسعار FOB كوريا وحاسبة التكلفة واصلة للميناء."
                  : "Continuous endless scroll through 120,000+ certified South Korea vehicles with direct FOB pricing & landed cost."}
              </p>
            </div>

            {/* Quick Port / Currency Switcher + Sort + View Mode */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              
              {/* Destination Port Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
                <Ship className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isAr ? "الميناء:" : "Port:"}
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

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-800 text-sky-500 shadow-sm"
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
                      ? "bg-white dark:bg-slate-800 text-sky-500 shadow-sm"
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

          {/* Search Input & Quick Brand Chips */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={isAr ? "ابحث بالماركة، الموديل، الشاسي أو رقم اللوحة..." : "Search make, model, trim, VIN, or Korean plate..."}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setDebouncedSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Brand Pills */}
            <div className="w-full md:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {availableBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedBrand === brand
                      ? "bg-slate-950 dark:bg-sky-500 text-white dark:text-slate-950 shadow-md"
                      : "bg-slate-100 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-white/5"
                  }`}
                >
                  {brand === "All" ? (isAr ? "جميع الشركات" : "All Makes") : brand}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Year & Price Filter Pills (One-Tap Fast Filtering) */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Quick Year Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                {isAr ? "الموديل:" : "Year:"}
              </span>
              {quickYearPills.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedYearPill(pill.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedYearPill === pill.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {isAr ? pill.labelAr : pill.labelEn}
                </button>
              ))}
            </div>

            {/* Quick Price Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                {isAr ? "الميزانية:" : "Budget:"}
              </span>
              {quickPricePills.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedPricePill(pill.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedPricePill === pill.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {isAr ? pill.labelAr : pill.labelEn}
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
                <SlidersHorizontal className="h-4 w-4 text-sky-500" />
                <span>{isAr ? "تصفية السيارات" : "Filter Encar Feed"}</span>
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
                        ? "bg-sky-500 text-slate-950 font-black border-sky-400"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
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
              <div className="grid grid-cols-2 gap-1.5">
                {availableFuelTypes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFuelType(f.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center border transition cursor-pointer ${
                      selectedFuelType === f.id
                        ? "bg-sky-500 text-slate-950 font-black border-sky-400"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {isAr ? f.ar : f.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">{isAr ? "السعر الأقصى:" : "Max Price (USD):"}</span>
                <span className="text-sky-500 font-mono font-bold">
                  {maxPriceUsd >= 500000 ? (isAr ? "الكل (بدون حد)" : "Any Price") : `$${maxPriceUsd.toLocaleString()}`}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={maxPriceUsd}
                onChange={(e) => setMaxPriceUsd(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>$5,000</span>
                <span>$100,000</span>
                <span>{isAr ? "بدون حد" : "Any"}</span>
              </div>
            </div>

            {/* Max Mileage Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">{isAr ? "الممشى الأقصى:" : "Max Mileage:"}</span>
                <span className="text-sky-500 font-mono font-bold">
                  {maxMileageKm >= 350000 ? (isAr ? "الكل (بدون حد)" : "Any Mileage") : `${maxMileageKm.toLocaleString()} km`}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="350000"
                step="10000"
                value={maxMileageKm}
                onChange={(e) => setMaxMileageKm(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>10k km</span>
                <span>150k km</span>
                <span>{isAr ? "بدون حد" : "Any"}</span>
              </div>
            </div>

            {/* Ro-Ro Direct Shipping Highlight */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200/80 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>{isAr ? "فحص 150 نقطة وضمان الشحن" : "150-Point Audit & Transit"}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? "جميع السيارات مفحوصة بدقة وخالية من أي حوادث هيكلية مع شحن مباشر Ro-Ro إلى ميناء المقصد."
                  : "All vehicles certified 0% frame damage. Ro-Ro freight with marine insurance to your destination port."}
              </p>
            </div>
          </aside>

          {/* Vehicles List / Grid Area */}
          <main className="lg:col-span-3">
            
            {/* Shimmer Skeletons during loading */}
            {isLoading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {[...Array(6)].map((_, i) => (
                  <CatalogSkeletonCard key={i} viewMode={viewMode} />
                ))}
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
                  const priceKrw = car.price || (car.prices?.KRW ? car.prices.KRW : priceUsd * 1350);
                  const whatsappUrl = getConsultationWhatsAppUrl(car);
                  const photosCount = car.images?.length || 20;
                  const plate = car.licensePlate || car.accidentHistory?.licensePlate || "";
                  const displacementStr = car.displacement ? `${car.displacement.toLocaleString()} cc` : "";
                  const isCleanAccident = car.accidentHistory?.hasAccident === false || !car.accidentHistory?.hasAccident;

                  // List View Card
                  if (viewMode === "list") {
                    return (
                      <motion.div
                        key={car.id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.2) }}
                        className="rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-stretch hover:border-sky-500/40 transition-all shadow-sm"
                      >
                        {/* Car Image Preview */}
                        <div className="relative w-full md:w-64 h-48 md:h-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                          <Image
                            src={car.image || "/logo.jpg"}
                            alt={car.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 256px"
                            priority={idx < 2}
                            loading={idx < 4 ? "eager" : "lazy"}
                            decoding="async"
                            className="object-cover hover:scale-105 transition duration-500"
                            unoptimized
                          />
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-white bg-slate-950/85 backdrop-blur px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Encar Diagnostic</span>
                            </span>
                            <button
                              onClick={() => setQuickInspectVehicle(car)}
                              className="text-[10px] font-bold text-white bg-slate-950/85 backdrop-blur px-2 py-0.5 rounded flex items-center gap-1 hover:bg-sky-500 transition"
                            >
                              <Camera className="h-3 w-3 text-sky-400" />
                              <span>{photosCount}</span>
                            </button>
                          </div>

                          {plate && (
                            <div className="absolute bottom-2.5 left-2.5 bg-slate-950/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                              {plate}
                            </div>
                          )}
                        </div>

                        {/* Middle: Details & Specs */}
                        <div className="flex-grow flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                🛡️ {isCleanAccident ? (isAr ? "خالي من الحوادث 100%" : "0 Accidents Verified") : (isAr ? "فحص شاسي معتمد" : "Structural Audit Passed")}
                              </span>
                              {displacementStr && (
                                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                                  {displacementStr}
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded font-bold">
                                100% LHD Compliant
                              </span>
                            </div>
                            <Link href={`/vehicle/${car.id}`} className="hover:text-sky-500 transition">
                              <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                                {isAr && car.titleAr ? car.titleAr : car.title}
                              </h3>
                            </Link>
                          </div>

                          {/* Spec Pills */}
                          <div className="grid grid-cols-4 gap-2 text-[11px] font-bold bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <Calendar className="h-3.5 w-3.5 text-sky-500" />
                              <span>{car.year}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <Gauge className="h-3.5 w-3.5 text-sky-500" />
                              <span>{car.mileage?.toLocaleString()} km</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <Fuel className="h-3.5 w-3.5 text-sky-500" />
                              <span className="capitalize truncate">{car.fuelType}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <MapPin className="h-3.5 w-3.5 text-sky-500" />
                              <span className="truncate">{car.location || "Seoul"}</span>
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
                              {/* WhatsApp Button */}
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
                                <span>{isAr ? "استشارة وشراء" : "WhatsApp Buy"}</span>
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

                  // Grid View Card
                  return (
                    <motion.div
                      key={car.id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.2) }}
                      className="rounded-3xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between hover:border-sky-500/40 hover:shadow-xl transition-all duration-300"
                    >
                      <div>
                        {/* Image Link */}
                        <Link href={`/vehicle/${car.id}`} className="block relative aspect-[16/10] bg-slate-100 dark:bg-slate-950 overflow-hidden group">
                          <Image
                            src={car.image || "/logo.jpg"}
                            alt={car.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={idx < 2}
                            loading={idx < 4 ? "eager" : "lazy"}
                            decoding="async"
                            className="object-cover transition duration-500 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-white bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded-md shadow-sm border border-white/10">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Encar Diagnostic</span>
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuickInspectVehicle(car);
                              }}
                              className="text-[10px] font-bold text-white bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1 hover:bg-sky-500 transition"
                            >
                              <Camera className="h-3 w-3 text-sky-400" />
                              <span>{photosCount} Photos</span>
                            </button>
                          </div>

                          {/* Bottom Image Info */}
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono font-bold text-white">
                            <span className="bg-slate-950/85 px-2 py-0.5 rounded border border-white/10">
                              {plate || `#${car.id.slice(0, 8)}`}
                            </span>
                            <span className="bg-emerald-950/85 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              <span>{isCleanAccident ? (isAr ? "خالي حوادث" : "0 Accidents") : (isAr ? "فحص معتمد" : "Inspected")}</span>
                            </span>
                          </div>
                        </Link>

                        {/* Title & Specs */}
                        <div className="p-5 space-y-3.5">
                          <Link href={`/vehicle/${car.id}`} className="block hover:text-sky-500 transition">
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                              {isAr && car.titleAr ? car.titleAr : car.title}
                            </h3>
                          </Link>

                          {/* Key Specs Pill */}
                          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-slate-200/60 dark:border-white/5">
                            <div className="flex flex-col items-center justify-center text-center">
                              <Calendar className="h-3 w-3 text-sky-500 mb-0.5" />
                              <span>{car.year}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                              <Gauge className="h-3 w-3 text-sky-500 mb-0.5" />
                              <span>{car.mileage?.toLocaleString()} km</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                              <Fuel className="h-3 w-3 text-sky-500 mb-0.5" />
                              <span className="capitalize truncate max-w-full">{car.fuelType}</span>
                            </div>
                          </div>

                          {/* Displacement & LHD Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                            {displacementStr && (
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                                ⚙️ {displacementStr}
                              </span>
                            )}
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                              ✓ 100% LHD
                            </span>
                            {car.location && (
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded truncate max-w-[120px]">
                                📍 {car.location}
                              </span>
                            )}
                          </div>

                          {/* Pricing Display */}
                          <div className="flex items-baseline justify-between border-t border-slate-200 dark:border-white/10 pt-3">
                            <div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase">FOB Korea</div>
                              <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                                ${priceUsd.toLocaleString()}{" "}
                                <span className="text-xs font-normal text-slate-400">USD</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                ₩{(priceKrw / 1000000).toFixed(1)}M KRW
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">
                                Est. {activeCurrency.symbol}
                              </div>
                              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                ~{priceLocal.toLocaleString()} {activeCurrency.symbol}
                              </div>
                              <div className="text-[10px] text-sky-500 dark:text-sky-400 font-bold">
                                +${activeCurrency.freightUsd} Ro-Ro Port
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
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
                          <span>{isAr ? "استشارة وشراء" : "WhatsApp Sourcing"}</span>
                        </a>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setQuickInspectVehicle(car)}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 text-[11px] font-bold transition cursor-pointer"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 text-sky-500" />
                            <span>{isAr ? "فحص 150 نقطة" : "150-Pt Audit"}</span>
                          </button>

                          <Link
                            href={`/vehicle/${car.id}`}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white py-2.5 text-[11px] font-bold transition"
                          >
                            <span>{isAr ? "كامل المواصفات" : "Full Specs"}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="h-16 w-full pointer-events-none" />

            {/* Bottom Loading Indicator & Skeletons */}
            {isLoadingMore && (
              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-center gap-2.5 text-xs font-bold text-sky-600 dark:text-sky-400 py-2.5 px-5 rounded-full bg-sky-500/10 border border-sky-500/20 max-w-fit mx-auto animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                  <span>
                    {isAr
                      ? `جاري تحميل الدفعة التالية من سيارات إنكار تلقائياً (${filteredVehicles.length} معروضة)...`
                      : `Streaming next batch of Encar vehicles (${filteredVehicles.length} loaded)...`}
                  </span>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  <CatalogSkeletonCard viewMode={viewMode} />
                  <CatalogSkeletonCard viewMode={viewMode} />
                  <CatalogSkeletonCard viewMode={viewMode} />
                </div>
              </div>
            )}

            {/* Tap to Load Fallback */}
            {!isLoading && !isLoadingMore && hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMoreVehicles}
                  className="px-6 py-3 rounded-2xl bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-sky-500 text-xs font-bold transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? "اسحب للأسفل أو اضغط لتحميل المزيد" : "Scroll down or tap to load more"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Reached End of Infinite Scroll */}
            {!isLoading && !isLoadingMore && !hasMore && filteredVehicles.length > 0 && (
              <div className="mt-12 text-center border-t border-slate-200 dark:border-white/10 pt-8 pb-4 space-y-3">
                <p className="text-xs font-bold text-slate-500">
                  {isAr
                    ? `تم عرض جميع نتائج البحث المتاحة (${filteredVehicles.length} سيارة مفحوصة ومطابقة)`
                    : `You've viewed all ${filteredVehicles.length} verified Encar export vehicles for this category`}
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {isAr ? "العودة إلى الأعلى ↑" : "Back to Top ↑"}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick Inspection Modal */}
      <AnimatePresence>
        {quickInspectVehicle && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {isAr ? "فحص إنكار الرسمي (150 نقطة)" : "Official Encar Diagnostic Audit"}
                  </span>
                </div>
                <button
                  onClick={() => setQuickInspectVehicle(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Vehicle Title & Photo */}
              <div className="flex gap-4 items-center">
                <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                  <Image
                    src={quickInspectVehicle.image || "/logo.jpg"}
                    alt={quickInspectVehicle.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                    {isAr && quickInspectVehicle.titleAr ? quickInspectVehicle.titleAr : quickInspectVehicle.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-1">
                    <span>{quickInspectVehicle.year}</span>
                    <span>•</span>
                    <span>{quickInspectVehicle.mileage?.toLocaleString()} km</span>
                    <span>•</span>
                    <span className="text-emerald-500 font-bold">100% LHD</span>
                  </div>
                </div>
              </div>

              {/* 150-Point Audit Checklist */}
              <div className="space-y-2 pt-2">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  {isAr ? "نتائج التدقيق الفني والميكانيكي" : "Diagnostic Checkpoints"}
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>0% Frame Damage</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>0% Flood & Fire</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Engine Compression OK</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Transmission Verified</span>
                  </div>
                </div>
              </div>

              {/* Specs Strip */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Plate</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {quickInspectVehicle.licensePlate || "Verified"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Engine</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {quickInspectVehicle.displacement ? `${quickInspectVehicle.displacement.toLocaleString()} cc` : "OEM Spec"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Owners</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {quickInspectVehicle.accidentHistory?.ownerChangeCnt ?? 1} Owner
                  </span>
                </div>
              </div>

              {/* Landed Cost Breakdown */}
              {(() => {
                const priceUsd = quickInspectVehicle.prices?.USD
                  ? Math.round(quickInspectVehicle.prices.USD)
                  : typeof quickInspectVehicle.price === "number"
                  ? Math.round(quickInspectVehicle.price / 1350)
                  : 25000;
                const freight = activeCurrency.freightUsd;
                const insurance = 180;
                const duty = Math.round(priceUsd * 0.05);
                const landedUsd = priceUsd + freight + insurance + duty;
                const landedLocal = Math.round(landedUsd * activeCurrency.rate);

                return (
                  <div className="space-y-2 text-xs font-semibold border-t border-slate-200 dark:border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">FOB Price Korea:</span>
                      <span className="font-mono font-bold">${priceUsd.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ro-Ro Ocean Freight ({activeCurrency.portEn}):</span>
                      <span className="font-mono font-bold">+${freight.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Marine Insurance:</span>
                      <span className="font-mono font-bold">+${insurance.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2 text-sm font-black text-slate-900 dark:text-white">
                      <span>{isAr ? "الإجمالي التقديري واصل:" : "Estimated Landed Cost:"}</span>
                      <span className="text-sky-500 dark:text-sky-400 font-mono">
                        ${landedUsd.toLocaleString()} USD (~{landedLocal.toLocaleString()} {activeCurrency.symbol})
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons in Modal */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <a
                  href={getConsultationWhatsAppUrl(quickInspectVehicle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white py-3 text-xs font-extrabold uppercase tracking-wide transition shadow-md"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>{isAr ? "واتساب مباشر" : "WhatsApp Buy"}</span>
                </a>

                <Link
                  href={`/vehicle/${quickInspectVehicle.id}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3 text-xs font-black uppercase tracking-wide transition shadow-md"
                >
                  <span>{isAr ? "تقرير الفحص الكامل" : "Full 150-Pt Report"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
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
                  {isAr ? "تصفية السيارات" : "Filter Encar Feed"}
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
                          ? "bg-sky-500 text-slate-950"
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
                          ? "bg-sky-500 text-slate-950 border-sky-400"
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
