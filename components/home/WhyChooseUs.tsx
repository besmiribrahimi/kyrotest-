"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { ShieldCheck, Ship, DollarSign, FileCheck, Sparkles, Check } from "lucide-react";

export default function WhyChooseUs() {
  const { t, language, dir } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      title: t.features.feat1Title,
      desc: t.features.feat1Desc,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Ship,
      title: t.features.feat2Title,
      desc: t.features.feat2Desc,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      icon: DollarSign,
      title: t.features.feat3Title,
      desc: t.features.feat3Desc,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: FileCheck,
      title: t.features.feat4Title,
      desc: t.features.feat4Desc,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <section dir={dir} className="relative py-20 bg-[#020a18] text-white border-t border-white/10">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#003478]/40 border border-[#0066ff]/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>MyKoryo Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            {t.features.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group glass-panel glass-panel-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between transition-all duration-300 hover:border-sky-500/30"
              >
                <div className="space-y-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${feat.bg}`}>
                    <Icon className={`h-6 w-6 transition-transform duration-300 group-hover:rotate-6 ${feat.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                  <Check className="h-3.5 w-3.5 text-sky-400" />
                  <span>{language === "ar" ? "معتمد في عقد الاستيراد" : "Guaranteed in Sourcing Agreement"}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
