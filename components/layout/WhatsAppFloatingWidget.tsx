"use client";

import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppFloatingWidget() {
  const { language, dir } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 4 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappLink = "https://wa.me/821072290580?text=Hello%20Advanced%20Koryo,%20I%20have%20a%20question%20about%20importing%20a%20vehicle.";

  return (
    <div
      dir={dir}
      className={`fixed bottom-6 z-[99] flex items-center gap-3 ${
        language === "ar" ? "left-6 flex-row-reverse" : "right-6 flex-row"
      }`}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: language === "ar" ? -15 : 15 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="hidden sm:block relative bg-[#FFFFFF] border border-slate-200 text-[#000000] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl whitespace-nowrap"
          >
            <span>
              {language === "ar" ? "تواصل معنا 24/7 عبر الواتساب!" : "Chat with us 24/7 on WhatsApp!"}
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              className={`absolute -top-1.5 h-4 w-4 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center text-[10px] font-black ${
                language === "ar" ? "-left-1.5" : "-right-1.5"
              }`}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#FFFFFF] shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none"
        title="WhatsApp Support"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 0c-6.626 0-12 5.371-12 12 0 2.115.548 4.195 1.597 6.037L0 24l6.135-1.61c1.802.983 3.826 1.5 5.892 1.5 6.623 0 12-5.377 12-12s-5.377-12-12-12zm6.273 17.075c-.267.756-1.554 1.393-2.138 1.488-.537.086-1.239.155-3.53-.787-2.929-1.205-4.809-4.194-4.954-4.389-.147-.195-1.189-1.585-1.189-3.023 0-1.439.754-2.143 1.021-2.438.267-.293.585-.368.78-.368.196 0 .392.002.563.01.176.009.414-.066.649.505.241.586.822 2.008.892 2.155.07.147.118.318.02.515-.098.195-.147.318-.293.488-.147.168-.309.378-.44.507-.147.146-.3.308-.129.605.171.293.76 1.253 1.629 2.027.9.8 1.66 1.047 1.954 1.196.293.146.464.122.636-.073.171-.195.733-.854.928-1.146.195-.293.391-.244.659-.146.268.098 1.708.805 2.001.95.293.147.488.22.562.344.073.121.073.708-.194 1.464z"/>
        </svg>
      </a>
    </div>
  );
}
