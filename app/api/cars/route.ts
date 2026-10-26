import { NextResponse } from "next/server";
import { CATALOG_CARS } from "@/lib/catalog-data";

function normalizeImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes("/image-proxy")) {
    try {
      const inner = new URL(url).searchParams.get("url");
      if (inner && (inner.includes("encar.com") || inner.includes("ci.encar.com"))) {
        return inner.split("?")[0];
      }
    } catch {
      // Malformed URL - fall through
    }
    return url;
  }
  return url.split("?")[0];
}

function getFallbackCars(params: {
  brand?: string;
  source?: string;
  model?: string;
  yearFrom?: string;
  yearTo?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  limit?: string;
}) {
  let list = [...CATALOG_CARS];

  // Exclusively Encar
  list = list.filter((c) => !c.source || c.source.toLowerCase() === "encar");

  if (params.brand && params.brand !== "All") {
    list = list.filter((c) => c.brand.toLowerCase() === params.brand!.toLowerCase());
  }

  if (params.model) {
    list = list.filter(
      (c) =>
        c.model.toLowerCase().includes(params.model!.toLowerCase()) ||
        c.title.toLowerCase().includes(params.model!.toLowerCase())
    );
  }

  if (params.yearFrom) {
    const yr = Number(params.yearFrom);
    if (!isNaN(yr)) list = list.filter((c) => c.year >= yr);
  }

  if (params.yearTo) {
    const yr = Number(params.yearTo);
    if (!isNaN(yr)) list = list.filter((c) => c.year <= yr);
  }

  if (params.minPrice) {
    const p = Number(params.minPrice);
    if (!isNaN(p)) list = list.filter((c) => c.priceUsd >= p);
  }

  if (params.maxPrice) {
    const p = Number(params.maxPrice);
    if (!isNaN(p)) list = list.filter((c) => c.priceUsd <= p);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.titleAr && c.titleAr.includes(q)) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        (c.vin && c.vin.toLowerCase().includes(q))
    );
  }

  const limitNum = params.limit ? parseInt(params.limit, 10) : 48;
  const sliced = list.slice(0, isNaN(limitNum) ? 48 : limitNum);

  return sliced.map((c) => ({
    id: c.id,
    encarId: c.id,
    title: c.title,
    titleAr: c.titleAr,
    brand: c.brand,
    model: c.model,
    year: c.year,
    price: c.price,
    priceUsd: c.priceUsd,
    mileage: c.mileage,
    fuelType: c.fuelType,
    transmission: c.transmission,
    bodyType: c.bodyType,
    drivetrain: c.drivetrain,
    source: "encar",
    image: c.image,
    images: c.images,
    badge: c.badge || "Encar Certified",
    vin: c.vin,
    prices: {
      USD: c.priceUsd,
      EUR: Math.round(c.priceUsd * 0.92),
      KRW: c.price,
    },
    inspection: c.inspection,
  }));
}

