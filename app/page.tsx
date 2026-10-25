import CatalogClient from "@/components/catalog/CatalogClient";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Direct Korean Vehicle Catalog | Encar Certified Export | Advanced Koryo";
const description =
  "Official direct vehicle catalog for catalog.hisdomain.com featuring 120,000+ Encar certified Korean vehicles: Genesis, Hyundai, Kia, BMW, Mercedes-Benz. 150-Point diagnostic audit, transparent FOB pricing, and direct Ro-Ro shipping to Saudi Arabia, UAE, Qatar, Kuwait, and worldwide.";

export const metadata = buildPageMetadata({
  title,
  description,
  path: "/",
});

export default function Home() {
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Encar Catalog", item: "/" },
  ]);

  return (
    <main className="bg-white dark:bg-[#020a18] min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CatalogClient />
    </main>
  );
}
