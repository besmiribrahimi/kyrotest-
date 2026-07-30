import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand") || "";
  const limit = searchParams.get("limit") || "12";

  try {
    const primaryKey = process.env.APICARS_API_KEY || "RINSX9BFq53MC67FEXIJREa7Uq0UHfHTeP";
    const backupKey = "RINupcjSzwvpZNvNLfaMYcoiKHxQ1mk1AX";
    const scraperUrl = `https://api.rinevoapi.autos/api/scraper/cars?limit=${limit}${brand ? `&brand=${encodeURIComponent(brand)}` : ""}`;

    let res = await fetch(scraperUrl, {
      headers: {
        "x-api-key": primaryKey,
      },
      cache: "no-store",
    });

    if (res.status === 401 && primaryKey !== backupKey) {
      console.warn("Primary API key expired or unauthorized. Falling back to backup key.");
      res = await fetch(scraperUrl, {
        headers: {
          "x-api-key": backupKey,
        },
        cache: "no-store",
      });
    }

    if (!res.ok) {
      return NextResponse.json({ success: false, cars: [] });
    }

    const data = await res.json();

    // Normalize image URLs in proxy output to prevent watermarks and API key exposure
    if (data && typeof data === "object") {
      const cars = data.data?.cars || data.cars;
      if (Array.isArray(cars)) {
        for (const car of cars) {
          if (car.image) car.image = normalizeImageUrl(car.image);
          if (Array.isArray(car.images)) {
            car.images = car.images.map((img: string) => normalizeImageUrl(img));
          }
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ success: false, cars: [] });
  }
}
