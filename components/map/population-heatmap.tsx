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
} from "lucide-react";

interface PopulationPoint {
  id: string;
  lat: number;
  lng: number;
  population: number;
  density: "low" | "medium" | "high" | "crowded";
  lastUpdate: Date;
  type: "temple" | "market" | "ghat" | "street" | "park";
}

interface PopulationHeatmapProps {
  className?: string;
}

export function PopulationHeatmap({ className = "" }: PopulationHeatmapProps) {
  const [populationData, setPopulationData] = useState<PopulationPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedArea, setSelectedArea] = useState<PopulationPoint | null>(
    null
  );
  const mapRef = useRef<HTMLDivElement>(null);

  // Ujjain coordinates and key locations
  const ujjainCenter = { lat: 23.1765, lng: 75.7885 };

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
      name: "Ujjain Market",
      lat: 23.177,
      lng: 75.787,
      type: "market" as const,
    },
    { name: "Shipra River", lat: 23.17, lng: 75.78, type: "ghat" as const },
    {
      name: "Vikram Kirti Mandir",
      lat: 23.183,
      lng: 75.788,
      type: "temple" as const,
    },
  ];

  // Generate realistic population data
  const generatePopulationData = (): PopulationPoint[] => {
    return keyLocations.map((location, index) => {
      const basePopulation = Math.floor(Math.random() * 500) + 50;
      const timeFactor = getTimeBasedMultiplier();
      const eventFactor = getEventBasedMultiplier(location.name);
      const population = Math.floor(basePopulation * timeFactor * eventFactor);

      let density: "low" | "medium" | "high" | "crowded";
      if (population < 100) density = "low";
      else if (population < 300) density = "medium";
      else if (population < 500) density = "high";
      else density = "crowded";

      return {
        id: `location-${index}`,
        lat: location.lat + (Math.random() - 0.5) * 0.01,
        lng: location.lng + (Math.random() - 0.5) * 0.01,
        population,
        density,
        lastUpdate: new Date(),
        type: location.type,
      };
    });
  };

  // Time-based population multiplier (more crowded during aarti times)
  const getTimeBasedMultiplier = (): number => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 8) return 2.5; // Morning aarti
    if (hour >= 12 && hour <= 14) return 1.8; // Afternoon
    if (hour >= 18 && hour <= 20) return 3.0; // Evening aarti
    if (hour >= 20 && hour <= 22) return 2.2; // Night aarti
    return 1.0; // Normal times
  };

  // Event-based population multiplier
  const getEventBasedMultiplier = (locationName: string): number => {
    const events = {
      "Mahakaleshwar Temple": 2.5, // Always crowded
      "Ram Ghat": 1.8,
      "Harsiddhi Temple": 1.6,
      "Ujjain Market": 1.4,
      "Shipra River": 1.2,
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

    // Update every 30 seconds
    const interval = setInterval(() => {
      const data = generatePopulationData();
      setPopulationData(data);
      setLastUpdate(new Date());
    }, 30000);

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
    <div className={`space-y-6 ${className}`}>
      {/* Map Header with Live Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Live Population Map</CardTitle>
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Live Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total People</p>
                  <p className="text-xl font-bold text-green-600">
                    {totalPopulation.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Crowded Areas</p>
                  <p className="text-xl font-bold text-red-600">
                    {crowdedAreas}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Busy Areas</p>
                  <p className="text-xl font-bold text-orange-600">
                    {busyAreas}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Locations
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {populationData.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border-2 border-border relative overflow-hidden"
            >
              {/* Simulated Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-yellow-100 to-blue-200 dark:from-green-800/30 dark:via-yellow-800/30 dark:to-blue-800/30">
                {/* Simulated roads */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-400/50 transform -translate-y-1/2"></div>
                <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-400/50 transform -translate-x-1/2"></div>

                {/* Population Points */}
                {populationData.map((point) => (
                  <div
                    key={point.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${30 + (point.lng - ujjainCenter.lng) * 1000}%`,
                      top: `${30 + (point.lat - ujjainCenter.lat) * 1000}%`,
                    }}
                    onClick={() => setSelectedArea(point)}
                  >
                    {/* Population Circle */}
                    <div
                      className={`w-8 h-8 rounded-full ${getDensityColor(
                        point.density
                      )} opacity-80 hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white text-sm font-bold shadow-lg hover:scale-110 animate-pulse`}
                    >
                      {getLocationIcon(point.type)}
                    </div>

                    {/* Population Count */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.population}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <h4 className="font-semibold text-sm mb-2">
                  Population Density
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Light (0-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Moderate (100-300)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Busy (300-500)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Crowded (500+)</span>
                  </div>
                </div>
              </div>

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Updating population data...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  const data = generatePopulationData();
                  setPopulationData(data);
                  setLastUpdate(new Date());
                  setIsLoading(false);
                }, 1000);
              }}
              className="flex items-center gap-2"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Toggle Layers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Area Details */}
      {selectedArea && (
        <Card className="animate-appear-zoom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getLocationIcon(selectedArea.type)} Area Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Population
                </p>
                <p className="text-2xl font-bold text-primary">
                  {selectedArea.population}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Density Level</p>
                <Badge
                  className={`${getDensityColor(
                    selectedArea.density
                  )} text-white`}
                >
                  {getDensityText(selectedArea.density)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location Type</p>
                <p className="font-semibold capitalize">{selectedArea.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm">
                  {selectedArea.lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Recommendation:</span>{" "}
                {selectedArea.density === "crowded"
                  ? "Consider visiting during off-peak hours (early morning or late evening)"
                  : selectedArea.density === "high"
                  ? "Moderate crowd expected. Good time to visit with some patience"
                  : "Perfect time to visit! Low crowd expected"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Population Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Population Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {populationData
              .sort((a, b) => b.population - a.population)
              .slice(0, 5)
              .map((point, index) => (
                <div
                  key={point.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {getLocationIcon(point.type)}
                    </div>
                    <div>
                      <p className="font-semibold">Location {index + 1}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {point.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{point.population}</p>
                    <Badge
                      className={`${getDensityColor(
                        point.density
                      )} text-white text-xs`}
                    >
                      {getDensityText(point.density)}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
