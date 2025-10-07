"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface InteractiveSVGElementsProps {
  className?: string;
}

export const InteractiveSVGElements: React.FC<InteractiveSVGElementsProps> = ({
  className,
}) => {
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [flameIntensity, setFlameIntensity] = useState(1);
  const [prayerMode, setPrayerMode] = useState(false);

  // Auto-animate flame intensity
  useEffect(() => {
    const interval = setInterval(() => {
      setFlameIntensity(Math.random() * 0.4 + 0.8); // Random between 0.8 and 1.2
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleElementClick = (elementId: string) => {
    setActiveElement(elementId);
    if (elementId === "diya") {
      setPrayerMode(true);
      setTimeout(() => setPrayerMode(false), 3000);
    }
    setTimeout(() => setActiveElement(null), 2000);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 p-2", className)}>
      {/* Main Diya (Oil Lamp) */}
      <div
        className="relative cursor-pointer group"
        onClick={() => handleElementClick("diya")}
      >
        <svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          className={cn(
            "transition-all duration-300",
            activeElement === "diya" && "animate-pulse",
            prayerMode && "diya-flame"
          )}
        >
          {/* Diya Base */}
          <ellipse
            cx="60"
            cy="120"
            rx="35"
            ry="12"
            fill="#8B4513"
            className="transition-all duration-300 group-hover:fill-amber-700"
          />

          {/* Diya Body */}
          <ellipse
            cx="60"
            cy="100"
            rx="28"
            ry="20"
            fill="#CD853F"
            className="transition-all duration-300 group-hover:fill-amber-600"
          />

          {/* Diya Rim */}
          <ellipse
            cx="60"
            cy="85"
            rx="30"
            ry="8"
            fill="#D2691E"
            className="transition-all duration-300 group-hover:fill-amber-500"
          />

          {/* Oil/Ghee */}
          <ellipse
            cx="60"
            cy="88"
            rx="25"
            ry="5"
            fill="#FFD700"
            className="transition-all duration-300"
          />

          {/* Wick */}
          <rect
            x="58"
            y="75"
            width="4"
            height="15"
            fill="#8B4513"
            className="transition-all duration-300"
          />

          {/* Flame - Animated */}
          <g
            className={cn(
              "transition-all duration-100",
              prayerMode && "spiritual-pulse"
            )}
          >
            {/* Outer Flame */}
            <ellipse
              cx="60"
              cy="65"
              rx="8"
              ry="20"
              fill="#FF4500"
              opacity={flameIntensity * 0.3}
              className="transition-all duration-100"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.4;0.2"
                dur="1s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Middle Flame */}
            <ellipse
              cx="60"
              cy="70"
              rx="6"
              ry="15"
              fill="#FF6347"
              opacity={flameIntensity * 0.6}
              className="transition-all duration-100"
            >
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Inner Flame */}
            <ellipse
              cx="60"
              cy="75"
              rx="4"
              ry="12"
              fill="#FFFF00"
              opacity={flameIntensity}
              className="transition-all duration-100"
            >
              <animate
                attributeName="opacity"
                values="0.8;1.2;0.8"
                dur="0.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="75;73;75"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Flame Core */}
            <ellipse
              cx="60"
              cy="78"
              rx="2"
              ry="8"
              fill="#FFFFFF"
              opacity={flameIntensity * 0.8}
              className="transition-all duration-100"
            >
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="0.6s"
                repeatCount="indefinite"
              />
            </ellipse>
          </g>

          {/* Glow Effect */}
          <circle
            cx="60"
            cy="75"
            r="25"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            opacity={prayerMode ? 0.8 : 0}
            className="transition-all duration-500"
          >
            <animate
              attributeName="r"
              values="25;35;25"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>

        {/* Prayer Points */}
        {prayerMode && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="text-yellow-400 font-bold text-sm animate-bounce">
              +5 Punya
            </div>
          </div>
        )}
      </div>

      {/* Circular Icon Row */}
      <div className="flex gap-4">
        {/* Tulsi (Holy Basil) */}
        <div
          className="relative cursor-pointer group"
          onClick={() => handleElementClick("tulsi")}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            className={cn(
              "transition-all duration-300",
              activeElement === "tulsi" && "animate-pulse tulsi-rustle"
            )}
          >
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke="#22C55E"
              strokeWidth="2"
              className={cn(
                "transition-all duration-300",
                activeElement === "tulsi"
                  ? "stroke-green-400"
                  : "stroke-green-600"
              )}
            />
            {/* Tulsi Leaves */}
            <g className="transition-all duration-300 group-hover:scale-110">
              <path
                d="M25 25 Q30 20 35 25 Q30 30 25 25"
                fill="#16A34A"
                className="transition-all duration-300"
              />
              <path
                d="M25 35 Q30 30 35 35 Q30 40 25 35"
                fill="#16A34A"
                className="transition-all duration-300"
              />
              <path
                d="M20 30 Q25 25 20 30 Q25 35 20 30"
                fill="#15803D"
                className="transition-all duration-300"
              />
              <path
                d="M40 30 Q35 25 40 30 Q35 35 40 30"
                fill="#15803D"
                className="transition-all duration-300"
              />
            </g>
          </svg>
          {activeElement === "tulsi" && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="text-green-400 font-bold text-xs animate-bounce">
                +8
              </div>
            </div>
          )}
        </div>

        {/* Bell */}
        <div
          className="relative cursor-pointer group"
          onClick={() => handleElementClick("bell")}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            className={cn(
              "transition-all duration-300",
              activeElement === "bell" && "animate-pulse bell-ring"
            )}
          >
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              className={cn(
                "transition-all duration-300",
                activeElement === "bell"
                  ? "stroke-yellow-400"
                  : "stroke-yellow-600"
              )}
            />
            {/* Bell */}
            <g className="transition-all duration-300 group-hover:scale-110">
              <path
                d="M25 20 Q30 15 35 20 L35 35 Q30 40 25 35 Z"
                fill="#FCD34D"
                className="transition-all duration-300"
              />
              <circle cx="30" cy="25" r="2" fill="#8B4513" />
              <path
                d="M28 35 L32 35"
                stroke="#8B4513"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            </g>
          </svg>
          {activeElement === "bell" && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="text-yellow-400 font-bold text-xs animate-bounce">
                +15
              </div>
            </div>
          )}
        </div>

        {/* Conch Shell */}
        <div
          className="relative cursor-pointer group"
          onClick={() => handleElementClick("conch")}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            className={cn(
              "transition-all duration-300",
              activeElement === "conch" && "animate-pulse conch-glow"
            )}
          >
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              className={cn(
                "transition-all duration-300",
                activeElement === "conch"
                  ? "stroke-blue-400"
                  : "stroke-blue-600"
              )}
            />
            {/* Conch */}
            <g className="transition-all duration-300 group-hover:scale-110">
              <ellipse
                cx="30"
                cy="30"
                rx="12"
                ry="18"
                fill="#F0F8FF"
                className="transition-all duration-300"
              />
              <path
                d="M30 15 Q35 20 30 25 Q25 20 30 15"
                fill="#E0F2FE"
                className="transition-all duration-300"
              />
              <path
                d="M30 25 Q35 30 30 35 Q25 30 30 25"
                fill="#E0F2FE"
                className="transition-all duration-300"
              />
              <path
                d="M30 35 Q35 40 30 45 Q25 40 30 35"
                fill="#E0F2FE"
                className="transition-all duration-300"
              />
            </g>
          </svg>
          {activeElement === "conch" && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="text-blue-400 font-bold text-xs animate-bounce">
                +12
              </div>
            </div>
          )}
        </div>

        {/* Marigold */}
        <div
          className="relative cursor-pointer group"
          onClick={() => handleElementClick("marigold")}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            className={cn(
              "transition-all duration-300",
              activeElement === "marigold" && "animate-pulse marigold-bloom"
            )}
          >
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
              className={cn(
                "transition-all duration-300",
                activeElement === "marigold"
                  ? "stroke-orange-400"
                  : "stroke-orange-600"
              )}
            />
            {/* Marigold Flower */}
            <g className="transition-all duration-300 group-hover:scale-110">
              <circle cx="30" cy="30" r="8" fill="#FBBF24" />
              <path
                d="M22 30 Q30 20 38 30 Q30 40 22 30"
                fill="#F59E0B"
                className="transition-all duration-300"
              />
              <path
                d="M30 22 Q20 30 30 38 Q40 30 30 22"
                fill="#F59E0B"
                className="transition-all duration-300"
              />
              <path
                d="M25 25 Q35 25 35 35 Q25 35 25 25"
                fill="#F59E0B"
                className="transition-all duration-300"
              />
              <path
                d="M35 25 Q25 25 25 35 Q35 35 35 25"
                fill="#F59E0B"
                className="transition-all duration-300"
              />
            </g>
          </svg>
          {activeElement === "marigold" && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="text-orange-400 font-bold text-xs animate-bounce">
                +7
              </div>
            </div>
          )}
        </div>

        {/* Lotus */}
        <div
          className="relative cursor-pointer group"
          onClick={() => handleElementClick("lotus")}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            className={cn(
              "transition-all duration-300",
              activeElement === "lotus" && "animate-pulse lotus-bloom"
            )}
          >
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke="#EC4899"
              strokeWidth="2"
              className={cn(
                "transition-all duration-300",
                activeElement === "lotus"
                  ? "stroke-pink-400"
                  : "stroke-pink-600"
              )}
            />
            {/* Lotus */}
            <g className="transition-all duration-300 group-hover:scale-110">
              <circle cx="30" cy="30" r="6" fill="#FDF2F8" />
              <path
                d="M30 20 Q35 25 30 30 Q25 25 30 20"
                fill="#FCE7F3"
                className="transition-all duration-300"
              />
              <path
                d="M30 20 Q35 25 30 30 Q25 25 30 20"
                fill="#F9A8D4"
                className="transition-all duration-300"
                transform="rotate(45 30 30)"
              />
              <path
                d="M30 20 Q35 25 30 30 Q25 25 30 20"
                fill="#F9A8D4"
                className="transition-all duration-300"
                transform="rotate(90 30 30)"
              />
              <path
                d="M30 20 Q35 25 30 30 Q25 25 30 20"
                fill="#F9A8D4"
                className="transition-all duration-300"
                transform="rotate(135 30 30)"
              />
            </g>
          </svg>
          {activeElement === "lotus" && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="text-pink-400 font-bold text-xs animate-bounce">
                +10
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-white/80 text-xs">
          {activeElement ? `${activeElement} activated!` : "Click to interact"}
        </p>
      </div>
    </div>
  );
};
