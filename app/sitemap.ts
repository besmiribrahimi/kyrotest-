import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/inventory`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Direct Encar Certified Export Catalog
    {
      url: `${siteUrl}/inventory?source=encar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Top Brand Filter Landing Pathways
    {
      url: `${siteUrl}/inventory?brand=Genesis`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/inventory?brand=Hyundai`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/inventory?brand=Kia`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Supporting pages
    {
      url: `${siteUrl}/shipping-calculator`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic live vehicle detail pages for search discovery
  let vehicleRoutes: MetadataRoute.Sitemap = [];

  try {
    const primaryKey = process.env.APICARS_API_KEY || "RINMkYz8kXAX5FFEykWPKSWJl9V7uljeGGo";
    const backupKey = "RINSX9BFq53MC67FEXIJREa7Uq0UHfHTeP";
    const scraperUrl = `https://api.rinevoapi.com/api/encar/cars?limit=50`;

    let res = await fetch(scraperUrl, {
      headers: {
        "x-api-key": primaryKey,
      },
      cache: "no-store",
    });

    if (res.status === 401 && primaryKey !== backupKey) {
      res = await fetch(scraperUrl, {
        headers: {
          "x-api-key": backupKey,
        },
        cache: "no-store",
      });
    }

    if (res.ok) {
      const json = await res.json();
      const cars = json.recentCars || json.data?.cars || json.cars || [];
      if (Array.isArray(cars)) {
        vehicleRoutes = cars.map((car: any) => ({
          url: `${siteUrl}/vehicle/${car.id}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.65,
        }));
      }
    }
  } catch (error) {
    console.error("Error generating sitemap vehicle routes:", error);
  }

  return [...staticRoutes, ...vehicleRoutes];
}
