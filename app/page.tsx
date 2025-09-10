import { HeroSectionDemo } from "@/components/hero-section-demo";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-56px)] overflow-hidden">
      <main>
        <HeroSectionDemo />
        <Features />
        <Testimonials />
      </main>
    </div>
  );
}
