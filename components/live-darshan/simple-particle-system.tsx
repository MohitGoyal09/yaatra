"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  type: string;
}

interface SimpleParticleSystemProps {
  type: "leaves" | "agarbati" | "devotional" | "ambient" | "celebration";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function SimpleParticleSystem({
  type,
  intensity = "medium",
  className = "",
}: SimpleParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleCount = getParticleCount(intensity);
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: getParticleSize(type),
        color: getParticleColor(type),
        duration: getParticleDuration(type),
        delay: Math.random() * 2,
        type: type,
      });
    }

    setParticles(newParticles);

    // Cleanup particles after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 8000);

    return () => clearTimeout(timer);
  }, [type, intensity]);

  const getParticleCount = (intensity: string) => {
    switch (intensity) {
      case "low":
        return type === "leaves"
          ? 15
          : type === "agarbati"
          ? 10
          : type === "celebration"
          ? 20
          : 25;
      case "medium":
        return type === "leaves"
          ? 30
          : type === "agarbati"
          ? 20
          : type === "celebration"
          ? 40
          : 50;
      case "high":
        return type === "leaves"
          ? 50
          : type === "agarbati"
          ? 35
          : type === "celebration"
          ? 80
          : 100;
      default:
        return 30;
    }
  };

  const getParticleSize = (type: string) => {
    switch (type) {
      case "leaves":
        return 2 + Math.random() * 4;
      case "agarbati":
        return 1 + Math.random() * 2;
      case "devotional":
        return 2 + Math.random() * 3;
      case "ambient":
        return 1 + Math.random() * 2;
      case "celebration":
        return 3 + Math.random() * 4;
      default:
        return 2;
    }
  };

  const getParticleColor = (type: string) => {
    const colors = {
      leaves: ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"],
      agarbati: ["#f59e0b", "#d97706", "#92400e", "#78350f", "#451a03"],
      devotional: [
        "#fbbf24",
        "#f59e0b",
        "#d97706",
        "#92400e",
        "#22c55e",
        "#16a34a",
      ],
      ambient: ["#ffffff", "#f3f4f6", "#e5e7eb"],
      celebration: [
        "#fbbf24",
        "#f59e0b",
        "#d97706",
        "#92400e",
        "#22c55e",
        "#16a34a",
        "#dc2626",
        "#7c3aed",
      ],
    };

    const typeColors = colors[type as keyof typeof colors] || colors.ambient;
    return typeColors[Math.floor(Math.random() * typeColors.length)];
  };

  const getParticleDuration = (type: string) => {
    switch (type) {
      case "leaves":
        return 4 + Math.random() * 2;
      case "agarbati":
        return 3 + Math.random() * 2;
      case "devotional":
        return 3 + Math.random() * 2;
      case "ambient":
        return 5 + Math.random() * 3;
      case "celebration":
        return 2 + Math.random() * 2;
      default:
        return 3;
    }
  };

  const getAnimationClass = (type: string) => {
    switch (type) {
      case "leaves":
        return "animate-leaves-fall";
      case "agarbati":
        return "animate-agarbati-rise";
      case "devotional":
        return "animate-devotional-float";
      case "ambient":
        return "animate-ambient-float";
      case "celebration":
        return "animate-celebration-burst";
      default:
        return "animate-ambient-float";
    }
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${getAnimationClass(particle.type)}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: particle.type === "leaves" ? "50% 0" : "50%",
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: particle.type === "ambient" ? 0.3 : 0.7,
            transform: `rotate(${Math.random() * 360}deg)`,
            boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
          }}
        />
      ))}
    </div>
  );
}

// Specialized particle components
export function LeavesParticles({
  intensity = "medium",
}: {
  intensity?: "low" | "medium" | "high";
}) {
  return (
    <SimpleParticleSystem
      type="leaves"
      intensity={intensity}
      className="z-10"
    />
  );
}

export function AgarbatiParticles({
  intensity = "medium",
}: {
  intensity?: "low" | "medium" | "high";
}) {
  return (
    <SimpleParticleSystem
      type="agarbati"
      intensity={intensity}
      className="z-10"
    />
  );
}

export function DevotionalParticles({
  intensity = "medium",
}: {
  intensity?: "low" | "medium" | "high";
}) {
  return (
    <SimpleParticleSystem
      type="devotional"
      intensity={intensity}
      className="z-10"
    />
  );
}

export function AmbientParticles({
  intensity = "medium",
}: {
  intensity?: "low" | "medium" | "high";
}) {
  return (
    <SimpleParticleSystem
      type="ambient"
      intensity={intensity}
      className="z-5"
    />
  );
}

export function CelebrationParticles({
  intensity = "high",
}: {
  intensity?: "low" | "medium" | "high";
}) {
  return (
    <SimpleParticleSystem
      type="celebration"
      intensity={intensity}
      className="z-20"
    />
  );
}
