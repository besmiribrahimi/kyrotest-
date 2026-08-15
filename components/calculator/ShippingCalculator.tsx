"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Calculator,
  Ship,
  DollarSign,
  Globe2,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

interface DestinationCountry {
  code: string;
  nameEn: string;
  nameAr: string;
  portEn: string;
  portAr: string;
  flag: string;
  freightCostUsd: number;
  insuranceUsd: number;
  dutyRate: number;
  vatRate: number;
  currencySymbol: string;
  usdExchangeRate: number;
  transitTimeEn?: string;
  transitTimeAr?: string;
}

const DESTINATION_COUNTRIES: DestinationCountry[] = [
  {
    code: "SA",
    nameEn: "Saudi Arabia",
    nameAr: "المملكة العربية السعودية",
    portEn: "Jeddah Islamic Port",
    portAr: "ميناء جدة الإسلامي",
    flag: "🇸🇦",
    freightCostUsd: 1450,
    insuranceUsd: 150,
    dutyRate: 0.05,
    vatRate: 0.15,
    currencySymbol: "SAR",
    usdExchangeRate: 3.75,
    transitTimeEn: "18-22 Days",
    transitTimeAr: "١٨-٢٢ يوم",
  },
  {
    code: "AE",
    nameEn: "United Arab Emirates",
    nameAr: "الإمارات العربية المتحدة",
    portEn: "Jebel Ali Port (Dubai)",
    portAr: "ميناء جبل علي (دبي)",
    flag: "🇦🇪",
    freightCostUsd: 1350,
    insuranceUsd: 150,
    dutyRate: 0.05,
    vatRate: 0.05,
    currencySymbol: "AED",
    usdExchangeRate: 3.67,
    transitTimeEn: "14-16 Days",
    transitTimeAr: "١٤-١٦ يوم",
  },
  {
    code: "QA",
    nameEn: "Qatar",
    nameAr: "دولة قطر",
    portEn: "Hamad Port (Doha)",
    portAr: "ميناء حمد (الدوحة)",
    flag: "🇶🇦",
    freightCostUsd: 1500,
    insuranceUsd: 200,
    dutyRate: 0.05,
    vatRate: 0.0,
    currencySymbol: "QAR",
    usdExchangeRate: 3.64,
    transitTimeEn: "16-18 Days",
    transitTimeAr: "١٦-١٨ يوم",
  },
  {
    code: "KW",
    nameEn: "Kuwait",
    nameAr: "دولة الكويت",
    portEn: "Shuwaikh Port",
    portAr: "ميناء الشويخ",
    flag: "🇰🇼",
    freightCostUsd: 1550,
    insuranceUsd: 180,
    dutyRate: 0.05,
    vatRate: 0.0,
    currencySymbol: "KWD",
    usdExchangeRate: 0.31,
    transitTimeEn: "17-19 Days",
    transitTimeAr: "١٧-١٩ يوم",
  },
  {
    code: "OM",
    nameEn: "Oman",
    nameAr: "سلطنة عمان",
    portEn: "Sohar Port",
    portAr: "ميناء صحار",
    flag: "🇴🇲",
    freightCostUsd: 1400,
    insuranceUsd: 150,
    dutyRate: 0.05,
    vatRate: 0.05,
    currencySymbol: "OMR",
    usdExchangeRate: 0.38,
    transitTimeEn: "13-15 Days",
    transitTimeAr: "١٣-١٥ يوم",
  },
  {
    code: "BH",
    nameEn: "Bahrain",
    nameAr: "مملكة البحرين",
    portEn: "Khalifa Bin Salman Port",
    portAr: "ميناء خليفة بن سلمان",
    flag: "🇧🇭",
    freightCostUsd: 1600,
    insuranceUsd: 200,
    dutyRate: 0.05,
    vatRate: 0.1,
    currencySymbol: "BHD",
    usdExchangeRate: 0.38,
    transitTimeEn: "15-17 Days",
    transitTimeAr: "١٥-١٧ يوم",
  },
  {
    code: "JO",
    nameEn: "Jordan",
    nameAr: "المملكة الأردنية الهاشمية",
    portEn: "Aqaba Port",
    portAr: "ميناء العقبة",
    flag: "🇯🇴",
    freightCostUsd: 1750,
    insuranceUsd: 250,
    dutyRate: 0.2,
    vatRate: 0.16,
    currencySymbol: "JOD",
    usdExchangeRate: 0.71,
    transitTimeEn: "22-26 Days",
    transitTimeAr: "٢٢-٢٦ يوم",
  },
  {
    code: "EG",
    nameEn: "Egypt",
    nameAr: "جمهورية مصر العربية",
    portEn: "Alexandria Port",
    portAr: "ميناء الإسكندرية",
    flag: "🇪🇬",
    freightCostUsd: 1950,
    insuranceUsd: 250,
    dutyRate: 0.3,
    vatRate: 0.14,
    currencySymbol: "EGP",
    usdExchangeRate: 30.9,
    transitTimeEn: "26-30 Days",
    transitTimeAr: "٢٦-٣٠ يوم",
  },
  {
    code: "LY",
    nameEn: "Libya",
    nameAr: "دولة ليبيا",
    portEn: "Tripoli Port",
    portAr: "ميناء طرابلس",
    flag: "🇱🇾",
    freightCostUsd: 2100,
    insuranceUsd: 300,
    dutyRate: 0.1,
    vatRate: 0.0,
    currencySymbol: "LYD",
    usdExchangeRate: 4.85,
    transitTimeEn: "32-38 Days",
    transitTimeAr: "٣٢-٣٨ يوم",
  },
  {
    code: "DZ",
    nameEn: "Algeria",
    nameAr: "الجمهورية الجزائرية",
    portEn: "Algiers Port",
    portAr: "ميناء الجزائر",
    flag: "🇩🇿",
    freightCostUsd: 2200,
    insuranceUsd: 300,
    dutyRate: 0.15,
    vatRate: 0.19,
    currencySymbol: "DZD",
    usdExchangeRate: 135.0,
    transitTimeEn: "34-40 Days",
    transitTimeAr: "٣٤-٤٠ يوم",
  },
  {
    code: "IQ",
    nameEn: "Iraq",
    nameAr: "جمهورية العراق",
    portEn: "Umm Qasr Port (Basra)",
    portAr: "ميناء أم قصر (البصرة)",
    flag: "🇮🇶",
    freightCostUsd: 1800,
    insuranceUsd: 250,
    dutyRate: 0.1,
    vatRate: 0.0,
    currencySymbol: "IQD",
    usdExchangeRate: 1310,
    transitTimeEn: "20-24 Days",
    transitTimeAr: "٢٠-٢٤ يوم",
  },
  {
    code: "DE",
    nameEn: "Germany",
    nameAr: "ألمانيا",
    portEn: "Port of Bremerhaven",
    portAr: "ميناء بريمرهافن",
    flag: "🇩🇪",
    freightCostUsd: 1850,
    insuranceUsd: 200,
    dutyRate: 0.1,
    vatRate: 0.19,
    currencySymbol: "EUR",
    usdExchangeRate: 0.92,
    transitTimeEn: "28-32 Days",
    transitTimeAr: "٢٨-٣٢ يوم",
  },
  {
    code: "BE",
    nameEn: "Belgium",
    nameAr: "بلجيكا",
    portEn: "Port of Zeebrugge",
    portAr: "ميناء زيبروج",
    flag: "🇧🇪",
    freightCostUsd: 1800,
    insuranceUsd: 200,
    dutyRate: 0.1,
    vatRate: 0.21,
    currencySymbol: "EUR",
    usdExchangeRate: 0.92,
    transitTimeEn: "27-31 Days",
    transitTimeAr: "٢٧-٣١ يوم",
  },
  {
    code: "NL",
    nameEn: "Netherlands",
    nameAr: "هولندا",
    portEn: "Port of Rotterdam",
    portAr: "ميناء روتردام",
    flag: "🇳🇱",
    freightCostUsd: 1850,
    insuranceUsd: 200,
    dutyRate: 0.1,
    vatRate: 0.21,
    currencySymbol: "EUR",
    usdExchangeRate: 0.92,
    transitTimeEn: "28-32 Days",
    transitTimeAr: "٢٨-٣٢ يوم",
  },
  {
    code: "GB",
    nameEn: "United Kingdom",
    nameAr: "المملكة المتحدة",
    portEn: "Port of Southampton",
    portAr: "ميناء ساوثهامبتون",
    flag: "🇬🇧",
    freightCostUsd: 1900,
    insuranceUsd: 250,
    dutyRate: 0.1,
    vatRate: 0.2,
    currencySymbol: "GBP",
    usdExchangeRate: 0.78,
    transitTimeEn: "30-34 Days",
    transitTimeAr: "٣٠-٣٤ يوم",
  },
  {
    code: "FR",
    nameEn: "France",
    nameAr: "فرنسا",
    portEn: "Port of Le Havre",
    portAr: "ميناء لو هافر",
    flag: "🇫🇷",
    freightCostUsd: 1900,
    insuranceUsd: 250,
    dutyRate: 0.1,
    vatRate: 0.2,
    currencySymbol: "EUR",
    usdExchangeRate: 0.92,
    transitTimeEn: "28-32 Days",
    transitTimeAr: "٢٨-٣٢ يوم",
  },
  {
    code: "ES",
    nameEn: "Spain",
    nameAr: "إسبانيا",
    portEn: "Port of Barcelona",
    portAr: "ميناء برشلونة",
    flag: "🇪🇸",
    freightCostUsd: 1750,
    insuranceUsd: 200,
    dutyRate: 0.1,
    vatRate: 0.21,
    currencySymbol: "EUR",
    usdExchangeRate: 0.92,
    transitTimeEn: "24-28 Days",
    transitTimeAr: "٢٤-٢٨ يوم",
  },
  {
    code: "IT",
    nameEn: "Italy",
    nameAr: "إيطاليا",
    portEn: "Port of Livorno",
    portAr: "ميناء ليفورنو",
    flag: "🇮🇹",
    freightCostUsd: 1750,
    insuranceUsd: 200,
    dutyRate: 0.1,
    vatRate: 0.22,
    currencySymbol: "EUR",
    usdExchangeRate: 0.92,
    transitTimeEn: "22-26 Days",
    transitTimeAr: "٢٢-٢٦ يوم",
  },
  {
    code: "SI",
    nameEn: "Slovenia",
    nameAr: "سلوفينيا",
    portEn: "Port of Koper",
    portAr: "ميناء كوبير",
    flag: "🇸🇮",
    freightCostUsd: 1700,
    insuranceUsd: 200,
    dutyRate: 0.1,
    vatRate: 0.22,
    currencySymbol: "EUR",
    usdExchangeRate: 0.92,
    transitTimeEn: "20-24 Days",
    transitTimeAr: "٢٠-٢٤ يوم",
  },
];

