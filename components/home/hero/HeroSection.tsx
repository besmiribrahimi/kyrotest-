"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import {
  ShieldCheck,
  Search,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  Ship,
  Sparkles,
  Calendar,
  Gauge,
  Fuel,
} from "lucide-react";

interface ShowcaseVehicle {
  id: string;
  name: string;
  price: string;
  badge: string;
  image: string;
  engine: string;
  mileage: string;
  year: number;
}

export default function HeroSection() {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);

  const showcaseVehicles: ShowcaseVehicle[] = [
    {
      id: "genesis-g80",
      name: "Genesis G80 3.5T AWD",
      price: "$28,500 USD",
      badge: isAr ? "فحص إنكار معتمد" : "Encar Trust Verified",
      image: "/images/genesis_g80_export.png",
      engine: "3.5L V6 Twin-Turbo",
      mileage: "28,400 km",
      year: 2022,
    },
    {
      id: "kia-carnival",
      name: "Kia Carnival Hi-Limousine",
      price: "$34,200 USD",
      badge: isAr ? "مزادات لوتيه الممتازة" : "Lotte Auction Grade A",
      image: "/images/kia_carnival_export.png",
      engine: "3.5L V6 Smartstream",
      mileage: "18,200 km",
      year: 2023,
    },
    {
      id: "hyundai-palisade",
      name: "Hyundai Palisade Calligraphy",
      price: "$29,800 USD",
      badge: isAr ? "خالي من الحوادث 100%" : "0% Structural Damage",
      image: "/images/hyundai_palisade_export.png",
      engine: "3.8L V6 HTRAC AWD",
      mileage: "31,000 km",
      year: 2022,
    },
  ];

  const activeCar = showcaseVehicles[selectedVehicleIndex];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/catalog");
    }
  };

  const popularBrands = [
    { name: "Hyundai", ar: "هيونداي" },
    { name: "Kia", ar: "كيا" },
    { name: "Genesis", ar: "جينيسيس" },
    { name: "Mercedes", ar: "مرسيدس" },
    { name: "BMW", ar: "بي إم دبليو" },
    { name: "Audi", ar: "أودي" },
  ];

  const waInquiryUrl = `https://wa.me/821072290580?text=${encodeURIComponent(
    isAr
      ? `مرحباً أدفانسد كوريو 🇰🇷\nأود الاستفسار عن استيراد سيارة من كوريا (${activeCar.name}) بسعر ${activeCar.price}.`
      : `Hello Advanced Koryo 🇰🇷\nI am inquiring about sourcing the ${activeCar.name} listed at ${activeCar.price}.`
  )}`;

  return (
    <section
      dir={dir}
      className="relative overflow-hidden bg-white dark:bg-[#020a18] pt-8 sm:pt-12 pb-12 sm:pb-16 text-slate-900 dark:text-white transition-colors duration-300"
    >
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 space-y-8">
        
        {/* Main Grid: Info + Mobile/Desktop Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Search & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Licensed Exporter Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-sky-500/10 border border-slate-200 dark:border-sky-500/20 px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-sky-300 shadow-sm">
              <span className="text-sm">🇰🇷</span>
              <ShieldCheck className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400" />
              <span>
                {isAr
                  ? "مصدر سيارات مرخص في سيول • فحص إنكار وKB المباشر"
                  : "Licensed Seoul Exporter • Encar & KB Direct Feed"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-slate-950 dark:text-white">
              {isAr ? (
                <>
                  تصدير السيارات من كوريا مباشرة{" "}
                  <span className="block mt-1.5 text-[#0066ff] dark:text-sky-400">
                    بفحص 150 نقطة وشحن لمينائك
                  </span>
                </>
              ) : (
                <>
                  Direct Korean Vehicle Sourcing{" "}
                  <span className="block mt-1.5 text-[#0066ff] dark:text-sky-400">
                    100% Inspected & Shipped to Port
                  </span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-2xl">
              {isAr
                ? "تصفح أكثر من 150,000 سيارة كورية مفحوصة مباشرة من منصات إنكار (Encar) وKB تشاتشاتشا مع أسعار FOB الحقيقية، تدقيق الشاسي والمحرك، وشحن بحري مباشر Ro-Ro إلى السعودية، الإمارات، قطر، الكويت، وكافة الموانئ."
                : "Browse 150,000+ verified vehicles directly from Encar and KB ChaChaCha with transparent FOB pricing, 150-point diagnostic inspection, and insured Ro-Ro ocean shipping to Jeddah, Jebel Ali, Dammam, and worldwide."}
            </p>

            {/* Phone-Centered Quick Search Box */}
            <form
              onSubmit={handleSearch}
              className="bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 rounded-2xl p-2 sm:p-2.5 shadow-md space-y-2.5"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isAr
                        ? "ابحث بالماركة أو الموديل (مثل: Palisade, G80, Carnival, BMW)..."
                        : "Search make, model, or trim (e.g. Genesis G80, Palisade, Carnival)..."
                    }
                    className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0066ff] transition"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0066ff] hover:bg-blue-600 text-white text-xs sm:text-sm font-black rounded-xl transition shadow-sm whitespace-nowrap cursor-pointer"
                >
                  {isAr ? "بحث فوري" : "Search Cars"}
                </button>
              </div>

              {/* Fast Brand Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] font-bold">
                <span className="text-slate-400 shrink-0 text-[10px] uppercase font-mono px-1">
                  {isAr ? "شائع:" : "Popular:"}
                </span>
                {popularBrands.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => router.push(`/catalog?brand=${encodeURIComponent(b.name)}`)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-[#0066ff] dark:hover:border-sky-400 transition whitespace-nowrap cursor-pointer"
                  >
                    {isAr ? b.ar : b.name}
                  </button>
                ))}
              </div>
            </form>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/catalog"
                className="flex items-center justify-center gap-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-[#0066ff] dark:hover:bg-slate-100 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shadow-md"
              >
                <span>{isAr ? "تصفح كتالوج السيارات المباشر" : "Browse Live Export Catalog"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={waInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide transition shadow-md shadow-emerald-500/20"
              >
                <PhoneCall className="h-4 w-4" />
                <span>{isAr ? "استفسار وشراء عبر واتساب" : "Chat with Exporter in Seoul"}</span>
              </a>
            </div>

            {/* 3 Key Trust Metrics */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-white/5 text-center sm:text-start">
                <div className="text-base sm:text-xl font-black font-mono text-slate-950 dark:text-white">
                  150,000+
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                  {isAr ? "سيارة كورية معتمدة" : "Verified Listings"}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-white/5 text-center sm:text-start">
                <div className="text-base sm:text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  150-Point
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                  {isAr ? "فحص شاسي ومحرك" : "Diagnostic Audit"}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-white/5 text-center sm:text-start">
                <div className="text-base sm:text-xl font-black font-mono text-[#0066ff] dark:text-sky-400">
                  18-22 Days
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                  {isAr ? "شحن Ro-Ro للخليج" : "Ro-Ro Ocean Transit"}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Phone/Desktop Car Showcase */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
              
              {/* Car Image Preview */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900">
                <Image
                  src={activeCar.image}
                  alt={activeCar.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  {activeCar.badge}
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono font-bold text-white bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-xl border border-white/10">
                  <span>{activeCar.engine}</span>
                  <span className="text-emerald-400">✓ 100% LHD</span>
                </div>
              </div>

              {/* Vehicle Title & Specs */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {activeCar.name}
                  </h3>
                  <span className="text-base sm:text-lg font-black font-mono text-[#0066ff] dark:text-sky-400">
                    {activeCar.price}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-white/5">
                    <Calendar className="h-3.5 w-3.5 text-[#0066ff]" />
                    <span>{isAr ? `موديل ${activeCar.year}` : `Year ${activeCar.year}`}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-white/5">
                    <Gauge className="h-3.5 w-3.5 text-[#0066ff]" />
                    <span>{activeCar.mileage}</span>
                  </div>
                </div>
              </div>

              {/* Selector Tabs for 3 featured cars */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {showcaseVehicles.map((car, idx) => (
                  <button
                    key={car.id}
                    onClick={() => setSelectedVehicleIndex(idx)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold truncate transition cursor-pointer ${
                      selectedVehicleIndex === idx
                        ? "bg-[#0066ff] text-white shadow"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5"
                    }`}
                  >
                    {car.name.split(" ")[0]} {car.name.split(" ")[1]}
                  </button>
                ))}
              </div>

              {/* Direct WhatsApp Action for this car */}
              <a
                href={waInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>{isAr ? "استفسار فوري عن هذه السيارة" : "Inquire About This Vehicle"}</span>
              </a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
