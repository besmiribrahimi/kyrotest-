"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle2, ArrowUpRight, ShieldCheck, Sparkles, MessageSquare, Gauge, Fuel, MapPin } from "lucide-react";
import AdvancedSearchWidget from "@/components/search/AdvancedSearchWidget";

interface ShowcaseVehicle {
  id: string;
  name: string;
  price: string;
  badge: string;
  image: string;
  engine: string;
  mileage: string;
  locationEn: string;
  locationAr: string;
}

export default function HeroSection() {
  const { t, language, dir } = useLanguage();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("genesis-g80");

  // 3D Magnetic Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });

  const vehicles: ShowcaseVehicle[] = [
    {
      id: "genesis-g80",
      name: "Genesis G80 3.5T AWD",
      price: "$28,500 USD",
      badge: "150-Pt Encar Certified",
      image: "/images/genesis_g80_export.png",
      engine: "3.5L V6 Twin-Turbo (375 HP)",
      mileage: "28,400 km • Grade A+",
      locationEn: "Incheon Yard (Ro-Ro Ready)",
      locationAr: "ميناء إنشون (جاهزة للشحن)",
    },
    {
      id: "kia-carnival",
      name: "Kia Carnival Hi-Limousine",
      price: "$34,200 USD",
      badge: "Lotte Auction Approved",
      image: "/images/kia_carnival_export.png",
      engine: "3.5L V6 Smartstream VIP",
      mileage: "18,200 km • Grade A+",
      locationEn: "Busan Port Yard (Direct)",
      locationAr: "ميناء بوسان (شحن مباشر)",
    },
    {
      id: "hyundai-palisade",
      name: "Hyundai Palisade Calligraphy",
      price: "$29,800 USD",
      badge: "Encar Trust Verified",
      image: "/images/hyundai_palisade_export.png",
      engine: "3.8L V6 HTRAC AWD",
      mileage: "31,000 km • Accident-Free",
      locationEn: "Seoul Center Yard",
      locationAr: "مستودع سيول المركزي",
    },
    {
      id: "porsche-cayenne",
      name: "Porsche Cayenne Coupe 3.0T",
      price: "$58,900 USD",
      badge: "Supercar Certified",
      image: "/images/porsche_cayenne_export.png",
      engine: "3.0L Turbo V6 (340 HP)",
      mileage: "14,500 km • Full Warranty",
      locationEn: "Incheon Logistics Hub",
      locationAr: "مركز إنشون اللوجستي",
    },
  ];

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const whatsappInquiryUrl = `https://wa.me/821072290580?text=${encodeURIComponent(
    `Hello Advanced Koryo! I am inquiring about the ${activeVehicle.name} listed at ${activeVehicle.price}.`
  )}`;

  // Mouse tilt calculations
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8; // Gentle tilt max 8deg
    const rotateY = ((x - centerX) / centerX) * 8;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  return (
    <section dir={dir} className="relative overflow-hidden bg-white dark:bg-[#020a18] pt-12 pb-20 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Inline styles for text shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: shimmer-text 5s linear infinite;
        }
      `}</style>

      {/* Dynamic Animated Glassmorphic Ambient Orbs */}
      <motion.div 
        animate={{
          y: [0, 25, 0],
          x: [0, 15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-600/10 dark:bg-[#0066ff]/8 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          y: [0, -30, 0],
          x: [0, -20, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-400/8 dark:bg-sky-400/5 blur-[110px] pointer-events-none" 
      />

      {/* Background Dot Matrix Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(rgba(255,255,255,0.07)_1.5px,transparent_1.5px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-70 pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 space-y-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Premium Headline & Sourcing Stats */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Interactive float-blink Sparkles wrapped around Badge */}
            <div className="relative inline-block">
              <motion.span 
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8], y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2.5 -right-3 text-sky-400 dark:text-sky-300 pointer-events-none z-20"
              >
                <Sparkles className="h-4 w-4 fill-current" />
              </motion.span>

              <div className="inline-flex items-center gap-2.5 rounded-full bg-[#003478]/5 dark:bg-sky-500/10 border border-[#003478]/15 dark:border-sky-500/20 px-4.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#003478] dark:text-sky-400 shadow-sm transition">
                <ShieldCheck className="h-4 w-4 text-[#003478] dark:text-sky-400" />
                <Image
                  src="/Flag_of_South_Korea.svg"
                  alt="South Korea Flag"
                  width={16}
                  height={10}
                  className="h-3 w-[18px] rounded-[1px] object-cover"
                />
                <span>{t.hero.badge}</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white font-sans transition">
              {t.hero.title}{" "}
              <span className="block mt-3 bg-gradient-to-r from-[#003478] via-[#0066ff] to-[#003478] dark:from-sky-400 dark:via-[#0066ff] dark:to-[#00c6ff] bg-clip-text text-transparent w-fit font-black drop-shadow-sm pb-1 transition animate-text-shimmer">
                {t.hero.titleAccent}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium font-sans transition">
              {t.hero.description}
            </p>

            {/* Live Stats Block - High-end Floating Glassmorphic Panels */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: t.hero.stat1Value, label: t.hero.stat1Label, icon: ShieldCheck, color: "text-blue-600 dark:text-sky-400" },
                { value: t.hero.stat2Value, label: t.hero.stat2Label, icon: CheckCircle2, color: "text-teal-600 dark:text-teal-400" },
                { value: t.hero.stat3Value, label: t.hero.stat3Label, icon: Sparkles, color: "text-amber-500 dark:text-amber-400" },
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col justify-between p-4.5 rounded-2xl bg-slate-50/80 dark:bg-[#0b1528]/60 border border-slate-200/60 dark:border-white/5 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <stat.icon className={`h-5 w-5 ${stat.color} opacity-80`} />
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight transition">{stat.value}</div>
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400 mt-3 leading-tight transition">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Ultra-Luxury Integrated Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative perspective-[1000px]"
          >
            {/* 3D Tilting Card Container */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: tilt.isHovered
                  ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.015)`
                  : "rotateX(0deg) rotateY(0deg) scale(1)",
                transition: tilt.isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
              }}
              className="koryo-card-white bg-white/95 dark:bg-[#0b1528]/95 backdrop-blur-md rounded-3xl p-6 space-y-5 relative overflow-hidden shadow-2xl dark:shadow-[0_0_80px_-15px_rgba(0,102,255,0.35)] border border-slate-200 dark:border-white/10 group hover:border-[#0066ff]/20 dark:hover:border-sky-400/20"
            >
              {/* Dynamic Spotlight Glare Overlay */}
              {tilt.isHovered && (
                <div
                  className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(500px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.16), transparent 40%)`,
                  }}
                />
              )}

              {/* Integrated Segment Control Tabs Bar */}
              <div className="bg-slate-100/90 dark:bg-slate-950/80 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/80 dark:border-white/10">
                {vehicles.map((v) => {
                  const isActive = v.id === selectedVehicleId;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicleId(v.id)}
                      className={`relative flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider transition rounded-xl z-10 ${
                        isActive
                          ? "bg-[#0066ff] text-white shadow-lg font-black"
                          : "text-slate-555 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{v.name.split(" ")[0]} {v.name.split(" ")[1]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Vehicle Image Showcase with Cross-Fade */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#070d19] border border-slate-200 dark:border-white/10 transition">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeVehicle.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeVehicle.image}
                      alt={activeVehicle.name}
                      fill
                      className="object-cover transition duration-700"
                      priority
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 dark:from-[#000000]/95 via-transparent to-transparent z-10" />
                
                <div className="absolute top-3 left-3 z-20">
                  <span className="text-[10px] font-bold font-mono text-white bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {activeVehicle.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#FFFFFF] z-20">
                  <span className="font-extrabold bg-slate-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-lg font-sans">
                    {activeVehicle.name}
                  </span>
                  <span className="font-mono text-[#FFFFFF] font-extrabold bg-[#0066ff] px-3.5 py-1.5 rounded-xl border border-white/20 shadow-lg">
                    {activeVehicle.price}
                  </span>
                </div>
              </div>

              {/* Structured Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-white/5 space-y-1 hover:border-[#0066ff]/20 dark:hover:border-sky-400/20 transition-all duration-300">
                  <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-400 text-[9px] uppercase font-bold tracking-wider">
                    <Fuel className="h-3.5 w-3.5 text-[#0066ff] shrink-0" />
                    <span>Engine</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{activeVehicle.engine.split("(")[0]}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-white/5 space-y-1 hover:border-[#0066ff]/20 dark:hover:border-sky-400/20 transition-all duration-300">
                  <div className="flex items-center gap-1.5 text-slate-455 dark:text-slate-400 text-[9px] uppercase font-bold tracking-wider">
                    <Gauge className="h-3.5 w-3.5 text-[#0066ff] shrink-0" />
                    <span>Odometer</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{activeVehicle.mileage.split("•")[0]}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-white/5 space-y-1 hover:border-[#0066ff]/20 dark:hover:border-sky-400/20 transition-all duration-300">
                  <div className="flex items-center gap-1.5 text-slate-455 dark:text-slate-400 text-[9px] uppercase font-bold tracking-wider">
                    <MapPin className="h-3.5 w-3.5 text-[#0066ff] shrink-0" />
                    <span>Location</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {language === "ar" ? activeVehicle.locationAr.split("(")[0] : activeVehicle.locationEn.split("(")[0]}
                  </div>
                </div>
              </div>

              {/* Dual Action CTA Bar - Redesigned Luxury Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="#inventory-section"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 hover:border-[#0066ff]/20 dark:hover:border-sky-400/20 text-slate-800 dark:text-white py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{t.inventory.title}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_4px_18px_-2px_rgba(16,185,129,0.35)] dark:shadow-[0_4px_18px_-2px_rgba(16,185,129,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  {/* Live Status indicator ring for online availability */}
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
                  </span>
                  <span>{language === "ar" ? "استفسر واتساب" : "Inquire Car"}</span>
                </a>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Full-width Advanced Search Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AdvancedSearchWidget />
        </motion.div>
      </div>
    </section>
  );
}
