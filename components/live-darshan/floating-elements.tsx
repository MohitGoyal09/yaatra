"use client";

import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  type: string;
  delay: number;
  duration: number;
  size: number;
  animation?: string;
}

export function FloatingLeaves() {
  const [leaves, setLeaves] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const leafTypes = ["🌿", "🍃", "🌱", "🌾"];
    const newLeaves = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: leafTypes[Math.floor(Math.random() * leafTypes.length)],
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 4,
      size: 0.8 + Math.random() * 0.6,
    }));

    setLeaves(newLeaves);
  }, []);

  return (
    <div className="floating-element">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="floating-leaves"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            fontSize: `${leaf.size}rem`,
            opacity: 0.6,
          }}
        >
          {leaf.type}
        </div>
      ))}
    </div>
  );
}

export function DevotionalIcons() {
  const [icons, setIcons] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const iconTypes = [
      { emoji: "🪔", animation: "diya-flame" },
      { emoji: "🔔", animation: "bell-swing" },
      { emoji: "🐚", animation: "conch-glow" },
      { emoji: "🌼", animation: "marigold-bloom" },
      { emoji: "🌿", animation: "tulsi-rustle" },
      { emoji: "🥘", animation: "thali-shine" },
    ];

    const newIcons = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 10 + (i % 3) * 30 + Math.random() * 20,
      y: 80 + Math.random() * 15,
      type: iconTypes[i].emoji,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      size: 1.2 + Math.random() * 0.4,
      animation: iconTypes[i].animation,
    }));

    setIcons(newIcons);
  }, []);

  return (
    <div className="floating-element">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className={`${icon.animation || ""} devotional-icon`}
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            animationDelay: `${icon.delay}s`,
            animationDuration: `${icon.duration}s`,
            fontSize: `${icon.size}rem`,
            filter: `drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))`,
          }}
        >
          {icon.type}
        </div>
      ))}
    </div>
  );
}

export function AmbientParticles() {
  const [particles, setParticles] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const particleTypes = ["✨", "💫", "⭐", "🌟"];
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 3,
      size: 0.5 + Math.random() * 0.5,
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="floating-element">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="gentle-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            fontSize: `${particle.size}rem`,
            opacity: 0.4,
          }}
        >
          {particle.type}
        </div>
      ))}
    </div>
  );
}

export function VideoOverlayEffects() {
  return (
    <div className="video-overlay">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

      {/* Ambient glow */}
      <div className="absolute inset-0 spiritual-pulse" />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-white/20 text-2xl floating-leaves">
        🕉️
      </div>
      <div className="absolute top-4 right-4 text-white/20 text-2xl floating-leaves">
        ॐ
      </div>
      <div className="absolute bottom-4 left-4 text-white/20 text-xl floating-leaves">
        🌸
      </div>
      <div className="absolute bottom-4 right-4 text-white/20 text-xl floating-leaves">
        🪔
      </div>
    </div>
  );
}
