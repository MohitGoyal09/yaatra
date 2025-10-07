"use client";

import { useEffect, useState } from "react";

interface ParticleEffectsProps {
  effect: string | null;
  intensity?: "low" | "medium" | "high";
}

export function ParticleEffects({
  effect,
  intensity = "medium",
}: ParticleEffectsProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      type: string;
      delay: number;
      size: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    if (!effect) {
      setParticles([]);
      return;
    }

    const particleCount =
      intensity === "low" ? 15 : intensity === "medium" ? 25 : 40;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: effect,
      delay: Math.random() * 2,
      size: 0.8 + Math.random() * 0.4,
      duration: 2 + Math.random() * 2,
    }));

    setParticles(newParticles);

    // Clear particles after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [effect, intensity]);

  if (!effect || particles.length === 0) return null;

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          type={particle.type}
          delay={particle.delay}
          size={particle.size}
          duration={particle.duration}
        />
      ))}
    </div>
  );
}

function Particle({
  x,
  y,
  type,
  delay,
  size,
  duration,
}: {
  x: number;
  y: number;
  type: string;
  delay: number;
  size: number;
  duration: number;
}) {
  const getParticleConfig = (effectType: string) => {
    switch (effectType) {
      case "prayer":
        return {
          emoji: "🙏",
          color: "text-purple-300",
          animation: "prayer-float",
          baseSize: "text-2xl",
        };
      case "offering":
        return {
          emoji: "🌸",
          color: "text-pink-300",
          animation: "lotus-fall",
          baseSize: "text-xl",
        };
      case "bell":
        return {
          emoji: "🔔",
          color: "text-yellow-300",
          animation: "bell-ring",
          baseSize: "text-2xl",
        };
      case "share":
        return {
          emoji: "✨",
          color: "text-yellow-300",
          animation: "sparkle-rise",
          baseSize: "text-lg",
        };
      case "watching":
        return {
          emoji: "💫",
          color: "text-blue-300",
          animation: "gentle-float",
          baseSize: "text-sm",
        };
      case "diya":
        return {
          emoji: "🪔",
          color: "text-orange-300",
          animation: "diya-flame",
          baseSize: "text-xl",
        };
      case "conch":
        return {
          emoji: "🐚",
          color: "text-white",
          animation: "conch-glow",
          baseSize: "text-lg",
        };
      case "marigold":
        return {
          emoji: "🌼",
          color: "text-orange-400",
          animation: "marigold-bloom",
          baseSize: "text-lg",
        };
      case "tulsi":
        return {
          emoji: "🌿",
          color: "text-green-300",
          animation: "tulsi-rustle",
          baseSize: "text-sm",
        };
      case "thali":
        return {
          emoji: "🥘",
          color: "text-yellow-200",
          animation: "thali-shine",
          baseSize: "text-lg",
        };
      default:
        return {
          emoji: "✨",
          color: "text-yellow-300",
          animation: "sparkle-rise",
          baseSize: "text-lg",
        };
    }
  };

  const config = getParticleConfig(type);

  return (
    <div
      className={`floating-element ${config.color} ${config.animation}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        animationFillMode: "both",
        fontSize: `${size}rem`,
        filter: `drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))`,
      }}
    >
      {config.emoji}
    </div>
  );
}

// Lotus Petals Effect Component
export function LotusPetalEffect({ active }: { active: boolean }) {
  const [petals, setPetals] = useState<
    Array<{
      id: number;
      x: number;
      rotation: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    if (!active) {
      setPetals([]);
      return;
    }

    const newPetals = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      rotation: Math.random() * 360,
      delay: Math.random() * 2,
    }));

    setPetals(newPetals);

    const timer = setTimeout(() => {
      setPetals([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active || petals.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute text-pink-200 text-lg lotus-petal-fall"
          style={{
            left: `${petal.x}%`,
            top: "-10%",
            transform: `rotate(${petal.rotation}deg)`,
            animationDelay: `${petal.delay}s`,
            animationDuration: "4s",
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
}

// Punya Points Animation Component
export function PunyaPointsAnimation({
  points,
  active,
}: {
  points: number;
  active: boolean;
}) {
  const [animations, setAnimations] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
    }>
  >([]);

  useEffect(() => {
    if (!active) {
      setAnimations([]);
      return;
    }

    const newAnimations = Array.from(
      { length: Math.min(points, 10) },
      (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 40,
        y: 50 + (Math.random() - 0.5) * 40,
      })
    );

    setAnimations(newAnimations);

    const timer = setTimeout(() => {
      setAnimations([]);
    }, 2000);

    return () => clearTimeout(timer);
  }, [points, active]);

  if (!active || animations.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {animations.map((anim) => (
        <div
          key={anim.id}
          className="absolute text-yellow-400 font-bold text-lg punya-rise"
          style={{
            left: `${anim.x}%`,
            top: `${anim.y}%`,
            animationDelay: `${anim.id * 0.1}s`,
          }}
        >
          +{points}
        </div>
      ))}
    </div>
  );
}

// Spiritual Glow Effect
export function SpiritualGlow({
  active,
  color = "yellow",
}: {
  active: boolean;
  color?: string;
}) {
  if (!active) return null;

  const colorClasses = {
    yellow: "from-yellow-400/30 to-transparent",
    purple: "from-purple-400/30 to-transparent",
    pink: "from-pink-400/30 to-transparent",
    blue: "from-blue-400/30 to-transparent",
  };

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-t ${
        colorClasses[color as keyof typeof colorClasses]
      } spiritual-pulse`}
    />
  );
}
