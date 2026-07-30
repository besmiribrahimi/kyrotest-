import type { Car, InventoryFilters } from "@/types/inventory";

export const DEFAULT_CAR_IMAGE_URL = "/images/mock-car.jpg";
export const NOT_SPECIFIED = "E paspecifikuar";
const DEFAULT_MIN_FILTER_YEAR = 2010;
const DEFAULT_MIN_FILTER_PRICE = 5000;
const DEFAULT_MAX_FILTER_PRICE = 250000;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type DbRecord = Record<string, unknown>;

const ACRONYMS = new Set(["api", "eur", "id", "krw", "url", "vin", "vat"]);

export function isRecord(value: unknown): value is DbRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function getString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return null;
}

export function firstPresent(...values: unknown[]): string | null {
  for (const value of values) {
    const stringValue = getString(value);

    if (stringValue) {
      return stringValue;
    }
  }

  return null;
}

export function formatReadableLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();

      if (ACRONYMS.has(lower)) {
        return lower.toUpperCase();
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest;
}

export function formatCurrency(
  value: unknown,
  currency: "EUR" | "USD" | "KRW" = "EUR",
): string {
  const numericValue = toNumber(value);

  if (numericValue === null) {
    return NOT_SPECIFIED;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numericValue);
}

/**
 * Converts a USD price to EUR using a live exchange rate API.
 * The fetch is optionally cached depending on the environment (Next.js native cache)
 * and returns the converted amount rounded to the nearest whole number.
 */
export async function convertUsdToEur(usdPrice: number): Promise<number> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();
    const rateEur = data.rates.EUR;

    if (typeof rateEur !== "number") {
      throw new Error("Invalid rate format received");
    }

    return Math.round(usdPrice * rateEur);
  } catch (error) {
    console.error("Error fetching USD to EUR rate:", error);
    // Fallback to a static approximate rate if the API call fails
    return Math.round(usdPrice * 0.92);
  }
}

export function formatCompactDate(value: unknown): string {
  const stringValue = getString(value);
  if (!stringValue) return NOT_SPECIFIED;
  const date = new Date(stringValue);
  if (Number.isNaN(date.getTime())) return stringValue;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function getKrwToEurRate(): Promise<number | null> {
  const apis = [
    "https://api.frankfurter.app/latest?from=KRW&to=EUR",
    "https://open.er-api.com/v6/latest/KRW",
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json",
  ];
  for (const url of apis) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const data = await res.json();
      let rate: number | undefined;
      if (data.rates?.EUR) rate = data.rates.EUR;
      else if (data.rates?.krw?.eur) rate = Number(data.rates.krw.eur);
      else if (data.EUR) rate = Number(data.EUR);
      if (typeof rate === "number" && rate > 0) return rate;
    } catch {
      continue;
    }
  }
  return null;
}

export async function convertKrwToEur(krwPrice: number): Promise<number | null> {
  const rate = await getKrwToEurRate();
  return rate !== null ? Math.round(krwPrice * rate) : null;
}

