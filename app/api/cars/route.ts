import { NextResponse } from "next/server";
import { CATALOG_CARS } from "@/lib/catalog-data";

function getPhotoPriority(url: string): number {
  if (!url) return 9999;
  const lower = url.toLowerCase();
  if (lower.includes("noimage") || lower.includes("placeholder") || lower.includes("empty")) return 9999;

  if (/(wheel|tire|rim|tyre|alloy|caliper|brake|odometer|pedal|engine|underbody|exhaust|scratch|trunk_inside|tag)/i.test(lower)) {
    return 800;
  }

  const filename = lower.substring(lower.lastIndexOf("/") + 1);
  const match = filename.match(/[_-](\d+)\./);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num === 1) return 1;    // Front-left 3/4 primary exterior showcase shot
    if (num === 11) return 2;   // Front-right 3/4 opposite exterior
    if (num === 2) return 3;    // Front full
    if (num === 12) return 4;   // Rear-right 3/4 opposite exterior
    if (num === 3) return 5;    // Rear full
    if (num === 4) return 6;    // Left side profile
    if (num === 14) return 7;   // Right side profile
    if (num >= 5 && num <= 10) return 10 + num;
    if (num >= 15 && num <= 19) return 30 + num;
    if (num >= 20 && num <= 25) return 60 + num;
    if (num >= 26 && num <= 35) return 500 + num;
    if (num >= 36) return 600 + num;
    return 100 + num;
  }

  if (lower.includes("front") || lower.includes("cover") || lower.includes("main") || lower.includes("hero")) return 2;
  if (lower.includes("rear") || lower.includes("back")) return 5;
  if (lower.includes("side")) return 6;
  if (lower.includes("interior") || lower.includes("cockpit")) return 40;

  return 200;
}

function sortCarImages(images: string[]): string[] {
  if (!images || !Array.isArray(images) || images.length === 0) return [];
  const unique = Array.from(new Set(images.filter((img): img is string => typeof img === "string" && img.trim().length > 0)));
  return unique.sort((a, b) => getPhotoPriority(a) - getPhotoPriority(b));
}

function normalizeImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes("/image-proxy")) {
    try {
      const inner = new URL(url).searchParams.get("url");
      if (
        inner &&
        (inner.includes("encar.com") ||
          inner.includes("ci.encar.com") ||
          inner.includes("kbchachacha.com") ||
          inner.includes("autoimg.cn") ||
          inner.includes("che168.com"))
      ) {
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
  // Always resolve to the real clean vehicle ID (e.g. 41188766), not the internal DB UUID
  const cleanId = String(c.encar_id || c.encarId || c.sourceListingId || c.id || "");

  // Robust price resolution across v1 and v2 formats
  const priceKrw =
    Number(
      c.pricing?.krw ||
        c.priceKrw ||
        c.originalPriceKrw ||
        (typeof c.price === "number" && c.price > 100000 ? c.price : 0) ||
        c.prices?.KRW
    ) || 25000000;

  const priceUsd =
    Number(c.pricing?.usd || c.priceUsd || c.prices?.USD) ||
    Math.round(priceKrw / 1350);

  const priceEur =
    Number(c.pricing?.eur || c.prices?.EUR) || Math.round(priceUsd * 0.92);

  // Photos & images from all possible formats
  let allImages: string[] = [];
  if (Array.isArray(c.images) && c.images.length > 0) {
    allImages = c.images.map((img: any) =>
      normalizeImageUrl(typeof img === "string" ? img : img?.url || "")
    );
  } else if (Array.isArray(c.photos) && c.photos.length > 0) {
    allImages = c.photos.map((img: any) =>
      normalizeImageUrl(typeof img === "string" ? img : img?.url || "")
    );
  } else if (Array.isArray(c.media?.photos) && c.media.photos.length > 0) {
    allImages = c.media.photos.map((img: any) =>
      normalizeImageUrl(typeof img === "string" ? img : img?.url || "")
    );
  } else if (c.image) {
    allImages = [normalizeImageUrl(c.image)];
  } else if (c.media?.coverPhoto) {
    allImages = [normalizeImageUrl(c.media.coverPhoto)];
  } else if (c.coverPhoto) {
    allImages = [normalizeImageUrl(c.coverPhoto)];
  }

  // Sort photos so exterior front showcase shot is ALWAYS at index 0 and wheels are at the end
  allImages = sortCarImages(allImages);
  const mainImage =
    allImages[0] ||
    normalizeImageUrl(c.coverPhoto || c.image || c.media?.coverPhoto || "");

  return {
    id: cleanId,
    encarId: cleanId,
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
    source: c.source || "encar",
    image: mainImage,
    images: isDetail ? allImages : allImages.slice(0, 8),
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
    options: isDetail ? (c.options || c.vehicleOptions) : undefined,
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
  const yearFrom = searchParams.get("yearFrom") || searchParams.get("minYear") || "";
  const yearTo = searchParams.get("yearTo") || searchParams.get("maxYear") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const search = searchParams.get("search") || searchParams.get("q") || "";
  const fuelType = searchParams.get("fuelType") || "";
  const bodyType = searchParams.get("bodyType") || "";
  const limit = searchParams.get("limit") || "40";
  const page = searchParams.get("page") || "1";
  const id = searchParams.get("id") || "";

  const cacheKey = id
    ? `car_${id}`
    : `feed_${brand}_${model}_${yearFrom}_${yearTo}_${minPrice}_${maxPrice}_${search}_${fuelType}_${bodyType}_${limit}_p${page}`;
  const cached = routeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=600",
        "X-Cache": "HIT",
      },
    });
  }

  const configuredKey = process.env.APICARS_API_KEY;
  const primaryKey =
    !configuredKey || configuredKey === "RINMkYz8kXAX5FFEykWPKSWJl9V7uljeGGo"
      ? "RINCMbzWP1Jm21VshR80FcBGj4QAJF458l"
      : configuredKey;

  // 1. Single car lookup by ID
  if (id) {
    try {
      const detailUrls = [
        `https://api.rinevoapi.com/api/v1/vehicle/${encodeURIComponent(id)}/full`,
        `https://api.rinevoapi.com/api/encar/cars/${encodeURIComponent(id)}`,
      ];

      for (const detailUrl of detailUrls) {
        const res = await fetch(detailUrl, {
          headers: { "x-api-key": primaryKey },
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        }).catch(() => null);

        if (res && res.ok) {
          const j = await res.json().catch(() => null);
          const rawCar = j?.data || j?.vehicle || j?.car;
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

    // Return 404 if specific vehicle ID was requested and not found
    return NextResponse.json(
      { success: false, error: "Vehicle not found" },
      { status: 404 }
    );
  }

  // 2. Cars feed query with real server-side search and pagination
  try {
    const v1Params = new URLSearchParams();
    v1Params.set("limit", limit);
    v1Params.set("page", page);
    if (brand && brand !== "All") v1Params.set("brand", brand);
    if (model) v1Params.set("model", model);
    if (yearFrom) v1Params.set("yearFrom", yearFrom);
    if (yearTo) v1Params.set("yearTo", yearTo);

    // Convert USD prices to KRW for upstream database
    if (minPrice) {
      const p = Number(minPrice);
      if (!isNaN(p)) {
        const krw = p < 1000000 ? Math.round(p * 1350) : p;
        v1Params.set("priceFromKrw", String(krw));
      }
    }
    if (maxPrice) {
      const p = Number(maxPrice);
      if (!isNaN(p)) {
        const krw = p < 1000000 ? Math.round(p * 1350) : p;
        v1Params.set("priceToKrw", String(krw));
      }
    }
    if (search) {
      v1Params.set("q", search);
    }
    if (bodyType && bodyType !== "All") {
      v1Params.set("bodyType", bodyType);
    }

    // Query primary v1 search endpoint
    let res = await fetch(`https://api.rinevoapi.com/api/v1/cars?${v1Params.toString()}`, {
      headers: { "x-api-key": primaryKey },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);

    let rawCars: any[] | null = null;
    let totalInDb = 378210;
    let totalPages = Math.ceil(totalInDb / (parseInt(limit, 10) || 40));

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (Array.isArray(data?.data?.cars) && data.data.cars.length > 0) {
        rawCars = data.data.cars;
        totalInDb = data?.data?.pagination?.total ?? totalInDb;
        totalPages = data?.data?.pagination?.totalPages ?? Math.ceil(totalInDb / (parseInt(limit, 10) || 40));
      } else if (Array.isArray(data?.cars) && data.cars.length > 0) {
        rawCars = data.cars;
      }
    }

    // Fallback to /api/encar/cars if v1 didn't return cars
    if (!rawCars) {
      const encarParams = new URLSearchParams();
      encarParams.set("limit", limit);
      encarParams.set("page", page);
      if (brand && brand !== "All") encarParams.set("brand", brand);
      if (search) encarParams.set("search", search);

      const fallbackRes = await fetch(`https://api.rinevoapi.com/api/encar/cars?${encarParams.toString()}`, {
        headers: { "x-api-key": primaryKey },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }).catch(() => null);

      if (fallbackRes && fallbackRes.ok) {
        const data = await fallbackRes.json().catch(() => null);
        const fbCars = data?.recentCars || data?.data?.cars || data?.cars;
        if (Array.isArray(fbCars) && fbCars.length > 0) {
          rawCars = fbCars;
          totalInDb = data?.meta?.totalCarsInDb || data?.meta?.total || totalInDb;
          totalPages = data?.meta?.totalPages || Math.ceil(totalInDb / (parseInt(limit, 10) || 40));
        }
      }
    }

    if (rawCars && rawCars.length > 0) {
      const normalizedList = rawCars.map((c: any) => normalizeEncarCar(c, false));
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

    const pageNum = parseInt(page, 10) || 1;
    if (pageNum > 1 || search || (brand && brand !== "All")) {
      // If beyond page 1 or filtered search returned empty, return empty list (not dummy fallback)
      return NextResponse.json({
        success: true,
        data: {
          cars: [],
          total: 0,
          page: pageNum,
          totalPages: 1,
        },
        cars: [],
      });
    }

    // Upstream API timed out or returned empty on default page 1; serve certified Encar fallback
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
    if (pageNum > 1 || search || (brand && brand !== "All")) {
      return NextResponse.json({
        success: true,
        data: { cars: [], total: 0, page: pageNum, totalPages: 1 },
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
