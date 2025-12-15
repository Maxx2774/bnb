import { HeroSection } from "@/components/hero-section";
import { PropertyGrid } from "@/components/property-grid";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection />
      <PropertyGrid />
    </div>
  );
}
