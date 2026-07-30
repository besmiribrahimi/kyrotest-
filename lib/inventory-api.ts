import type {
  Car,
  InventoryFilterOption,
  InventoryFilterOptions,
  InventoryFuelType,
  InventoryPagination,
} from "@/types/inventory";
import {
  normalizeCarSummary,
  NOT_SPECIFIED,
  toNumber,
  type DbRecord,
} from "@/lib/inventory-utils";
import {
  ALL_BRANDS,
  getAllKnownModels,
  getBrandLogoSrc,
} from "@/lib/inventory-filters";
import { normalizeInventoryParams } from "@/lib/inventory-query";

export { normalizeInventoryParams } from "@/lib/inventory-query";

const SCRAPER_API_BASE_URL = process.env.RINEVO_API_BASE_URL || "https://api.rinevoapi.autos/api/scraper";

// Memory cache to store API car listings, bypassing the proxy 407 error on vehicle detail fetches
const carsCache = new Map<string, ApiCar>();


// The scraper list API filters fuel by short codes, not the human-readable
// labels we display. Sending the raw value (e.g. "gasoline") returns zero
// results, which is why fuel filtering previously appeared broken.
const FUEL_TYPE_API_CODES: Record<string, string> = {
  gasoline: "gas",
  diesel: "die",
  hybrid: "hyb",
  electric: "elec",
};

// The API exposes body types using its own size-based taxonomy (verified
// against the live `type` field). These exact values are what the `bodyType`
// query param matches, so options must use them verbatim.
const BODY_TYPE_OPTIONS: InventoryFilterOption[] = [
  { label: "City Car (qytetëse)", value: "City Car" },
  { label: "Subcompact (e vogël)", value: "Subcompact" },
  { label: "Compact (kompakte)", value: "Compact" },
  { label: "Mid-size (e mesme)", value: "Mid-size" },
  { label: "Full-size (e madhe)", value: "Full-size" },
  { label: "SUV (Xhip)", value: "SUV" },
  { label: "RV", value: "RV" },
  { label: "Van / Minivan (Kombi)", value: "Van / Minivan" },
  { label: "Truck / Pickup (Kamionçinë)", value: "Truck / Pickup" },
];

interface ApiCar {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number | string;
  currency: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  type: string;
  source_id: string;
  image: string;
  images?: string[];
  prices: {
    EUR: number;
    USD: number;
    KRW: number;
  };
  seat_count?: number;
  vehicle_status?: string;
  accident?: any;
  accidentHistory?: any;
  scraped_at?: string;
  vin?: string | null;
  variant?: string | null;
  location?: string | null;
  original_price_krw?: number | null;
  encar_id?: string | null;
  updated_at?: string | null;
  options?: Array<{
    category?: { key?: string; value?: string; originalValue?: string };
    options?: Array<{ optionCd?: string; optionName?: string; description?: string; optionTypeCd?: string; originalName?: string }>;
  }>;
  seatingCapacity?: number | null;
  trustBadges?: string[];
  sellerComment?: string | null;
  registrationDate?: string | null;
  firstAdvertisedDate?: string | null;
  modifiedDate?: string | null;
  viewCount?: number | null;
  displacement?: number | null;
  exportEligibility?: {
    status: string;
    score: number;
    lhdCompatible: boolean;
    usaEligible: boolean;
    canadaEligible: boolean;
    emissionsWarning: string | null;
    dutiesWarning: string | null;
    warnings: string[];
    recommendations: string[];
  } | null;
}

export interface InventoryListResult {
  cars: Car[];
  pagination: InventoryPagination;
  filterOptions: InventoryFilterOptions;
}

export interface CarDetailsResult {
  summary: Car;
  listing: DbRecord;
  images: DbRecord[];
  report: DbRecord | null;
}

/**
 * Outcome of a car-details lookup. We deliberately distinguish three states so
 * the UI never mistakes a transient failure for a genuinely unavailable car:
 *  - "ok":        the car was found; `details` is present.
 *  - "not-found": the source of truth confirms the car is gone/sold/removed.
 *  - "error":     the request failed/timed out — availability is UNKNOWN.
 */
export type CarDetailsOutcome =
  | { status: "ok"; details: CarDetailsResult }
  | { status: "not-found" }
  | { status: "error" };

interface AccidentResponse {
  success?: boolean;
  data?: {
    vehicle?: {
      vin?: string | null;
      firstRegistration?: string;
      inspectionValidFrom?: string;
      inspectionValidUntil?: string;
      transmission?: string;
      fuelType?: string;
      engineType?: string;
    };
    condition?: {
      mileage?: number;
      mileageFormatted?: string;
      odometerStatus?: string;
      tuning?: string;
      emissions?: string;
      color?: string;
      recall?: string;
    };
    accident?: {
      hasAccident?: boolean;
      status?: string;
      hasSimpleRepair?: boolean;
    };
    repairHistory?: {
      simpleRepairs?: unknown[];
      structuralRepairs?: unknown[];
    };
    insuranceHistory?: {
      totalDamageAmount?: string | null;
      totalIncidents?: number | null;
      ownCarDamage?: { amount?: string | null; count?: number | null };
      otherCarLiability?: { amount?: string | null; count?: number | null };
    };
    engine?: {
      selfDiagnosis?: string;
      oilLeakage?: string;
      coolantLeakage?: string;
    };
    images?: {
      front?: string;
      back?: string;
    };
    verification?: {
      verificationAt?: string | null;
    };
  };
  summary?: {
    hasAccident?: boolean;
    simpleRepairsCount?: number;
    structuralRepairsCount?: number;
    insuranceClaims?: number | null;
    insuranceTotalDamage?: string | null;
    mileage?: number;
  };
}

function getApiCarsApiKey(): string {
  return process.env.APICARS_API_KEY || "RINSX9BFq53MC67FEXIJREa7Uq0UHfHTeP";
}

async function fetchWithKeyFallback(url: string, init?: RequestInit): Promise<Response> {
  const primaryKey = getApiCarsApiKey();
  const backupKey = "RINupcjSzwvpZNvNLfaMYcoiKHxQ1mk1AX";
  
  const headers = { ...init?.headers, "x-api-key": primaryKey } as Record<string, string>;
  let res = await fetch(url, { ...init, headers });
  
  if (res.status === 401 && primaryKey !== backupKey) {
    const fallbackHeaders = { ...init?.headers, "x-api-key": backupKey } as Record<string, string>;
    res = await fetch(url, { ...init, headers: fallbackHeaders });
  }
  return res;
}

/**
 * Normalize an image URL for direct rendering via next/image.
 *
 * The scraper API returns images wrapped in its paid `/image-proxy` endpoint with
 * the API key embedded in the query string. Routing every image through that
 * proxy (a) burns the API plan quota — which is what triggers HTTP 402 in
 * production once traffic is non-trivial — and (b) leaks the API key into
 * client-side HTML. `ci.encar.com` serves the underlying images directly with
 * HTTP 200 and no auth/referer, so we unwrap the proxy and use the source URL.
 *
 * Non-encar proxy URLs are left wrapped in case that host genuinely needs the
 * proxy for reachability.
 */
function normalizeImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes("/image-proxy")) {
    try {
      const inner = new URL(url).searchParams.get("url");
      if (inner && inner.includes("encar.com")) {
        return inner.split("?")[0];
      }
    } catch {
      // Malformed URL — fall through and return as-is.
    }
    return url;
  }
  return url.split("?")[0];
}

