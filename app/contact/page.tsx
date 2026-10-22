import ContactPageClient from "@/components/contact/ContactPageClient";
import { buildPageMetadata, webPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact Advanced Koryo | Sourcing & Logistics in Seoul",
  description: "Get in touch with Advanced Koryo's vehicle sourcing and export specialists in Seoul. Secure verified cars with direct Ro-Ro shipping and customs assistance.",
  path: "/contact",
});

export default function ContactPage() {
  const contactSchema = webPageJsonLd({
    title: "Contact Advanced Koryo | Official South Korean Vehicle Exporter",
    description: "Contact details, address, email, WhatsApp, and interactive vehicle inquiry form for Advanced Koryo in Seoul, South Korea.",
    path: "/contact",
  });

  const breadcrumbsSchema = breadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Contact", item: "/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ContactPageClient />
    </>
  );
}
