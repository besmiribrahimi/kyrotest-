import ShippingCalculator from "@/components/calculator/ShippingCalculator";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Sea & Land Freight Calculator | Advanced Koryo",
  description: "Calculate standard Ro-Ro shipping, local customs duty (5% GCC), and estimated import taxes from South Korea to your destination port.",
  path: "/shipping-calculator",
});

export default function ShippingCalculatorPage() {
  return <ShippingCalculator />;
}
