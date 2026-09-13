import HeroSection from "@/components/home/hero/HeroSection";
import BrandLogosBar from "@/components/home/BrandLogosBar";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ResearchInsights from "@/components/home/ResearchInsights";
import MyKoryoInventory from "@/components/inventory/MyKoryoInventory";
import AboutSection from "@/components/home/AboutSection";
import ShippingCalculator from "@/components/calculator/ShippingCalculator";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/cta/CtaSection";
import SourcingWizard from "@/components/inventory/SourcingWizard";
import { buildPageMetadata, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Advanced Koryo | Direct South Korean Vehicle Sourcing & Export";
const description =
  "Advanced Koryo (mykoryo.com) provides 100% verified South Korean vehicle sourcing, 150-Point inspection, direct Ro-Ro ocean freight, and weekly progress reporting for international buyers.";

export const metadata = buildPageMetadata({
  title,
  description,
  path: "/",
});

const HOME_FAQS = [
  {
    question: "How do I search and buy cars directly from Encar (엔카) and KB ChaChaCha (KB차차차)?",
    answer: "Advanced Koryo serves as your direct licensed sourcing partner and exporter in Seoul. You can browse live verified inventory from both Encar and KB ChaChaCha directly on our platform. Once you select a vehicle, our Seoul inspection team visits the vehicle, performs a 150-point diagnostic audit with paint-depth measurement, negotiates the dealer price, manages export de-registration, and arranges Ro-Ro shipping directly to your destination port.",
  },
  {
    question: "What is the difference between Encar and KB ChaChaCha used car inventories?",
    answer: "Encar (엔카) is South Korea's largest automotive marketplace with over 150,000 active listings, featuring official Encar Trust Diagnosis and insurance accident databases. KB ChaChaCha (KB차차차) is operated by KB Financial Group, renowned for verified odometer records, direct dealer stock, and strict financial verification. Advanced Koryo aggregates both feeds into a single unified search with transparent pricing and global shipping estimates.",
  },
  {
    question: "Can international buyers import Encar and KB ChaChaCha cars to Saudi Arabia, UAE, and GCC countries?",
    answer: "Yes. We regularly export vehicles to Jeddah Islamic Port, Jebel Ali (Dubai), Dammam, Hamad (Qatar), and Shuwaikh (Kuwait). We provide complete certified Korean Export Certificates, SASO / GCC conformity compliance documentation, Bill of Lading, and commercial invoices to guarantee seamless customs clearance.",
  },
  {
    question: "How does the direct vehicle sourcing process work?",
    answer: "You submit your vehicle requirements (make, model, trim, budget, and destination port). Our local export agents in Seoul inspect Encar listings and local dealer networks, verify the condition, perform a 150-point quality audit, and send you a video walkaround. Upon agreement, we secure the vehicle, handle export paperwork, and ship it directly to your target port.",
  },
  {
    question: "What does the 150-Point Quality Inspection cover?",
    answer: "Every vehicle undergoes a professional diagnostic audit. This includes engine compression tests, chassis/frame structure diagnostics (ensuring 0% structural damage), paint depth verification (to check for accidents/repaints), transmission diagnostics, electrical systems audit, and undercarriage rust check. We send you the verified inspection report and walkaround video before final purchase.",
  },
  {
    question: "What is the shipping time and transit route to my destination?",
    answer: "We ship all vehicles via Ro-Ro (Roll-on/Roll-off) vessels or container freight. Estimated transit times for GCC ports (Jeddah, Jebel Ali, Hamad, Shuwaikh) are typically 14 to 22 days. Shipping to Europe (Bremerhaven, Rotterdam) takes 34 to 40 days. All vehicles are fully insured during transit.",
  },
  {
    question: "Are there any custom duties, VAT, or local clearance taxes?",
    answer: "Yes, import customs regulations apply. For GCC countries, there is a standard 5% customs duty. Local VAT varies (e.g., 15% in Saudi Arabia, 5% in UAE). Our built-in Shipping Calculator provides clear estimates for your target port. We supply the complete export certificate, commercial invoice, and bill of lading to ensure smooth customs clearance.",
  },
  {
    question: "Can I track my vehicle sourcing and export stages?",
    answer: "Absolutely. Advanced Koryo provides weekly progress tracking. Once your sourcing starts, you will receive a unique tracking ID/VIN. You can enter it on our Client Progress Report portal to monitor the real-time status of your vehicle across 5 stages: Sourced & Secured, Export Certificate Issued, Port Deposited, Vessel Loaded, and Ocean Transit.",
  },
];

export default function Home() {
  const faqSchema = faqJsonLd(HOME_FAQS);
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", item: "/" }
  ]);

  return (
    <main className="bg-white dark:bg-[#020a18] min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <HeroSection />
      
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 py-6">
        <SourcingWizard />
      </div>

      <BrandLogosBar />

      <MyKoryoInventory />
      <WhyChooseUs />
      <ResearchInsights />
      <AboutSection />
      <ShippingCalculator />
      <FAQSection />
      <CTASection />
    </main>
  );
}
