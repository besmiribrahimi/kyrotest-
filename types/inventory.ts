export interface Car {
  id: string;
  carId?: string | null;
  title: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  priceKRW: number;
  priceEUR: number;
  estimatedTotalEUR?: number | null;
  importPriceDurresEUR?: number | null;
  durresPrice?: number | null;
  imageUrl: string;
  location: string;
  transmission: string;
  fuelType: string;
  color: string;
  engine: string;
  bodyType: string;
  driveType: string;
  sourceUrl?: string | null;
  sold?: boolean;
  detailsHref: string;
}

export interface InventoryResponse {
  success: boolean;
  data: Car[];
  pagination: InventoryPagination;
  filterOptions?: InventoryFilterOptions;
  message?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'newest' | 'price-low' | 'price-high' | 'mileage-low';
export type InventoryFuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric';
export type InventoryAccidentStatus = 'accident-free' | 'has-accident';

export interface InventoryFilterOption {
  label: string;
  value: string;
  logoSrc?: string;
}

export interface InventoryFilterOptions {
  brands: InventoryFilterOption[];
  models: InventoryFilterOption[];
  fuelTypes: InventoryFilterOption[];
  transmissions: InventoryFilterOption[];
  colors: InventoryFilterOption[];
  bodyTypes: InventoryFilterOption[];
  engineSizes: InventoryFilterOption[];
  driveTypes: InventoryFilterOption[];
  accidentStatuses: InventoryFilterOption[];
}

export interface InventoryFilters {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  priceMin?: number;
  priceMax?: number;
  fuelType?: InventoryFuelType;
  transmission?: string;
  color?: string;
  bodyType?: string;
  engineSize?: string;
  driveType?: string;
  accidentStatus?: InventoryAccidentStatus;
}

export interface InventoryPagination {
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}
