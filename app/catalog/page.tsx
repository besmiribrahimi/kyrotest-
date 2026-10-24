import CatalogClient from "@/components/catalog/CatalogClient";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Direct Korean Vehicle Catalog | Official Encar Export | Advanced Koryo",
  description:
    "Instant direct export catalog of verified Korean vehicles: Genesis, Hyundai, Kia, BMW, Mercedes-Benz. 150-Point inspection certified, FOB pricing, and direct WhatsApp consultation & Ro-Ro shipping to Saudi Arabia, UAE, Qatar, Kuwait, and worldwide.",
  path: "/catalog",
});

export default function CatalogPage() {
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Export Catalog", item: "/catalog" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CatalogClient />
    </>
  );
}
