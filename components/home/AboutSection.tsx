"use client";

import { motion as motionDiv } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { ShieldCheck, Globe, Clock, Target, CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  const { t, language, dir } = useLanguage();

  return (
    <section
      id="about-section"
      dir={dir}
      className="relative py-24 bg-slate-50 dark:bg-[#020a18] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 overflow-hidden transition-colors duration-300"
    >
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 bg-[#0066ff]/10 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 bg-sky-300/10 pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0066ff] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white mb-4 shadow-sm shadow-[#0066ff]/25 transition">
            <ShieldCheck className="h-4 w-4" />
            <span>{t.about.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 transition">
            {t.about.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold max-w-xl mx-auto transition">
            {t.about.subtitle}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Direct Exporter Positioning */}
          <motionDiv.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-between koryo-card-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden bg-white dark:bg-[#0b1528] border border-slate-200 dark:border-white/10 transition"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0066ff]/10 text-[#0066ff] dark:text-sky-400 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans transition">
                  {t.about.licenseTitle}
                </h3>
              </div>

              <div className="space-y-4 text-xs font-medium text-slate-650 dark:text-slate-300 leading-relaxed font-sans transition">
                <p>{t.about.licenseDesc1}</p>
                <p>{t.about.licenseDesc2}</p>
              </div>

              <div className="space-y-3 pt-2 text-xs font-semibold text-slate-800 dark:text-slate-200 font-sans transition">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#0066ff] dark:text-sky-400 shrink-0" />
                  <span>{language === "ar" ? "رخصة تصدير رسمية معتمدة ومسجلة في كوريا الجنوبية" : "Government-Registered Auto Sourcing & Direct Export License"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#0066ff] dark:text-sky-400 shrink-0" />
                  <span>{language === "ar" ? "لسنا وسيطاً تجارياً - نشتري ونصدر مركباتنا مباشرة" : "Direct Wholesalers: No Brokers, No Hidden Third-Party Markups"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#0066ff] dark:text-sky-400 shrink-0" />
                  <span>{language === "ar" ? "نظام فحص Encar دقيق مع تقارير فيديو أسبوعية للمشتري" : "Transparent Sourcing: Real-Time Auction & Inspection Portals"}</span>
                </div>
              </div>
            </div>
          </motionDiv.div>

          {/* Right Column: Global Coverage, Hours & Target Audience */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Row 1: Global Coverage & Business Hours in subgrid */}
            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Global Coverage Card */}
              <motionDiv.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group koryo-card-white rounded-3xl p-6 shadow-md flex flex-col gap-4 bg-white dark:bg-[#0b1528] border border-slate-200 dark:border-white/10 transition hover:border-[#0066ff]/35"
              >
                <div className="h-10 w-10 rounded-xl bg-[#0066ff]/10 text-[#0066ff] dark:text-sky-400 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Globe className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5 font-sans transition">
                    {t.about.regionsTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed font-sans transition">
                    {t.about.regionsDesc}
                  </p>
                </div>
              </motionDiv.div>

              {/* Business Hours Card */}
              <motionDiv.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group koryo-card-white rounded-3xl p-6 shadow-md flex flex-col gap-4 bg-white dark:bg-[#0b1528] border border-slate-200 dark:border-white/10 transition hover:border-[#0066ff]/35"
              >
                <div className="h-10 w-10 rounded-xl bg-[#0066ff]/10 text-[#0066ff] dark:text-sky-400 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Clock className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5 font-sans transition">
                    {t.about.hoursTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed font-sans transition">
                    {t.about.hoursDesc}
                  </p>
                </div>
              </motionDiv.div>
            </div>

            {/* Row 2: Target Audience Card */}
            <motionDiv.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group koryo-card-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col gap-4 bg-white dark:bg-[#0b1528] border border-slate-200 dark:border-white/10 transition hover:border-[#0066ff]/35"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#0066ff]/10 text-[#0066ff] dark:text-sky-400 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
                  <Target className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-sans transition">
                  {t.about.audienceTitle}
                </h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans transition">
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-xl p-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0066ff] dark:bg-sky-400 mt-1.5 shrink-0" />
                  <span>{t.about.audience1}</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-xl p-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0066ff] dark:bg-sky-400 mt-1.5 shrink-0" />
                  <span>{t.about.audience2}</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-xl p-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0066ff] dark:bg-sky-400 mt-1.5 shrink-0" />
                  <span>{t.about.audience3}</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-xl p-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0066ff] dark:bg-sky-400 mt-1.5 shrink-0" />
                  <span>{t.about.audience4}</span>
                </div>
              </div>
            </motionDiv.div>

          </div>
        </div>
      </div>
    </section>
  );
}
