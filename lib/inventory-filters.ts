import type {
  InventoryAccidentStatus,
  InventoryFuelType,
  InventoryFilterOption,
  SortOption,
} from "../types/inventory";
import carLogos from "./car-logos.json";

export const ALL_BRANDS_VALUE = "All Brands";
export const ALL_ENGINE_TYPES_VALUE = "all";
export const ALL_DETAIL_FILTERS_VALUE = "all";
export const MIN_FILTER_YEAR = 2010;
export const MIN_FILTER_PRICE = 5000;
export const MAX_FILTER_PRICE = 250000;

export const ALL_BRANDS = [
  "Alfa Romeo",
  "Audi",
  "Bentley",
  "BMW",
  "Cadillac",
  "Chevrolet",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Ram",
  "Renault",
  "Rolls-Royce",
  "Skoda",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

export const BRAND_MODELS_MAP: Record<string, string[]> = {
  hyundai: [
    "Tucson",
    "Santa Fe",
    "Palisade",
    "Kona",
    "Elantra",
    "Sonata",
    "Staria",
    "Ioniq 5",
    "Ioniq 6",
    "Venue",
    "Creta",
    "Grandeur",
    "Genesis",
    "Accent",
    "Avante",
    "Casper",
  ],
  kia: [
    "Seltos",
    "Sportage",
    "Sorento",
    "Carnival",
    "Stinger",
    "K3",
    "K5",
    "K7",
    "K8",
    "K9",
    "Soul",
    "Niro",
    "EV6",
    "EV9",
    "Picanto",
    "Rio",
    "Ceed",
    "Mohave",
    "Bongo",
  ],
  genesis: ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  kgmobilityssangyong: [
    "Torres",
    "Korando",
    "Rexton",
    "Tivoli",
    "Musso",
    "Actyon",
  ],
  chevrolet: [
    "Trax",
    "Trailblazer",
    "Equinox",
    "Spark",
    "Cruze",
    "Malibu",
    "Orlando",
    "Captiva",
    "Aveo",
  ],
  bmw: [
    "1-Series",
    "2-Series",
    "3-Series",
    "4-Series",
    "5-Series",
    "6-Series",
    "7-Series",
    "8-Series",
    "Gran Turismo",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "M2",
    "M3",
    "M4",
    "M5",
    "M8",
    "Z4",
    "i3",
    "i4",
    "i8",
    "iX",
    "iX3",
    "i7",
  ],
  mercedesbenz: [
    "A-Class",
    "B-Class",
    "C-Class",
    "E-Class",
    "G-Class",
    "S-Class",
    "V-Class",
    "CLA",
    "CLS",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "AMG GT",
    "SL",
    "SLC",
    "SLK",
    "EQA",
    "EQB",
    "EQC",
    "EQE",
    "EQS",
  ],
  audi: [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "S1",
    "S3",
    "S4",
    "S5",
    "S6",
    "S7",
    "S8",
    "RS3",
    "RS4",
    "RS5",
    "RS6",
    "RS7",
    "RS8",
    "Q2",
    "Q3",
    "Q4",
    "Q5",
    "Q7",
    "Q8",
    "SQ2",
    "SQ5",
    "SQ7",
    "SQ8",
    "RSQ3",
    "RSQ8",
    "TT",
    "TTS",
    "TT RS",
    "R8",
    "e-tron",
    "e-tron GT",
  ],
  volkswagen: ["Golf", "Tiguan", "Passat", "Polo", "Arteon", "Touareg", "ID.4"],
  ford: ["Explorer", "Mustang", "Ranger", "Kuga", "Focus", "Fiesta"],
  toyota: ["Camry", "RAV4", "Prius", "Corolla", "Land Cruiser", "Yaris", "Hilux"],
  lexus: ["RX", "NX", "UX", "ES", "IS", "LS"],
  tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Fit"],
  renault: ["QM6", "XM3", "SM6", "Captur", "Clio", "Zoe", "Megane"],
  peugeot: ["208", "308", "2008", "3008", "5008", "508"],
  alfaromeo: ["Giulia", "Stelvio", "Tonale", "Spider", "Giulietta"],
  bentley: ["Continental GT", "Bentayga", "Flying Spur", "Mulsanne"],
  cadillac: ["Escalade", "CTS", "XTS", "SRX", "XT5"],
  dodge: ["Charger", "Challenger", "Durango", "Grand Caravan"],
  ferrari: ["F8 Tributo", "SF90 Stradale", "Roma", "296 GTB", "488 GTB"],
  fiat: ["500", "Panda", "Tipo", "Doblo", "Fiorino"],
  gmc: ["Yukon", "Sierra", "Terrain", "Acadia"],
  infiniti: ["Q50", "Q60", "QX50", "QX60", "QX80"],
  jaguar: ["F-PACE", "E-PACE", "I-PACE", "XF", "XE", "F-TYPE"],
  jeep: ["Grand Cherokee", "Wrangler", "Cherokee", "Renegade", "Compass", "Gladiator"],
  lamborghini: ["Urus", "Huracan", "Aventador", "Gallardo"],
  landrover: ["Range Rover", "Range Rover Sport", "Range Rover Evoque", "Discovery", "Discovery Sport", "Defender"],
  lotus: ["Emira", "Evija", "Exige", "Elise"],
  maserati: ["Ghibli", "Levante", "Quattroporte", "MC20", "Grecale"],
  mazda: ["CX-5", "CX-30", "CX-9", "Mazda3", "Mazda6", "MX-5"],
  mclaren: ["720S", "Artura", "GT", "765LT"],
  mini: ["Cooper", "Countryman", "Clubman", "John Cooper Works"],
  mitsubishi: ["Outlander", "Eclipse Cross", "ASX", "Pajero", "L200"],
  nissan: ["Qashqai", "Juke", "X-Trail", "Pathfinder", "Navara", "Leaf", "GT-R"],
  opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland"],
  porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Cayman", "Boxster"],
  ram: ["1500", "2500", "3500", "ProMaster"],
  rollsroyce: ["Ghost", "Phantom", "Cullinan", "Wraith", "Dawn"],
  skoda: ["Octavia", "Superb", "Kodiaq", "Karoq", "Fabia", "Scala"],
  subaru: ["Outback", "Forester", "Impreza", "XV", "Levorg", "WRX"],
  suzuki: ["Swift", "Vitara", "S-Cross", "Jimny", "Baleno"],
  volvo: ["XC90", "XC60", "XC40", "S60", "S90", "V60", "V90"],
};

export const BRAND_ALIASES: Record<string, string> = {
  kg_mobility_ssangyong: "kgmobilityssangyong",
  chevroletgmdaewoo: "chevrolet",
  mercedes: "mercedesbenz",
};

export interface InventoryFilterState {
  brand: string;
  model: string;
  yearMin: number;
  yearMax: number;
  mileageMax: number;
  priceMin: number;
  priceMax: number;
  engineType: InventoryFuelType | typeof ALL_ENGINE_TYPES_VALUE;
  transmission: string;
  color: string;
  bodyType: string;
  engineSize: string;
  driveType: string;
  accidentStatus: InventoryAccidentStatus | typeof ALL_DETAIL_FILTERS_VALUE;
}

type SearchParamSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | null
  | undefined;

const FUEL_TYPES = new Set<string>([
  "gasoline",
  "diesel",
  "hybrid",
  "electric",
]);

const ACCIDENT_STATUSES = new Set<string>([
  "accident-free",
  "has-accident",
]);

const BRAND_LOGO_SLUGS: Record<string, string> = {
  acura: "acura",
  alfaromeo: "alfaromeo",
  astonmartin: "astonmartin",
  audi: "audi",
  bentley: "bentley",
  bmw: "bmw",
  bugatti: "bugatti",
  buick: "buick",
  cadillac: "cadillac",
  chevrolet: "chevrolet",
  chrysler: "chrysler",
  citroen: "citroen",
  dodge: "dodge",
  ferrari: "ferrari",
  fiat: "fiat",
  ford: "ford",
  genesis: "genesis",
  gmc: "gmc",
  honda: "honda",
  hyundai: "hyundai",
  infiniti: "infiniti",
  jaguar: "jaguar",
  jeep: "jeep",
  kia: "kia",
  lamborghini: "lamborghini",
  landrover: "landrover",
  lexus: "lexus",
  lotus: "lotus",
  maserati: "maserati",
  mazda: "mazda",
  mclaren: "mclaren",
  mercedes: "mercedes",
  mercedesbenz: "mercedes",
  mini: "mini",
  mitsubishi: "mitsubishi",
  nissan: "nissan",
  opel: "opel",
  peugeot: "peugeot",
  porsche: "porsche",
  ram: "ram",
  renault: "renault",
  rollsroyce: "rollsroyce",
  skoda: "skoda",
  subaru: "subaru",
  suzuki: "suzuki",
  tesla: "tesla",
  toyota: "toyota",
  volkswagen: "volkswagen",
  volvo: "volvo",
};

const BRAND_LOGOS = Object.fromEntries(
  Object.entries(BRAND_LOGO_SLUGS).map(([key, slug]) => [
    key,
    `https://cdn.simpleicons.org/${slug}/1B5E3F`,
  ]),
);

export function getDefaultInventoryFilters(
  currentYear = new Date().getFullYear(),
): InventoryFilterState {
  return {
    brand: ALL_BRANDS_VALUE,
    model: "",
    yearMin: MIN_FILTER_YEAR,
    yearMax: currentYear,
    mileageMax: 0,
    priceMin: MIN_FILTER_PRICE,
    priceMax: MAX_FILTER_PRICE,
    engineType: ALL_ENGINE_TYPES_VALUE,
    transmission: ALL_DETAIL_FILTERS_VALUE,
    color: ALL_DETAIL_FILTERS_VALUE,
    bodyType: ALL_DETAIL_FILTERS_VALUE,
    engineSize: ALL_DETAIL_FILTERS_VALUE,
    driveType: ALL_DETAIL_FILTERS_VALUE,
    accidentStatus: ALL_DETAIL_FILTERS_VALUE,
  };
}

export function getInventoryFiltersFromSearchParams(
  searchParams: SearchParamSource,
  currentYear = new Date().getFullYear(),
): InventoryFilterState {
  const defaults = getDefaultInventoryFilters(currentYear);
  const fuelType = cleanString(
    getSearchParam(searchParams, "fuelType") ??
      getSearchParam(searchParams, "engineType"),
  )?.toLowerCase();
  const accidentStatus = cleanString(
    getSearchParam(searchParams, "accidentStatus"),
  )?.toLowerCase();

  return {
    brand:
      cleanString(getSearchParam(searchParams, "make")) ?? defaults.brand,
    model: cleanString(getSearchParam(searchParams, "model")) ?? defaults.model,
    yearMin:
      toPositiveInteger(getSearchParam(searchParams, "yearMin")) ??
      defaults.yearMin,
    yearMax:
      toPositiveInteger(getSearchParam(searchParams, "yearMax")) ??
      defaults.yearMax,
    mileageMax:
      toPositiveInteger(getSearchParam(searchParams, "mileageMax")) ??
      defaults.mileageMax,
    priceMin:
      toPositiveInteger(getSearchParam(searchParams, "priceMin")) ??
      defaults.priceMin,
    priceMax:
      toPositiveInteger(getSearchParam(searchParams, "priceMax")) ??
      defaults.priceMax,
    engineType: FUEL_TYPES.has(fuelType ?? "")
      ? (fuelType as InventoryFuelType)
      : defaults.engineType,
    transmission:
      cleanString(getSearchParam(searchParams, "transmission")) ??
      defaults.transmission,
    color:
      cleanString(getSearchParam(searchParams, "color")) ?? defaults.color,
    bodyType:
      cleanString(getSearchParam(searchParams, "bodyType")) ??
      defaults.bodyType,
    engineSize:
      cleanString(getSearchParam(searchParams, "engineSize")) ??
      defaults.engineSize,
    driveType:
      cleanString(getSearchParam(searchParams, "driveType")) ??
      defaults.driveType,
    accidentStatus: ACCIDENT_STATUSES.has(accidentStatus ?? "")
      ? (accidentStatus as InventoryAccidentStatus)
      : defaults.accidentStatus,
  };
}

export function buildInventorySearchParams(
  filters: InventoryFilterState,
  options: {
    sort?: SortOption;
    page?: number;
    currentYear?: number;
  } = {},
): URLSearchParams {
  const currentYear = options.currentYear ?? new Date().getFullYear();
  const defaults = getDefaultInventoryFilters(currentYear);
  const params = new URLSearchParams();
  const brand = cleanString(filters.brand);
  const model = cleanString(filters.model);

  if (brand && brand !== defaults.brand) {
    params.set("make", brand);
  }

  if (model) {
    params.set("model", model);
  }

  if (filters.yearMin > defaults.yearMin) {
    params.set("yearMin", String(filters.yearMin));
  }

  if (filters.yearMax < defaults.yearMax) {
    params.set("yearMax", String(filters.yearMax));
  }

  if (filters.mileageMax > defaults.mileageMax) {
    params.set("mileageMax", String(filters.mileageMax));
  }

  if (filters.priceMin > defaults.priceMin) {
    params.set("priceMin", String(filters.priceMin));
  }

  if (filters.priceMax < defaults.priceMax) {
    params.set("priceMax", String(filters.priceMax));
  }

  if (filters.engineType !== defaults.engineType) {
    params.set("fuelType", filters.engineType);
  }

  appendOptionalDetailFilter(params, "transmission", filters.transmission);
  appendOptionalDetailFilter(params, "color", filters.color);
  appendOptionalDetailFilter(params, "bodyType", filters.bodyType);
  appendOptionalDetailFilter(params, "engineSize", filters.engineSize);
  appendOptionalDetailFilter(params, "driveType", filters.driveType);
  appendOptionalDetailFilter(
    params,
    "accidentStatus",
    filters.accidentStatus,
  );

  if (options.sort && options.sort !== "newest") {
    params.set("sort", options.sort);
  }

  if (options.page && options.page > 1) {
    params.set("page", String(Math.floor(options.page)));
  }

  return params;
}

export function hasActiveInventoryFilters(
  filters: InventoryFilterState,
  currentYear = new Date().getFullYear(),
): boolean {
  return !areInventoryFiltersEqual(
    filters,
    getDefaultInventoryFilters(currentYear),
  );
}

export function areInventoryFiltersEqual(
  left: InventoryFilterState,
  right: InventoryFilterState,
): boolean {
  return (
    left.brand === right.brand &&
    left.model === right.model &&
    left.yearMin === right.yearMin &&
    left.yearMax === right.yearMax &&
    left.mileageMax === right.mileageMax &&
    left.priceMin === right.priceMin &&
    left.priceMax === right.priceMax &&
    left.engineType === right.engineType &&
    left.transmission === right.transmission &&
    left.color === right.color &&
    left.bodyType === right.bodyType &&
    left.engineSize === right.engineSize &&
    left.driveType === right.driveType &&
    left.accidentStatus === right.accidentStatus
  );
}

export function getBrandLogoSrc(brand: string): string | undefined {
  const key = normalizeBrandKey(brand);
  return (carLogos as Record<string, string>)[key] || BRAND_LOGOS[key];
}

// Maps user-facing model display names to the exact model values the scraper API
// uses. Korean brands use domestic market names (e.g. "Santafe" not "Santa Fe"),
// which differ from the export names users recognise. Without this map, filtering
// by "Santa Fe" sends model=Santa+Fe to the API and returns 0 results.
const MODEL_API_NAME_MAP: Record<string, Record<string, string>> = {
  hyundai: {
    "Santa Fe": "Santafe",
    "Elantra": "AVANTE",
    "Avante": "AVANTE",
    "Staria": "Starex",
  },
  kia: {
    "Carnival": "Canival",
    "Picanto": "morning",
    "Rio": "pride",
  },
};

export function getModelsForBrand(brand: string): string[] {
  const normalizedKey = normalizeBrandKey(brand);
  const resolvedKey = BRAND_ALIASES[normalizedKey] ?? normalizedKey;
  return BRAND_MODELS_MAP[resolvedKey] ?? [];
}

export function getAllKnownModels(): string[] {
  return Array.from(new Set(Object.values(BRAND_MODELS_MAP).flat())).sort(
    (left, right) => left.localeCompare(right, "en", { sensitivity: "base" }),
  );
}

export function isModelCompatibleWithBrand(
  brand: string,
  model: string,
): boolean {
  const models = getModelsForBrand(brand);

  if (models.length === 0 || !model) {
    return true;
  }

  const normalizedModel = model.toLowerCase();
  const brandApiMap = MODEL_API_NAME_MAP[normalizeBrandKey(brand)] ?? {};

  return models.some((entry) => {
    if (entry.toLowerCase() === normalizedModel) return true;
    // Also check the API value (e.g. model state "Santafe" for display "Santa Fe")
    const apiValue = brandApiMap[entry];
    return apiValue ? apiValue.toLowerCase() === normalizedModel : false;
  });
}

export function getModelOptionsForBrand(
  brand: string,
  sourceOptions: InventoryFilterOption[] = [],
): InventoryFilterOption[] {
  const knownModels = getModelsForBrand(brand);
  const brandApiMap = MODEL_API_NAME_MAP[normalizeBrandKey(brand)] ?? {};
  const sourceModelNames = sourceOptions.map((option) => option.value);
  const modelNames =
    knownModels.length > 0
      ? knownModels
      : Array.from(new Set([...getAllKnownModels(), ...sourceModelNames])).sort(
          (left, right) =>
            left.localeCompare(right, "en", { sensitivity: "base" }),
        );

  return modelNames.map((model) => {
    const apiValue = brandApiMap[model] ?? model;
    return { label: model, value: apiValue };
  });
}

function appendOptionalDetailFilter(
  params: URLSearchParams,
  key: string,
  value: unknown,
): void {
  const cleanedValue = cleanString(value);

  if (cleanedValue && cleanedValue !== ALL_DETAIL_FILTERS_VALUE) {
    params.set(key, cleanedValue);
  }
}

function getSearchParam(
  source: SearchParamSource,
  key: string,
): string | undefined {
  if (!source) {
    return undefined;
  }

  if (source instanceof URLSearchParams) {
    return source.get(key) ?? undefined;
  }

  const value = source[key];
  return Array.isArray(value) ? value[0] : value;
}

function cleanString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function toPositiveInteger(value: unknown): number | null {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return Math.floor(parsed);
}

export function normalizeBrandKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
