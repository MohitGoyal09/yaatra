import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-56px)] overflow-hidden">
      <main>
        <Hero />
        <Features />
        <Testimonials />
      </main>
    </div>
  );
}