function normalizeEncarCar(c: any, isDetail: boolean = false) {
  const priceKrw = c.pricing?.krw || c.priceKrw || (typeof c.price === "number" ? c.price : 25000000);
  const priceUsd = c.pricing?.usd || c.priceUsd || Math.round(priceKrw / 1350);
  const priceEur = c.pricing?.eur || Math.round(priceUsd * 0.92);

  const rawCover = c.coverPhoto || c.image || c.images?.[0] || c.photos?.[0] || "";
  const mainImage = normalizeImageUrl(rawCover);

  let allImages: string[] = [];
  if (Array.isArray(c.images) && c.images.length > 0) {
    allImages = c.images.map((img: any) => normalizeImageUrl(typeof img === "string" ? img : img?.url || ""));
  } else if (Array.isArray(c.photos) && c.photos.length > 0) {
    allImages = c.photos.map((img: any) => normalizeImageUrl(typeof img === "string" ? img : img?.url || ""));
  } else if (mainImage) {
    allImages = [mainImage];
  }

  return {
    id: String(c.id || c.encarId),
    encarId: c.encarId ? String(c.encarId) : String(c.id),
    title: c.title || `${c.brand || "Korean"} ${c.model || "Export"}`,
    brand: (c.brand || "Encar").replace(/_/g, " "),
    model: c.model || "",
    year: c.year || 2022,
    price: priceKrw,
    priceUsd: priceUsd,
    prices: {
      USD: priceUsd,
      EUR: priceEur,
      KRW: priceKrw,
    },
    mileage: c.mileageKm || c.mileage || 0,
    fuelType: c.fuelType || "Gasoline",
    transmission: c.transmission || "Automatic",
    bodyType: c.bodyType || "Sedan",
    drivetrain: c.drivetrain || "2WD",
    location: c.location || "Seoul / Incheon Yard",
    source: "encar",
    image: mainImage,
    images: isDetail ? allImages : allImages.slice(0, 6),
    badge: "Encar Certified",
    licensePlate: c.licensePlate || c.accidentHistory?.licensePlate || "",
    vin: c.vin || c.accidentHistory?.vin || "",
    displacement: c.displacement,
    accidentHistory: c.accidentHistory || c.accident,
    exportEligibility: c.exportEligibility || {
      lhdCompatible: true,
      score: 95,
      recommendations: ["100% Left-Hand Drive (LHD) - GCC & Global Compliant"],
    },
    options: isDetail ? c.options : undefined,
    sellerComment: isDetail ? c.sellerComment : undefined,
  };
}

