"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const { t, language, dir } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requirements: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Simulate submission or whatsapp redirect
    const whatsappMessage = encodeURIComponent(
      `Hello Advanced Koryo! My name is ${formData.name} (${formData.email}).\nI want to source a vehicle:\n${formData.requirements}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/821072290580?text=${whatsappMessage}`, "_blank");
    }, 1200);
  };

  return (
    <div dir={dir} className="py-20 bg-white dark:bg-[#020a18] text-slate-900 dark:text-white transition-colors duration-300 min-h-[80vh]">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white transition">
            {language === "ar" ? "تواصل معنا" : "Contact Us"}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium transition">
            {language === "ar"
              ? "فريق تصدير السيارات الكورية في سيول جاهز لمساعدتك باللغتين العربية والإلكترونية."
              : "Our Korean auto sourcing specialists are ready to assist you in English and Arabic."}
          </p>
        </div>

        {/* Dual Panel Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Panel: Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between koryo-card-white rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-[#0b1528] border border-slate-200 dark:border-white/10 transition">
            <div className="space-y-8">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition">
                {language === "ar" ? "مقر الشركة واللوجستيات" : "Headquarters & Global Logistics"}
              </h2>

              <div className="space-y-6">
                
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0066ff]/10 text-[#0066ff] dark:text-sky-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {language === "ar" ? "العنوان الوطني" : "Business Address"}
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 font-sans">
                      ADVANCED KORYO Co., Ltd.
                      <br />
                      278 Beotkkot-ro, Gasan-dong, SJ Technoville, Seoul 08511, South Korea
                    </p>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0066ff]/10 text-[#0066ff] dark:text-sky-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {language === "ar" ? "رقم الهاتف المباشر" : "Primary Phone Number"}
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 font-mono">
                      +82 10 7229 0580
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0066ff]/10 text-[#0066ff] dark:text-sky-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {language === "ar" ? "البريد الإلكتروني الرسمي" : "Email Address"}
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 font-sans">
                      info@mykoryo.com
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {language === "ar" ? "رقم الواتساب (دعم 24/7)" : "WhatsApp Support (24/7)"}
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 font-mono">
                      01072290580
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Social handles list */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-6 mt-8">
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                {language === "ar" ? "تابع حساباتنا الاجتماعية" : "Follow Our Social Media"}
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg">
                  Instagram: @advancedkoryo
                </span>
                <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg">
                  TikTok: @advancedk_ayman
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Form */}
          <div className="lg:col-span-7 koryo-card-white rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0b1528] border border-slate-200 dark:border-white/10 transition">
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition">
                  {language === "ar" ? "طلب عرض سعر أو فحص فني" : "Inquire Sourcing & Custom Inspection"}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {language === "ar" ? "الاسم الكريم" : "Your Name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans text-sm focus:outline-none focus:border-[#0066ff] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {language === "ar" ? "البريد الإلكتروني" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans text-sm focus:outline-none focus:border-[#0066ff] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {language === "ar" ? "رقم الهاتف / الواتساب" : "Phone / WhatsApp"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    placeholder="+966 50 000 0000"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans text-sm focus:outline-none focus:border-[#0066ff] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {language === "ar" ? "تفاصيل السيارة المطلوبة (الماركة، الموديل، الميزانية)" : "Sourcing Specifications (Make, Model, Budget)"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.requirements}
                    placeholder={
                      language === "ar"
                        ? "جينيسيس G80 موديل 2023 ممشى أقل من 30 ألف كم، ميزانية 35 ألف دولار واصل..."
                        : "Genesis G80 2023, mileage < 30,000 km, budget around $35,000 USD landed..."
                    }
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans text-sm focus:outline-none focus:border-[#0066ff] transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl koryo-btn-black py-4 text-xs font-bold uppercase tracking-wider shadow-md transition duration-300"
                >
                  <Send className="h-4 w-4" />
                  <span>{language === "ar" ? "إرسال وتأكيد الطلب" : "Submit & Connect via WhatsApp"}</span>
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-4"
              >
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {language === "ar" ? "تم تجهيز الاستفسار!" : "Inquiry Prepared!"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-sm">
                    {language === "ar"
                      ? "جاري إعادة توجيهك إلى الواتساب للتحدث مباشرة مع وكيل التصدير الكوري لدينا."
                      : "We are redirecting you to WhatsApp to finalize your custom sourcing request with our Seoul export agent."}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
