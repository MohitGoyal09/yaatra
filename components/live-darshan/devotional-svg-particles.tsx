"use client";

import { useEffect, useState, useRef } from "react";

interface SVGParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: string;
  svg: string;
}

interface DevotionalSVGParticlesProps {
  effect: string | null;
  intensity?: "low" | "medium" | "high";
}

// Custom SVG definitions for devotional elements
const DEVOTIONAL_SVGS = {
  diya: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Diya base -->
    <ellipse cx="16" cy="28" rx="12" ry="4" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
    <ellipse cx="16" cy="26" rx="10" ry="3" fill="#FFA500"/>
    
    <!-- Diya body -->
    <path d="M8 26 Q8 20 16 20 Q24 20 24 26 L24 28 Q24 30 16 30 Q8 30 8 28 Z" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
    
    <!-- Flame -->
    <path d="M16 18 Q14 12 16 8 Q18 12 16 18" fill="#FF6B35" opacity="0.9"/>
    <path d="M16 18 Q15 14 16 10 Q17 14 16 18" fill="#FFD700" opacity="0.8"/>
    <path d="M16 18 Q15.5 15 16 12 Q16.5 15 16 18" fill="#FFFFFF" opacity="0.6"/>
    
    <!-- Wick -->
    <rect x="15.5" y="18" width="1" height="2" fill="#8B4513"/>
  </svg>`,

  agarbati: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Incense stick -->
    <rect x="15" y="8" width="2" height="20" fill="#8B4513"/>
    
    <!-- Base -->
    <ellipse cx="16" cy="30" rx="3" ry="2" fill="#654321"/>
    
    <!-- Smoke particles -->
    <circle cx="16" cy="6" r="1.5" fill="#E5E5E5" opacity="0.7"/>
    <circle cx="14" cy="4" r="1" fill="#F0F0F0" opacity="0.6"/>
    <circle cx="18" cy="3" r="0.8" fill="#D0D0D0" opacity="0.5"/>
    <circle cx="17" cy="1" r="0.6" fill="#B0B0B0" opacity="0.4"/>
    
    <!-- Glowing tip -->
    <circle cx="16" cy="6" r="2" fill="#FFD700" opacity="0.3"/>
  </svg>`,

  bell: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Bell body -->
    <path d="M16 4 C12 4 8 6 8 10 L8 18 C8 20 10 22 12 24 L20 24 C22 22 24 20 24 18 L24 10 C24 6 20 4 16 4 Z" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
    
    <!-- Bell clapper -->
    <circle cx="16" cy="26" r="2" fill="#8B4513"/>
    <rect x="15.5" y="24" width="1" height="4" fill="#654321"/>
    
    <!-- Bell handle -->
    <rect x="15" y="2" width="2" height="4" fill="#FFA500"/>
    <rect x="14" y="1" width="4" height="2" fill="#FFD700"/>
    
    <!-- Decorative lines -->
    <path d="M10 12 L22 12" stroke="#FFA500" stroke-width="1"/>
    <path d="M11 16 L21 16" stroke="#FFA500" stroke-width="1"/>
  </svg>`,

  conch: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Conch shell body -->
    <path d="M16 4 C20 4 24 8 24 12 C24 16 20 20 16 20 C12 20 8 16 8 12 C8 8 12 4 16 4 Z" fill="#FFFFFF" stroke="#E0E0E0" stroke-width="1"/>
    
    <!-- Inner spiral -->
    <path d="M16 8 C18 8 20 10 20 12 C20 14 18 16 16 16 C14 16 12 14 12 12 C12 10 14 8 16 8 Z" fill="#F0F0F0"/>
    
    <!-- Spiral lines -->
    <path d="M16 10 Q18 10 18 12 Q18 14 16 14 Q14 14 14 12 Q14 10 16 10" stroke="#D0D0D0" stroke-width="0.5" fill="none"/>
    
    <!-- Opening -->
    <ellipse cx="16" cy="20" rx="4" ry="2" fill="#E8E8E8"/>
    
    <!-- Glow effect -->
    <circle cx="16" cy="12" r="8" fill="#FFFFFF" opacity="0.1"/>
  </svg>`,

  tulsi: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Main stem -->
    <rect x="15.5" y="8" width="1" height="20" fill="#22C55E"/>
    
    <!-- Leaves -->
    <ellipse cx="12" cy="12" rx="4" ry="2" fill="#16A34A" transform="rotate(-30 12 12)"/>
    <ellipse cx="20" cy="14" rx="4" ry="2" fill="#16A34A" transform="rotate(30 20 14)"/>
    <ellipse cx="10" cy="18" rx="3" ry="1.5" fill="#15803D" transform="rotate(-45 10 18)"/>
    <ellipse cx="22" cy="20" rx="3" ry="1.5" fill="#15803D" transform="rotate(45 22 20)"/>
    <ellipse cx="14" cy="24" rx="3" ry="1.5" fill="#166534" transform="rotate(-20 14 24)"/>
    <ellipse cx="18" cy="26" rx="3" ry="1.5" fill="#166534" transform="rotate(20 18 26)"/>
    
    <!-- Small leaves -->
    <ellipse cx="13" cy="10" rx="2" ry="1" fill="#22C55E" transform="rotate(-15 13 10)"/>
    <ellipse cx="19" cy="12" rx="2" ry="1" fill="#22C55E" transform="rotate(15 19 12)"/>
    
    <!-- Base -->
    <ellipse cx="16" cy="30" rx="6" ry="2" fill="#14532D"/>
  </svg>`,

  marigold: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer petals -->
    <ellipse cx="16" cy="16" rx="12" ry="8" fill="#F59E0B" transform="rotate(0 16 16)"/>
    <ellipse cx="16" cy="16" rx="12" ry="8" fill="#D97706" transform="rotate(30 16 16)"/>
    <ellipse cx="16" cy="16" rx="12" ry="8" fill="#F59E0B" transform="rotate(60 16 16)"/>
    <ellipse cx="16" cy="16" rx="12" ry="8" fill="#D97706" transform="rotate(90 16 16)"/>
    <ellipse cx="16" cy="16" rx="12" ry="8" fill="#F59E0B" transform="rotate(120 16 16)"/>
    <ellipse cx="16" cy="16" rx="12" ry="8" fill="#D97706" transform="rotate(150 16 16)"/>
    
    <!-- Inner petals -->
    <ellipse cx="16" cy="16" rx="8" ry="5" fill="#FBBF24" transform="rotate(15 16 16)"/>
    <ellipse cx="16" cy="16" rx="8" ry="5" fill="#F59E0B" transform="rotate(45 16 16)"/>
    <ellipse cx="16" cy="16" rx="8" ry="5" fill="#FBBF24" transform="rotate(75 16 16)"/>
    <ellipse cx="16" cy="16" rx="8" ry="5" fill="#F59E0B" transform="rotate(105 16 16)"/>
    <ellipse cx="16" cy="16" rx="8" ry="5" fill="#FBBF24" transform="rotate(135 16 16)"/>
    <ellipse cx="16" cy="16" rx="8" ry="5" fill="#F59E0B" transform="rotate(165 16 16)"/>
    
    <!-- Center -->
    <circle cx="16" cy="16" r="4" fill="#92400E"/>
    <circle cx="16" cy="16" r="2" fill="#451A03"/>
    
    <!-- Stem -->
    <rect x="15.5" y="24" width="1" height="6" fill="#22C55E"/>
  </svg>`,

  thali: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Thali base -->
    <ellipse cx="16" cy="28" rx="14" ry="4" fill="#C0C0C0" stroke="#A0A0A0" stroke-width="1"/>
    
    <!-- Thali rim -->
    <ellipse cx="16" cy="26" rx="12" ry="3" fill="#E0E0E0"/>
    <ellipse cx="16" cy="25" rx="10" ry="2" fill="#F0F0F0"/>
    
    <!-- Inner offerings -->
    <circle cx="12" cy="20" r="2" fill="#FFD700"/>
    <circle cx="20" cy="18" r="1.5" fill="#FFA500"/>
    <circle cx="14" cy="16" r="1" fill="#22C55E"/>
    <circle cx="18" cy="22" r="1.2" fill="#D97706"/>
    <circle cx="16" cy="14" r="1.5" fill="#F59E0B"/>
    
    <!-- Decorative border -->
    <circle cx="16" cy="25" r="10" fill="none" stroke="#D0D0D0" stroke-width="0.5"/>
  </svg>`,

  lotus: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer petals -->
    <ellipse cx="16" cy="16" rx="10" ry="6" fill="#FFB6C1" transform="rotate(0 16 16)"/>
    <ellipse cx="16" cy="16" rx="10" ry="6" fill="#FFC0CB" transform="rotate(45 16 16)"/>
    <ellipse cx="16" cy="16" rx="10" ry="6" fill="#FFB6C1" transform="rotate(90 16 16)"/>
    <ellipse cx="16" cy="16" rx="10" ry="6" fill="#FFC0CB" transform="rotate(135 16 16)"/>
    <ellipse cx="16" cy="16" rx="10" ry="6" fill="#FFB6C1" transform="rotate(180 16 16)"/>
    <ellipse cx="16" cy="16" rx="10" ry="6" fill="#FFC0CB" transform="rotate(225 16 16)"/>
    <ellipse cx="16" cy="16" rx="10" ry="6" fill="#FFB6C1" transform="rotate(270 16 16)"/>
    <ellipse cx="16" cy="16" rx="10" ry="6" fill="#FFC0CB" transform="rotate(315 16 16)"/>
    
    <!-- Inner petals -->
    <ellipse cx="16" cy="16" rx="6" ry="4" fill="#FFFFFF" transform="rotate(22.5 16 16)"/>
    <ellipse cx="16" cy="16" rx="6" ry="4" fill="#FFF0F5" transform="rotate(67.5 16 16)"/>
    <ellipse cx="16" cy="16" rx="6" ry="4" fill="#FFFFFF" transform="rotate(112.5 16 16)"/>
    <ellipse cx="16" cy="16" rx="6" ry="4" fill="#FFF0F5" transform="rotate(157.5 16 16)"/>
    <ellipse cx="16" cy="16" rx="6" ry="4" fill="#FFFFFF" transform="rotate(202.5 16 16)"/>
    <ellipse cx="16" cy="16" rx="6" ry="4" fill="#FFF0F5" transform="rotate(247.5 16 16)"/>
    <ellipse cx="16" cy="16" rx="6" ry="4" fill="#FFFFFF" transform="rotate(292.5 16 16)"/>
    <ellipse cx="16" cy="16" rx="6" ry="4" fill="#FFF0F5" transform="rotate(337.5 16 16)"/>
    
    <!-- Center -->
    <circle cx="16" cy="16" r="3" fill="#FFD700"/>
    <circle cx="16" cy="16" r="1.5" fill="#FFA500"/>
    
    <!-- Stem -->
    <rect x="15.5" y="22" width="1" height="8" fill="#22C55E"/>
  </svg>`
};

const getParticleCount = (intensity: "low" | "medium" | "high") => {
  switch (intensity) {
    case "low": return 8;
    case "medium": return 15;
    case "high": return 25;
    default: return 15;
  }
};

export function DevotionalSVGParticles({ 
  effect, 
  intensity = "medium" 
}: DevotionalSVGParticlesProps) {
  const [particles, setParticles] = useState<SVGParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!effect || !DEVOTIONAL_SVGS[effect as keyof typeof DEVOTIONAL_SVGS]) {
      setParticles([]);
      return;
    }

    const particleCount = getParticleCount(intensity);
    const newParticles: SVGParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 16, // Size between 24 and 40
        duration: 3 + Math.random() * 2, // Duration between 3s and 5s
        delay: Math.random() * 0.5, // Delay up to 0.5s
        type: effect,
        svg: DEVOTIONAL_SVGS[effect as keyof typeof DEVOTIONAL_SVGS],
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 6000); // Clear after max duration

    return () => clearTimeout(timer);
  }, [effect, intensity]);

  if (!effect || particles.length === 0) return null;

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none z-30"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute devotional-svg-particle ${particle.type}-animation`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
          dangerouslySetInnerHTML={{ __html: particle.svg }}
        />
      ))}
    </div>
  );
}

