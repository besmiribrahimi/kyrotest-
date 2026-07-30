import type {
  InventoryAccidentStatus,
  InventoryFilters,
  InventoryFuelType,
  SortOption,
} from "../types/inventory";

export const DEFAULT_INVENTORY_LIMIT = 24;
export const MAX_INVENTORY_LIMIT = 48;

interface InventoryParamOptions {
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
}

export interface NormalizedInventoryParams {
  limit: number;
  page: number;
  sort: SortOption;
  offset: number;
  filters: InventoryFilters;
}

function toPositiveInteger(
  value: string | number | null | undefined,
  fallback: number,
  max?: number,
): number {
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);

  if (!Number.isFinite(numericValue) || numericValue < 1) {
    return fallback;
  }

  const integerValue = Math.floor(numericValue);
  return max ? Math.min(integerValue, max) : integerValue;
}

function toOptionalPositiveInteger(
  value: string | number | null | undefined,
): number | undefined {
  const parsed = toPositiveInteger(value, 0);
  return parsed > 0 ? parsed : undefined;
}

function normalizeSort(value: string | null | undefined): SortOption {
  if (
    value === "price-low" ||
    value === "price-high" ||
    value === "mileage-low"
  ) {
    return value;
  }

  return "newest";
}

function normalizeSearchText(
  value: string | null | undefined,
): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 80) : undefined;
}

function normalizeDetailFilter(
  value: string | null | undefined,
): string | undefined {
  const normalizedValue = normalizeSearchText(value);

  return normalizedValue?.toLowerCase() === "all" ? undefined : normalizedValue;
}

function normalizeMake(value: string | null | undefined): string | undefined {
  const make = normalizeSearchText(value);

  if (!make || make.toLowerCase() === "all" || make === "All Brands") {
    return undefined;
  }

  return make;
}

function normalizeFuelType(
  value: string | null | undefined,
): InventoryFuelType | undefined {
  const fuelType = value?.trim().toLowerCase();

  if (
    fuelType === "gasoline" ||
    fuelType === "diesel" ||
    fuelType === "hybrid" ||
    fuelType === "electric"
  ) {
    return fuelType;
  }

  return undefined;
}

function normalizeAccidentStatus(
  value: string | null | undefined,
): InventoryAccidentStatus | undefined {
  const status = value?.trim().toLowerCase();

  if (status === "accident-free" || status === "has-accident") {
    return status;
  }

  return undefined;
}

export function normalizeInventoryParams(
  options: InventoryParamOptions,
): NormalizedInventoryParams {
  const limit = toPositiveInteger(
    options.limit,
    DEFAULT_INVENTORY_LIMIT,
    MAX_INVENTORY_LIMIT,
  );
  const page = toPositiveInteger(options.page, 1);
  const sort = normalizeSort(options.sort);
  const priceMin = toOptionalPositiveInteger(options.priceMin);
  const priceMax = toOptionalPositiveInteger(options.priceMax);
  const filters: InventoryFilters = {
    make: normalizeMake(options.make),
    model: normalizeSearchText(options.model),
    yearMin: toOptionalPositiveInteger(options.yearMin),
    yearMax: toOptionalPositiveInteger(options.yearMax),
    mileageMax: toOptionalPositiveInteger(options.mileageMax),
    priceMin:
      priceMin !== undefined && priceMax !== undefined && priceMin > priceMax
        ? priceMax
        : priceMin,
    priceMax:
      priceMin !== undefined && priceMax !== undefined && priceMin > priceMax
        ? priceMin
        : priceMax,
    fuelType: normalizeFuelType(options.fuelType),
    transmission: normalizeDetailFilter(options.transmission),
    color: normalizeDetailFilter(options.color),
    bodyType: normalizeDetailFilter(options.bodyType),
    engineSize: normalizeDetailFilter(options.engineSize),
    driveType: normalizeDetailFilter(options.driveType),
    accidentStatus: normalizeAccidentStatus(options.accidentStatus),
  };

  return {
    limit,
    page,
    sort,
    offset: (page - 1) * limit,
    filters: Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined),
    ) as InventoryFilters,
  };
}
