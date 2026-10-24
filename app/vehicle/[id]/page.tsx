import { getInventoryCarDetails } from "@/lib/inventory-api";
import CarDetailClient from "./CarDetailClient";
import { buildPageMetadata, carJsonLd, webPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CarDetailPageProps) {
  const resolvedParams = await params;
  const carId = resolvedParams.id;
  const details = await getInventoryCarDetails(carId);

  if (!details) {
    return buildPageMetadata({
      title: "Vehicle Not Found | Advanced Koryo",
      description: "The requested vehicle could not be found in our export inventory.",
      path: `/vehicle/${carId}`,
      noIndex: true,
    });
  }

  const car = details.summary;
  const make = car.make || "Genesis";
  const model = car.model || "G80";
  const year = car.year || 2023;
  const mileage = car.mileage ? `${car.mileage.toLocaleString()} km` : "Low mileage";
  const fuel = car.fuelType || "Gasoline";
  const transmission = car.transmission || "Automatic";
  const source = (details.listing as any)?.source || "encar";
  const sourceLabel = "Encar Certified";

  const title = `${year} ${make} ${model} Export Sourced from ${sourceLabel} Korea | Advanced Koryo`;
  const description = `Direct import this verified ${year} ${make} ${model} sourced from ${sourceLabel} South Korea. Mileage: ${mileage}, Transmission: ${transmission}, Fuel: ${fuel}. Certified with 150-Point diagnostic inspection and worldwide Ro-Ro shipping.`;
  const image = car.imageUrl || "/logo.png";

  return buildPageMetadata({
    title,
    description,
    path: `/vehicle/${carId}`,
    image,
    keywords: [
      `${make} ${model}`,
      `${sourceLabel} ${make}`,
      `${sourceLabel} used cars`,
      `Buy ${make} from Korea`,
      "Korean car export",
    ],
  });
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const resolvedParams = await params;
  const carId = resolvedParams.id;
  const details = await getInventoryCarDetails(carId);

  if (!details) {
    notFound();
  }

  const car = details.summary;
  const make = car.make || "Genesis";
  const model = car.model || "G80";
  const year = car.year || 2023;
  const mileage = car.mileage || 24000;
  const fuel = car.fuelType || "Gasoline";
  const transmission = car.transmission || "Automatic";
  const color = car.color || "Black";
  const image = car.imageUrl || "/logo.png";

  const rawObj = (details.listing.raw as any) || {};
  const reportObj = (details.report as any) || {};

  const baseEur = Number(car.priceEUR) || 35000;
  const priceKrw: number = details.listing.original_price_krw || rawObj.pricing?.krw || rawObj.priceKrw || Math.round(baseEur * 1450);
  const priceUsd: number = rawObj.pricing?.usd || rawObj.priceUsd || Math.round(priceKrw / 1350);
  const priceEur: number = rawObj.pricing?.eur || Math.round(priceUsd * 0.92);
  const priceJpy: number = rawObj.pricing?.jpy || Math.round(priceUsd * 155);

  const rawImages: string[] = Array.isArray(details.images) && details.images.length > 0
    ? details.images.map((img: any) => typeof img === "string" ? img : img.url).filter(Boolean)
    : Array.isArray(rawObj.photos) && rawObj.photos.length > 0
    ? rawObj.photos
    : Array.isArray(rawObj.images) && rawObj.images.length > 0
    ? rawObj.images
    : [image];

  const carData = {
    id: carId,
    title: car.title || rawObj.title || `${make} ${model} ${year}`,
    brand: make,
    model: model,
    year: year,
    mileage: mileage,
    fuelType: fuel,
    transmission: transmission,
    color: color,
    price: priceKrw,
    prices: {
      USD: priceUsd,
      EUR: priceEur,
      KRW: priceKrw,
      JPY: priceJpy,
    },
    image: image,
    images: rawImages,
    vin: details.listing.vin || rawObj.vin || rawObj.accidentHistory?.vin || reportObj.vehicleInfo?.vin || "",
    licensePlate: rawObj.licensePlate || rawObj.accidentHistory?.licensePlate || reportObj.vehicleInfo?.licensePlate || "",
    inspectionNumber: rawObj.accidentHistory?.inspectionNumber || reportObj.vehicleInfo?.inspectionNumber || "",
    firstRegistration: rawObj.accidentHistory?.firstRegistration || reportObj.vehicleInfo?.firstRegistration || "",
    inspectionValidFrom: rawObj.accidentHistory?.inspectionValidFrom || "",
    inspectionValidUntil: rawObj.accidentHistory?.inspectionValidUntil || "",
    displacement: rawObj.displacement || rawObj.displacementCc || rawObj.specifications?.displacementCc || null,
    seatingCapacity: rawObj.seatingCapacity || rawObj.specifications?.seatingCapacity || null,
    bodyType: car.bodyType || rawObj.bodyType || rawObj.specifications?.bodyType || "Sedan",
    drivetrain: rawObj.drivetrain || rawObj.specifications?.driveSystem || "2WD",
    location: rawObj.location || "Seoul / Incheon Yard, South Korea",

    // Rich Encar API data:
    optionsCategories: rawObj.options?.categories || [],
    mappedOptions: reportObj.mapped_options || [],
    accident: rawObj.accident || reportObj.accidentStatus || null,
    accidentSummary: rawObj.accidentSummary || null,
    accidentHistory: rawObj.accidentHistory || null,
    insuranceHistory: rawObj.accidentHistory?.insuranceHistory || rawObj.accident?.insuranceHistory || reportObj.insuranceHistory || null,
    mechanicalInspection: rawObj.accidentHistory?.mechanicalInspection || reportObj.mechanicalDetail || null,
    exportEligibility: rawObj.exportEligibility || reportObj.exportEligibility || null,
    sellerComment: rawObj.sellerComment || null,
  };

  // Structured Data
  const sourceRaw = (details.listing as any)?.source || "encar";
  const carSchema = carJsonLd({
    car: {
      id: carId,
      title: carData.title,
      make: carData.brand,
      model: carData.model,
      year: carData.year,
      mileage: carData.mileage,
      fuelType: carData.fuelType,
      transmission: carData.transmission,
      durresPrice: carData.prices.USD,
      imageUrl: carData.image,
      source: sourceRaw,
    },
    url: `/vehicle/${carId}`,
  });

  const webpageSchema = webPageJsonLd({
    title: carData.title,
    description: `Import this verified ${carData.brand} ${carData.model} from South Korea. 150-Point inspection certified.`,
    path: `/vehicle/${carId}`,
    image: carData.image,
  });

  const breadcrumbsSchema = breadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Inventory", item: "/inventory" },
    { name: `${make} ${model}`, item: `/vehicle/${carId}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <CarDetailClient carId={carId} initialCarData={carData} />
    </>
  );
}
