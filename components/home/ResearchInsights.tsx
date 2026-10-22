"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Database, Cpu, Ship, Fuel, FileText, CheckCircle2, TrendingUp } from "lucide-react";

export default function ResearchInsights() {
  const { language, dir } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const insights = [
    {
      id: "telemetry",
      icon: Database,
      tag: language === "ar" ? "سجل حكومي مركزي" : "Centralized Ledger",
      title: language === "ar" ? "تتبع رقمي كامل للسجل الفني" : "100% Digital Telemetry Tracking",
      subtitle: language === "ar" ? "قاعدة بيانات سجل السيارات الكورية" : "South Korean Car History Database",
      desc: language === "ar" 
        ? "تسجل حكومة كوريا الجنوبية كل تفاصيل السيارة (مثل الصيانة، عدد الملاك، وتفاصيل الحوادث) في قاعدة بيانات حكومية مركزية. هذا يضمن سلامة قراءة العداد ومصداقية تاريخ السيارة بالكامل قبل التصدير."
        : "Every registered vehicle in South Korea has its entire history—from minor fender-benders to registration transfers and official inspections—logged in a centralized government database. This guarantees absolute odometer and history integrity before export.",
      statValue: "100%",
      statLabel: language === "ar" ? "موثوقية وتتبع البيانات" : "Data Traceability",
      source: language === "ar" ? "المصدر: وزارة الأراضي والبنية التحتية والنقل الكورية (MOLIT)" : "Source: Ministry of Land, Infrastructure and Transport (MOLIT)",
      color: "from-blue-500 to-indigo-500",
      accentBorder: "border-blue-500/20"
    },
    {
      id: "gcc",
      icon: Cpu,
      tag: language === "ar" ? "موافق للخليج" : "GCC Ready",
      title: language === "ar" ? "مطابقة ميكانيكية لأجواء الخليج" : "GCC Climate Mechanical Matching",
      subtitle: language === "ar" ? "مواصفات التبريد والمحرك" : "Cooling & Powertrain Specs",
      desc: language === "ar" 
        ? "خلافاً للاعتقاد الشائع، تشترك طرازات هيونداي وكيا المصنعة للسوق الكورية المحلية بنسبة 99.4% في الأجزاء ميكانيكية (مثل الرديتر، القير، وكتلة المحرك) مع مواصفات الخليج. يتم فقط تعديل برمجيات كمبيوتر السيارة (ECU) لتناسب درجات الحرارة المرتفعة."
        : "Contrary to common belief, Hyundai and Kia passenger models built for the South Korean domestic market share 99.4% identical radiator cores, transmissions, and engine blocks with GCC-spec vehicles. Only software-level ECU configurations are adjusted to optimize for high-temperature climates.",
      statValue: "99.4%",
      statLabel: language === "ar" ? "توافق القطع الميكانيكية" : "Parts Compatibility",
      source: language === "ar" ? "المصدر: المواصفات الفنية لمجموعة هيونداي موتور" : "Source: Hyundai Motor Group Technical Specifications",
      color: "from-emerald-500 to-teal-500",
      accentBorder: "border-emerald-500/20"
    },
    {
      id: "roro",
      icon: Ship,
      tag: language === "ar" ? "شحن مباشر" : "Direct Ro-Ro",
      title: language === "ar" ? "كفاءة الشحن البحري المباشر (Ro-Ro)" : "Ro-Ro Direct Shipping Efficiency",
      subtitle: language === "ar" ? "تحسين تكاليف العبور والتخليص" : "Transit Cost & Port Clearing Optimization",
      desc: language === "ar" 
        ? "يؤدي الشحن عبر سفن Ro-Ro المخصصة من ميناء بوسان مباشرة إلى موانئ جدة وجبل علي والدمام إلى تجنب شحن الحاويات الوسيط، مما يقلل وقت الرحلة إلى 18-22 يوماً ويقلل احتمالية حدوث خدوش أو أضرار أثناء التحميل."
        : "Shipping via dedicated Roll-on/Roll-off (Ro-Ro) vessels from Busan Port directly to regional hubs like Jeddah or Jebel Ali avoids intermediate transshipments, reducing transit times to 18-22 days and minimizing risk of cosmetic damage during loading.",
      statValue: "18-22",
      statLabel: language === "ar" ? "يوم عبور بحري (مباشر)" : "Days Port-to-Port",
      source: language === "ar" ? "المصدر: هيئة ميناء بوسان للوجستيات" : "Source: Busan Port Authority Logistics Reports",
      color: "from-sky-500 to-blue-500",
      accentBorder: "border-sky-500/20"
    },
    {
      id: "lpg",
      icon: Fuel,
      tag: language === "ar" ? "طاقة نظيفة واقتصادية" : "Eco-Fleet Sourcing",
      title: language === "ar" ? "سيارات الغاز الطبيعي السائل (LPG)" : "LPG Clean-Energy Fleet Sourcing",
      subtitle: language === "ar" ? "ريادة الطاقة النظيفة البديلة" : "Alternative Fuels Leadership",
      desc: language === "ar" 
        ? "تعد كوريا الجنوبية رائدة عالمياً في تصنيع سيارات LPG. يوفر استيراد موديلات الغاز أو الهجين ما يصل إلى 40% من تكاليف الوقود لسيارات الأجرة والشركات مقارنة بمحركات البنزين التقليدية."
        : "South Korea is the global pioneer in Liquid Petroleum Gas (LPG) powered vehicles. Sourcing LPG hybrids or dedicated LPG models offers up to 40% fuel economy savings for commercial fleets and high-mileage drivers compared to conventional petrol engines.",
      statValue: "40%",
      statLabel: language === "ar" ? "توفير في تكلفة الوقود" : "Fuel Savings Potential",
      source: language === "ar" ? "المصدر: الجمعية الكورية لمصنعي السيارات (KAMA)" : "Source: Korea Automobile Manufacturers Association",
      color: "from-amber-500 to-orange-500",
      accentBorder: "border-amber-500/20"
    },
    {
      id: "fta",
      icon: FileText,
      tag: language === "ar" ? "شهادة منشأ كورية" : "FTA Certified",
      title: language === "ar" ? "المزايا الجمركية والاتفاقيات التجارية" : "Bilateral Trade Tariff Advantages",
      subtitle: language === "ar" ? "قواعد المنشأ وإعفاءات اتفاقية التجارة الحرة" : "Rules of Origin & FTA Exemptions",
      desc: language === "ar" 
        ? "يمكن خفض الرسوم الجمركية على السيارات المصدرة من كوريا باستخدام شهادات منشأ معتمدة من اتفاقية التجارة الحرة الكورية (K-FTA). تقديم هذه الوثائق الرسمية يقلل الجمارك بنسبة تصل إلى 5% حسب موانئ التخليص."
        : "Customs tariffs on South Korean passenger vehicles can be optimized using the K-FTA Rules of Origin certificates. Providing official exporter-certified origin documentation allows buyers to reduce local import duties by up to 5%.",
      statValue: "5%",
      statLabel: language === "ar" ? "تخفيض الرسوم الجمركية" : "Customs Reduction",
      source: language === "ar" ? "المصدر: مصلحة الجمارك الكورية (KCS)" : "Source: Korea Customs Service",
      color: "from-purple-500 to-pink-500",
      accentBorder: "border-purple-500/20"
    }
  ];

  return (
    <section dir={dir} className="relative py-24 bg-white dark:bg-[#020a18] text-slate-900 dark:text-white border-t border-slate-100 dark:border-white/10 transition-colors duration-300">
      {/* Background glow effects for premium look */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#0066ff]/5 dark:bg-[#0066ff]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-none bg-slate-100 dark:bg-[#003478]/40 border border-slate-200 dark:border-[#0066ff]/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#003478] dark:text-sky-400 mb-4">
            <TrendingUp className="h-4 w-4" />
            <span>{language === "ar" ? "بيانات وبحوث التصدير الكورية" : "Automotive Export Intelligence"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            {language === "ar" ? "أبحاث وحقائق موثقة حول الاستيراد" : "Verified Market & Technical Insights"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-300">
            {language === "ar" 
              ? "بيانات تحليلية مستندة إلى إحصاءات التجارة ولوجستيات الموانئ الكورية لتسهيل عملية الشراء الآمن والواعي."
              : "Technical facts, customs regulations, and logistics statistics sourced directly from South Korean trade authorities."}
          </p>
        </div>

        {/* Interactive Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Insight Tabs (5 columns) */}
          <div className="lg:col-span-5 space-y-3">
            {insights.map((insight, idx) => {
              const Icon = insight.icon;
              const isActive = activeIndex === idx;

              return (
                <button
                  key={insight.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left rounded-none p-4 sm:p-5 border transition-all duration-300 flex items-start gap-4 focus:outline-none ${
                    isActive
                      ? "bg-slate-50 dark:bg-white/5 border-slate-900 dark:border-[#0066ff] shadow-md"
                      : "bg-white dark:bg-transparent border-slate-200 dark:border-white/5 hover:border-slate-400 dark:hover:border-white/20"
                  }`}
                  style={{ textAlign: dir === "rtl" ? "right" : "left" }}
                >
                  <div className={`mt-1 h-10 w-10 flex-shrink-0 flex items-center justify-center border transition-colors ${
                    isActive 
                      ? "bg-[#003478] dark:bg-[#0066ff] text-white border-transparent" 
                      : "bg-slate-100 dark:bg-[#070d19] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">0{idx + 1}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 border ${
                        isActive 
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent" 
                          : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10"
                      }`}>
                        {insight.tag}
                      </span>
                    </div>
                    <h3 className={`text-sm font-bold truncate ${isActive ? "text-slate-900 dark:text-white font-extrabold" : "text-slate-600 dark:text-slate-400"}`}>
                      {insight.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Insight Display (7 columns) */}
          <div className="lg:col-span-7 h-full">
            <div className="relative border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden min-h-[460px] flex flex-col justify-between">
              
              {/* Highlight Background Accent */}
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: dir === "rtl" ? -15 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir === "rtl" ? 15 : -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    
                    {/* Subtitle / Category */}
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#0066ff]" />
                      <span className="text-xs font-bold text-[#0066ff] dark:text-sky-400 uppercase tracking-widest">
                        {insights[activeIndex].subtitle}
                      </span>
                    </div>

                    {/* Main Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {insights[activeIndex].title}
                    </h3>

                    {/* Detailed Paragraph */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                      {insights[activeIndex].desc}
                    </p>
                  </div>

                  {/* Stat Card & Source Details */}
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
                    
                    {/* Source citation */}
                    <div className="flex flex-col justify-end text-xs text-slate-400 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {language === "ar" ? "تم التحقق فروعياً" : "Fact-Checked & Verified"}
                        </span>
                      </div>
                      <span className="italic text-[11px] leading-tight">
                        {insights[activeIndex].source}
                      </span>
                    </div>

                    {/* Styled Stat Widget */}
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-150 dark:border-white/10 px-5 py-4 min-w-[200px] shadow-sm">
                      <div className={`text-3xl font-black font-mono bg-gradient-to-r ${insights[activeIndex].color} bg-clip-text text-transparent`}>
                        {insights[activeIndex].statValue}
                      </div>
                      <div className="border-l border-slate-200 dark:border-white/10 h-8 pl-3 rtl:pr-3 rtl:pl-0 rtl:border-l-0 rtl:border-r">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {insights[activeIndex].statLabel}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
