"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { ShieldCheck, ArrowRight, MessageSquare } from "lucide-react";

export default function CTASection() {
  const { t, language, dir } = useLanguage();

  return (
    <section dir={dir} className="relative py-20 px-4 sm:px-6 lg:px-10 bg-[#020a18] overflow-hidden border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="relative rounded-3xl p-10 sm:p-14 overflow-hidden bg-gradient-to-br from-[#003478] via-[#001c44] to-[#020a18] border border-sky-400/30 blue-glow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-30 bg-[#0066ff]" />

          <div className="relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-bold text-sky-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{language === "ar" ? "خدمة استيراد موثوقة ومباشرة من كوريا" : "Certified Direct Import Service from South Korea"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {language === "ar" ? "جاهز لاستيراد سيارتك الكورية القادمة؟" : "Ready to Sourced Your Next Premium Korean Vehicle?"}
            </h2>

            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              {language === "ar"
                ? "تواصل مع خبراء أدفانسد كوريو (Advanced Koryo) للحصول على تقرير فحص مجاني وعرض أسعار شامل واصل لمينائك."
                : "Connect with Advanced Koryo vehicle specialists for a free inspection report and full landed quote to your destination port."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a
                href="https://wa.me/821072290580?text=Hello%20Advanced%20Koryo,%20I%20want%20to%20request%20a%20vehicle%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-[#003478] font-extrabold text-sm px-8 py-4 shadow-xl transition hover:scale-105"
              >
                <MessageSquare className="h-5 w-5" />
                <span>{language === "ar" ? "تواصل مباشر عبر الواتساب" : "Direct WhatsApp Inquiry"}</span>
              </a>

              <a
                href="#inventory-section"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#003478]/80 hover:bg-[#003478] border border-white/20 text-white font-bold text-sm px-8 py-4 transition hover:scale-105"
              >
                <span>{t.nav.inventory}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
