import type { Metadata } from "next";

export type JsonLdObject = Record<string, unknown>;

export const siteConfig = {
  name: "Advanced Koryo",
  legalName: "ADVANCED KORYO Co., Ltd.",
  domain: "mykoryo.com",
  language: "en",
  locale: "en_US",
  description:
    "Direct South Korean Vehicle Sourcing & Exporting. Certified 150-Point Inspection, Ro-Ro Shipping & Full Customs Support for Middle East & Global Buyers.",
  defaultOgImage: "/logo.png",
  email: "info@mykoryo.com",
  phone: "+82 10 7229 0580",
  whatsapp: "821072290580",
  address: {
    streetAddress: "278 Beotkkot-ro, Gasan-dong, SJ Technoville",
    addressLocality: "Seoul",
    postalCode: "08511",
    addressCountry: "KR",
  },
};

const fallbackSiteUrl = "https://mykoryo.com";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const rawUrl = configuredUrl || fallbackSiteUrl;
  const normalizedUrl = /^https?:\/\//i.test(rawUrl)
    ? rawUrl
    : `https://${rawUrl}`;

  try {
    return new URL(normalizedUrl).origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = siteConfig.defaultOgImage,
  type = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function webSiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: getSiteUrl(),
    inLanguage: siteConfig.language,
    description: siteConfig.description,
  };
}

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: getSiteUrl(),
    logo: absoluteUrl(siteConfig.defaultOgImage),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
  };
}

export function webPageJsonLd({
  title,
  description,
  path,
  image,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  dateModified?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(path),
    url: absoluteUrl(path),
    name: title,
    description: description,
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(dateModified ? { dateModified } : {}),
    isPartOf: {
      "@type": "WebSite",
      "@id": getSiteUrl(),
      name: siteConfig.name,
      url: getSiteUrl(),
    },
  };
}

export function carJsonLd({
  car,
  url,
}: {
  car: {
    title: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    durresPrice?: number | null;
    imageUrl?: string;
  };
  url: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: car.title,
    image: car.imageUrl,
    description: `Buy ${car.make} ${car.model} ${car.year} - Mileage: ${car.mileage} km, Transmission: ${car.transmission}, Fuel: ${car.fuelType}`,
    brand: {
      "@type": "Brand",
      name: car.make,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(url),
      priceCurrency: "EUR",
      price: car.durresPrice || "0",
      itemCondition: "https://schema.org/UsedCondition",
      availability: "https://schema.org/InStock",
    },
  };
}
