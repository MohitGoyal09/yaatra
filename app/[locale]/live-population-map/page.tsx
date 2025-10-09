"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Layers,
  Maximize2,
  Users,
  AlertTriangle,
  Eye,
  MapPin,
  Clock,
  Navigation,
} from "lucide-react";
import { OpenStreetMap } from "@/components/map/openstreet-map";

const DENSITY_COLORS = {
  light: { color: "bg-green-500", text: "Light (0-150)" },
  moderate: { color: "bg-yellow-500", text: "Moderate (150-400)" },
  busy: { color: "bg-orange-500", text: "Busy (400-700)" },
  crowded: { color: "bg-red-500", text: "Crowded (700+)" },
};

export default function LivePopulationMapPage() {
  const [lastUpdate, setLastUpdate] = useState("2:16:48 AM");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLayers, setShowLayers] = useState(true);

  // Mock stats for display
  const totalPeople = 4120;
  const crowdedAreas = 2;
  const busyAreas = 3;
  const activeLocations = 10;

  const refreshData = async () => {
    setIsRefreshing(true);

    // Simulate API call
    setTimeout(() => {
      setLastUpdate(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setIsRefreshing(false);
    }, 1000);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ujjain Live Population Map
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time crowd density across spiritual landmarks
              </p>
            </div>
            <Badge className="bg-green-500 hover:bg-green-600 text-white animate-pulse shadow-lg shadow-green-500/30">
              LIVE
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Last updated: {lastUpdate}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Total People
                  </p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {totalPeople.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    Crowded Areas
                  </p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {crowdedAreas}
                  </p>
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                    Busy Areas
                  </p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {busyAreas}
                  </p>
                </div>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                    Active Locations
                  </p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {activeLocations}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Container */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200 dark:border-slate-700 overflow-hidden relative shadow-2xl">
          <CardContent className="p-0">
            <div className="relative h-[600px] w-full">
              <OpenStreetMap />

              {/* Map Controls */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Data
                </Button>

                <Button
                  onClick={() => setShowLayers(!showLayers)}
                  className="bg-white/90 hover:bg-white text-slate-700 shadow-lg border border-slate-200"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Toggle Layers
                </Button>

                <Button
                  onClick={() => {
                    if (document.documentElement.requestFullscreen) {
                      document.documentElement.requestFullscreen();
                    }
                  }}
                  className="bg-white/90 hover:bg-white text-slate-700 shadow-lg border border-slate-200"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Full Screen
                </Button>
              </div>

              {/* Population Density Legend */}
              <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 p-4 rounded-lg border border-slate-200 dark:border-slate-600 shadow-lg">
                <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  Population Density
                </h4>
                <div className="space-y-2">
                  {Object.entries(DENSITY_COLORS).map(([density, config]) => (
                    <div key={density} className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${config.color} shadow-sm`}
                      ></div>
                      <span className="text-sm font-medium">{config.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
