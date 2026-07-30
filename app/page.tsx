import HeroSection from "@/components/home/hero/HeroSection";
import BrandLogosBar from "@/components/home/BrandLogosBar";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import MyKoryoInventory from "@/components/inventory/MyKoryoInventory";
import AboutSection from "@/components/home/AboutSection";
import ShippingCalculator from "@/components/calculator/ShippingCalculator";
import CTASection from "@/components/cta/CtaSection";
import SourcingWizard from "@/components/inventory/SourcingWizard";
import { buildPageMetadata } from "@/lib/seo";

const title = "Advanced Koryo | Direct South Korean Vehicle Sourcing & Export";
const description =
  "Advanced Koryo (mykoryo.com) provides 100% verified South Korean vehicle sourcing, 150-Point inspection, direct Ro-Ro ocean freight, and weekly progress reporting for international buyers.";

export const metadata = buildPageMetadata({
  title,
  description,
  path: "/",
});

export default function Home() {
  return (
    <main className="bg-white dark:bg-[#020a18] min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
      <HeroSection />
      
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 py-6">
        <SourcingWizard />
      </div>

      <BrandLogosBar />

      <MyKoryoInventory />
      <WhyChooseUs />
      <AboutSection />
      <ShippingCalculator />
      <CTASection />
    </main>
  );
}
