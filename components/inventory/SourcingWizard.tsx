"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import carLogos from "@/lib/car-logos.json";
import { useLanguage } from "@/lib/i18n";
import {
  Car,
  MapPin,
  DollarSign,
  PhoneCall,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function SourcingWizard() {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [customPort, setCustomPort] = useState("");

  const logoMap = carLogos as Record<string, string>;

  const [formData, setFormData] = useState({
    make: "Hyundai",
    bodyType: "SUV / 4x4",
    budget: "$20,000 - $35,000",
    destination: "Jeddah Islamic Port (Saudi Arabia)",
  });

  const makes = [
    { name: "Hyundai", key: "hyundai" },
    { name: "Kia", key: "kia" },
    { name: "Genesis", key: "genesis" },
    { name: "Mercedes-Benz", key: "mercedesbenz" },
    { name: "BMW", key: "bmw" },
    { name: "Audi", key: "audi" },
    { name: "Porsche", key: "porsche" },
    { name: "Renault Korea", key: "renaultsamsung" },
  ];

  const bodyTypes = [
    { nameEn: "SUV / 4x4", nameAr: "دفع رباعي / عائلية", icon: "🚙" },
    { nameEn: "Sedan", nameAr: "سيدان", icon: "🚗" },
    { nameEn: "EV / Hybrid", nameAr: "كهرباء / هجين", icon: "⚡" },
    { nameEn: "Commercial Van / Truck", nameAr: "شاحنة / نقل", icon: "🚛" },
  ];

  const budgets = [
    { nameEn: "Under $18,000", nameAr: "أقل من 18,000 دولار" },
    { nameEn: "$18,000 - $30,000", nameAr: "18,000 - 30,000 دولار" },
    { nameEn: "$30,000 - $50,000", nameAr: "30,000 - 50,000 دولار" },
    { nameEn: "Luxury ($50,000+)", nameAr: "فاخرة (أكثر من 50,000 دولار)" },
  ];

  const destinations = [
    { portEn: "Jeddah Islamic Port (Saudi Arabia)", portAr: "ميناء جدة الإسلامي (السعودية)", flag: "🇸🇦" },
    { portEn: "Dammam King Abdulaziz Port (Saudi Arabia)", portAr: "ميناء الملك عبدالعزيز بالدمام (السعودية)", flag: "🇸🇦" },
    { portEn: "Jebel Ali Port (UAE / Dubai)", portAr: "ميناء جبل علي (الإمارات / دبي)", flag: "🇦🇪" },
    { portEn: "Hamad Port (Qatar)", portAr: "ميناء حمد (قطر)", flag: "🇶🇦" },
    { portEn: "Shuwaikh Port (Kuwait)", portAr: "ميناء الشويخ (الكويت)", flag: "🇰🇼" },
  ];

  const targetPort = customPort.trim() || (isAr
    ? destinations.find((d) => d.portEn === formData.destination)?.portAr || formData.destination
    : formData.destination);

  const waRequestUrl = `https://wa.me/821072290580?text=${encodeURIComponent(
    isAr
      ? `مرحباً أدفانسد كوريو 🇰🇷\nأود طلب توريد سيارة بمواصفات مخصصة من كوريا:\n\n🚗 الماركة: ${formData.make}\n🚙 نوع الهيكل: ${formData.bodyType}\n💰 الميزانية: ${formData.budget}\n⚓ ميناء الوصول: ${targetPort}\n\nيرجى تزويدي بالخيارات المتاحة من مزادات إنكار وسيول مع تكلفة الشحن والفحص.`
      : `Hello Advanced Koryo 🇰🇷\nI would like to request custom vehicle sourcing from South Korea:\n\n🚗 Make: ${formData.make}\n🚙 Body Type: ${formData.bodyType}\n💰 Budget: ${formData.budget}\n⚓ Destination Port: ${targetPort}\n\nPlease share matching cars from Encar / Seoul auctions with inspection & landed shipping quotes.`
  )}`;

  return (
    <>
      {/* Homepage Quick Sourcing Card */}
      <div
        dir={dir}
        className="rounded-3xl bg-slate-900 dark:bg-[#070e1b] border border-slate-800 dark:border-white/10 p-5 sm:p-6 text-white shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-3 py-1 text-xs font-bold text-sky-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isAr ? "خدمة التوريد الخاص من سيول" : "Custom Sourcing Service"}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              {isAr
                ? "تبحث عن سيارة بمواصفات معينة لم تجدها في المعروض؟"
                : "Looking for a specific vehicle not listed in the feed?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? "يقوم فريقنا الميداني في سيول بفحص سيارات منصة إنكار (Encar) وشبكات الوكلاء وتوريدها لمينائك مباشرة بفحص 150 نقطة كامل."
                : "Our Seoul team inspects Encar yards and certified dealer networks to secure your exact car with 150-point inspection and direct Ro-Ro export."}
            </p>
          </div>

          <button
            onClick={() => {
              setStep(1);
              setIsOpen(true);
            }}
            className="flex items-center gap-2 bg-[#0066ff] hover:bg-blue-600 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shadow-md shrink-0 cursor-pointer"
          >
            <span>{isAr ? "طلب سيارة مخصصة" : "Request Custom Car"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sourcing Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div
            dir={dir}
            className="relative w-full max-w-xl bg-white dark:bg-[#0b1528] rounded-3xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-white space-y-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Header & Close Button */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-600/10 text-[#0066ff] dark:text-sky-400 font-bold">
                  🇰🇷
                </span>
                <div>
                  <h4 className="text-base font-extrabold">
                    {isAr ? "طلب سيارة مخصصة من كوريا" : "Custom Sourcing Request"}
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr ? `الخطوة ${step} من 3` : `Step ${step} of 3`}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step 1: Make & Body */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-mono">
                    {isAr ? "1. اختر الماركة المطلوبة:" : "1. Select Brand:"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {makes.map((m) => {
                      const isSelected = formData.make === m.name;
                      const logoUrl = logoMap[m.key];
                      return (
                        <button
                          key={m.name}
                          onClick={() => setFormData({ ...formData, make: m.name })}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            isSelected
                              ? "bg-[#0066ff] text-white border-[#0066ff] shadow-sm"
                              : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-[#0066ff]/40"
                          }`}
                        >
                          {logoUrl ? (
                            <div className="relative h-5 w-5 shrink-0 bg-white rounded p-0.5">
                              <Image src={logoUrl} alt={m.name} fill className="object-contain" unoptimized />
                            </div>
                          ) : (
                            <span>🚗</span>
                          )}
                          <span className="truncate">{m.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-mono">
                    {isAr ? "2. نوع الهيكل:" : "2. Body Type:"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {bodyTypes.map((b) => {
                      const isSelected = formData.bodyType === b.nameEn;
                      return (
                        <button
                          key={b.nameEn}
                          onClick={() => setFormData({ ...formData, bodyType: b.nameEn })}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            isSelected
                              ? "bg-[#0066ff] text-white border-[#0066ff] shadow-sm"
                              : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-[#0066ff]/40"
                          }`}
                        >
                          <span className="text-base">{b.icon}</span>
                          <span>{isAr ? b.nameAr : b.nameEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer"
                  >
                    <span>{isAr ? "المتابعة للخطوة التالية" : "Continue to Step 2"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Budget & Port */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-mono">
                    {isAr ? "1. الميزانية التقديرية (FOB كوريا):" : "1. Estimated FOB Budget:"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {budgets.map((b) => {
                      const isSelected = formData.budget === b.nameEn;
                      return (
                        <button
                          key={b.nameEn}
                          onClick={() => setFormData({ ...formData, budget: b.nameEn })}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                            isSelected
                              ? "bg-[#0066ff] text-white border-[#0066ff] shadow-sm"
                              : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-[#0066ff]/40"
                          }`}
                        >
                          <span>{isAr ? b.nameAr : b.nameEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-mono">
                    {isAr ? "2. ميناء الوصول والتسليم:" : "2. Destination Port:"}
                  </label>
                  <div className="space-y-1.5">
                    {destinations.map((d) => {
                      const isSelected = formData.destination === d.portEn && !customPort;
                      return (
                        <button
                          key={d.portEn}
                          onClick={() => {
                            setFormData({ ...formData, destination: d.portEn });
                            setCustomPort("");
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition text-start cursor-pointer ${
                            isSelected
                              ? "bg-[#0066ff] text-white border-[#0066ff] shadow-sm"
                              : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-[#0066ff]/40"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{d.flag}</span>
                            <span>{isAr ? d.portAr : d.portEn}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {isAr ? "السابق" : "Back"}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-2/3 flex items-center justify-center gap-2 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer"
                  >
                    <span>{isAr ? "تأكيد وإرسال الطلب" : "Confirm Request"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Instant Summary & WhatsApp Submission */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                    {isAr ? "ملخص طلب التوريد" : "Sourcing Request Summary"}
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-500">{isAr ? "الماركة:" : "Make:"}</span>
                    <span>{formData.make}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-500">{isAr ? "الهيكل:" : "Body:"}</span>
                    <span>{formData.bodyType}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-500">{isAr ? "الميزانية:" : "Budget:"}</span>
                    <span>{formData.budget}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-500">{isAr ? "الميناء:" : "Port:"}</span>
                    <span className="truncate max-w-[200px]">{targetPort}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href={waRequestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide transition shadow-lg shadow-emerald-500/20"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>{isAr ? "إرسال الطلب فوراً عبر واتساب" : "Send Request Directly via WhatsApp"}</span>
                  </a>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/catalog?brand=${encodeURIComponent(formData.make)}`);
                    }}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition hover:bg-slate-200 cursor-pointer"
                  >
                    {isAr ? "تصفح السيارات المتاحة فوراً في الكتالوج" : "Browse Matching Cars in Catalog"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