export function formatMileage(value: unknown, unit = "km"): string {
  const numericValue = toNumber(value);

  if (numericValue === null) {
    return NOT_SPECIFIED;
  }

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(numericValue)} ${unit}`;
}

export function applyMargin(priceEur: number, bodyType: string): number {
  const isSUV = ["suv", "crossover", "off-road"].some((t) =>
    bodyType.toLowerCase().includes(t),
  );
  if (priceEur <= 15000) return priceEur + (isSUV ? 2700 : 2500);
  if (priceEur <= 30000) return priceEur + (isSUV ? 3000 : 2800);
  if (priceEur <= 45000) return priceEur + (isSUV ? 3500 : 3300);
  if (priceEur <= 60000) return priceEur + (isSUV ? 3700 : 3500);
  return priceEur;
}

export function formatEngineDisplacement(value: unknown): string {
  const str = getString(value);
  if (!str) return NOT_SPECIFIED;
  const numeric = str.replace(/,/g, "").trim();
  if (/^\d+$/.test(numeric)) {
    return `${Number(numeric).toLocaleString("en-US")} cc`;
  }
  return str;
}


export function formatInspectionDate(value: unknown): string {
  const str = getString(value);
  if (!str || str === NOT_SPECIFIED) return NOT_SPECIFIED;
  const digits = str.replace(/\D/g, "");
  if (digits.length === 8) {
    const year = digits.slice(0, 4);
    const month = digits.slice(4, 6);
    const day = digits.slice(6, 8);
    return `${day}.${month}.${year}`;
  }
  const date = new Date(str);
  if (!Number.isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  return str;
}

export function formatDateTime(value: unknown): string {
  const stringValue = getString(value);

  if (!stringValue) {
    return NOT_SPECIFIED;
  }

  const date = new Date(stringValue);

  if (Number.isNaN(date.getTime())) {
    return stringValue;
  }

  return new Intl.DateTimeFormat("sq-AL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function isUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isImageUrl(value: unknown): value is string {
  if (!isUrl(value)) {
    return false;
  }

  const { pathname } = new URL(value);
  return /\.(avif|gif|jpe?g|png|webp)$/i.test(pathname);
}

export function getCarStableKey(car: Partial<Car>): string {
  return (
    firstPresent(car.id, car.carId) ??
    getCarFingerprint(car) ??
    ""
  );
}

export function getCarDeduplicationKey(car: Partial<Car>): string {
  return (
    firstPresent(car.carId, car.id) ??
    getCarFingerprint(car) ??
    ""
  );
}

export function getCarFingerprint(car: Partial<Car>): string {
  const parts = [
    car.title,
    car.make,
    car.model,
    car.year,
    car.importPriceDurresEUR ?? car.priceEUR,
    car.mileage,
    car.imageUrl,
  ].map(normalizeIdentityPart);

  const meaningfulParts = parts.filter(Boolean);

  if (meaningfulParts.length < 4) {
    return "";
  }

  return `car:${parts.join("|")}`;
}

export function dedupeCars<T extends Partial<Car>>(cars: T[]): T[] {
  const seenKeys = new Set<string>();
  const seenFingerprints = new Set<string>();
  const uniqueCars: T[] = [];

  for (const car of cars) {
    const identityKey = getCarDeduplicationKey(car);
    const hasSourceCarId = Boolean(firstPresent(car.carId));
    const fingerprint = hasSourceCarId ? "" : getCarFingerprint(car);

    if (identityKey && seenKeys.has(identityKey)) {
      continue;
    }

    if (fingerprint && seenFingerprints.has(fingerprint)) {
      continue;
    }

    if (identityKey) {
      seenKeys.add(identityKey);
    }

    if (fingerprint) {
      seenFingerprints.add(fingerprint);
    }

    uniqueCars.push(car);
  }

  return uniqueCars;
}

export function shuffleCars<T>(cars: T[]): T[] {
  const shuffled = [...cars];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function filterCars<T extends Partial<Car>>(
  cars: T[],
  filters: Partial<Omit<InventoryFilters, "accidentStatus">> & {
    accidentStatus?: string;
    brand?: string;
    engineType?: string;
  },
): T[] {
  return cars.filter((car) => {
    const make = firstPresent(filters.make, filters.brand);
    const fuelType = firstPresent(filters.fuelType, filters.engineType);
    const price = toNumber(car.importPriceDurresEUR ?? car.priceEUR);

    if (make && !isAllValue(make) && !textEquals(car.make, make)) {
      return false;
    }

    if (
      filters.model &&
      !textIncludes(`${car.model ?? ""} ${car.title ?? ""}`, filters.model)
    ) {
      return false;
    }

    if (
      filters.yearMin &&
      filters.yearMin > DEFAULT_MIN_FILTER_YEAR &&
      (toNumber(car.year) ?? 0) < filters.yearMin
    ) {
      return false;
    }

    if (
      filters.yearMax &&
      filters.yearMax < new Date().getFullYear() &&
      (toNumber(car.year) ?? 0) > filters.yearMax
    ) {
      return false;
    }

    if (filters.mileageMax && (toNumber(car.mileage) ?? 0) > filters.mileageMax) {
      return false;
    }

    if (
      filters.priceMin &&
      filters.priceMin > DEFAULT_MIN_FILTER_PRICE &&
      (price ?? 0) < filters.priceMin
    ) {
      return false;
    }

    if (
      filters.priceMax &&
      filters.priceMax < DEFAULT_MAX_FILTER_PRICE &&
      (price ?? 0) > filters.priceMax
    ) {
      return false;
    }

    if (fuelType && !isAllValue(fuelType) && !matchesFuelFilter(car.fuelType, fuelType)) {
      return false;
    }

    if (!matchesDetailFilter(car.transmission, filters.transmission)) {
      return false;
    }

    if (!matchesDetailFilter(car.color, filters.color)) {
      return false;
    }

    if (!matchesDetailFilter(car.bodyType, filters.bodyType)) {
      return false;
    }

    if (!matchesDetailFilter(car.engine, filters.engineSize)) {
      return false;
    }

    if (!matchesDetailFilter(car.driveType, filters.driveType)) {
      return false;
    }

    return true;
  });
}

function normalizeIdentityPart(value: unknown): string {
  const stringValue = getString(value);

  return stringValue
    ? stringValue.toLowerCase().replace(/\s+/g, " ").trim()
    : "";
}

function matchesDetailFilter(value: unknown, filterValue: unknown): boolean {
  const filter = getString(filterValue);

  return !filter || isAllValue(filter) || textEquals(value, filter);
}

function textEquals(value: unknown, expected: string): boolean {
  return normalizeFilterText(value) === normalizeFilterText(expected);
}

function textIncludes(value: unknown, expected: string): boolean {
  const normalizedValue = normalizeFilterText(value);
  const normalizedExpected = normalizeFilterText(expected);

  return Boolean(normalizedExpected) && normalizedValue.includes(normalizedExpected);
}

function matchesFuelFilter(value: unknown, expected: string): boolean {
  const normalizedValue = normalizeFuelText(value);
  const normalizedExpected = normalizeFuelText(expected);

  if (normalizedValue && normalizedExpected) {
    return normalizedValue === normalizedExpected;
  }

  return textIncludes(value, expected);
}

function normalizeFuelText(value: unknown): string {
  const normalized = normalizeFilterText(value);

  if (normalized.includes("electric") || normalized.includes("ev")) {
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

  return "";
}

function isAllValue(value: string): boolean {
  const normalizedValue = normalizeFilterText(value);

  return normalizedValue === "all" || normalizedValue === "all brands";
}

function normalizeFilterText(value: unknown): string {
  return (getString(value) ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getNestedString(source: unknown, path: string[]): string | null {
  let cursor = source;

  for (const key of path) {
    if (!isRecord(cursor)) {
      return null;
    }

    cursor = cursor[key];
  }

  return getString(cursor);
}

function getFirstRawImage(raw: unknown): string | null {
  if (!isRecord(raw) || !Array.isArray(raw.images)) {
    return null;
  }

  for (const image of raw.images) {
    if (typeof image === "string" && image.trim()) {
      return image;
    }

    if (isRecord(image)) {
      const imageUrl = firstPresent(image.url, image.src, image.imageUrl);

      if (imageUrl) {
        return imageUrl;
      }
    }
  }

  return null;
}

function getPricingRecord(row: DbRecord, raw: DbRecord): DbRecord {
  if (isRecord(row.pricing)) {
    return row.pricing;
  }

  if (isRecord(raw.pricing)) {
    return raw.pricing;
  }

  return {};
}

function getImportPriceDurresEUR({
  estimatedTotalEUR,
  advertisedPriceEUR,
  importFeesEUR,
  kosovoTransportEUR,
}: {
  estimatedTotalEUR: number | null;
  advertisedPriceEUR: number | null;
  importFeesEUR: number | null;
  kosovoTransportEUR: number | null;
}): number | null {
  if (estimatedTotalEUR !== null && kosovoTransportEUR !== null) {
    return Math.max(estimatedTotalEUR - kosovoTransportEUR, 0);
  }

  if (advertisedPriceEUR !== null && importFeesEUR !== null) {
    return advertisedPriceEUR + importFeesEUR;
  }

  return estimatedTotalEUR;
}

export async function normalizeCarSummary(row: DbRecord): Promise<Car> {
  const raw = isRecord(row.raw) ? row.raw : {};
  const id = firstPresent(row.id, row.car_id) ?? "";
  const year = toNumber(row.year) ?? 0;
  const make = firstPresent(row.make, raw.make) ?? "Unknown";
  const model = firstPresent(row.model, raw.model) ?? "Unknown";
  const trim = firstPresent(row.grade, row.trim, raw.grade) ?? "";
  const title =
    firstPresent(row.full_name, raw.full_name) ??
    [year || null, make, model, trim].filter(Boolean).join(" ");

  const rawEstimatedTotalUsd = toNumber(row.estimated_total_eur);
  const rawPricing = getPricingRecord(row, raw);
  
  const importPriceDurresUSD = getImportPriceDurresEUR({
    estimatedTotalEUR:
      rawEstimatedTotalUsd ?? toNumber(rawPricing.estimatedTotalEur),
    advertisedPriceEUR:
      toNumber(rawPricing.advertisedPriceEur) ??
      toNumber(row.price_eur) ??
      toNumber(raw.price),
    importFeesEUR: toNumber(rawPricing.importFeesEur),
    kosovoTransportEUR: toNumber(rawPricing.kosovoTransportEur),
  });

  const estimatedTotalEUR = rawEstimatedTotalUsd !== null ? await convertUsdToEur(rawEstimatedTotalUsd) : 0;
  const importPriceDurresEUR = importPriceDurresUSD !== null ? await convertUsdToEur(importPriceDurresUSD) : null;
  const priceEUR = importPriceDurresEUR ?? estimatedTotalEUR;
  const bodyType = firstPresent(row.body_type, raw.type) ?? NOT_SPECIFIED;
  const priceKRW =
    toNumber(row.original_price_krw) ??
    toNumber(raw.originalPriceKRW) ??
    toNumber(rawPricing.originalPriceKrw) ??
    0;
  let durresPrice: number | null = null;
  if (priceKRW > 0) {
    const rate = await getKrwToEurRate();
    if (rate !== null) {
      durresPrice = roundToNearest(applyMargin(Math.round(priceKRW * rate), bodyType), 100);
    }
  }
  if (durresPrice === null && importPriceDurresEUR !== null) {
    durresPrice = roundToNearest(applyMargin(importPriceDurresEUR, bodyType), 100);
  }

  return {
    id,
    carId: firstPresent(row.car_id, raw.car_id),
    title,
    make,
    model,
    trim,
    year,
    mileage: toNumber(row.mileage) ?? toNumber(raw.mileage) ?? 0,
    priceKRW,
    priceEUR,
    estimatedTotalEUR,
    importPriceDurresEUR,
    durresPrice,
    imageUrl:
      firstPresent(row.image_url, row.url, raw.mainPhotoUrl) ??
      getFirstRawImage(raw) ??
      DEFAULT_CAR_IMAGE_URL,
    location:
      firstPresent(
        row.location,
        raw.sellerLocation,
        getNestedString(raw, ["dealer", "location"]),
      ) ?? NOT_SPECIFIED,
    transmission:
      firstPresent(row.transmission, raw.transmission) ?? NOT_SPECIFIED,
    fuelType: firstPresent(row.fuel_type, raw.fuelType) ?? NOT_SPECIFIED,
    color:
      firstPresent(row.exterior_color, row.color, raw.exteriorColor) ??
      NOT_SPECIFIED,
    engine:
      firstPresent(row.engine, raw.displacement, raw.engineDetails) ??
      NOT_SPECIFIED,
    bodyType,
    driveType:
      firstPresent(
        row.drive_type,
        raw.drivetrain,
        getNestedString(raw, [
          "inspection",
          "performance",
          "transmission",
          "drivetrain",
        ]),
      ) ?? NOT_SPECIFIED,
    sourceUrl: firstPresent(row.source_url, raw.sourceUrl),
    sold: row.sold === true,
    detailsHref: `/inventory/${id}`,
  };
}
