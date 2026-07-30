"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import {
  Search,
  CheckCircle2,
  Clock,
  Ship,
  ShieldCheck,
  Download,
  AlertCircle,
  Calendar,
  Anchor,
  FileText,
} from "lucide-react";

interface ProgressLog {
  date: string;
  stage: string;
  status: "completed" | "in_progress" | "pending";
  titleEn: string;
  titleAr: string;
  notesEn: string;
  notesAr: string;
}

interface OrderRecord {
  orderId: string;
  vin: string;
  vehicleName: string;
  clientName: string;
  destinationPort: string;
  currentStageIndex: number;
  currentStatusEn: string;
  currentStatusAr: string;
  vesselName: string;
  etaDate: string;
  logs: ProgressLog[];
}

const SAMPLE_ORDERS: Record<string, OrderRecord> = {
  "MK-9042": {
    orderId: "MK-9042",
    vin: "KMHD7817BPK102938",
    vehicleName: "2023 Kia Seltos 1.6T Signature (White)",
    clientName: "Mohammed Al-Otaibi",
    destinationPort: "Jeddah Islamic Port, Saudi Arabia 🇸🇦",
    currentStageIndex: 3,
    currentStatusEn: "Vehicle loaded on Ro-Ro Vessel (Hyundai Glovis), en route to Red Sea",
    currentStatusAr: "تم تحميل السيارة على سفينة Ro-Ro (هيونداي جلوبيس) وفي الطريق لميناء جدة",
    vesselName: "Glovis Supreme V-042",
    etaDate: "2026-08-12",
    logs: [
      {
        date: "2026-07-02",
        stage: "Stage 1",
        status: "completed",
        titleEn: "150-Point Encar & Koryo Inspection Completed",
        titleAr: "إتمام الفحص الشامل 150 نقطة في مركز كوريا",
        notesEn: "Engine compression 100%, zero frame damage detected, paint depth verified uniform.",
        notesAr: "ضغط المحرك 100%، خلو تام من أي صدمات هيكلية، وسماكة الطلاء مطابقة للمصنع.",
      },
      {
        date: "2026-07-08",
        stage: "Stage 2",
        status: "completed",
        titleEn: "Korean Export De-Registration Approved",
        titleAr: "إلغاء التسجيل الكوري وإصدار شهادة التصدير",
        notesEn: "Ministry of Transport export license issued. VIN verified clean for GCC importation.",
        notesAr: "تم صدور رخصة التصدير الحكومية والتأكد من مطابقة الشاسي لمواصفات التصدير.",
      },
      {
        date: "2026-07-15",
        stage: "Stage 3",
        status: "completed",
        titleEn: "Busan Port Storage & Export Customs Clearance",
        titleAr: "إيداع السيارة في ميناء بوسان والتخليص الجمركي الكوري",
        notesEn: "Customs declaration cleared at Busan New Port Terminal B-4.",
        notesAr: "إنهاء الإقرار الجمركي والتأمين التصديري في ساحة ميناء بوسان الجديد.",
      },
      {
        date: "2026-07-21",
        stage: "Stage 4",
        status: "in_progress",
        titleEn: "Ro-Ro Vessel Boarding & Maritime Insurance Active",
        titleAr: "تحميل السيارة على السفينة وتفعيل التأمين البحري الشامل",
        notesEn: "Vehicle secured in Deck 4, Compartment B. Vessel departed Busan Port.",
        notesAr: "تم تثبيت السيارة في الطابق الرابع وتغطيتها بالتأمين البحري ورافقت السفينة الميناء.",
      },
      {
        date: "2026-08-12",
        stage: "Stage 5",
        status: "pending",
        titleEn: "Jeddah Port Arrival & Delivery Handover",
        titleAr: "الوصول المتوقع لميناء جدة والتسليم النهائي",
        notesEn: "Pending arrival and customs clearance at destination.",
        notesAr: "في انتظار الوصول وإنهاء التخليص في ميناء الوصول.",
      },
    ],
  },
  "MK-7182": {
    orderId: "MK-7182",
    vin: "WAUZZZ4G8EN123456",
    vehicleName: "2014 Audi A7 3.0 TDI Quattro (Black)",
    clientName: "Tariq Al-Mansoor",
    destinationPort: "Jebel Ali Port, Dubai, UAE 🇦🇪",
    currentStageIndex: 2,
    currentStatusEn: "Cleared Korean Customs at Busan Port, Scheduled for Next Carrier Vessel",
    currentStatusAr: "تم التخليص الجمركي في ميناء بوسان وفي انتظار موعد السفينة القادمة",
    vesselName: "Hoegh Autoliners H-119",
    etaDate: "2026-08-18",
    logs: [
      {
        date: "2026-07-10",
        stage: "Stage 1",
        status: "completed",
        titleEn: "Vehicle Inspection Audit Approved",
        titleAr: "اعتماد تقرير فحص المحرك والأنظمة الإلكترونية",
        notesEn: "All systems diagnostics cleared. Air suspension and Quattro transmission tested.",
        notesAr: "تم فحص الهايدروليك، المحرك ونظام الدفع الرباعي وحالتها ممتازة.",
      },
      {
        date: "2026-07-16",
        stage: "Stage 2",
        status: "completed",
        titleEn: "Export Certification & Legal Titles Cleared",
        titleAr: "إنجاز الأوراق الرسمية وشهادة التصدير الدولية",
        notesEn: "Certificate of Origin and chassis validation completed.",
        notesAr: "تم تجهيز شهادة المنشأ ووثائق الشاسي المعتمدة.",
      },
      {
        date: "2026-07-20",
        stage: "Stage 3",
        status: "in_progress",
        titleEn: "Busan Maritime Holding Yard",
        titleAr: "إيداع السيارة في ميناء بوسان بانتظار السفينة",
        notesEn: "Vehicle staged in protected maritime holding lot awaiting vessel booking.",
        notesAr: "السيارة متواجدة في ساحة الشحن البحرية المحمية بميناء بوسان.",
      },
    ],
  },
};