export default function ShippingCalculator() {
  const { t, language, dir } = useLanguage();

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("SA");
  const [fobPriceUsd, setFobPriceUsd] = useState<number>(24000);

  // Sync state from localStorage on mount and register listeners
  useEffect(() => {
    // 1. Read existing calculator state
    const savedCode = localStorage.getItem("kyro_calculator_country");
    const savedFob = localStorage.getItem("kyro_calculator_fob");
    if (savedCode) setSelectedCountryCode(savedCode);
    if (savedFob) setFobPriceUsd(Number(savedFob));

    // Helper function to map destination port string from Sourcing Wizard to a country code
    const mapPortToCode = (dest: string): string | null => {
      if (!dest) return null;
      const lower = dest.toLowerCase();
      if (lower.includes("saudi") || lower.includes("jeddah")) return "SA";
      if (lower.includes("dubai") || lower.includes("jebel") || lower.includes("uae") || lower.includes("الإمارات")) return "AE";
      if (lower.includes("qatar") || lower.includes("doha") || lower.includes("حمد")) return "QA";
      if (lower.includes("kuwait") || lower.includes("shuwaikh") || lower.includes("الكويت")) return "KW";
      if (lower.includes("oman") || lower.includes("sohar") || lower.includes("عمان")) return "OM";
      if (lower.includes("bahrain") || lower.includes("خليفة")) return "BH";
      if (lower.includes("jordan") || lower.includes("aqaba") || lower.includes("العقبة")) return "JO";
      if (lower.includes("egypt") || lower.includes("alexandria") || lower.includes("مصر")) return "EG";
      if (lower.includes("libya") || lower.includes("tripoli") || lower.includes("ليبيا")) return "LY";
      if (lower.includes("algeria") || lower.includes("algiers") || lower.includes("الجزائر")) return "DZ";
      if (lower.includes("iraq") || lower.includes("basra") || lower.includes("العراق")) return "IQ";
      if (lower.includes("germany") || lower.includes("bremerhaven") || lower.includes("ألمانيا")) return "DE";
      if (lower.includes("belgium") || lower.includes("zeebrugge") || lower.includes("بلجيكا")) return "BE";
      if (lower.includes("netherlands") || lower.includes("rotterdam") || lower.includes("هولندا")) return "NL";
      if (lower.includes("united kingdom") || lower.includes("southampton") || lower.includes("المملكة المتحدة")) return "GB";
      if (lower.includes("france") || lower.includes("havre") || lower.includes("فرنسا")) return "FR";
      if (lower.includes("spain") || lower.includes("barcelona") || lower.includes("إسبانيا")) return "ES";
      if (lower.includes("italy") || lower.includes("livorno") || lower.includes("إيطاليا")) return "IT";
      if (lower.includes("slovenia") || lower.includes("koper") || lower.includes("سلوفينيا")) return "SI";
      return null;
    };

    // Helper to map budget string to numeric FOB price estimate
    const mapBudgetToFob = (budgetStr: string): number | null => {
      if (!budgetStr) return null;
      if (budgetStr.includes("Under $15,000") || budgetStr.includes("أقل")) return 12000;
      if (budgetStr.includes("$15,000 - $30,000") || budgetStr.includes("15,000")) return 22000;
      if (budgetStr.includes("$30,000 - $50,000") || budgetStr.includes("30,000")) return 40000;
      if (budgetStr.includes("Premium") || budgetStr.includes("فاخرة")) return 75000;
      return null;
    };

    // Check wizard values on mount
    const wizardDest = localStorage.getItem("kyro_wizard_destination") || "";
    const wizardBudget = localStorage.getItem("kyro_wizard_budget") || "";
    const mappedCode = mapPortToCode(wizardDest);
    const mappedFob = mapBudgetToFob(wizardBudget);
    
    if (mappedCode) {
      setSelectedCountryCode(mappedCode);
      localStorage.setItem("kyro_calculator_country", mappedCode);
    }
    if (mappedFob) {
      setFobPriceUsd(mappedFob);
      localStorage.setItem("kyro_calculator_fob", String(mappedFob));
    }

    // 2. Register live event listeners
    const handleWizardDestinationUpdate = (e: Event) => {
      const code = mapPortToCode((e as CustomEvent).detail);
      if (code) {
        setSelectedCountryCode(code);
        localStorage.setItem("kyro_calculator_country", code);
      }
    };

    const handleWizardBudgetUpdate = (e: Event) => {
      const fob = mapBudgetToFob((e as CustomEvent).detail);
      if (fob) {
        setFobPriceUsd(fob);
        localStorage.setItem("kyro_calculator_fob", String(fob));
      }
    };

    const handleWizardComplete = (e: Event) => {
      const { destination, budget } = (e as CustomEvent).detail;
      const code = mapPortToCode(destination);
      const fob = mapBudgetToFob(budget);
      if (code) {
        setSelectedCountryCode(code);
        localStorage.setItem("kyro_calculator_country", code);
      }
      if (fob) {
        setFobPriceUsd(fob);
        localStorage.setItem("kyro_calculator_fob", String(fob));
      }
    };

    const handleSearchApply = (e: Event) => {
      const { destinationPort, maxPrice } = (e as CustomEvent).detail;
      const code = mapPortToCode(destinationPort);
      if (code) {
        setSelectedCountryCode(code);
        localStorage.setItem("kyro_calculator_country", code);
      }
      if (maxPrice) {
        const val = Number(maxPrice);
        if (!isNaN(val)) {
          setFobPriceUsd(val);
          localStorage.setItem("kyro_calculator_fob", String(val));
        }
      }
    };

    window.addEventListener("kyro-wizard-update-destination", handleWizardDestinationUpdate);
    window.addEventListener("kyro-wizard-update-budget", handleWizardBudgetUpdate);
    window.addEventListener("kyro-wizard-complete", handleWizardComplete);
    window.addEventListener("kyro-search-apply", handleSearchApply);

    return () => {
      window.removeEventListener("kyro-wizard-update-destination", handleWizardDestinationUpdate);
      window.removeEventListener("kyro-wizard-update-budget", handleWizardBudgetUpdate);
      window.removeEventListener("kyro-wizard-complete", handleWizardComplete);
      window.removeEventListener("kyro-search-apply", handleSearchApply);
    };
  }, []);

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    localStorage.setItem("kyro_calculator_country", code);
  };

  const handleFobChange = (val: number) => {
    setFobPriceUsd(val);
    localStorage.setItem("kyro_calculator_fob", String(val));
  };

  const country =
    DESTINATION_COUNTRIES.find((c) => c.code === selectedCountryCode) ||
    DESTINATION_COUNTRIES[0];

  const freightCost = country.freightCostUsd;
  const insuranceCost = country.insuranceUsd;
  const cifPrice = fobPriceUsd + freightCost + insuranceCost;

  const customsDuty = Math.round(cifPrice * country.dutyRate);
  const vatAmount = Math.round((cifPrice + customsDuty) * country.vatRate);
  const totalUsd = Math.round(cifPrice + customsDuty + vatAmount);

  const totalLocalCurrency = Math.round(totalUsd * country.usdExchangeRate);

  const whatsappMessage = encodeURIComponent(
    `Hello Advanced Koryo! I calculated a shipping quote for a vehicle:\n` +
      `- FOB Korea Price: $${fobPriceUsd.toLocaleString()}\n` +
      `- Destination: ${country.flag} ${country.nameEn} (${country.portEn})\n` +
      `- Est. Landed Total: $${totalUsd.toLocaleString()} USD (~${totalLocalCurrency.toLocaleString()} ${country.currencySymbol})\n` +
      `Please confirm Ro-Ro vessel availability for me.`
  );

  return (
    <section id="shipping-calculator" dir={dir} className="relative py-20 bg-white dark:bg-[#020a18] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 dark:bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white dark:text-slate-950 mb-4 transition shadow-sm">
            <Calculator className="h-4 w-4 text-sky-400 dark:text-[#0066ff]" />
            <span>{t.shipping.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white transition">
            {t.shipping.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium transition">
            {t.shipping.subtitle}
          </p>
        </div>

        {/* Dual Panels */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Sourcing Inputs */}
          <div className="lg:col-span-7 koryo-card-white rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-3 flex items-center gap-2 transition">
                <Globe2 className="h-4 w-4 text-[#0066ff] dark:text-sky-400" />
                <span>{t.shipping.selectCountry}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {DESTINATION_COUNTRIES.map((c) => {
                  const isSelected = c.code === selectedCountryCode;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountryChange(c.code)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? "bg-slate-900 dark:bg-[#0066ff] border-slate-900 dark:border-[#0066ff] text-[#FFFFFF] shadow-md"
                          : "bg-slate-50 dark:bg-[#070d19] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-350 hover:border-slate-350 dark:hover:border-sky-400"
                      }`}
                    >
                      <span className="text-2xl mb-1">{c.flag}</span>
                      <span className="text-xs font-bold truncate max-w-full">
                        {language === "ar" ? c.nameAr : c.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
              <div className="flex items-center gap-3">
                <Ship className="h-5 w-5 text-[#0066ff] dark:text-sky-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-555 dark:text-slate-400 font-semibold uppercase">{language === "ar" ? "ميناء التفريغ" : "Arrival Port"}</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white transition">
                    {language === "ar" ? country.portAr : country.portEn}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {country.transitTimeEn && (
                  <span className="text-[11px] font-extrabold text-[#0066ff] dark:text-sky-300 bg-[#0066ff]/10 dark:bg-sky-400/10 px-3 py-1 rounded-md border border-[#0066ff]/20">
                    ⏱️ {language === "ar" ? country.transitTimeAr : country.transitTimeEn}
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-[#FFFFFF] bg-[#0066ff] px-3 py-1 rounded-md shadow-sm">
                  Direct Ro-Ro
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2 transition">
                  <DollarSign className="h-4 w-4 text-[#0066ff] dark:text-sky-400" />
                  <span>{t.shipping.fobPrice}</span>
                </label>
                <span className="text-base font-extrabold font-mono text-white dark:text-slate-900 bg-slate-950 dark:bg-white px-3 py-1 rounded-lg transition shadow-sm">
                  ${fobPriceUsd.toLocaleString()} USD
                </span>
              </div>

              <input
                type="range"
                min={5000}
                max={120000}
                step={1000}
                value={fobPriceUsd}
                onChange={(e) => handleFobChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0066ff] dark:accent-sky-400 transition"
              />

              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono font-semibold transition">
                <span>$5,000</span>
                <span>$50,000</span>
                <span>$120,000</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Cost Breakdown Quote */}
          <div className="lg:col-span-5 koryo-card-white rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 transition-colors">
              <span>{language === "ar" ? "تفاصيل التكلفة التقديرية" : "Cost Breakdown Summary"}</span>
              <span className="text-2xl">{country.flag}</span>
            </h3>

            <div className="space-y-3 text-xs font-medium">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-650 dark:text-slate-400">{t.shipping.fobPrice}:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white transition">${fobPriceUsd.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-200 dark:border-white/10 transition-colors">
                <span className="text-slate-650 dark:text-slate-400">{t.shipping.freightEstimate}:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white transition">
                  +${(freightCost + insuranceCost).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-200 dark:border-white/10 transition-colors">
                <span className="text-slate-650 dark:text-slate-400">{t.shipping.customsDuty}:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white transition">
                  +${(customsDuty + vatAmount).toLocaleString()}
                </span>
              </div>

              <motion.div
                key={totalUsd}
                initial={{ scale: 0.97, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="mt-6 rounded-2xl bg-slate-950 dark:bg-slate-900 p-5 text-center shadow-md space-y-1 border border-white/5 transition"
              >
                <div className="text-xs text-slate-350 dark:text-slate-400 font-bold uppercase tracking-wider transition">
                  {t.shipping.totalEstimate}
                </div>
                <div className="text-3xl font-extrabold text-white font-mono transition">
                  ${totalUsd.toLocaleString()} <span className="text-sm font-normal text-slate-300">USD</span>
                </div>
                <div className="text-sm font-bold text-white dark:text-sky-400 font-mono transition">
                  ~ {totalLocalCurrency.toLocaleString()} {country.currencySymbol}
                </div>
              </motion.div>
            </div>

            {/* Price Fluctuations Warning Block */}
            <div className="flex gap-3 rounded-2xl border border-amber-250 bg-amber-500/10 p-4 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs transition">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-extrabold uppercase tracking-wider">{t.shipping.warningTitle}</div>
                <div className="leading-relaxed font-semibold opacity-90">{t.shipping.warningBody}</div>
              </div>
            </div>

            <a
              href={`https://wa.me/821072290580?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl koryo-btn-black py-4 text-xs font-bold uppercase tracking-wider shadow-md transition duration-300"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{language === "ar" ? "طلب هذا العرض عبر الواتساب" : "Confirm Quote via WhatsApp"}</span>
            </a>

            <p className="text-[11px] text-slate-500 dark:text-slate-450 text-center leading-relaxed transition">
              {t.shipping.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
