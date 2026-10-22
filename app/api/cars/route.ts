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

  if (params.source && params.source !== "all") {
    list = list.filter((c) => c.source.toLowerCase() === params.source!.toLowerCase());
  }

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
    title: c.title,
    titleAr: c.titleAr,
    brand: c.brand,
    model: c.model,
    year: c.year,
    price: c.price,
    mileage: c.mileage,
    fuelType: c.fuelType,
    transmission: c.transmission,
    bodyType: c.bodyType,
    drivetrain: c.drivetrain,
    source: c.source,
    image: c.image,
    images: c.images,
    badge: c.badge,
    vin: c.vin,
    prices: {
      USD: c.priceUsd,
      EUR: Math.round(c.priceUsd * 0.92),
      KRW: c.price,
    },
    inspection: c.inspection,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand") || "";
  const source = searchParams.get("source") || "";
  const model = searchParams.get("model") || "";
  const yearFrom = searchParams.get("yearFrom") || "";
  const yearTo = searchParams.get("yearTo") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const search = searchParams.get("search") || "";
  const limit = searchParams.get("limit") || "48";
  const id = searchParams.get("id") || "";

  // Single car lookup
  if (id) {
    const foundFallback = CATALOG_CARS.find((c) => c.id === id);
    if (foundFallback) {
      return NextResponse.json({
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
          source: foundFallback.source,
          image: foundFallback.image,
          images: foundFallback.images,
          badge: foundFallback.badge,
          vin: foundFallback.vin,
          prices: {
            USD: foundFallback.priceUsd,
            EUR: Math.round(foundFallback.priceUsd * 0.92),
            KRW: foundFallback.price,
          },
          inspection: foundFallback.inspection,
        },
      });
    }
  }

  try {
    const primaryKey = process.env.APICARS_API_KEY || "RINSX9BFq53MC67FEXIJREa7Uq0UHfHTeP";
    const backupKey = "RINupcjSzwvpZNvNLfaMYcoiKHxQ1mk1AX";

    const scraperParams = new URLSearchParams();
    scraperParams.set("limit", limit);
    if (brand && brand !== "All") scraperParams.set("brand", brand);
    if (source && source !== "all") scraperParams.set("source", source);
    if (model) scraperParams.set("model", model);
    if (yearFrom) scraperParams.set("yearFrom", yearFrom);
    if (yearTo) scraperParams.set("yearTo", yearTo);
    if (minPrice) scraperParams.set("minPrice", minPrice);
    if (maxPrice) scraperParams.set("maxPrice", maxPrice);
    if (search) scraperParams.set("search", search);

    const scraperUrl = `https://api.rinevoapi.autos/api/scraper/cars?${scraperParams.toString()}`;

    let res = await fetch(scraperUrl, {
      headers: {
        "x-api-key": primaryKey,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(3000), // Quick timeout so user doesn't wait
    }).catch(() => null);

    if (res && res.status === 401 && primaryKey !== backupKey) {
      res = await fetch(scraperUrl, {
        headers: {
          "x-api-key": backupKey,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      }).catch(() => null);
    }

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      const remoteCars = data?.data?.cars || data?.cars;
      if (Array.isArray(remoteCars) && remoteCars.length > 0) {
        for (const car of remoteCars) {
          if (car.image) car.image = normalizeImageUrl(car.image);
          if (Array.isArray(car.images)) {
            car.images = car.images.map((img: string) => normalizeImageUrl(img));
          }
        }
        return NextResponse.json(data);
      }
    }

    // Upstream scraper did not return data; serve certified export fallback
    const fallbackList = getFallbackCars({
      brand,
      source,
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
      },
      cars: fallbackList,
    });
  } catch (error) {
    console.error("API proxy error, falling back to curated Korean catalog:", error);
    const fallbackList = getFallbackCars({
      brand,
      source,
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
      },
      cars: fallbackList,
    });
  }
}
