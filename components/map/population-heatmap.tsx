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
  id: number;
  name: string;
  lat: number;
  lng: number;
  population: number;
  density: "light" | "moderate" | "busy" | "crowded";
  lastUpdate: string;
  type: "temple" | "market" | "ghat" | "street" | "park";
}

interface PopulationHeatmapProps {
  data: PopulationPoint[];
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
}

export function PopulationHeatmap({ data, center, zoom, className = "" }: PopulationHeatmapProps) {
  const [selectedArea, setSelectedArea] = useState<PopulationPoint | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize OpenStreetMap
  useEffect(() => {
    if (!mapRef.current || isMapLoaded) return;

    // Create OpenStreetMap tile layer
    const mapElement = mapRef.current;
    
    // Add OpenStreetMap attribution
    const attribution = document.createElement('div');
    attribution.innerHTML = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    attribution.className = 'absolute bottom-2 right-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded';
    mapElement.appendChild(attribution);

    setIsMapLoaded(true);
  }, [isMapLoaded]);

  const getDensityColor = (density: string) => {
    switch (density) {
      case "light":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "busy":
        return "bg-orange-500";
      case "crowded":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDensityText = (density: string) => {
    switch (density) {
      case "light":
        return "Light";
      case "moderate":
        return "Moderate";
      case "busy":
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

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* OpenStreetMap Container */}
      <div
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border border-gray-300 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url('https://tile.openstreetmap.org/0/0/0.png')`,
        }}
      >
        {/* Population Points Overlay */}
        {data.map((point) => (
          <div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
            style={{
              left: `${50 + (point.lng - center.lng) * 10000}%`,
              top: `${50 + (point.lat - center.lat) * 10000}%`,
            }}
            onClick={() => setSelectedArea(point)}
          >
            {/* Population Circle */}
            <div
              className={`w-10 h-10 rounded-full ${getDensityColor(
                point.density
              )} opacity-85 hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white text-lg font-bold shadow-lg hover:scale-110 animate-pulse border-2 border-white`}
            >
              {getLocationIcon(point.type)}
            </div>

            {/* Population Count Tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              <div className="text-center">
                <div className="font-bold">{point.population}</div>
                <div className="text-xs text-gray-300">{point.name}</div>
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
            </div>
          </div>
        ))}

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          <Button
            size="sm"
            className="w-10 h-10 bg-white/90 hover:bg-white text-gray-700 shadow-lg border border-gray-300"
            onClick={() => {
              // Zoom in functionality would go here
            }}
          >
            +
          </Button>
          <Button
            size="sm"
            className="w-10 h-10 bg-white/90 hover:bg-white text-gray-700 shadow-lg border border-gray-300"
            onClick={() => {
              // Zoom out functionality would go here
            }}
          >
            −
          </Button>
        </div>
      </div>

      {/* Selected Area Details Popup */}
      {selectedArea && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm z-30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{getLocationIcon(selectedArea.type)}</span>
            <div>
              <h3 className="font-bold text-gray-900">{selectedArea.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{selectedArea.type}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500">Population</p>
              <p className="text-xl font-bold text-gray-900">{selectedArea.population}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Density</p>
              <Badge className={`${getDensityColor(selectedArea.density)} text-white text-xs`}>
                {getDensityText(selectedArea.density)}
              </Badge>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mb-2">
            Last updated: {selectedArea.lastUpdate}
          </div>
          
          <div className="p-2 bg-gray-50 rounded text-xs">
            <span className="font-semibold">Recommendation:</span>{" "}
            {selectedArea.density === "crowded"
              ? "Consider visiting during off-peak hours"
              : selectedArea.density === "busy"
              ? "Moderate crowd expected"
              : "Perfect time to visit!"}
          </div>
        </div>
      )}
    </div>
  );
}
