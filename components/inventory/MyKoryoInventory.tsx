"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import {
  ShieldCheck,
  Fuel,
  Gauge,
  Calendar,
  PhoneCall,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface RealCarItem {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  image: string;
  prices?: {
    USD?: number;
    EUR?: number;
    KRW?: number;
  };
}

export default function MyKoryoInventory() {
  const { t, language, dir } = useLanguage();
  const [selectedMake, setSelectedMake] = useState<string>("All");
  const [realCars, setRealCars] = useState<RealCarItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const makesList = ["All", "Hyundai", "Kia", "Genesis", "Audi", "BMW", "Mercedes-Benz"];

  useEffect(() => {
    async function loadRealCars() {
      setIsLoading(true);
      try {
        const brandQuery = selectedMake === "All" ? "" : `?brand=${encodeURIComponent(selectedMake)}`;
        const res = await fetch(`/api/cars${brandQuery}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.cars) {
            setRealCars(json.data.cars);
          } else if (Array.isArray(json.cars)) {
            setRealCars(json.cars);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live vehicles:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRealCars();
  }, [selectedMake]);

  return (
    <section id="inventory-section" dir={dir} className="relative py-20 bg-slate-50 dark:bg-[#020a18] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 dark:bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white dark:text-slate-950 mb-3 transition shadow-sm">
              <Sparkles className="h-4 w-4 text-sky-400 dark:text-[#0066ff]" />
              <span>Live Korea Sourcing Feed</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white transition">
              {t.inventory.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium transition">
              {t.inventory.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {makesList.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMake(m)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedMake === m
                    ? "bg-slate-900 dark:bg-[#0066ff] text-white font-extrabold border border-slate-900 dark:border-[#0066ff]"
                    : "bg-white dark:bg-[#0b1528] border border-slate-300 dark:border-white/5 text-slate-800 dark:text-white hover:border-[#0066ff]/40 dark:hover:border-sky-400 shadow-sm"
                }`}
              >
                {m === "All" ? t.inventory.allBrands : m}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-slate-800 dark:text-[#0066ff] animate-spin" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 transition">
              {language === "ar" ? "جاري جلب أحدث السيارات المتاحة من كوريا..." : "Fetching live vehicles directly from South Korea..."}
            </p>
          </div>
        )}

        {/* Real Cars Grid */}
        {!isLoading && realCars.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {realCars.map((car, idx) => {
              const priceUsd = car.prices?.USD ? Math.round(car.prices.USD) : typeof car.price === 'number' ? Math.round(car.price / 1350) : 24000;
              const priceSar = Math.round(priceUsd * 3.75);

              return (
                <motion.div
                  key={car.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="koryo-card-white rounded-3xl overflow-hidden flex flex-col justify-between koryo-card-white-hover"
                >
                  <div>
                    <Link href={`/vehicle/${car.id}`} className="block relative aspect-[16/10] bg-slate-100 dark:bg-[#070d19] overflow-hidden border-b border-slate-200 dark:border-white/5 group transition">
                      <Image
                        src={car.image || "/images/genesis_g80_export.png"}
                        alt={car.title || "Korean Export Vehicle"}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 dark:from-[#000000]/80 via-transparent to-transparent opacity-85" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white bg-[#0066ff] px-3 py-1 rounded-md border border-white/20">
                          <ShieldCheck className="h-3.5 w-3.5 text-white" />
                          <span>{t.inventory.inspectedBadge}</span>
                        </span>

                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-slate-950 px-3 py-1 rounded-md border border-white/10">
                          {t.inventory.exportReady}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 font-mono text-[11px] font-bold text-white bg-slate-950/80 backdrop-blur px-2.5 py-0.5 rounded border border-white/10">
                        ID: #{car.id}
                      </div>
                    </Link>

                    <div className="p-6 space-y-4">
                      <Link href={`/vehicle/${car.id}`} className="block hover:text-[#0066ff] dark:hover:text-sky-400 transition">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 transition font-sans">
                          {car.title}
                        </h3>
                      </Link>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700 dark:text-slate-350 font-semibold bg-slate-100/60 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-200/60 dark:border-white/5 transition">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Calendar className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400 mb-1" />
                          <span>{car.year || 2022}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                          <Gauge className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400 mb-1" />
                          <span>{car.mileage?.toLocaleString() || 0} km</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                          <Fuel className="h-3.5 w-3.5 text-[#0066ff] dark:text-sky-400 mb-1" />
                          <span className="capitalize">{car.fuelType || "Gasoline"}</span>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between border-t border-slate-200 dark:border-white/10 pt-4 transition-colors">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">FOB Price (Korea)</div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono transition">
                            ${priceUsd.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">USD</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Est. SAR</div>
                          <div className="text-sm font-extrabold text-white dark:text-slate-900 font-mono bg-slate-950 dark:bg-white px-2.5 py-0.5 rounded border border-white/10 dark:border-transparent transition shadow-sm">
                            ~{priceSar.toLocaleString()} SAR
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex gap-2">
                    <Link
                      href={`/vehicle/${car.id}`}
                      className="w-full flex items-center justify-center gap-2 rounded-xl koryo-btn-black py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition"
                    >
                      <span>{language === "ar" ? "عرض التفاصيل الكاملة" : "View Full Specs"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
