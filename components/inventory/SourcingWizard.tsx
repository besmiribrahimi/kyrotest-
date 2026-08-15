"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import carLogos from "@/lib/car-logos.json";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Database,
  MapPin,
  Car,
  DollarSign,
  MessageSquare,
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface WizardData {
  make: string;
  bodyType: string;
  budget: string;
  destination: string;
}

export default function SourcingWizard() {
  const { language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [customPort, setCustomPort] = useState("");

  const logoMap = carLogos as Record<string, string>;

  const [formData, setFormData] = useState<WizardData>({
    make: "",
    bodyType: "",
    budget: "",
    destination: "",
  });

  useEffect(() => {
    // Load saved wizard choices on mount
    const savedMake = localStorage.getItem("kyro_wizard_make") || "";
    const savedBodyType = localStorage.getItem("kyro_wizard_bodyType") || "";
    const savedBudget = localStorage.getItem("kyro_wizard_budget") || "";
    const savedDestination = localStorage.getItem("kyro_wizard_destination") || "";
    
    setFormData({
      make: savedMake,
      bodyType: savedBodyType,
      budget: savedBudget,
      destination: savedDestination,
    });
  }, []);

  const updateField = (field: keyof WizardData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    localStorage.setItem(`kyro_wizard_${field}`, value);
    // Dispatch instant filter change event for other listeners
    window.dispatchEvent(new CustomEvent(`kyro-wizard-update-${field}`, { detail: value }));
  };

  const makes = [
    { name: "Hyundai", key: "hyundai" },
    { name: "Kia", key: "kia" },
    { name: "Genesis", key: "genesis" },
    { name: "SsangYong / KGM", key: "ssangyong" },
    { name: "Renault Korea", key: "renaultsamsung" },
    { name: "Mercedes-Benz", key: "mercedesbenz" },
    { name: "BMW", key: "bmw" },
    { name: "Audi", key: "audi" },
    { name: "Porsche", key: "porsche" },
    { name: "Chevrolet / GM Korea", key: "chevrolet" },
    { name: "Tesla", key: "tesla" },
    { name: "Lexus / Toyota", key: "lexus" },
  ];

  const bodyTypes = [
    { nameEn: "Sedan", nameAr: "سيدان", icon: "🚗" },
    { nameEn: "SUV / Offroad", nameAr: "دفع رباعي / عائلية", icon: "🚙" },
    { nameEn: "EV / Hybrid", nameAr: "كهربائية / هجينة", icon: "⚡" },
    { nameEn: "Commercial Truck", nameAr: "شاحنة تجارية", icon: "🚛" },
  ];

  const budgets = [
    { nameEn: "Under $15,000", nameAr: "أقل من 15,000 دولار" },
    { nameEn: "$15,000 - $30,000", nameAr: "15,000 - 30,000 دولار" },
    { nameEn: "$30,000 - $50,000", nameAr: "30,000 - 50,000 دولار" },
    { nameEn: "Premium ($50,000+)", nameAr: "فاخرة (أكثر من 50,000 دولار)" },
  ];

  const destinations = [
    { nameEn: "Jeddah Islamic Port (Saudi Arabia 🇸🇦)", nameAr: "ميناء جدة الإسلامي (السعودية 🇸🇦)" },
    { nameEn: "Jebel Ali Port, Dubai (UAE 🇦🇪)", nameAr: "ميناء جبل علي، دبي (الإمارات 🇦🇪)" },
    { nameEn: "Hamad Port, Doha (Qatar 🇶🇦)", nameAr: "ميناء حمد، الدوحة (قطر 🇶🇦)" },
    { nameEn: "Shuwaikh Port (Kuwait 🇰🇼)", nameAr: "ميناء الشويخ (الكويت 🇰🇼)" },
    { nameEn: "Aqaba Port (Jordan 🇯🇴)", nameAr: "ميناء العقبة (الأردن 🇯🇴)" },
    { nameEn: "Port of Bremerhaven (Germany 🇩🇪)", nameAr: "ميناء بريمرهافن (ألمانيا 🇩🇪)" },
    { nameEn: "Port of Zeebrugge (Belgium 🇧🇪)", nameAr: "ميناء زيبروج (بلجيكا 🇧🇪)" },
    { nameEn: "Port of Rotterdam (Netherlands 🇳🇱)", nameAr: "ميناء روتردام (هولندا 🇳🇱)" },
    { nameEn: "Port of Southampton (United Kingdom 🇬🇧)", nameAr: "ميناء ساوثهامبتون (المملكة المتحدة 🇬🇧)" },
    { nameEn: "Port of Le Havre (France 🇫🇷)", nameAr: "ميناء لو هافر (فرنسا 🇫🇷)" },
    { nameEn: "Port of Barcelona (Spain 🇪🇸)", nameAr: "ميناء برشلونة (إسبانيا 🇪🇸)" },
    { nameEn: "Port of Livorno (Italy 🇮🇹)", nameAr: "ميناء ليفورنو (إيطاليا 🇮🇹)" },
    { nameEn: "Port of Koper (Slovenia 🇸🇮)", nameAr: "ميناء كوبير (سلوفينيا 🇸🇮)" },
  ];

  // Simulation timeline on step 5
  useEffect(() => {
    if (step === 5) {
      setProgressPercent(0);
      setMatchesCount(0);
      
      const duration = 4000; // 4 seconds total
      const intervalTime = 50;
      const steps = duration / intervalTime;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const percent = Math.min((currentStep / steps) * 100, 100);
        setProgressPercent(percent);

        // Dynamic count roll-up simulation
        if (percent < 20) {
          setMatchesCount(0);
        } else if (percent >= 20 && percent < 45) {
          setMatchesCount(4);
        } else if (percent >= 45 && percent < 75) {
          setMatchesCount(11);
        } else if (percent >= 75 && percent < 95) {
          setMatchesCount(23);
        } else {
          setMatchesCount(34);
        }

        if (currentStep >= steps) {
          clearInterval(timer);
          setTimeout(() => {
            setStep(6);
            // Dispatch wizard completion event
            window.dispatchEvent(new CustomEvent("kyro-wizard-complete", { detail: formData }));
          }, 600);
        }
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [step, formData]);

  const whatsappMessage = encodeURIComponent(
    `Hello Advanced Koryo Sourcing! I completed the Interactive Sourcing Wizard:\n` +
      `- Make: ${formData.make}\n` +
      `- Body: ${formData.bodyType}\n` +
      `- Budget Limit: ${formData.budget}\n` +
      `- Destination: ${formData.destination}\n` +
      `Please send me matching active auction files this week.`
  );

  return (
    <>
      {/* Ultra Eye-Catching Sourcing Quiz Banner Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001739] via-[#003da8] to-[#001739] dark:from-[#08101f] dark:via-[#003478] dark:to-[#030a18] border-2 border-sky-400/50 dark:border-sky-400/40 p-8 sm:p-10 shadow-[0_0_50px_-10px_rgba(0,102,255,0.4)] transition-all duration-300 group">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition duration-700" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#0066ff]/25 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition duration-700" />
        
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/20 border border-sky-400/50 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-sky-300 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>{language === "ar" ? "مساعد التوريد بالذكاء الاصطناعي" : "AI Vehicle Sourcing Assistant"}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-[10px] font-bold text-emerald-300">
                <span>{language === "ar" ? "⚡ في 30 ثانية" : "⚡ 30-Sec Live Scan"}</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-sans tracking-tight leading-tight">
              {language === "ar" ? "لم تجد سيارة أحلامك بعد في المعرض؟" : "Can't Find Your Ideal Vehicle in Our Feed?"}
            </h3>
            
            <p className="text-sm sm:text-base text-blue-100 dark:text-slate-200 max-w-2xl font-semibold leading-relaxed transition-colors">
              {language === "ar"
                ? "امسح قواعد بيانات مزادات سيول ومستودعات التصدير الكورية مباشرة عبر مساعدنا التفاعلي الذكي!"
                : "Sift through live Seoul auctions & Incheon Port export yards in 30 seconds. Discover 100% verified GCC & European inventory."}
            </p>

            {/* Feature Highlight Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-sky-200 font-semibold">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-300" />
                {language === "ar" ? "مزادات كورية مباشرة" : "Direct Korean Auctions"}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-300" />
                {language === "ar" ? "شحن دولي مؤمن" : "Insured Global Shipping"}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-300" />
                {language === "ar" ? "فحص 150 نقطة" : "150-Point Audit Passed"}
              </span>
            </div>
          </div>
          
          <div className="relative shrink-0">
            {/* Pulsing Outer Halo Rings */}
            <span className="absolute inset-0 rounded-2xl bg-sky-400/30 animate-ping pointer-events-none scale-105" />
            <button
              onClick={() => {
                setStep(1);
                setIsOpen(true);
                setCustomPort("");
              }}
              className="relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-white via-sky-50 to-white dark:from-sky-400 dark:to-[#0066ff] text-[#002b66] dark:text-white hover:opacity-95 px-8 py-5 text-sm font-black uppercase tracking-wider shadow-[0_10px_30px_rgba(0,102,255,0.4)] transition transform hover:-translate-y-1 hover:scale-105"
            >
              <Zap className="h-5 w-5 text-[#0066ff] dark:text-white animate-pulse" />
              <span>{language === "ar" ? "ابدأ البحث التفاعلي الآن" : "Start Sourcing Wizard"}</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sourcing Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#020a18]/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0b1528] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 flex flex-col justify-between"
              dir={dir}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Steps Progress Header */}
              {step <= 4 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    <span>{language === "ar" ? `الخطوة ${step} من 4` : `Step ${step} of 4`}</span>
                    <span>{Math.round((step / 4) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0066ff] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(step / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Step Renderings */}
              <div className="min-h-[290px] flex flex-col justify-center">
                
                {/* Step 1: Brands Sourcing */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 transition">
                      <Car className="h-5 w-5 text-[#0066ff] dark:text-sky-400" />
                      <span>{language === "ar" ? "اختر ماركة السيارة المطلوبة:" : "Which automotive brand are you sourcing?"}</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
                      {makes.map((m) => {
                        const isSelected = formData.make === m.name;
                        const logoUrl = logoMap[m.key] || "";
                        
                        return (
                          <motion.button
                            key={m.name}
                            whileHover={{ scale: 1.03, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              updateField("make", m.name);
                              setStep(2);
                            }}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all min-h-[96px] ${
                              isSelected
                                ? "bg-[#0066ff]/5 border-[#0066ff] text-[#0066ff] dark:text-sky-300 shadow-[0_0_15px_rgba(0,102,255,0.2)] font-black"
                                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-350 hover:border-[#0066ff]/40 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                          >
                            {logoUrl ? (
                              <div className="relative h-10 w-10 mb-2 flex items-center justify-center bg-white rounded-lg p-1 border border-slate-100">
                                <Image
                                  src={logoUrl}
                                  alt={m.name}
                                  fill
                                  className="object-contain p-0.5"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <span className="text-2xl mb-1.5">🚗</span>
                            )}
                            <span className="text-[11px] font-bold font-sans line-clamp-1">{m.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Body Types Sourcing */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 transition">
                      <Car className="h-5 w-5 text-[#0066ff] dark:text-sky-400" />
                      <span>{language === "ar" ? "اختر نمط هيكل السيارة:" : "Select body styling type:"}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {bodyTypes.map((b) => {
                        const isSelected = formData.bodyType === b.nameEn;
                        const name = language === "ar" ? b.nameAr : b.nameEn;
                        return (
                          <motion.button
                            key={b.nameEn}
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              updateField("bodyType", b.nameEn);
                              setStep(3);
                            }}
                            className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all ${
                              isSelected
                                ? "bg-[#0066ff]/5 border-[#0066ff] text-[#0066ff] dark:text-sky-300 shadow-[0_0_15px_rgba(0,102,255,0.2)] font-black"
                                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-[#0066ff]/40 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className="text-3xl mb-2">{b.icon}</span>
                            <span className="text-xs font-bold">{name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Budget Range Sourcing */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 transition">
                      <DollarSign className="h-5 w-5 text-[#0066ff] dark:text-sky-400" />
                      <span>{language === "ar" ? "حدد ميزانيتك المقدرة (FOB كوريا):" : "Determine your target FOB budget:"}</span>
                    </h4>
                    <div className="grid gap-2.5">
                      {budgets.map((b) => {
                        const isSelected = formData.budget === b.nameEn;
                        const name = language === "ar" ? b.nameAr : b.nameEn;
                        return (
                          <motion.button
                            key={b.nameEn}
                            whileHover={{ scale: 1.01, x: dir === "rtl" ? -4 : 4 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => {
                              updateField("budget", b.nameEn);
                              setStep(4);
                            }}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-[#0066ff]/5 border-[#0066ff] text-[#0066ff] dark:text-sky-300 shadow-[0_0_15px_rgba(0,102,255,0.2)] font-black"
                                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-[#0066ff]/40 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className="text-xs font-bold">{name}</span>
                            <ChevronRight className="h-4 w-4" />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Destination Port with custom input */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 transition">
                      <MapPin className="h-5 w-5 text-[#0066ff] dark:text-sky-400" />
                      <span>{language === "ar" ? "حدد ميناء الوصول البحري:" : "Select your regional arrival port:"}</span>
                    </h4>
                    
                    <div className="grid sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {destinations.map((d) => {
                        const isSelected = formData.destination === d.nameEn;
                        const name = language === "ar" ? d.nameAr : d.nameEn;
                        return (
                          <motion.button
                            key={d.nameEn}
                            whileHover={{ scale: 1.01, x: dir === "rtl" ? -4 : 4 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => {
                              updateField("destination", d.nameEn);
                              setStep(5);
                            }}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-[#0066ff]/5 border-[#0066ff] text-[#0066ff] dark:text-sky-300 shadow-[0_0_15px_rgba(0,102,255,0.2)] font-black"
                                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-[#0066ff]/40 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className="text-xs font-bold truncate max-w-[85%]">{name}</span>
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Custom Port Sourcing Input */}
                    <div className="pt-3 border-t border-slate-150 dark:border-white/10 mt-3 transition-colors">
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {language === "ar" ? "أو اكتب ميناء / مدينة أخرى للتصدير:" : "Or specify another custom shipping port:"}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customPort}
                          placeholder={language === "ar" ? "مثال: ميناء طنجة، المغرب" : "e.g. Port of Oslo, Norway"}
                          onChange={(e) => {
                            setCustomPort(e.target.value);
                            updateField("destination", e.target.value);
                          }}
                          className="flex-grow px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-[#0066ff]"
                        />
                        {customPort.trim() && (
                          <button
                            onClick={() => setStep(5)}
                            className="px-5 py-2.5 bg-[#0066ff] text-white text-xs font-bold rounded-xl hover:bg-blue-650 transition shadow-sm"
                          >
                            {language === "ar" ? "متابعة" : "Next"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: High-Fidelity Scanning simulation */}
                {step === 5 && (
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    
                    {/* Left: Loader & Count Badge */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="relative flex items-center justify-center">
                        <div className="h-24 w-24 border-4 border-[#0066ff]/10 border-t-[#0066ff] rounded-full animate-spin" />
                        <div className="absolute h-20 w-20 border-4 border-dashed border-sky-400/20 border-b-sky-400/50 rounded-full animate-spin [animation-duration:8s]" />
                        
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight transition">
                            {matchesCount}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            {language === "ar" ? "مطابقة" : "Matches"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0066ff] transition-all duration-100 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Right: Live Sourcing Checklist checkoffs */}
                    <div className="md:col-span-7 space-y-3.5 text-xs font-semibold">
                      
                      {/* Check 1 */}
                      <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                        progressPercent >= 25 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                          : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600"
                      }`}>
                        {progressPercent >= 25 ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Loader2 className="h-5 w-5 animate-spin shrink-0 text-[#0066ff]" />
                        )}
                        <span>{language === "ar" ? "الاتصال بقاعدة بيانات Encar في سيول" : "Connecting to Encar Seoul Yard Database"}</span>
                      </div>

                      {/* Check 2 */}
                      <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                        progressPercent >= 50 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                          : progressPercent >= 25 
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400"
                          : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600"
                      }`}>
                        {progressPercent >= 50 ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : progressPercent >= 25 ? (
                          <Loader2 className="h-5 w-5 animate-spin shrink-0 text-[#0066ff]" />
                        ) : (
                          <Database className="h-5 w-5 shrink-0" />
                        )}
                        <span>{language === "ar" ? "مسح منصات مزادات Lotte الكبرى" : "Scanning Lotte & Glovis Auto Auctions"}</span>
                      </div>

                      {/* Check 3 */}
                      <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                        progressPercent >= 75 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                          : progressPercent >= 50 
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400"
                          : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600"
                      }`}>
                        {progressPercent >= 75 ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : progressPercent >= 50 ? (
                          <Loader2 className="h-5 w-5 animate-spin shrink-0 text-[#0066ff]" />
                        ) : (
                          <Database className="h-5 w-5 shrink-0" />
                        )}
                        <span>{language === "ar" ? "سحب تفاصيل اللوجستيات بميناء إنشون" : "Pulling Incheon Port Export Yards"}</span>
                      </div>

                      {/* Check 4 */}
                      <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                        progressPercent >= 100 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                          : progressPercent >= 75 
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400"
                          : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600"
                      }`}>
                        {progressPercent >= 100 ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : progressPercent >= 75 ? (
                          <Loader2 className="h-5 w-5 animate-spin shrink-0 text-[#0066ff]" />
                        ) : (
                          <Database className="h-5 w-5 shrink-0" />
                        )}
                        <span>{language === "ar" ? "تصفية سجلات الحوادث وفحص الصدمات" : "Filtering Accident Logs & Structure Audits"}</span>
                      </div>

                    </div>
                  </div>
                )}

                {/* Step 6: Sourcing Success Matches */}
                {step === 6 && (
                  <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute h-16 w-16 bg-emerald-500/20 dark:bg-emerald-500/20 animate-ping rounded-full" />
                      <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center relative">
                        <Zap className="h-8 w-8" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <h4 className="text-xl font-black text-slate-900 dark:text-white transition">
                        {language === "ar" ? "اكتشاف تطابقات توريد جاهزة!" : "Matches Sourced Successfully!"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md font-semibold leading-relaxed transition">
                        {language === "ar"
                          ? `لقد وجدنا ${matchesCount} سيارة ${formData.make} ${formData.bodyType} مطابقة تماماً للميزانية المقترحة (${formData.budget}) في أسواق سيول هذا الأسبوع وتوريد مباشر إلى ${formData.destination.split("(")[0]}.`
                          : `We found ${matchesCount} verified ${formData.make} ${formData.bodyType} slots matching your budget (${formData.budget}) in Seoul auctions ready for direct export cargo to ${formData.destination.split("(")[0]}.`}
                      </p>
                    </div>

                    <motion.a
                      whileHover={{ scale: 1.025 }}
                      whileTap={{ scale: 0.98 }}
                      href={`https://wa.me/821072290580?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4.5 text-xs font-black uppercase tracking-wider shadow-lg transition"
                    >
                      <MessageSquare className="h-4.5 w-4.5" />
                      <span>{language === "ar" ? "الحصول على الملفات والتقارير الحية (واتساب)" : "Get Live Sourcing Sheets (WhatsApp)"}</span>
                    </motion.a>
                  </div>
                )}

              </div>

              {/* Steps navigation footer */}
              {step > 1 && step <= 4 && (
                <div className="flex justify-between mt-8 pt-4 border-t border-slate-200 dark:border-white/10 transition-colors">
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{language === "ar" ? "السابق" : "Back"}</span>
                  </button>
                  <div className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {formData.make && `${formData.make}`}
                    {formData.bodyType && ` • ${formData.bodyType}`}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
