"use client";

import { HeroSection } from "@/components/ui/hero-section";
import { Icons } from "@/components/ui/icons";

export function HeroSectionDemo() {
  return (
    <HeroSection
      badge={{
        text: "Introducing YaatraSarthi",
        action: {
          text: "Learn more",
          href: "/dashboard",
        },
      }}
      title="Your Spiritual Journey Companion"
      description="Experience Ujjain like never before with our gamified tourism platform. Earn Punya Points for eco-friendly actions, cultural engagement, and community service while exploring the sacred city."
      actions={[
        {
          text: "Start Your Journey",
          href: "/dashboard",
          variant: "default",
        },
        {
          text: "View Leaderboard",
          href: "/leaderboard",
          variant: "glow",
          icon: <Icons.gitHub className="h-5 w-5" />,
        },
      ]}
      image={{
        light:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1248&h=765&fit=crop&crop=center",
        dark: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1248&h=765&fit=crop&crop=center&sat=-50&brightness=0.3",
        alt: "Ujjain Temple and Spiritual Journey",
      }}
    />
  );
}