export default function WeeklyProgressReport() {
  const { t, language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("MK-9042");
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(SAMPLE_ORDERS["MK-9042"]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const query = searchQuery.trim().toUpperCase();

    if (SAMPLE_ORDERS[query]) {
      setActiveOrder(SAMPLE_ORDERS[query]);
    } else {
      const found = Object.values(SAMPLE_ORDERS).find(
        (o) => o.vin.toUpperCase() === query
      );
      if (found) {
        setActiveOrder(found);
      } else {
        setSearchError(
          language === "ar"
            ? "لم يتم العثور على شحنة بهٰذا الرقم. جرب الرمز التجريبي MK-9042 أو MK-7182"
            : "No active shipment found with this ID. Try sample code MK-9042 or MK-7182"
        );
      }
    }
  };

  const stages = [
    t.weeklyReport.stage1,
    t.weeklyReport.stage2,
    t.weeklyReport.stage3,
    t.weeklyReport.stage4,
    t.weeklyReport.stage5,
  ];

  return (
    <section id="weekly-report" dir={dir} className="relative py-20 bg-[#FFFFFF] text-[#000000] border-t border-slate-200">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#000000] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] mb-4">
            <ShieldCheck className="h-4 w-4 text-[#FFFFFF]" />
            <span>{t.weeklyReport.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#000000] mb-3">
            {t.weeklyReport.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {t.weeklyReport.subtitle}
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-3 koryo-card-white p-2 rounded-2xl shadow-sm">
            <div className="relative flex-grow flex items-center px-3">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.weeklyReport.enterVinPlaceholder}
                className="w-full bg-transparent px-3 py-2 text-sm text-[#000000] placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl koryo-btn-black px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] transition shrink-0"
            >
              {t.weeklyReport.trackButton}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500 font-medium">
            <span>{language === "ar" ? "أمثلة سريعة للتتبع:" : "Sample Tracking Codes:"}</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("MK-9042");
                setActiveOrder(SAMPLE_ORDERS["MK-9042"]);
                setSearchError(null);
              }}
              className="font-mono text-[#000000] underline font-bold"
            >
              MK-9042 (Kia Seltos)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("MK-7182");
                setActiveOrder(SAMPLE_ORDERS["MK-7182"]);
                setSearchError(null);
              }}
              className="font-mono text-[#000000] underline font-bold"
            >
              MK-7182 (Audi A7)
            </button>
          </div>

          {searchError && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </form>

        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="koryo-card-white rounded-3xl p-6 sm:p-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-[#000000] px-3 py-1 font-mono text-xs font-bold text-[#FFFFFF]">
                    {activeOrder.orderId}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">VIN: {activeOrder.vin}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#000000] mt-1">
                  {activeOrder.vehicleName}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {language === "ar" ? "العميل:" : "Client:"} <strong className="text-[#000000]">{activeOrder.clientName}</strong> | {language === "ar" ? "وجهة الوصول:" : "Destination:"} <strong className="text-[#000000]">{activeOrder.destinationPort}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200 p-4 text-center min-w-[140px]">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">{language === "ar" ? "ناقلة الشحن" : "Vessel Carrier"}</div>
                  <div className="text-xs font-bold text-[#000000] mt-1 flex items-center justify-center gap-1">
                    <Ship className="h-3.5 w-3.5" />
                    <span>{activeOrder.vesselName}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200 p-4 text-center min-w-[140px]">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">{language === "ar" ? "الوصول المتوقع" : "Estimated ETA"}</div>
                  <div className="text-xs font-bold text-[#000000] mt-1 flex items-center justify-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{activeOrder.etaDate}</span>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl koryo-btn-black px-4 py-3 text-xs font-bold text-[#FFFFFF] transition"
                >
                  <Download className="h-4 w-4" />
                  <span>{t.weeklyReport.downloadPdf}</span>
                </button>
              </div>
            </div>

            <div className="py-8 border-b border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-6 flex items-center gap-2">
                <Anchor className="h-4 w-4 text-[#000000]" />
                <span>{language === "ar" ? "مسار إنجاز الطلب والتصدير الكوري" : "Export & Sourcing Milestone Stepper"}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {stages.map((stageName, idx) => {
                  const isDone = idx < activeOrder.currentStageIndex;
                  const isCurrent = idx === activeOrder.currentStageIndex;

                  return (
                    <div
                      key={idx}
                      className={`relative flex flex-col p-4 rounded-2xl border transition-all ${
                        isDone
                          ? "bg-[#000000] border-[#000000] text-[#FFFFFF]"
                          : isCurrent
                          ? "bg-[#FFFFFF] border-[#003478] text-[#000000] ring-2 ring-[#003478]"
                          : "bg-[#F8FAFC] border-slate-200 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                          {language === "ar" ? `المرحلة ${idx + 1}` : `Stage ${idx + 1}`}
                        </span>
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-[#FFFFFF]" />
                        ) : isCurrent ? (
                          <Clock className="h-4 w-4 text-[#003478] animate-pulse" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-slate-300" />
                        )}
                      </div>
                      <p className="text-xs font-bold leading-snug">{stageName}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#000000]" />
                <span>{t.weeklyReport.latestUpdate}</span>
              </h4>

              <div className="space-y-4">
                {activeOrder.logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 transition"
                  >
                    <div className="shrink-0 flex items-center gap-2 font-mono text-xs font-bold text-[#FFFFFF] bg-[#000000] px-3 py-1.5 rounded-lg">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{log.date}</span>
                    </div>

                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-sm font-bold text-[#000000]">
                          {language === "ar" ? log.titleAr : log.titleEn}
                        </h5>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#003478] text-[#FFFFFF]">
                          {log.stage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {language === "ar" ? log.notesAr : log.notesEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
