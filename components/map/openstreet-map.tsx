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

  // Ujjain key locations with realistic coordinates
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
    {
      name: "Sandipani Ashram",
      lat: 23.188,
      lng: 75.8,
      type: "temple" as const,
    },
    { name: "Gopal Mandir", lat: 23.179, lng: 75.786, type: "temple" as const },
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
    <div className={`space-y-6 ${className}`}>
      {/* Map Header with Live Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">
                Ujjain Live Population Map
              </CardTitle>
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

          {/* OpenStreetMap Container */}
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border-2 border-border relative overflow-hidden"
            >
              {/* OpenStreetMap iframe */}
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  mapCenter.lng - 0.01
                },${mapCenter.lat - 0.01},${mapCenter.lng + 0.01},${
                  mapCenter.lat + 0.01
                }&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`}
                className="absolute inset-0 w-full h-full border-0"
                title="Ujjain OpenStreetMap"
              />

              {/* Population Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {populationData.map((point) => (
                  <div
                    key={point.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                    style={{
                      left: `${50 + (point.lng - mapCenter.lng) * 5000}%`,
                      top: `${50 + (point.lat - mapCenter.lat) * 5000}%`,
                    }}
                    onClick={() => setSelectedArea(point)}
                  >
                    {/* Population Circle */}
                    <div
                      className={`${getPopulationSize(
                        point.population
                      )} rounded-full ${getDensityColor(
                        point.density
                      )} opacity-80 hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 animate-pulse border-2 border-white`}
                    >
                      {getLocationIcon(point.type)}
                    </div>

                    {/* Population Count */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {point.name}: {point.population}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  onClick={() => setZoom((prev) => Math.min(prev + 1, 18))}
                  className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                  size="sm"
                >
                  +
                </Button>
                <Button
                  onClick={() => setZoom((prev) => Math.max(prev - 1, 10))}
                  className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                  size="sm"
                >
                  -
                </Button>
                <Button
                  onClick={() => {
                    setMapCenter({ lat: 23.1765, lng: 75.7885 });
                    setZoom(14);
                  }}
                  className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                  size="sm"
                  title="Reset View"
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <h4 className="font-semibold text-sm mb-2">
                  Population Density
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Light (0-150)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Moderate (150-400)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Busy (400-700)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Crowded (700+)</span>
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
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              Full Screen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Area Details */}
      {selectedArea && (
        <Card className="animate-appear-zoom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getLocationIcon(selectedArea.type)} {selectedArea.name}
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
            Live Population Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {populationData
              .sort((a, b) => b.population - a.population)
              .slice(0, 8)
              .map((point, index) => (
                <div
                  key={point.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {getLocationIcon(point.type)}
                    </div>
                    <div>
                      <p className="font-semibold">{point.name}</p>
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