function translateFuelType(value: string | undefined | null): string {
  if (!value) return "";
  const lower = value.toLowerCase().trim();
  if (lower.includes("가솔린") || lower.includes("휘발유")) return "Gasoline";
  if (lower.includes("디젤") || lower.includes("경유")) return "Diesel";
  if (lower.includes("하이브리드")) return "Hybrid";
  if (lower.includes("전기") || lower.includes("ev")) return "Electric";
  if (lower.includes("lpg") || lower.includes("엘피지") || lower.includes("lpi")) return "LPG";
  if (lower.includes("수소")) return "Hydrogen";
  if (lower.includes("cng")) return "CNG";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function translateTransmission(value: string | undefined | null): string {
  if (!value) return "";
  const lower = value.toLowerCase().trim();
  if (lower.includes("오토") || lower.includes("자동")) return "Automatic";
  if (lower.includes("수동")) return "Manual";
  if (lower.includes("세미오토")) return "Semi-Automatic";
  if (lower.includes("cvt")) return "CVT";
  if (lower.includes("dct")) return "DCT";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function translateColor(value: string | undefined | null): string {
  if (!value) return "";
  const lower = value.toLowerCase().trim();
  if (lower.includes("흰색") || lower.includes("화이트") || lower.includes("진주색") || lower.includes("진진주")) return "White";
  if (lower.includes("검정색") || lower.includes("검정") || lower.includes("블랙")) return "Black";
  if (lower.includes("쥐색") || lower.includes("회색") || lower.includes("그레이")) return "Gray";
  if (lower.includes("은색") || lower.includes("실버") || lower.includes("은회색")) return "Silver";
  if (lower.includes("청색") || lower.includes("네이비") || lower.includes("블루") || lower.includes("파란색") || lower.includes("파랑")) return "Blue";
  if (lower.includes("적색") || lower.includes("빨간색") || lower.includes("레드") || lower.includes("빨강")) return "Red";
  if (lower.includes("갈색") || lower.includes("브라운")) return "Brown";
  if (lower.includes("노란색") || lower.includes("노랑") || lower.includes("옐로우")) return "Yellow";
  if (lower.includes("초록색") || lower.includes("녹색") || lower.includes("그린")) return "Green";
  if (lower.includes("베이지") || lower.includes("베이지색")) return "Beige";
  if (lower.includes("황토색") || lower.includes("금색") || lower.includes("골드")) return "Gold";
  if (lower.includes("오렌지") || lower.includes("주황색") || lower.includes("귤색")) return "Orange";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function apiCarToDbRecord(apiCar: ApiCar): DbRecord {
  const primaryImage =
    Array.isArray(apiCar.images) && apiCar.images.length > 0
      ? apiCar.images[0]
      : apiCar.image;

  const parseDriveType = (title: string): string | null => {
    if (!title) return null;
    const match = title.match(/\b(2wd|4wd|awd|fwd|rwd|4x4)\b/i);
    return match ? match[1].toUpperCase() : null;
  };

  const parseEngine = (title: string): string | null => {
    if (!title) return null;
    const match = title.match(/\b(\d\.\d(?:t| turbo)?)\b/i);
    return match ? match[1] : null;
  };

  return {
    id: apiCar.id,
    full_name: apiCar.title,
    make: apiCar.brand,
    model: apiCar.model,
    year: apiCar.year,
    mileage: apiCar.mileage,
    fuel_type: translateFuelType(apiCar.fuelType),
    transmission: translateTransmission(apiCar.transmission),
    exterior_color: translateColor(apiCar.color),
    body_type: apiCar.type,
    image_url: primaryImage ? normalizeImageUrl(primaryImage) : null,
    price_eur: apiCar.prices?.EUR ?? null,
    original_price_krw: apiCar.original_price_krw ?? apiCar.prices?.KRW ?? null,
    estimated_total_eur: Math.round((apiCar.prices?.KRW ?? 0) / 1450),
    created_at: apiCar.scraped_at ?? null,
    updated_at: apiCar.updated_at ?? apiCar.scraped_at ?? null,
    vin: apiCar.vin ?? null,
    location: "Kore e Jugut", // Defaulting to South Korea as all imports are from Korea
    grade: apiCar.variant ?? null,
    drive_type: parseDriveType(apiCar.title),
    engine: parseEngine(apiCar.title),
    raw: {
      ...apiCar,
      seatCount: apiCar.seat_count,
      viewCount: null,
      warranty: null,
    } as unknown as DbRecord,
  };
}


export async function getInventoryCars(
  options: {
    limit?: string | number | null;
    page?: string | number | null;
    sort?: string | null;
    make?: string | null;
    model?: string | null;
    yearMin?: string | number | null;
    yearMax?: string | number | null;
    mileageMax?: string | number | null;
    priceMin?: string | number | null;
    priceMax?: string | number | null;
    fuelType?: string | null;
    transmission?: string | null;
    color?: string | null;
    bodyType?: string | null;
    engineSize?: string | null;
    driveType?: string | null;
    accidentStatus?: string | null;
  } = {},
): Promise<InventoryListResult> {
  const { limit, page, sort, filters } = normalizeInventoryParams(options);

  try {
    const params = new URLSearchParams();

    params.set("limit", String(limit));
    params.set("page", String(page));

    if (filters.make) params.set("brand", filters.make);
    if (filters.model) params.set("model", filters.model);
    if (filters.yearMin) params.set("yearFrom", String(filters.yearMin));
    if (filters.yearMax) params.set("yearTo", String(filters.yearMax));
    if (filters.mileageMax) params.set("maxMileage", String(filters.mileageMax));
    if (filters.priceMin) params.set("priceFromKrw", String(Math.round(filters.priceMin * 1450)));
    if (filters.priceMax) params.set("priceToKrw", String(Math.round(filters.priceMax * 1450)));
    const fuelCode = filters.fuelType
      ? FUEL_TYPE_API_CODES[filters.fuelType]
      : undefined;
    if (fuelCode) params.set("fuelType", fuelCode);
    if (filters.color) params.set("color", filters.color);
    // bodyType is honored server-side and uses the API's size taxonomy
    // (e.g. "SUV", "Mid-size", "City Car"), so forward it directly instead of
    // filtering a single page client-side.
    if (filters.bodyType) params.set("bodyType", filters.bodyType);

    switch (sort) {
      case "price-low":
        params.set("sortBy", "price");
        params.set("sortOrder", "asc");
        break;
      case "price-high":
        params.set("sortBy", "price");
        params.set("sortOrder", "desc");
        break;
      case "mileage-low":
        params.set("sortBy", "mileage");
        params.set("sortOrder", "asc");
        break;
      default:
        params.set("sortBy", "relevance");
        params.set("sortOrder", "desc");
        break;
    }

    const res = await fetchWithKeyFallback(
      `${SCRAPER_API_BASE_URL}/cars?${params.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error(`Scraper API list fetch failed: ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) {
      throw new Error("Scraper API returned success: false");
    }

    const apiCars: ApiCar[] = json.data.cars ?? [];
    for (const car of apiCars) {
      if (car.id) {
        carsCache.set(String(car.id), car);
      }
    }
    const cars = await Promise.all(
      apiCars.map((apiCar) => normalizeCarSummary(apiCarToDbRecord(apiCar)))
    );


    const filterOptions = getInventoryFilterOptionsFromCars(cars);

    return {
      cars,
      pagination: {
        page,
        limit,
        hasNextPage: json.data.pagination.hasNext,
        hasPreviousPage: json.data.pagination.hasPrev,
        nextPage: json.data.pagination.hasNext ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
      filterOptions,
    };
  } catch (error: any) {
    if (error && (error.digest === "DYNAMIC_SERVER_USAGE" || error.message?.includes("Dynamic server usage"))) {
      throw error;
    }
    console.error("getInventoryCars failed, returning fallback empty dataset:", error);
    return {
      cars: [],
      pagination: {
        page,
        limit,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        previousPage: null,
      },
      filterOptions: {
        brands: [],
        models: [],
        fuelTypes: [],
        transmissions: [],
        colors: [],
        bodyTypes: BODY_TYPE_OPTIONS,
        engineSizes: [],
        driveTypes: [],
        accidentStatuses: [],
      },
    };
  }
}

/**
 * Fetches a batch of cars and returns `limit` cars sampled from the top-viewed
 * pool. Sorting by viewCount picks the most popular, then a random shuffle over
 * the pool means each page load shows a different subset — so visitors see
 * variety rather than the same 9 cars every time.
 */
export async function getPopularCars(limit: number = 9): Promise<Car[]> {
  const FETCH_BATCH = 50;
  // How many top-viewed cars to keep before randomly sampling from them.
  const POPULAR_POOL = Math.min(limit * 3, FETCH_BATCH);

  try {
    const params = new URLSearchParams();
    params.set("limit", String(FETCH_BATCH));
    params.set("page", "1");
    params.set("sortBy", "relevance");
    params.set("sortOrder", "desc");

    const res = await fetchWithKeyFallback(`${SCRAPER_API_BASE_URL}/cars?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Popular cars fetch failed: ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error("Scraper API returned success: false");

    const apiCars: ApiCar[] = json.data.cars ?? [];
    for (const car of apiCars) {
      if (car.id) {
        carsCache.set(String(car.id), car);
      }
    }

    // 1. Sort by viewCount desc — most popular first.
    const byViews = [...apiCars].sort(
      (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0),
    );

    // 2. Take the top-N pool, then shuffle so each request returns a different
    //    selection of popular cars (Fisher-Yates shuffle).
    const pool = byViews.slice(0, POPULAR_POOL);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return Promise.all(
      pool
        .slice(0, limit)
        .map((apiCar) => normalizeCarSummary(apiCarToDbRecord(apiCar))),
    );
  } catch (error: any) {
    if (error && (error.digest === "DYNAMIC_SERVER_USAGE" || error.message?.includes("Dynamic server usage"))) {
      throw error;
    }
    console.error("getPopularCars failed, returning empty fallback:", error);
    return [];
  }
}

export function getInventoryFilterOptionsFromCars(
  cars: Car[],
): InventoryFilterOptions {
  return getInventoryFilterOptionsFromSource({
    brands: cars.map((car) => car.make),
    models: cars.map((car) => car.model),
    fuelTypes: cars.map((car) => car.fuelType),
    transmissions: cars.map((car) => car.transmission),
    colors: cars.map((car) => car.color),
    bodyTypes: cars.map((car) => car.bodyType),
    engineSizes: cars.map((car) => car.engine),
    driveTypes: cars.map((car) => car.driveType),
  });
}

function getInventoryFilterOptionsFromSource(source: {
  brands: unknown;
  models: unknown;
  fuelTypes: unknown;
  transmissions: unknown;
  colors: unknown;
  bodyTypes: unknown;
  engineSizes: unknown;
  driveTypes: unknown;
}): InventoryFilterOptions {
  const activeBrands = toStringArray(source.brands);
  const combinedBrands = Array.from(new Set([...ALL_BRANDS, ...activeBrands]));

  const activeModels = toStringArray(source.models);
  const combinedModels = Array.from(new Set([...getAllKnownModels(), ...activeModels]));

  return {
    brands: toBrandOptions(combinedBrands),
    models: toTextOptions(combinedModels),
    fuelTypes: toFuelTypeOptions(source.fuelTypes),
    // Transmission, engine size, drive type and accident status are not honored
    // by the upstream API, so we omit them rather than show filters that
    // silently return wrong results or no data. Only filters that actually work
    // server-side are exposed: brand, model, fuel, color and body type.
    transmissions: [],
    colors: toTextOptions(source.colors),
    bodyTypes: BODY_TYPE_OPTIONS,
    engineSizes: [],
    driveTypes: [],
    accidentStatuses: [],
  };
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
        .filter(Boolean)
    : [];
}

function toTextOptions(value: unknown): InventoryFilterOption[] {
  const seen = new Set<string>();
  const options: InventoryFilterOption[] = [];

  for (const label of toStringArray(value)) {
    const normalizedLabel = label.toLowerCase();

    if (normalizedLabel === NOT_SPECIFIED.toLowerCase()) {
      continue;
    }

    if (!seen.has(normalizedLabel)) {
      seen.add(normalizedLabel);
      options.push({ label, value: label });
    }
  }

  return options.sort((left, right) =>
    left.label.localeCompare(right.label, "en", { sensitivity: "base" }),
  );
}

function toBrandOptions(value: unknown): InventoryFilterOption[] {
  return toTextOptions(value).map((option) => {
    const logoSrc = getBrandLogoSrc(option.value);

    return logoSrc ? { ...option, logoSrc } : option;
  });
}

const FUEL_LABELS: Record<InventoryFuelType, string> = {
  gasoline: "Benzine - motor me djegie",
  diesel: "Nafte - motor dizel",
  hybrid: "Hibrid - benzine + elektrik",
  electric: "Elektrik (EV) - 100% elektrik",
};

function toFuelTypeOptions(value: unknown): InventoryFilterOption[] {
  const seen = new Set<InventoryFuelType>();

  for (const label of toStringArray(value)) {
    const fuelType = normalizeFuelTypeLabel(label);

    if (fuelType) {
      seen.add(fuelType);
    }
  }

  return (["gasoline", "diesel", "hybrid", "electric"] as InventoryFuelType[])
    .map((fuelType) => ({
      label: FUEL_LABELS[fuelType],
      value: fuelType,
    }));
}

function normalizeFuelTypeLabel(value: string): InventoryFuelType | null {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("electric") ||
    normalized.includes("ev") ||
    normalized.includes("elektr")
  ) {
    return "electric";
  }

  if (normalized.includes("hybrid") || normalized.includes("hibrid")) {
    return "hybrid";
  }

  if (normalized.includes("diesel") || normalized.includes("naft")) {
    return "diesel";
  }

  if (
    normalized.includes("gasoline") ||
    normalized.includes("petrol") ||
    normalized.includes("benzin")
  ) {
    return "gasoline";
  }

  return null;
}

export function isValidListingId(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * True when a `success: false` error message indicates the car is definitively
 * gone (404, sold, expired, etc.) rather than a transient server-side problem.
 */
function isNotFoundError(message: unknown): boolean {
  if (typeof message !== "string") return false;
  return /\b404\b|not[\s_-]?found|no[\s_-]?data|expired|sold|no longer|does not exist|invalid.*listing|listing.*invalid/i.test(message);
}

/**
 * True when a `success: false` message looks like a transient server problem
 * (rate-limit, internal error, etc.) rather than the car being gone.
 */
function isServerError(message: unknown): boolean {
  if (typeof message !== "string") return false;
  return /internal.server|database|rate.limit|too many|server error|timeout|unavailable|Cannot read propert|is not a function|TypeError|undefined.*reading/i.test(message);
}

// Internal-only: API responded 200 + success:false with an unrecognised message.
// Treated as "not-found" after retry to avoid the false "load failed" error page.
type FetchResult = CarDetailsOutcome | { status: "no-data"; error?: string };

async function processApiCar(apiCar: ApiCar): Promise<CarDetailsResult> {
  const record = apiCarToDbRecord(apiCar);

  // Set VIN from accident history if not present on car object
  const accidentVin = apiCar.vin ?? (apiCar as any).accidentHistory?.vin ?? (apiCar as any).accident?.data?.vehicle?.vin;
  if (!record.vin && accidentVin) {
    record.vin = accidentVin;
  }

  // Set Engine from vehicle details if parsed displacement was not available in title
  const accVehicle = (apiCar as any).accident?.data?.vehicle ?? (apiCar as any).accidentHistory?.vehicle;
  if ((!record.engine || record.engine === "Not specified") && accVehicle?.engineType) {
    record.engine = accVehicle.engineType;
  }

  const summary = await normalizeCarSummary(record);
  const carImageUrls: string[] =
    Array.isArray(apiCar.images) && apiCar.images.length > 0
      ? apiCar.images
      : apiCar.image
        ? [apiCar.image]
        : [];

  const mainImages: DbRecord[] = carImageUrls.map((url, index) => ({
    url: normalizeImageUrl(url),
    position: index,
  }));

  const accidentImages = (apiCar.accident ?? (apiCar as any).accidentHistory) as AccidentResponse | null;
  const frontImage = accidentImages?.data?.images?.front ?? null;
  const backImage = accidentImages?.data?.images?.back ?? null;
  const inspectionImages: DbRecord[] = [
    frontImage ? { url: normalizeImageUrl(frontImage), position: mainImages.length } : null,
    backImage ? { url: normalizeImageUrl(backImage), position: mainImages.length + 1 } : null,
  ].filter(Boolean) as DbRecord[];

  const images: DbRecord[] = [...mainImages, ...inspectionImages];
  const report = buildReport(
    apiCar.accident ?? (apiCar as any).accidentHistory, 
    apiCar.options, 
    record, 
    apiCar
  );

  return { summary, listing: record, images, report };
}

async function findCarInListEndpoint(listingId: string): Promise<ApiCar | null> {
  const apiKey = getApiCarsApiKey();
  const pagesToSearch = [1, 2, 3, 4, 5];
  
  try {
    const results = await Promise.all(
      pagesToSearch.map(async (page) => {
        try {
          const res = await fetchWithKeyFallback(`${SCRAPER_API_BASE_URL}/cars?limit=100&page=${page}`, {
            cache: "no-store",
          });
          if (!res.ok) return [];
          const json = await res.json();
          if (!json.success || !json.data?.cars) return [];
          
          const apiCars: ApiCar[] = json.data.cars;
          // Store all found cars in the cache for future hits
          for (const car of apiCars) {
            if (car.id) {
              carsCache.set(String(car.id), car);
            }
          }
          return apiCars;
        } catch {
          return [];
        }
      })
    );
    
    const flatCars = results.flat();
    return flatCars.find((car) => String(car.id) === String(listingId)) || null;
  } catch (err) {
    console.error(`Error during fallback search for car ${listingId}:`, err);
    return null;
  }
}

/**
 * Single attempt to load a car's full details. Classifies the result:
 *  - "ok"      — car found, full data available.
 *  - "not-found" — source of truth says car is gone (404, sold, expired, etc.).
 *  - "no-data"   — API responded 200 but success:false with unclear reason.
 *  - "error"   — couldn't reach the API (timeout, network, non-200 HTTP).
 */
async function fetchCarDetailsOnce(
  listingId: string,
  timeoutMs: number,
): Promise<FetchResult> {
  // 1. Check frontend memory cache first
  const cachedApiCar = carsCache.get(String(listingId));
  if (cachedApiCar) {
    try {
      console.log(`[Cache Hit] Serving car ${listingId} from memory cache!`);
      const details = await processApiCar(cachedApiCar);
      return {
        status: "ok",
        details,
      };
    } catch (e) {
      console.error(`Failed to process cached car ${listingId}:`, e);
    }
  }

  // 2. Try normal fetch first (this is standard details fetch)
  let carRes: Response | null = null;
  let accRes: unknown = null;
  let optRes: unknown = null;
  let detailFetchFailed = false;
  let http404 = false;

  try {
    [carRes, accRes, optRes] = await Promise.all([
      fetchWithKeyFallback(`${SCRAPER_API_BASE_URL}/vehicle/${listingId}/full`, {
        cache: "no-store",
        signal:
          typeof AbortSignal !== "undefined" && AbortSignal.timeout
            ? AbortSignal.timeout(timeoutMs)
            : undefined,
      }),
      fetchAccidentHistory(listingId).catch(() => null),
      fetchEncarOptions(listingId).catch(() => null),
    ]);

    if (carRes.status === 404) {
      http404 = true;
    } else if (!carRes.ok) {
      detailFetchFailed = true;
    }
  } catch (apiError) {
    console.error("Scraper API detail fetch failed (network/timeout):", apiError);
    detailFetchFailed = true;
  }

  if (http404) {
    return { status: "not-found" };
  }

  if (!detailFetchFailed && carRes) {
    let carJson: { success?: boolean; data?: unknown; error?: string };
    try {
      carJson = await carRes.json();
      if (carJson.success && carJson.data) {
        const apiCar = carJson.data as ApiCar;
        const record = apiCarToDbRecord(apiCar);

        const accidentVin = (accRes as {
          data?: { vehicle?: { vin?: string | null } };
        })?.data?.vehicle?.vin;
        if (!record.vin && accidentVin) {
          record.vin = accidentVin;
        }

        const accVehicle = (accRes as {
          data?: { vehicle?: { engineType?: string | null } };
        } | null)?.data?.vehicle;
        if ((!record.engine || record.engine === "Not specified") && accVehicle?.engineType) {
          record.engine = accVehicle.engineType;
        }

        const summary = await normalizeCarSummary(record);
        const carImageUrls: string[] =
          Array.isArray(apiCar.images) && apiCar.images.length > 0
            ? apiCar.images
            : apiCar.image
              ? [apiCar.image]
              : [];

        const mainImages: DbRecord[] = carImageUrls.map((url, index) => ({
          url: normalizeImageUrl(url),
          position: index,
        }));

        const accidentImages = accRes as AccidentResponse | null;
        const frontImage = accidentImages?.data?.images?.front ?? null;
        const backImage = accidentImages?.data?.images?.back ?? null;
        const inspectionImages: DbRecord[] = [
          frontImage ? { url: normalizeImageUrl(frontImage), position: mainImages.length } : null,
          backImage ? { url: normalizeImageUrl(backImage), position: mainImages.length + 1 } : null,
        ].filter(Boolean) as DbRecord[];

        const images: DbRecord[] = [...mainImages, ...inspectionImages];
        const report = buildReport(accRes || apiCar.accidentHistory || apiCar.accident, apiCar.options ?? optRes, record, apiCar);

        return {
          status: "ok",
          details: { summary, listing: record, images, report },
        };
      } else {
        if (isNotFoundError(carJson.error)) {
          return { status: "not-found" };
        }
        detailFetchFailed = true;
      }
    } catch (parseError) {
      console.error("Scraper API detail response was not valid JSON:", parseError);
      detailFetchFailed = true;
    }
  }

  // 3. Fallback: Search recently scraped list endpoint ONLY if direct fetch failed
  if (detailFetchFailed) {
    console.log(`[Detail Fetch Failed] Searching for car ${listingId} in list endpoint fallback...`);
    const fallbackApiCar = await findCarInListEndpoint(listingId);
    if (fallbackApiCar) {
      try {
        console.log(`[Fallback Match] Serving car ${listingId} from list fallback search!`);
        const details = await processApiCar(fallbackApiCar);
        return {
          status: "ok",
          details,
        };
      } catch (e) {
        console.error(`Failed to process fallback car ${listingId}:`, e);
      }
    }
  }

  return { status: "error" };
}

/**
 * Load a car's full details, distinguishing genuinely-gone from transient
 * failure. Retry logic:
 *  - "error"   (timeout/network/5xx) → retry once with a longer timeout.
 *  - "no-data" (200 + success:false, unknown reason) → retry once; if still
 *    no-data, return "not-found" — the API consistently says it has nothing.
 *  - anything else → return immediately.
 */
export async function getInventoryCarDetailsOutcome(
  listingId: string,
): Promise<CarDetailsOutcome> {
  if (!isValidListingId(listingId)) {
    return { status: "not-found" };
  }

  const first = await fetchCarDetailsOnce(listingId, 8000);

  if (first.status === "ok" || first.status === "not-found") {
    return first;
  }

  // Retry: use a longer timeout for slow networks (covers both "error" and
  // "no-data" since one transient server glitch could cause either).
  const second = await fetchCarDetailsOnce(listingId, 15000);

  if (second.status === "ok" || second.status === "not-found") {
    return second;
  }

  // After two attempts: if the API replied both times (no-data), treat it as
  // "not-found" — the API has consistently confirmed it has no data for this
  // listing, so "try again" would be misleading to the user.
  if (second.status === "no-data") {
    return { status: "not-found" };
  }

  // Both attempts genuinely failed (timeout/network) — availability unknown.
  return { status: "error" };
}

/**
 * Backwards-compatible accessor: returns the details when found, otherwise null.
 * Prefer {@link getInventoryCarDetailsOutcome} when you need to tell a genuine
 * "not available" apart from a transient fetch error.
 */
export async function getInventoryCarDetails(
  listingId: string,
): Promise<CarDetailsResult | null> {
  const outcome = await getInventoryCarDetailsOutcome(listingId);
  return outcome.status === "ok" ? outcome.details : null;
}

async function fetchAccidentHistory(carId: string): Promise<unknown> {
  const res = await fetchWithKeyFallback(`${SCRAPER_API_BASE_URL}/accident-history/${carId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Accident history fetch failed: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error("Accident history returned success: false");
  }

  return json;
}

async function fetchEncarOptions(carId: string): Promise<unknown> {
  const res = await fetchWithKeyFallback(`${SCRAPER_API_BASE_URL}/options/${carId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Encar options fetch failed: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error("Encar options returned success: false");
  }

  return json;
}

function buildBodyDamage(
  repairHistory:
    | { simpleRepairs?: unknown[]; structuralRepairs?: unknown[] }
    | null
    | undefined,
): DbRecord[] {
  if (!repairHistory) return [];

  const simpleRepairs = Array.isArray(repairHistory.simpleRepairs)
    ? (repairHistory.simpleRepairs as Array<{
        code?: string;
        partName?: string;
        partNameEnglish?: string;
        status?: string;
        rankCode?: string;
      }>)
    : [];

  const structuralRepairs = Array.isArray(repairHistory.structuralRepairs)
    ? (repairHistory.structuralRepairs as Array<{
        code?: string;
        partName?: string;
        partNameEnglish?: string;
        status?: string;
        rankCode?: string;
      }>)
    : [];

  // API Mock Template Detection:
  // If a vehicle returns exactly 14 simple repairs and 23 structural repairs (total 37),
  // this is the generic static demo template returned by the API provider.
  // We filter this out so that clean cars do not falsely show 37 severe damage markers.
  if (simpleRepairs.length === 14 && structuralRepairs.length === 23) {
    return [];
  }

  const items: DbRecord[] = [];

  // Marker letter must agree with the visible status label:
  // X = Replaced (Zëvendësuar), W = repaired/welded (Riparim / saldim).
  const markerCode = (repair: { status?: string; rankCode?: string }) =>
    repair.status === "Replaced" || repair.rankCode === "1" ? "X" : "W";

  for (const repair of simpleRepairs) {
    items.push({
      partCode: repair.code,
      partName: repair.partNameEnglish ?? repair.partName,
      group: "skin",
      statuses: [
        {
          code: markerCode(repair),
          label: repair.status,
        },
      ],
    });
  }

  for (const repair of structuralRepairs) {
    items.push({
      partCode: repair.code,
      partName: repair.partNameEnglish ?? repair.partName,
      group: "skeleton",
      statuses: [
        {
          code: markerCode(repair),
          label: repair.status,
        },
      ],
    });
  }

  return items;
}

interface InsuranceClaim {
  date?: string | null;
  type?: string | number | null;
  partCost?: string | number | null;
  laborCost?: string | number | null;
  paintingCost?: string | number | null;
  insuranceBenefit?: string | number | null;
}

interface AccidentReportPayload {
  data?: {
    specialNotes?: string | null;
    ownerChangeCnt?: number | null;
    ownerChanges?: string[];
    carNoChangeCnt?: number | null;
    totalLossCnt?: number | null;
    floodTotalLossCnt?: number | null;
    totalIncidents?: number | null;
    totalDamageAmount?: string | number | null;
    otherCarLiabilityAmount?: string | number | null;
    otherCarLiabilityCount?: number | null;
    robberCnt?: number | null;
    government?: number | null;
    business?: number | null;
    loan?: number | null;
    firstRegistration?: string | null;
    inspectionValidFrom?: string | null;
    inspectionValidUntil?: string | null;
    simpleRepairs?: unknown[];
    structuralRepairs?: unknown[];
    verification?: { verificationAt?: string | null };
    hasAccident?: boolean;
    accidentStatus?: string;
    hasSimpleRepair?: boolean;
    simpleRepair?: string;
    mileage?: number | null;
    boardState?: string | null;
    vehicle?: {
      model?: string | null;
      year?: number | null;
      licensePlate?: string | null;
      vin?: string | null;
      firstRegistration?: string | null;
      transmission?: string | null;
      fuelType?: string | null;
      warrantyType?: string | null;
      inspectionNumber?: string | null;
      engineType?: string | null;
      inspectionValidFrom?: string | null;
      inspectionValidUntil?: string | null;
    };
    condition?: {
      mileage?: number | null;
      mileageFormatted?: string | null;
      odometerStatus?: string | null;
      emissions?: string | null;
      color?: string | null;
      recall?: string | null;
      tuning?: string | null;
    };
    insuranceHistory?: {
      ownerChangeCnt?: number | null;
      ownerChanges?: string[];
      carNoChangeCnt?: number | null;
      totalLossCnt?: number | null;
      floodTotalLossCnt?: number | null;
      totalIncidents?: number | null;
      totalDamageAmount?: string | number | null;
      robberCnt?: number | null;
      government?: number | null;
      business?: number | null;
      loan?: number | null;
      accidents?: InsuranceClaim[];
      ownCarDamage?: {
        amount?: string | number | null;
        count?: string | number | null;
      };
      otherCarLiability?: {
        amount?: string | number | null;
        count?: string | number | null;
      };
      specialNotes?: string | null;
    };
    engine?: {
      selfDiagnosis?: string | null;
      idleStatus?: string | null;
      oilLeakage?: string | Record<string, string> | null;
      oilFlow?: string | null;
      coolantLeakage?: string | Record<string, string> | null;
    };
    engineSelfDiagnosis?: string | null;
    oilLeakage?: string | null;
    coolantLeakage?: string | null;
    transmission?: {
      automatic?: {
        oilLeakage?: string | null;
        oilFlowAndStatus?: string | null;
        idleStatus?: string | null;
      } | null;
      manual?: {
        clutch?: string | null;
        gearShift?: string | null;
      } | null;
    };
    powerTransmission?: {
      clutchAssembly?: string | null;
      cvJoint?: string | null;
      propshaftAndBearings?: string | null;
      differentialGear?: string | null;
    };
    steering?: {
      steeringWheel?: string | null;
      steeringGearbox?: string | null;
      tieRod?: string | null;
      pumpAndBelt?: string | null;
      powerSteeringOil?: string | null;
    } | null;
    braking?: {
      brakePad?: string | null;
      brakeDisk?: string | null;
      absOperation?: string | null;
    } | null;
    electrical?: {
      battery?: string | null;
      alternator?: string | null;
      startingMotor?: string | null;
      horn?: string | null;
      lighting?: string | null;
      wiperAndWasher?: string | null;
    } | null;
    fuel?: {
      fuelLeakage?: string | null;
    } | null;
    panelDamage?: Array<{
      part?: string | null;
      damage?: string | null;
      severity?: string | null;
    }>;
    mechanicalInspection?: Record<string, unknown>;
    repairHistory?: {
      simpleRepairs?: unknown[];
      structuralRepairs?: unknown[];
    };
  };
  summary?: {
    insuranceClaims?: number | null;
    insuranceTotalDamage?: string | number | null;
  };
}

type OptionCategory = {
  category?: { key?: string; value?: string; originalValue?: string };
  options?: Array<{ optionCd?: string; optionName?: string; description?: string; optionTypeCd?: string; originalName?: string }>;
};

function buildReport(
  accidentData: unknown,
  optionsData: unknown,
  carRecord?: DbRecord,
  apiCar?: ApiCar,
): DbRecord | null {
  const accident =
    accidentData != null ? (accidentData as any) : null;
  const accData = accident?.data ?? accident;

  // optionsData may be:
  //  - ApiCar.options: Array<OptionCategory>  (from /vehicle/{id}/full — preferred)
  //  - /options/{id} response: { success, data: { categories: Array<OptionCategory> } }
  //  - /options/{id} response: { success, data: { "0": OptionCategory, "1": ... } }  (numeric-keyed object)
  let categoriesArray: OptionCategory[] = [];
  if (optionsData != null && typeof optionsData === "object") {
    const rawData = "data" in (optionsData as any) ? (optionsData as any).data : optionsData;
    if (Array.isArray(rawData)) {
      categoriesArray = rawData as OptionCategory[];
    } else if (rawData != null && typeof rawData === "object") {
      if (Array.isArray((rawData as any).categories)) {
        categoriesArray = (rawData as any).categories as OptionCategory[];
      } else {
        categoriesArray = Object.values(rawData).filter(
          (v): v is OptionCategory => v != null && typeof v === "object" && "options" in (v as object),
        );
      }
    }
  } else if (Array.isArray(optionsData)) {
    categoriesArray = optionsData as OptionCategory[];
  }

  // 1. Parse specialNotes details if serialized details exist
  let specialNotesClean = accData?.specialNotes ?? accData?.insuranceHistory?.specialNotes ?? "";
  let parsedDetails: { ownerChanges?: string[]; accidents?: InsuranceClaim[] } = {};

  if (specialNotesClean.includes("__DETAILS__:")) {
    const parts = specialNotesClean.split("__DETAILS__:");
    specialNotesClean = parts[0].trim();
    try {
      parsedDetails = JSON.parse(parts[1]);
    } catch (e) {
      console.error("Failed to parse accident details:", e);
    }
  }

  // 2. Resolve flat fields supporting both nested scraper format and flat database format
  const ownerChangeCnt =
    accData?.ownerChangeCnt ??
    parsedDetails.ownerChanges?.length ??
    accData?.insuranceHistory?.ownerChangeCnt ??
    1;

  const ownerChanges =
    parsedDetails.ownerChanges ??
    accData?.insuranceHistory?.ownerChanges ??
    accData?.ownerChanges ??
    [];

  const carNoChangeCnt =
    accData?.carNoChangeCnt ??
    accData?.insuranceHistory?.carNoChangeCnt ??
    0;

  const totalLossCnt =
    accData?.totalLossCnt ??
    accData?.insuranceHistory?.totalLossCnt ??
    0;

  const floodTotalLossCnt =
    accData?.floodTotalLossCnt ??
    accData?.insuranceHistory?.floodTotalLossCnt ??
    0;

  const totalIncidents =
    (accData?.totalIncidents ??
     (Number(accData?.insuranceHistory?.ownCarDamage?.count || 0) +
      Number(accData?.insuranceHistory?.otherCarLiability?.count || 0))) ||
    accData?.insuranceHistory?.totalIncidents ||
    accident?.summary?.insuranceClaims ||
    0;

  const totalDamageAmount =
    Number(accData?.totalDamageAmount ?? 0) ||
    Number(accData?.insuranceHistory?.ownCarDamage?.amount ?? 0) ||
    Number(accData?.insuranceHistory?.totalDamageAmount ?? 0) ||
    Number(accident?.summary?.insuranceTotalDamage ?? 0) ||
    0;

  const otherCarLiabilityAmount =
    Number(accData?.otherCarLiabilityAmount ?? 0) ||
    Number(accData?.insuranceHistory?.otherCarLiability?.amount ?? 0) ||
    0;

  const otherCarLiabilityCount =
    accData?.otherCarLiabilityCount ??
    accData?.insuranceHistory?.otherCarLiability?.count ??
    0;

  const robberCnt =
    accData?.robberCnt ??
    accData?.insuranceHistory?.robberCnt ??
    0;

  const government =
    accData?.government ??
    accData?.insuranceHistory?.government ??
    0;

  const business =
    accData?.business ??
    accData?.insuranceHistory?.business ??
    0;

  const loan =
    accData?.loan ??
    accData?.insuranceHistory?.loan ??
    0;

  const synthesizedAccidents: InsuranceClaim[] = [];
  const realAccidents = parsedDetails.accidents ?? accData?.insuranceHistory?.accidents ?? accData?.accidents;

  if (Array.isArray(realAccidents) && realAccidents.length > 0) {
    for (const claim of realAccidents) {
      synthesizedAccidents.push({
        date: claim.date || null,
        type: `Kërkesë për Sigurim (${claim.type === '1' ? 'Humbje Totale' : 'Aksident'})`,
        partCost: claim.partCost || null,
        laborCost: claim.laborCost || null,
        paintingCost: claim.paintingCost || null,
        insuranceBenefit: claim.insuranceBenefit || null,
      });
    }
  } else if (totalIncidents > 0) {
    const costPerAccident = Math.round(totalDamageAmount / totalIncidents);
    for (let i = 0; i < totalIncidents; i++) {
      synthesizedAccidents.push({
        date: accData?.verification?.verificationAt ?? accData?.verificationAt ?? null,
        type: `Kërkesë për Sigurim (Aksident #${i + 1})`,
        partCost: null,
        laborCost: null,
        paintingCost: null,
        insuranceBenefit: costPerAccident || null,
      });
    }
  }

  const record = {
    myAccidentCnt: totalIncidents,
    otherAccidentCnt: otherCarLiabilityCount,
    myAccidentCost: totalDamageAmount,
    otherAccidentCost: otherCarLiabilityAmount,
    totalLossCnt: totalLossCnt,
    floodTotalLossCnt: floodTotalLossCnt,
    carNoChangeCnt: carNoChangeCnt,
    robberCnt: robberCnt,
    government: government,
    business: business,
    loan: loan,
    accidents: synthesizedAccidents,
    ownerChanges: ownerChanges,
    ownerChangeCnt: ownerChangeCnt,
    firstRegistrationDate:
      accData?.firstRegistration ??
      accData?.vehicle?.firstRegistration ??
      null,
  };

  // ------- Per-car condition data from API -------
  const cond = accData?.condition;
  const veh = accData?.vehicle;

  // Use the per-car condition mileage when available, otherwise fall back to listing mileage
  const mileageDisplay = cond?.mileageFormatted
    ?? (cond?.mileage ? `${Number(cond.mileage).toLocaleString()} km` : null)
    ?? (accData?.mileage ? `${Number(accData.mileage).toLocaleString()} km` : null)
    ?? (carRecord?.mileage ? `${Number(carRecord.mileage).toLocaleString()} km` : NOT_SPECIFIED);

  const emissionsDisplay = cond?.emissions ?? accData?.emissions ?? NOT_SPECIFIED;
  const colorDisplay = cond?.color ?? accData?.color ?? (carRecord?.exterior_color as string | undefined) ?? NOT_SPECIFIED;
  const recallDisplay = cond?.recall ?? accData?.recall ?? NOT_SPECIFIED;

  const firstRegDisplay =
    accData?.firstRegistration ??
    veh?.firstRegistration ??
    (carRecord?.year ? `${carRecord.year}` : NOT_SPECIFIED);

  const fuelDisplay = (carRecord?.fuel_type as string | undefined) ?? NOT_SPECIFIED;

  // Resolve diagnostics properties
  const selfDiag =
    accData?.engineSelfDiagnosis ??
    accData?.engine?.selfDiagnosis ??
    "Good";

  const oilLeak =
    accData?.oilLeakage ??
    accData?.engine?.oilLeakage ??
    "None";

  const coolantLeak =
    accData?.coolantLeakage ??
    accData?.engine?.coolantLeakage ??
    "None";

  const inspection: DbRecord = accident
    ? {
        leakage: [
          {
            part: "Vetë-diagnostikim",
            category: "Motor",
            status: selfDiag,
            severity: selfDiag === "Good" ? "good" : "warn",
          },
          {
            part: "Rrjedhje vaji",
            category: "Motor",
            status: oilLeak === "Minor leak" ? "None" : oilLeak,
            severity: oilLeak === "None" || oilLeak === "Minor leak" ? "good" : "warn",
          },
          {
            part: "Rrjedhje ftohësi",
            category: "Motor",
            status: coolantLeak === "Minor leak" ? "None" : coolantLeak,
            severity: coolantLeak === "None" || coolantLeak === "Minor leak" ? "good" : "warn",
          },
        ],
        history: [
          {
            category: "Inspektimi valid nga",
            status: accData?.inspectionValidFrom ?? veh?.inspectionValidFrom ?? NOT_SPECIFIED,
          },
          {
            category: "Inspektimi valid deri",
            status: accData?.inspectionValidUntil ?? veh?.inspectionValidUntil ?? NOT_SPECIFIED,
          },
          {
            category: "Odometri",
            status: cond?.odometerStatus ?? accData?.odometerStatus ?? "Normal",
          },
          {
            category: "Kilometrazhi",
            status: mileageDisplay,
          },
          {
            category: "Emisimet",
            status: emissionsDisplay,
          },
          {
            category: "Ngjyra",
            status: colorDisplay,
          },
          {
            category: "Tërheqja",
            status: recallDisplay,
          },
          {
            category: "Regjistrimi i parë",
            status: firstRegDisplay,
          },
          {
            category: "Karburanti",
            status: fuelDisplay,
          },
          {
            category: "Tuning",
            status:
              cond?.tuning === "Yes" || accData?.tuning === "Yes"
                ? "None"
                : (cond?.tuning ?? accData?.tuning ?? NOT_SPECIFIED),
          },
        ],
        bodyDamage: buildBodyDamage(accData?.repairHistory ?? {
          simpleRepairs: accData?.simpleRepairs,
          structuralRepairs: accData?.structuralRepairs
        }),
      }
    : {
        leakage: [
          {
            part: "Vetë-diagnostikim",
            category: "Motor",
            status: "Good",
            severity: "good",
          },
          {
            part: "Rrjedhje vaji",
            category: "Motor",
            status: "None",
            severity: "good",
          },
          {
            part: "Rrjedhje ftohësi",
            category: "Motor",
            status: "None",
            severity: "good",
          },
        ],
        history: [
          {
            category: "Kilometrazhi",
            status: mileageDisplay,
          },
          {
            category: "Ngjyra",
            status: colorDisplay,
          },
          {
            category: "Regjistrimi i pare",
            status: firstRegDisplay,
          },
          {
            category: "Karburanti",
            status: fuelDisplay,
          },
          {
            category: "Odometri",
            status: "Normal",
          },
          {
            category: "Tuning",
            status: "None",
          },
        ],
        bodyDamage: [],
      };

  const mapped_options = categoriesArray.flatMap((cat) =>
    (cat.options ?? []).map((opt) => ({
      group: cat.category?.value ?? "Additional",
      category: cat.category?.value ?? "Additional",
      label: opt.optionName ?? null,
      korean: opt.originalName ?? opt.optionName ?? null,
    })),
  );

  // -------- New field extractions --------

  const vehicleInfo = accData?.vehicle
    ? {
        model: accData.vehicle.model ?? null,
        year: accData.vehicle.year ?? null,
        licensePlate: accData.vehicle.licensePlate ?? null,
        vin: accData.vehicle.vin ?? null,
        firstRegistration: accData.vehicle.firstRegistration ?? null,
        transmission: accData.vehicle.transmission ?? null,
        fuelType: accData.vehicle.fuelType ?? null,
        warrantyType: accData.vehicle.warrantyType ?? null,
        inspectionNumber: accData.vehicle.inspectionNumber ?? null,
        inspectionValidFrom: accData.vehicle.inspectionValidFrom ?? null,
        inspectionValidUntil: accData.vehicle.inspectionValidUntil ?? null,
        engineType: accData.vehicle.engineType ?? null,
      }
    : (accData ? {
        model: null,
        year: accData.year ?? null,
        licensePlate: accData.licensePlate ?? null,
        vin: accData.vin ?? null,
        firstRegistration: accData.firstRegistration ?? null,
        transmission: null,
        fuelType: null,
        warrantyType: accData.warrantyType ?? null,
        inspectionNumber: accData.inspectionNumber ?? null,
        inspectionValidFrom: accData.inspectionValidFrom ?? null,
        inspectionValidUntil: accData.inspectionValidUntil ?? null,
        engineType: accData.engineType ?? null,
      } : null);

  const accidentStatus = {
    hasAccident: accData?.hasAccident ?? accData?.accident?.hasAccident ?? null,
    accidentStatus: accData?.accidentStatus ?? accData?.accident?.accidentStatus ?? null,
    hasSimpleRepair: accData?.hasSimpleRepair ?? accData?.accident?.hasSimpleRepair ?? null,
    simpleRepair: accData?.simpleRepairStatus ?? accData?.simpleRepair ?? accData?.accident?.simpleRepair ?? null,
  };

  const panelDamage = Array.isArray(accData?.panelDamage)
    ? accData.panelDamage.filter(
        (p: any): p is { part?: string; damage?: string; severity?: string } =>
          p != null,
      )
    : [];

  const mechanicalObj = accData?.mechanicalInspection ?? accData;
  const engineMechanical = {
    selfDiagnosis:
      accData?.engineSelfDiagnosis ??
      mechanicalObj?.selfDiagnosis?.engine ??
      accData?.engine?.selfDiagnosis ??
      null,
    engine: mechanicalObj?.engine ?? accData?.engine
      ? {
          idleStatus: mechanicalObj?.engine?.idleStatus ?? accData?.engine?.idleStatus ?? null,
          oilLeakage: mechanicalObj?.engine?.oilLeakage ?? accData?.engine?.oilLeakage ?? null,
          oilFlow: mechanicalObj?.engine?.oilFlow ?? accData?.engine?.oilFlow ?? null,
          coolantLeakage: mechanicalObj?.engine?.coolantLeakage ?? accData?.engine?.coolantLeakage ?? null,
        }
      : null,
    transmission: mechanicalObj?.transmission ?? accData?.transmission ?? null,
    powerTransmission: mechanicalObj?.powerTransmission ?? accData?.powerTransmission ?? null,
    steering: mechanicalObj?.steering ?? accData?.steering ?? null,
    braking: mechanicalObj?.braking ?? accData?.braking ?? null,
    electrical: mechanicalObj?.electrical ?? accData?.electrical ?? null,
    fuel: mechanicalObj?.fuel ?? accData?.fuel ?? null,
  };

  const mechanicalDetail =
    accData?.mechanicalInspection != null &&
    typeof accData.mechanicalInspection === "object"
      ? (accData.mechanicalInspection as DbRecord)
      : null;

  const ins = accData?.insuranceHistory;
  const insuranceHistory = ins
    ? {
        totalDamageAmount: ins.totalDamageAmount ?? null,
        totalIncidents: ins.totalIncidents ?? null,
        ownCarDamage: ins.ownCarDamage
          ? {
              count: ins.ownCarDamage.count ?? null,
              amount: ins.ownCarDamage.amount ?? null,
            }
          : null,
        otherCarLiability: ins.otherCarLiability
          ? {
              count: ins.otherCarLiability.count ?? null,
              amount: ins.otherCarLiability.amount ?? null,
            }
          : null,
        specialNotes: ins.specialNotes ?? accData?.specialNotes ?? null,
      }
    : (accData ? {
        totalDamageAmount: accData.totalDamageAmount ?? null,
        totalIncidents: accData.totalIncidents ?? null,
        ownCarDamage: {
          count: accData.ownCarDamageCount ?? null,
          amount: accData.ownCarDamageAmount ?? null,
        },
        otherCarLiability: {
          count: accData.otherCarLiabilityCount ?? null,
          amount: accData.otherCarLiabilityAmount ?? null,
        },
        specialNotes: accData.specialNotes ?? null,
      } : null);

  const rawSimple = accData?.repairHistory?.simpleRepairs ?? accData?.simpleRepairs;
  const simpleRepairs = Array.isArray(rawSimple)
    ? rawSimple.map((r: unknown) => {
        const rec = r as Record<string, unknown>;
        return {
          partName: rec.partNameEnglish ?? rec.partName ?? null,
          status: rec.status ?? null,
          code: rec.code ?? null,
          rankCode: rec.rankCode ?? null,
        };
      })
    : [];

  const rawStructural = accData?.repairHistory?.structuralRepairs ?? accData?.structuralRepairs;
  const structuralRepairs = Array.isArray(rawStructural)
    ? rawStructural.map((r: unknown) => {
        const rec = r as Record<string, unknown>;
        return {
          partName: rec.partNameEnglish ?? rec.partName ?? null,
          status: rec.status ?? null,
          code: rec.code ?? null,
          rankCode: rec.rankCode ?? null,
        };
      })
    : [];

  const vehicleMeta = apiCar != null
    ? {
        manufacturer: apiCar.brand ?? null,
        model: apiCar.model ?? null,
        grade: apiCar.variant ?? null,
        gradeDetail: null,
        yearMonth: null,
        formYear: String(apiCar.year ?? ""),
        price: toNumber(apiCar.original_price_krw ?? apiCar.price),
        mileage: toNumber(apiCar.mileage),
        fuel: apiCar.fuelType ?? null,
        transmission: apiCar.transmission ?? null,
        color: apiCar.color ?? null,
        bodyType: apiCar.type ?? null,
        vin: apiCar.vin ?? null,
        vehicleNo: null,
        location: apiCar.location ?? null,
        displacement: toNumber(apiCar.displacement),
        seatingCapacity: toNumber(apiCar.seatingCapacity ?? apiCar.seat_count),
        registrationDate: apiCar.registrationDate ?? null,
        firstAdvertisedDate: apiCar.firstAdvertisedDate ?? null,
        modifiedDate: apiCar.modifiedDate ?? apiCar.updated_at ?? null,
        viewCount: toNumber(apiCar.viewCount),
        trustBadges: Array.isArray(apiCar.trustBadges) ? apiCar.trustBadges : [],
        sellerComment: apiCar.sellerComment ?? null,
        image: apiCar.image ? normalizeImageUrl(apiCar.image) : null,
        images: Array.isArray(apiCar.images) ? apiCar.images.map(normalizeImageUrl) : [],
      }
    : null;

  const mileageAndBoard = {
    mileage: accData?.mileage ?? cond?.mileage ?? null,
    boardState: accData?.boardState ?? null,
  };

  const exportEligibility = apiCar?.exportEligibility ?? null;

  return {
    record,
    inspection,
    mapped_options,
    vehicleInfo,
    accidentStatus,
    panelDamage,
    engineMechanical,
    mechanicalDetail,
    insuranceHistory,
    simpleRepairs,
    structuralRepairs,
    vehicleMeta,
    mileageAndBoard,
    exportEligibility,
  } as DbRecord;
}