// 5-minute server-side in-memory cache for instant response times
interface CacheEntry {
  timestamp: number;
  data: any;
}
const routeCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand") || "";
  const model = searchParams.get("model") || "";
  const yearFrom = searchParams.get("yearFrom") || "";
  const yearTo = searchParams.get("yearTo") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const search = searchParams.get("search") || "";
  const limit = searchParams.get("limit") || "40";
  const page = searchParams.get("page") || "1";
  const id = searchParams.get("id") || "";

  const cacheKey = id
    ? `car_${id}`
    : `feed_${brand}_${model}_${yearFrom}_${yearTo}_${minPrice}_${maxPrice}_${search}_${limit}_p${page}`;
  const cached = routeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=600",
        "X-Cache": "HIT",
      },
    });
  }

  const primaryKey = process.env.APICARS_API_KEY || "RINMkYz8kXAX5FFEykWPKSWJl9V7uljeGGo";
  const backupKey = "RINSX9BFq53MC67FEXIJREa7Uq0UHfHTeP";
  const apiBase = "https://api.rinevoapi.com/api/encar";

  // 1. Single car lookup by ID
  if (id) {
    try {
      const detailUrl = `${apiBase}/cars/${encodeURIComponent(id)}`;
      let res = await fetch(detailUrl, {
        headers: { "x-api-key": primaryKey },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      }).catch(() => null);

      if (res && res.status === 401 && primaryKey !== backupKey) {
        res = await fetch(detailUrl, {
          headers: { "x-api-key": backupKey },
          cache: "no-store",
          signal: AbortSignal.timeout(3000),
        }).catch(() => null);
      }

      if (res && res.ok) {
        const j = await res.json().catch(() => null);
        const rawCar = j?.vehicle || j?.car;
        if (rawCar) {
          const normalized = normalizeEncarCar(rawCar, true);
          const responsePayload = { success: true, car: normalized };
          routeCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });
          return NextResponse.json(responsePayload, {
            headers: {
              "Cache-Control": "public, s-maxage=180, stale-while-revalidate=600",
              "X-Cache": "MISS",
            },
          });
        }
      }
    } catch {
      // Fall through to local fallback
    }

    const foundFallback = CATALOG_CARS.find((c) => c.id === id);
    if (foundFallback) {
      const responsePayload = {
        success: true,
        car: {
          id: foundFallback.id,
          title: foundFallback.title,
          titleAr: foundFallback.titleAr,
          brand: foundFallback.brand,
          model: foundFallback.model,
          year: foundFallback.year,
          price: foundFallback.price,
          mileage: foundFallback.mileage,
          fuelType: foundFallback.fuelType,
          transmission: foundFallback.transmission,
          bodyType: foundFallback.bodyType,
          drivetrain: foundFallback.drivetrain,
          source: "encar",
          image: foundFallback.image,
          images: foundFallback.images,
          badge: foundFallback.badge || "Encar Certified",
          vin: foundFallback.vin,
          prices: {
            USD: foundFallback.priceUsd,
            EUR: Math.round(foundFallback.priceUsd * 0.92),
            KRW: foundFallback.price,
          },
          inspection: foundFallback.inspection,
        },
      };
      routeCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });
      return NextResponse.json(responsePayload);
    }
  }

  // 2. Cars feed query with pagination
  try {
    const encarParams = new URLSearchParams();
    encarParams.set("limit", limit);
    encarParams.set("page", page);
    if (brand && brand !== "All") encarParams.set("brand", brand);
    if (model) encarParams.set("model", model);
    if (yearFrom) encarParams.set("minYear", yearFrom);
    if (yearTo) encarParams.set("maxYear", yearTo);
    if (minPrice) encarParams.set("minPrice", minPrice);
    if (maxPrice) encarParams.set("maxPrice", maxPrice);
    if (search) encarParams.set("search", search);

    const targetUrl = `${apiBase}/cars?${encarParams.toString()}`;

    let res = await fetch(targetUrl, {
      headers: { "x-api-key": primaryKey },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    }).catch(() => null);

    if (res && res.status === 401 && primaryKey !== backupKey) {
      res = await fetch(targetUrl, {
        headers: { "x-api-key": backupKey },
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      }).catch(() => null);
    }

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      const rawCars = data?.recentCars || data?.data?.cars || data?.cars;
      if (Array.isArray(rawCars) && rawCars.length > 0) {
        const normalizedList = rawCars.map((c: any) => normalizeEncarCar(c, false));
        const totalInDb = data?.meta?.totalCarsInDb || data?.meta?.total || 121651;
        const totalPages = data?.meta?.totalPages || Math.ceil(totalInDb / (parseInt(limit, 10) || 40));
        const responsePayload = {
          success: true,
          data: {
            cars: normalizedList,
            total: totalInDb,
            page: parseInt(page, 10) || 1,
            totalPages,
          },
          cars: normalizedList,
        };
        routeCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });
        return NextResponse.json(responsePayload, {
          headers: {
            "Cache-Control": "public, s-maxage=180, stale-while-revalidate=600",
            "X-Cache": "MISS",
          },
        });
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    if (pageNum > 1) {
      // If beyond page 1 and upstream returned empty, signal end of list
      return NextResponse.json({
        success: true,
        data: {
          cars: [],
          total: 48,
          page: pageNum,
          totalPages: 1,
        },
        cars: [],
      });
    }

    // Upstream Encar API timed out or returned empty; serve certified Encar fallback (page 1 only)
    const fallbackList = getFallbackCars({
      brand,
      model,
      yearFrom,
      yearTo,
      minPrice,
      maxPrice,
      search,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        cars: fallbackList,
        total: fallbackList.length,
        page: 1,
        totalPages: 1,
      },
      cars: fallbackList,
    });
  } catch (error) {
    console.error("Encar API route error, falling back to curated catalog:", error);
    const pageNum = parseInt(page, 10) || 1;
    if (pageNum > 1) {
      return NextResponse.json({
        success: true,
        data: { cars: [], total: 48, page: pageNum, totalPages: 1 },
        cars: [],
      });
    }

    const fallbackList = getFallbackCars({
      brand,
      model,
      yearFrom,
      yearTo,
      minPrice,
      maxPrice,
      search,
      limit,
    });
    return NextResponse.json({
      success: true,
      data: {
        cars: fallbackList,
        total: fallbackList.length,
        page: 1,
        totalPages: 1,
      },
      cars: fallbackList,
    });
  }
}
