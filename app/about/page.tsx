import AboutSection from "@/components/home/AboutSection";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About Advanced Koryo | Official South Korean Vehicle Exporter",
  description: "Learn more about Advanced Koryo, a licensed direct vehicle exporter headquartered in Seoul, South Korea. We serve individual buyers and dealerships worldwide.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutSection />;
}
