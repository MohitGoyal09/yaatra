"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Activity,
  RefreshCw,
  Layers,
  Eye,
  TrendingUp,
  Clock,
  Navigation,
  Maximize2,
} from "lucide-react";

interface PopulationPoint {
  id: string;
  lat: number;
  lng: number;
  population: number;
  density: "low" | "medium" | "high" | "crowded";
  lastUpdate: Date;
  type: "temple" | "market" | "ghat" | "street" | "park";
  name: string;
}

interface OpenStreetMapProps {
  className?: string;
}

export function OpenStreetMap({ className = "" }: OpenStreetMapProps) {
  const [populationData, setPopulationData] = useState<PopulationPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedArea, setSelectedArea] = useState<PopulationPoint | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState({ lat: 23.1765, lng: 75.7885 });
  const [zoom, setZoom] = useState(14);
  const mapRef = useRef<HTMLDivElement>(null);

  // Ujjain key locations with accurate coordinates
  const keyLocations = [
    {
      name: "Mahakaleshwar Temple",
      lat: 23.1825,
      lng: 75.7892,
      type: "temple" as const,
    },
    { name: "Ram Ghat", lat: 23.175, lng: 75.785, type: "ghat" as const },
    {
      name: "Harsiddhi Temple",
      lat: 23.18,
      lng: 75.79,
      type: "temple" as const,
    },
    {
      name: "Chintaman Ganesh",
      lat: 23.185,
      lng: 75.795,
      type: "temple" as const,
    },
    {
      name: "Kalbhairav Temple",
      lat: 23.178,
      lng: 75.792,
      type: "temple" as const,
    },
    {
      name: "Ujjain Junction",
      lat: 23.173,
      lng: 75.79,
      type: "market" as const,
    },
    { name: "Shipra Ghat", lat: 23.175, lng: 75.788, type: "ghat" as const },
    {
      name: "Vikram Kirti Mandir",
      lat: 23.183,
      lng: 75.788,
      type: "temple" as const,
    },
    {
      name: "Sandipani Ashram",
      lat: 23.188,
      lng: 75.8,
      type: "temple" as const,
    },
    { name: "Gopal Mandir", lat: 23.179, lng: 75.786, type: "temple" as const },
    {
      name: "Freeganj Market",
      lat: 23.178,
      lng: 75.789,
      type: "market" as const,
    },
    {
      name: "Bade Ganeshji",
      lat: 23.177,
      lng: 75.791,
      type: "temple" as const,
    },
  ];

  // Generate realistic population data
  const generatePopulationData = (): PopulationPoint[] => {
    return keyLocations.map((location, index) => {
      const basePopulation = Math.floor(Math.random() * 800) + 100;
      const timeFactor = getTimeBasedMultiplier();
      const eventFactor = getEventBasedMultiplier(location.name);
      const population = Math.floor(basePopulation * timeFactor * eventFactor);

      let density: "low" | "medium" | "high" | "crowded";
      if (population < 150) density = "low";
      else if (population < 400) density = "medium";
      else if (population < 700) density = "high";
      else density = "crowded";

      return {
        id: `location-${index}`,
        lat: location.lat,
        lng: location.lng,
        population,
        density,
        lastUpdate: new Date(),
        type: location.type,
        name: location.name,
      };
    });
  };

  // Time-based population multiplier
  const getTimeBasedMultiplier = (): number => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 8) return 2.8; // Morning aarti
    if (hour >= 12 && hour <= 14) return 1.5; // Afternoon
    if (hour >= 18 && hour <= 20) return 3.2; // Evening aarti
    if (hour >= 20 && hour <= 22) return 2.5; // Night aarti
    if (hour >= 22 || hour <= 6) return 0.8; // Late night/early morning
    return 1.2; // Normal times
  };

  // Event-based population multiplier
  const getEventBasedMultiplier = (locationName: string): number => {
    const events = {
      "Mahakaleshwar Temple": 2.8, // Always very crowded
      "Ram Ghat": 2.2,
      "Harsiddhi Temple": 1.9,
      "Ujjain Market": 1.6,
      "Shipra River": 1.4,
      "Chintaman Ganesh": 1.7,
      "Kalbhairav Temple": 1.5,
    };
    return events[locationName as keyof typeof events] || 1.0;
  };

  // Initialize and update population data
  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      const data = generatePopulationData();
      setPopulationData(data);
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    initializeData();

    // Update every 20 seconds for more dynamic feel
    const interval = setInterval(() => {
      const data = generatePopulationData();
      setPopulationData(data);
      setLastUpdate(new Date());
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (density: string) => {
    switch (density) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "crowded":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDensityText = (density: string) => {
    switch (density) {
      case "low":
        return "Light";
      case "medium":
        return "Moderate";
      case "high":
        return "Busy";
      case "crowded":
        return "Crowded";
      default:
        return "Unknown";
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "temple":
        return "🕉️";
      case "ghat":
        return "🌊";
      case "market":
        return "🏪";
      case "park":
        return "🌳";
      default:
        return "📍";
    }
  };

  const getPopulationSize = (population: number) => {
    if (population < 200) return "w-6 h-6";
    if (population < 500) return "w-8 h-8";
    if (population < 800) return "w-10 h-10";
    return "w-12 h-12";
  };

  const totalPopulation = populationData.reduce(
    (sum, point) => sum + point.population,
    0
  );
  const crowdedAreas = populationData.filter(
    (point) => point.density === "crowded"
  ).length;
  const busyAreas = populationData.filter(
    (point) => point.density === "high"
  ).length;

  return (
    <div className={`w-full h-full ${className}`}>
      {/* OpenStreetMap Container */}
      <div className="relative w-full h-full">
        <div
          ref={mapRef}
          className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 relative overflow-hidden"
        >
          {/* OpenStreetMap iframe with Ujjain focus */}
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              mapCenter.lng - 0.015
            },${mapCenter.lat - 0.015},${mapCenter.lng + 0.015},${
              mapCenter.lat + 0.015
            }&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`}
            className="absolute inset-0 w-full h-full border-0 rounded-lg"
            title="Ujjain OpenStreetMap"
            loading="lazy"
          />

          {/* Population Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {populationData.map((point) => (
              <div
                key={point.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-10"
                style={{
                  left: `${50 + (point.lng - mapCenter.lng) * 3000}%`,
                  top: `${50 + (point.lat - mapCenter.lat) * 3000}%`,
                }}
                onClick={() => setSelectedArea(point)}
              >
                {/* Population Circle */}
                <div
                  className={`${getPopulationSize(
                    point.population
                  )} rounded-full ${getDensityColor(
                    point.density
                  )} opacity-85 hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 animate-pulse border-2 border-white`}
                >
                  {getLocationIcon(point.type)}
                </div>

                {/* Population Count Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                  <div className="text-center">
                    <div className="font-bold text-lg">{point.population}</div>
                    <div className="text-xs text-gray-300">{point.name}</div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <Button
              onClick={() => setZoom((prev) => Math.min(prev + 1, 18))}
              className="w-10 h-10 p-0 bg-white/95 hover:bg-white shadow-lg border border-slate-200 text-slate-700"
              size="sm"
              title="Zoom In"
            >
              +
            </Button>
            <Button
              onClick={() => setZoom((prev) => Math.max(prev - 1, 10))}
              className="w-10 h-10 p-0 bg-white/95 hover:bg-white shadow-lg border border-slate-200 text-slate-700"
              size="sm"
              title="Zoom Out"
            >
              -
            </Button>
            <Button
              onClick={() => {
                setMapCenter({ lat: 23.1765, lng: 75.7885 });
                setZoom(14);
              }}
              className="w-10 h-10 p-0 bg-white/95 hover:bg-white shadow-lg border border-slate-200 text-slate-700"
              size="sm"
              title="Reset to Ujjain Center"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 z-20">
            <h4 className="font-semibold text-sm mb-3 text-slate-800 dark:text-slate-200">
              Population Density
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                <span className="font-medium">Light (0-150)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                <span className="font-medium">Moderate (150-400)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm"></div>
                <span className="font-medium">Busy (400-700)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                <span className="font-medium">Crowded (700+)</span>
              </div>
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 flex items-center justify-center z-30 rounded-lg">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-lg">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-slate-700 dark:text-slate-300">
                  Updating population data...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Area Details Popup */}
      {selectedArea && (
        <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 p-4 max-w-sm z-30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">
              {getLocationIcon(selectedArea.type)}
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {selectedArea.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                {selectedArea.type}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Population
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {selectedArea.population}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Density
              </p>
              <Badge
                className={`${getDensityColor(
                  selectedArea.density
                )} text-white text-xs`}
              >
                {getDensityText(selectedArea.density)}
              </Badge>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Last updated: {selectedArea.lastUpdate.toLocaleTimeString()}
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded text-xs">
            <span className="font-semibold">Recommendation:</span>{" "}
            {selectedArea.density === "crowded"
              ? "Consider visiting during off-peak hours"
              : selectedArea.density === "high"
              ? "Moderate crowd expected"
              : "Perfect time to visit!"}
          </div>
        </div>
      )}
    </div>
  );
}
