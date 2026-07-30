import MyKoryoInventory from "@/components/inventory/MyKoryoInventory";
import SourcingWizard from "@/components/inventory/SourcingWizard";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Verified Korean Vehicle Inventory | Advanced Koryo",
  description: "Browse our live sourced inventory of Genesis, Hyundai, Kia, and other premium Korean vehicles ready for export from South Korea.",
  path: "/inventory",
});

export default function InventoryPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#020a18] min-h-screen py-10 transition-colors duration-300">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 mb-6">
        <SourcingWizard />
      </div>
      <MyKoryoInventory />
    </div>
  );
}
