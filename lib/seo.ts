import type { Metadata } from "next";

export type JsonLdObject = Record<string, unknown>;

export const siteConfig = {
  name: "Advanced Koryo",
  legalName: "ADVANCED KORYO Co., Ltd.",
  domain: "mykoryo.com",
  language: "en",
  locale: "en_US",
  description:
    "Direct South Korean Vehicle Sourcing & Exporting from Encar (엔카), KB ChaChaCha (KB차차차), and K-Car. Certified 150-Point Inspection, Ro-Ro Shipping & Full Customs Support for Middle East & Global Buyers.",
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

export const targetKeywords = [
  "Encar",
  "Encar cars",
  "Encar used cars",
  "Encar English",
  "KB ChaChaCha",
  "KB ChaChaCha English",
  "KB ChaChaCha cars",
  "KB차차차",
  "엔카",
  "K-Car Korea",
  "Buy cars from Encar",
  "South Korea car export",
  "Korean used cars export",
  "Genesis export Korea",
  "Hyundai Palisade export",
  "Kia Carnival export",
  "Ro-Ro shipping from Incheon Busan",
  "Korea used car inspection 150-point",
  "Car import from Korea to Saudi Arabia",
  "Car import from Korea to UAE Dubai",
  "استيراد سيارات من كوريا",
  "موقع إنكار للسيارات",
  "كي بي تشاتشاتشا",
  "شحن سيارات من كوريا",
];

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
  keywords?: string[];
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = siteConfig.defaultOgImage,
  type = "website",
  noIndex = false,
  keywords = targetKeywords,
}: PageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    keywords,
    category: "Automotive Vehicle Export & Sourcing",
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        "en-US": absoluteUrl(path),
        "ar-SA": absoluteUrl(path),
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      alternateLocale: ["ar_SA", "en_US"],
      type,
      images: [
        {
          url: image.startsWith("http") ? image : `${siteUrl}${image}`,
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
      images: [image.startsWith("http") ? image : `${siteUrl}${image}`],
    },
  };
}

/**
 * Google Sitelinks Searchbox JSON-LD schema
 * Qualifies the website for an integrated Google Search Box in SERP results!
 */
export function webSiteJsonLd(): JsonLdObject {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteConfig.name,
    alternateName: [
      "Advanced Koryo Encar & KB ChaChaCha Search",
      "MyKoryo Korean Vehicle Sourcing",
      "Kyroo Korean Auto Export",
    ],
    url: siteUrl,
    inLanguage: ["en", "ar"],
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/inventory?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * AutoDealer / AutomotiveBusiness Schema
 * Establishes strong authority for SEO & Answer Engines (AEO).
 */
export function autoDealerJsonLd(): JsonLdObject {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${siteUrl}/#autodealer`,
    name: siteConfig.legalName,
    alternateName: "Advanced Koryo Vehicle Export",
    url: siteUrl,
    logo: absoluteUrl(siteConfig.defaultOgImage),
    image: absoluteUrl(siteConfig.defaultOgImage),
    description:
      "Certified South Korean automotive exporter and direct sourcing gateway for Encar (엔카), KB ChaChaCha (KB차차차), and K-Car. Providing 150-point diagnostic inspection, Ro-Ro vessel ocean freight, and customs documentation.",
    email: siteConfig.email,
    telephone: siteConfig.phone,
    priceRange: "$$$",
    currenciesAccepted: "USD, EUR, SAR, AED, QAR, KWD, KRW",
    paymentAccepted: "Bank Wire (T/T), Letter of Credit (L/C)",
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.4812,
      longitude: 126.8827,
    },
    areaServed: [
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Qatar" },
      { "@type": "Country", name: "Kuwait" },
      { "@type": "Country", name: "Oman" },
      { "@type": "Country", name: "Bahrain" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Netherlands" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Jordan" },
      { "@type": "Country", name: "Iraq" },
    ],
    brand: [
      { "@type": "Brand", name: "Genesis" },
      { "@type": "Brand", name: "Hyundai" },
      { "@type": "Brand", name: "Kia" },
      { "@type": "Brand", name: "BMW" },
      { "@type": "Brand", name: "Mercedes-Benz" },
      { "@type": "Brand", name: "Porsche" },
      { "@type": "Brand", name: "Audi" },
    ],
    knowsAbout: [
      "Encar vehicle inspection",
      "KB ChaChaCha certified used cars",
      "K-Car export",
      "Roll-on/Roll-off ocean shipping",
      "South Korea vehicle export customs clearance",
      "150-Point vehicle quality diagnosis",
    ],
    sameAs: [
      "https://www.wikidata.org/wiki/Q11286536",
    ],
  };
}

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
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
      "@id": `${getSiteUrl()}/#website`,
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
    id?: string;
    title: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    durresPrice?: number | null;
    imageUrl?: string;
    source?: string;
  };
  url: string;
}): JsonLdObject {
  const sourceName = car.source === "kbchachacha" ? "KB ChaChaCha" : car.source === "kcar" ? "K-Car" : "Encar";

  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Car"],
    name: car.title,
    image: car.imageUrl,
    description: `Verified ${car.make} ${car.model} ${car.year} sourced directly from ${sourceName} South Korea. Inspected with 150-point diagnostic certification, Mileage: ${car.mileage.toLocaleString()} km, Transmission: ${car.transmission}, Fuel: ${car.fuelType}. Worldwide Ro-Ro ocean shipping available.`,
    brand: {
      "@type": "Brand",
      name: car.make,
    },
    model: car.model,
    productionDate: String(car.year),
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(url),
      priceCurrency: "USD",
      price: car.durresPrice || "24000",
      itemCondition: "https://schema.org/UsedCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: siteConfig.legalName,
      },
    },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; item: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.item),
    })),
  };
}
