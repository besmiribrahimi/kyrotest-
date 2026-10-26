"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

export default function WelcomeSplash() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Check if splash was already shown in this browsing session
    const hasSeen = sessionStorage.getItem("kyro_splash_seen_v2");
    if (!hasSeen) {
      setShowSplash(true);
      // Auto dismiss after 2.0s
      const timer = setTimeout(() => {
        handleDismiss();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem("kyro_splash_seen_v2", "true");
    } catch (e) {
      // ignore in incognito / restricted modes
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="welcome-splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020a18] text-white select-none cursor-pointer overflow-hidden"
        >
          {/* Ambient Radial Background Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sky-500/15 blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
          </div>

          {/* Central Logo & Welcome Typography */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
            
            {/* Logo Container with Glowing Ring */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              {/* Outer Pulsing Aura */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 opacity-30 blur-lg animate-pulse" />

              {/* Logo Frame */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-white p-2.5 shadow-2xl shadow-sky-500/20 border border-white/20 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="Advanced Koryo Logo"
                  width={112}
                  height={112}
                  priority
                  className="h-full w-full object-contain"
                />

                {/* Shimmer sweep animation across the logo */}
                <motion.div
                  initial={{ x: "-150%" }}
                  animate={{ x: "150%" }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear", delay: 0.3 }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none"
                />
              </div>
            </motion.div>

            {/* Brand Title with Cinematic Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-2"
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-[0.25em] text-white uppercase font-sans drop-shadow-md">
                ADVANCED KORYO
              </h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xs sm:text-sm font-bold text-sky-400 tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <span>{isAr ? "مرحباً بكم في أدفانسد كوريو" : "Welcome to Advanced Koryo"}</span>
              </motion.div>
            </motion.div>

            {/* Glowing Laser Progress Line */}
            <div className="w-48 h-1 bg-white/10 rounded-full mt-7 overflow-hidden relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-300 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              />
            </div>

            {/* Subtle Skip Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
              className="text-[10px] text-slate-400 font-mono mt-4 tracking-wider"
            >
              {isAr ? "اضغط للمتابعة" : "Tap anywhere to continue"}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
