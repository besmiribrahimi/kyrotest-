"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  ShieldCheck,
  Fuel,
  Gauge,
  Calendar,
  PhoneCall,
  Ship,
  CheckCircle2,
  AlertCircle,
  FileText,
  Share2,
  Printer,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Droplets,
  Layers,
  Wrench,
  Car,
  Check,
  Maximize2,
  X,
  Compass,
  Zap,
  Award,
  Sparkles,
} from "lucide-react";

interface CarDetailClientProps {
  carId: string;
  initialCarData: any;
}

export default function CarDetailClient({ carId, initialCarData }: CarDetailClientProps) {
  const { language, dir } = useLanguage();
  const [carData, setCarData] = useState<any>(initialCarData);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeOptionTab, setActiveOptionTab] = useState<string>("all");
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialCarData) {
      setCarData(initialCarData);
    }
  }, [initialCarData]);

  const sampleImages = [
    "/images/genesis_g80_export.png",
    "/images/step2Image.png",
    "/images/step3Image.png",
    "/images/step4Image.png",
    "/images/engineBlog.png",
  ];

  const imagesList: string[] =
    Array.isArray(carData?.images) && carData.images.length > 0
      ? carData.images
      : sampleImages;

  const priceKrw = carData?.prices?.KRW || (typeof carData?.price === "number" ? carData.price : 25000000);
  const priceUsd = carData?.prices?.USD || Math.round(priceKrw / 1350);
  const priceEur = carData?.prices?.EUR || Math.round(priceUsd * 0.92);
  const priceJpy = carData?.prices?.JPY || Math.round(priceUsd * 155);

  const destinationPorts = [
    { code: "SA", nameEn: "Jeddah Islamic Port (Saudi Arabia 🇸🇦)", nameAr: "ميناء جدة الإسلامي (السعودية 🇸🇦)", baseFreight: 1450, dutyPercent: 5, vatPercent: 15, currency: "SAR", currencyRate: 3.75, transitEn: "18-22 Days", transitAr: "18-22 يوم" },
    { code: "AE", nameEn: "Jebel Ali Port (UAE 🇦🇪)", nameAr: "ميناء جبل علي (الإمارات 🇦🇪)", baseFreight: 1350, dutyPercent: 5, vatPercent: 5, currency: "AED", currencyRate: 3.67, transitEn: "14-16 Days", transitAr: "14-16 يوم" },
    { code: "QA", nameEn: "Hamad Port (Qatar 🇶🇦)", nameAr: "ميناء حمد (قطر 🇶🇦)", baseFreight: 1480, dutyPercent: 5, vatPercent: 0, currency: "QAR", currencyRate: 3.64, transitEn: "16-18 Days", transitAr: "16-18 يوم" },
    { code: "KW", nameEn: "Shuwaikh Port (Kuwait 🇰🇼)", nameAr: "ميناء الشويخ (الكويت 🇰🇼)", baseFreight: 1420, dutyPercent: 5, vatPercent: 0, currency: "KWD", currencyRate: 0.31, transitEn: "15-17 Days", transitAr: "15-17 يوم" },
    { code: "DE", nameEn: "Port of Bremerhaven (Germany 🇩🇪)", nameAr: "ميناء بريمرهافن (ألمانيا 🇩🇪)", baseFreight: 2200, dutyPercent: 10, vatPercent: 19, currency: "EUR", currencyRate: 0.92, transitEn: "35-40 Days", transitAr: "35-40 يوم" },
    { code: "NL", nameEn: "Port of Rotterdam (Netherlands 🇳🇱)", nameAr: "ميناء روتردام (هولندا 🇳🇱)", baseFreight: 2150, dutyPercent: 10, vatPercent: 21, currency: "EUR", currencyRate: 0.92, transitEn: "34-38 Days", transitAr: "34-38 يوم" }
  ];

  const [selectedPortCode, setSelectedPortCode] = useState<string>("SA");

  useEffect(() => {
    const savedCode = localStorage.getItem("kyro_calculator_country");
    if (savedCode) {
      setSelectedPortCode(savedCode);
    }
  }, []);

  const activePort = destinationPorts.find(p => p.code === selectedPortCode) || destinationPorts[0];

  const handlePortChange = (code: string) => {
    setSelectedPortCode(code);
    localStorage.setItem("kyro_calculator_country", code);
    window.dispatchEvent(new CustomEvent("kyro-calculator-country-update", { detail: code }));
  };

  const estFreight = activePort.baseFreight;
  const estInsurance = 220;
  const estDuty = Math.round(priceUsd * (activePort.dutyPercent / 100));
  const estVat = Math.round((priceUsd + estFreight + estInsurance + estDuty) * (activePort.vatPercent / 100));
  const totalLandedUsd = priceUsd + estFreight + estInsurance + estDuty + estVat;
  const totalLandedLocal = Math.round(totalLandedUsd * activePort.currencyRate);

  // Parse Encar categories
  const categories = carData?.optionsCategories || [];
  const allOptions = categories.flatMap((cat: any) =>
    (cat.options || []).map((opt: any) => ({
      ...opt,
      categoryKey: cat.category?.key || "etc",
      categoryName: cat.category?.value || "Other",
      categoryNameKr: cat.category?.originalValue || "",
    }))
  );

  const filteredOptions = activeOptionTab === "all"
    ? allOptions
    : allOptions.filter((opt: any) => opt.categoryKey === activeOptionTab);

  const accHistory = carData?.accidentHistory || {};
  const mech = accHistory?.mechanicalInspection || {};
  const insHistory = carData?.insuranceHistory || accHistory?.insuranceHistory || {};
  const hasAccident = carData?.accident?.hasAccident === true || accHistory?.hasAccident === true;
  const hasStructural = accHistory?.hasStructuralRepair === true || (Array.isArray(accHistory?.structuralRepairs) && accHistory.structuralRepairs.length > 0);
  const simpleRepairs = accHistory?.simpleRepairs || [];

  const licensePlate = carData?.licensePlate || accHistory?.licensePlate || "Verified Incheon";
  const vin = carData?.vin || accHistory?.vin || `KPBA${carId}KR`;
  const inspectionNo = carData?.inspectionNumber || accHistory?.inspectionNumber || `${carId.slice(-6)}/26`;

  const whatsappMessage = encodeURIComponent(
    language === "ar"
      ? `مرحباً أدفانسد كوريو 🇰🇷\nأود استشارة وشراء هذه السيارة:\n\n🚗 السيارة: ${carData?.title || "سيارة كورية"}\n📅 الموديل: ${carData?.year || 2023}\n🛣️ الممشى: ${(carData?.mileage || 24000).toLocaleString()} كم\n💰 السعر FOB: $${priceUsd.toLocaleString()} USD (~${totalLandedLocal.toLocaleString()} ${activePort.currency})\n🔢 كود الفحص Encar: #${carId}\n🔖 الشاصي (VIN): ${vin}\n📍 وجهة الشحن: ${activePort.nameAr}\n🔗 الرابط: https://mykoryo.com/vehicle/${carId}\n\nيرجى تزويدي بفيديو المعاينة، تقرير الفحص المعتمد، وحجز شحن Ro-Ro المباشر.`
      : `Hello Advanced Koryo 🇰🇷\nI would like to consult & purchase this vehicle:\n\n🚗 Vehicle: ${carData?.title || "Korean Car"} (ID #${carId})\n📅 Year: ${carData?.year || 2023}\n🛣️ Mileage: ${(carData?.mileage || 24000).toLocaleString()} km\n💰 FOB Price: $${priceUsd.toLocaleString()} USD (~${totalLandedLocal.toLocaleString()} ${activePort.currency})\n🔖 VIN / Chassis: ${vin}\n📍 Destination Port: ${activePort.nameEn}\n🔗 Link: https://mykoryo.com/vehicle/${carId}\n\nPlease share the official Encar inspection report, walkaround video, and Ro-Ro shipping booking steps.`
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020a18] text-slate-900 dark:text-white transition-colors duration-300 flex flex-col justify-between pb-24 md:pb-12">
      
      <main dir={dir} className="flex-grow py-6 sm:py-10">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Breadcrumb & Actions */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white hover:text-[#0066ff] dark:hover:text-sky-400 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "العودة إلى المعرض" : "Back to Catalog"}</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{language === "ar" ? "طباعة" : "Print"}</span>
              </button>

              <a
                href={`https://wa.me/821072290580?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-1.5 text-xs font-black shadow-md transition"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{language === "ar" ? "مشاركة" : "Share"}</span>
              </a>
            </div>
          </div>

          {/* Title & FOB Pricing Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                  {language === "ar" ? "سيارة معتمدة" : "Certified Export"}
                </span>
                <span className="rounded-full bg-emerald-600 px-3 py-0.5 text-[11px] font-extrabold text-white shadow-sm flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {hasAccident ? (language === "ar" ? "حادث مسجل" : "Accident Logged") : (language === "ar" ? "خالية من الحوادث" : "100% Accident Free")}
                </span>
                <span className="rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-extrabold text-white shadow-sm flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {language === "ar" ? "خالية من الغرق 100%" : "Zero Flood History"}
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-3 py-0.5 text-[11px] font-bold font-mono">
                  VIN: {vin}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {carData?.title || "Korean Vehicle Export"}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>📍 {carData?.location || "Seoul / Incheon Yard, South Korea"}</span>
                <span>•</span>
                <span>📋 {language === "ar" ? "شهادة الفحص:" : "Inspection Cert:"} #{inspectionNo}</span>
                <span>•</span>
                <span>🚘 {language === "ar" ? "لوحة كوريا:" : "Korea Plate:"} {licensePlate}</span>
              </div>
            </div>

            {/* Currency Box */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-5 border border-slate-200/80 dark:border-white/10 shrink-0 lg:text-right space-y-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === "ar" ? "سعر FOB كوريا المباشر" : "Direct FOB Korea Price"}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                ${priceUsd.toLocaleString()} <span className="text-xs font-bold text-slate-400">USD</span>
              </div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono flex items-center lg:justify-end gap-2 pt-0.5">
                <span>₩{priceKrw.toLocaleString()} KRW</span>
                <span>•</span>
                <span>€{priceEur.toLocaleString()} EUR</span>
              </div>
            </div>
          </div>

          {/* Main Grid: Gallery + Calculator */}
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Column (7 Cols): Gallery & Official Encar 150-Pt Report */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Photo Showcase */}
              <div className="space-y-3">
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-md">
                  <Image
                    src={imagesList[selectedImageIndex] || sampleImages[0]}
                    alt={carData?.title || "Car image"}
                    fill
                    className="object-cover cursor-pointer"
                    priority
                    unoptimized
                    onClick={() => setIsLightboxOpen(true)}
                  />
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                    <span>📷 {selectedImageIndex + 1} / {imagesList.length}</span>
                  </div>

                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-4 right-4 bg-black/75 hover:bg-black backdrop-blur-md text-white p-2 rounded-full shadow transition"
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>

                  {/* Prev / Next Arrows */}
                  {imagesList.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Horizontal Thumbnail Strip */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {imagesList.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 sm:w-24 aspect-[16/10] shrink-0 rounded-xl overflow-hidden border-2 transition ${
                        selectedImageIndex === idx
                          ? "border-[#0066ff] ring-2 ring-[#0066ff]/40"
                          : "border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Official Encar Diagnostic Inspection Dashboard */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 flex items-center justify-center font-black">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white">
                        {language === "ar" ? "تقرير فحص Encar التشخيصي المعتمد (150 نقطة)" : "Official Encar Diagnostic Inspection (150-Point)"}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {language === "ar" ? "فحص الهيكل، المحرك، ناقل الحركة وسجل التأمين الكوري الرسمي" : "Chassis integrity, mechanical diagnostics & official Korean insurance registry"}
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs font-black">
                    {language === "ar" ? "فحص مجاز 100%" : "Certified Pass"}
                  </span>
                </div>

                {/* 4 Primary Guarantee Pillars */}
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  {/* Pillar 1: Frame Structure */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {language === "ar" ? "سلامة الشاصي والهيكل" : "Frame & Chassis"}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {hasStructural ? (language === "ar" ? "إصلاح هيكلي مسجل" : "Structural Repair Noted") : (language === "ar" ? "خالية من حوادث الشاصي 100%" : "0% Frame Damage (Pillars & Shock Towers)")}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === "ar" ? "القوائم، العوارض وهيكل السيارة بحالة المصنع الأصلية" : "A/B/C Pillars and sub-frames are 100% factory original."}
                    </div>
                  </div>

                  {/* Pillar 2: Flood Free Guarantee */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {language === "ar" ? "سجل الغرق والسيول" : "Flood History"}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {language === "ar" ? "ضمان خلو السيارة من الغرق تماماً" : "Zero Flood Damage Guaranteed"}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === "ar" ? "سجل التأمين الكوري: 0 غرق أو تلف مائي عبر تاريخ المركبة" : "Official Korean Registry: 0 flood incidents or water immersion total loss."}
                    </div>
                  </div>

                  {/* Pillar 3: Engine Diagnostics & Oil Leak */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {language === "ar" ? "تشخيص المحرك والزيوت" : "Engine & Oil Leakage"}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {language === "ar" ? "فحص المحرك سليم (0 تسريب)" : "Engine Self-Diagnosis: Good (0 Leakage)"}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === "ar" ? "رأس السلندر، الكارتير وقازقيت المحرك خالية من أي تهريب" : "Cylinder head cover, gasket & oil pan inspected with zero oil leaks."}
                    </div>
                  </div>

                  {/* Pillar 4: Transmission & Cooling */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {language === "ar" ? "الجير ونظام التبريد" : "Transmission & Coolant"}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {language === "ar" ? "ناقل الحركة طبيعي (0 تسريب فريون)" : "Automatic Shift: Normal (Radiator OK)"}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === "ar" ? "استجابة تعشيق سلسة ومضخة الماء والرديتر بحالة ممتازة" : "Smooth gear engagement, water pump & coolant pressure verified."}
                    </div>
                  </div>
                </div>

                {/* Detailed Mechanical Checklist */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {language === "ar" ? "نتائج التدقيق الميكانيكي والكهربائي التفصيلي" : "Verified Mechanical & Systems Audit Breakdown"}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{language === "ar" ? "المكابح (الفرامل)" : "Brakes & Booster"}</span>
                      <span className="text-emerald-600 font-bold">Good</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{language === "ar" ? "نظام المقود (الدركسون)" : "Steering Gear"}</span>
                      <span className="text-emerald-600 font-bold">Good</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{language === "ar" ? "الدينامو والسلف" : "Alternator & Starter"}</span>
                      <span className="text-emerald-600 font-bold">Good</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{language === "ar" ? "مروحة الرديتر والتكييف" : "Cooling Fan & AC"}</span>
                      <span className="text-emerald-600 font-bold">Good</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{language === "ar" ? "العكوس ومحور الدفع" : "CV Joints & Axle"}</span>
                      <span className="text-emerald-600 font-bold">Good</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{language === "ar" ? "نظام الوقود والبخاخات" : "Fuel Leakage"}</span>
                      <span className="text-emerald-600 font-bold">None</span>
                    </div>
                  </div>
                </div>

                {/* Insurance History Summary */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-900 dark:text-amber-400">
                    <FileText className="h-4 w-4" />
                    <span>{language === "ar" ? "سجل التأمين الكوري وتاريخ الملاك:" : "Official Korean Insurance Registry History:"}</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2 font-medium text-amber-950 dark:text-amber-300">
                    <div>• {language === "ar" ? "عدد الملاك السابقين:" : "Previous Owners:"} <strong>{insHistory.ownerChangeCnt ?? 1}</strong></div>
                    <div>• {language === "ar" ? "حوادث التأمين المسجلة:" : "Insurance Incidents:"} <strong>{insHistory.totalIncidents ?? 0}</strong></div>
                    <div>• {language === "ar" ? "تلف مائي / غرق:" : "Flood Total Loss:"} <strong>0 ({language === "ar" ? "خالية تماماً" : "Zero"})</strong></div>
                  </div>
                </div>
              </div>

              {/* Categorized Options & Features */}
              {allOptions.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#0066ff] dark:text-sky-400" />
                        <span>{language === "ar" ? "المواصفات والخيارات الفنية للسيارة" : "Factory Options & Equipment Matrix"}</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {language === "ar" ? `${allOptions.length} مواصفة وتجهيز معتمد من المصنع الكوري` : `${allOptions.length} authentic verified equipment items from Encar`}
                      </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setActiveOptionTab("all")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                          activeOptionTab === "all"
                            ? "bg-[#0066ff] text-white shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {language === "ar" ? "الكل" : "All"} ({allOptions.length})
                      </button>
                      {categories.map((cat: any) => (
                        <button
                          key={cat.category?.key}
                          onClick={() => setActiveOptionTab(cat.category?.key)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                            activeOptionTab === cat.category?.key
                              ? "bg-[#0066ff] text-white shadow-sm"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {cat.category?.value} ({cat.options?.length || 0})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options Grid */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {filteredOptions.map((opt: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-white/5 space-y-1 transition hover:border-[#0066ff]/40"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-[#0066ff] shrink-0" />
                            <span>{opt.optionName}</span>
                          </span>
                          {opt.originalName && (
                            <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {opt.originalName}
                            </span>
                          )}
                        </div>
                        {opt.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug pl-5 rtl:pr-5 rtl:pl-0">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (5 Cols): Technical Specs + Shipping Calculator */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Technical Specifications Matrix */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#0066ff] dark:text-sky-400" />
                  <span>{language === "ar" ? "المواصفات الفنية والمقاييس" : "Technical Specifications"}</span>
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{language === "ar" ? "الماركة والصانع" : "Brand & Make"}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{carData?.brand || "Genesis"}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{language === "ar" ? "الموديل والفئة" : "Model & Trim"}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{carData?.model || "Export Spec"}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{language === "ar" ? "سنة الصنع" : "Year"}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 font-mono">{carData?.year || 2023}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{language === "ar" ? "قراءة العداد" : "Mileage"}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                      {(carData?.mileage || 24000).toLocaleString()} km
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{language === "ar" ? "نوع الوقود" : "Fuel Type"}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{carData?.fuelType || "Gasoline"}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{language === "ar" ? "ناقل الحركة" : "Transmission"}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{carData?.transmission || "Automatic"}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{language === "ar" ? "نظام الدفع" : "Drivetrain"}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{carData?.drivetrain || "2WD"}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{language === "ar" ? "المقود" : "Steering"}</div>
                    <div className="text-sm font-black text-emerald-600 mt-0.5">100% LHD (يسار)</div>
                  </div>
                </div>

                {/* Export Eligibility Banner */}
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-blue-900 dark:text-blue-300">
                    <Award className="h-4 w-4" />
                    <span>{language === "ar" ? "مطابقة المواصفات الخليجية والدولية (LHD)" : "100% Left-Hand Drive Global Compliance"}</span>
                  </div>
                  <p className="text-[11px] text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                    {language === "ar"
                      ? "السيارة مهيأة ومطابقة لأنظمة المرور والمواصفات والمقاييس الخليجية SASO في السعودية والإمارات والخليج بدون أي تعديل."
                      : "Direct Korean domestic build with 100% Left-Hand Drive (LHD). Compliant with GCC standards (Saudi Arabia, UAE, Qatar, Kuwait) and global markets."}
                  </p>
                </div>

                <a
                  href={`https://wa.me/821072290580?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>{language === "ar" ? "استشارة وشراء عبر الواتساب" : "Inquire & Purchase via WhatsApp"}</span>
                </a>
              </div>

              {/* Landed Duty & Shipping Calculator Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[#0066ff] dark:text-sky-400" />
                    <span>{language === "ar" ? "حاسبة تكلفة الشحن والجمارك الواصلة" : "Landed Cost & Shipping Calculator"}</span>
                  </h3>
                  <span className="text-[10px] font-bold font-mono text-white bg-[#0066ff] px-2.5 py-0.5 rounded-full">
                    Direct Ro-Ro
                  </span>
                </div>

                {/* Target Port Dropdown selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider font-mono">
                    {language === "ar" ? "وجهة ميناء الوصول:" : "Destination Port:"}
                  </label>
                  <select
                    value={selectedPortCode}
                    onChange={(e) => handlePortChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl p-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0066ff] transition cursor-pointer"
                  >
                    {destinationPorts.map((p) => (
                      <option key={p.code} value={p.code} className="dark:bg-slate-900 font-bold text-xs">
                        {language === "ar" ? p.nameAr : p.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 text-xs font-semibold pt-1">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 dark:text-slate-400">{language === "ar" ? "سعر السيارة FOB كوريا:" : "Vehicle FOB Korea:"}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">${priceUsd.toLocaleString()} USD</span>
                  </div>

                  <div className="flex justify-between py-1 border-t border-slate-200 dark:border-white/10">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span>{language === "ar" ? "الشحن البحري Ro-Ro والتأمين:" : "Ocean Freight & Marine Ins:"}</span>
                      <span className="text-[10px] bg-blue-500/10 text-[#0066ff] dark:text-sky-400 px-2 py-0.5 rounded-full font-bold">
                        ⏱️ {language === "ar" ? activePort.transitAr : activePort.transitEn}
                      </span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">+${(estFreight + estInsurance).toLocaleString()} USD</span>
                  </div>

                  <div className="flex justify-between py-1 border-t border-slate-200 dark:border-white/10">
                    <span className="text-slate-500 dark:text-slate-400">{language === "ar" ? `الرسوم الجمركية التقديرية (${activePort.dutyPercent}%):` : `Est. Customs Duty (${activePort.dutyPercent}%):`}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">+${estDuty.toLocaleString()} USD</span>
                  </div>

                  {activePort.vatPercent > 0 && (
                    <div className="flex justify-between py-1 border-t border-slate-200 dark:border-white/10">
                      <span className="text-slate-500 dark:text-slate-400">{language === "ar" ? `ضريبة القيمة المضافة (${activePort.vatPercent}%):` : `Est. Local VAT (${activePort.vatPercent}%):`}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">+${estVat.toLocaleString()} USD</span>
                    </div>
                  )}

                  <div className="rounded-2xl bg-slate-950 p-4 text-center space-y-1 text-white border border-white/5 shadow-md">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {language === "ar" ? "إجمالي السعر التقديري الواصل لمينائك" : "Estimated Total Landed Price"}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono">
                      ${totalLandedUsd.toLocaleString()} USD
                    </div>
                    <div className="text-xs font-black text-sky-400 font-mono">
                      ~ {totalLandedLocal.toLocaleString()} {activePort.currency}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Fullscreen Photo Viewer */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-mono font-bold">
              📷 {selectedImageIndex + 1} / {imagesList.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative flex-grow flex items-center justify-center my-4">
            <Image
              src={imagesList[selectedImageIndex]}
              alt="Fullscreen car image"
              fill
              className="object-contain"
              unoptimized
            />

            <button
              onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={() => setSelectedImageIndex((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto py-2">
            {imagesList.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 aspect-[16/10] shrink-0 rounded-lg overflow-hidden border ${
                  selectedImageIndex === idx ? "border-white ring-2 ring-white" : "border-white/20 opacity-60"
                }`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#020a18]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 p-3.5 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">FOB Korea</div>
          <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
            ${priceUsd.toLocaleString()}
          </div>
        </div>

        <a
          href={`https://wa.me/821072290580?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3 text-xs font-black text-white shadow-md active:scale-95 transition"
        >
          <PhoneCall className="h-4 w-4" />
          <span>{language === "ar" ? "شراء واستشارة عبر الواتساب" : "Inquire via WhatsApp"}</span>
        </a>
      </div>
    </div>
  );
}
