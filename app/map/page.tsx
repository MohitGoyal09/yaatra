"use client";

import { useState, useEffect } from "react";
import dynamicImport from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Disable static generation for this page since it requires client-side rendering
export const dynamic = "force-dynamic";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamicImport(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamicImport(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamicImport(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamicImport(
  () => import("react-leaflet").then((mod) => mod.Popup),
  {
    ssr: false,
  }
);

// TypeScript interface for karma event data points
interface PunyaHotspot {
  id: string;
  lat: number;
  lng: number;
  intensity: number;
  action: string;
  timestamp: string;
}

// Create custom SVG-based marker icon
const createKarmaIcon = (intensity: number) => {
  // Choose symbol based on intensity
  let symbol = "🌟"; // Default star
  let color = "#10b981"; // Default green

  if (intensity >= 80) {
    symbol = "🔥"; // Fire for high intensity
    color = "#ef4444"; // Red
  } else if (intensity >= 60) {
    symbol = "⚡"; // Lightning for medium-high
    color = "#f59e0b"; // Orange
  } else if (intensity >= 40) {
    symbol = "💚"; // Heart for medium
    color = "#22c55e"; // Green
  } else if (intensity >= 20) {
    symbol = "✨"; // Sparkles for low-medium
    color = "#3b82f6"; // Blue
  } else {
    symbol = "💫"; // Dizzy star for low
    color = "#8b5cf6"; // Purple
  }

  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="16" y="20" text-anchor="middle" font-size="16" fill="white">${symbol}</text>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "custom-karma-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export default function LiveKarmaMap() {
  // State management for hotspot data points
  const [hotspots, setHotspots] = useState<PunyaHotspot[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent server-side rendering completely
  if (typeof window === "undefined") {
    return null;
  }

  // Real-time data fetching with Server-Sent Events
  useEffect(() => {
    // Create EventSource connection to backend endpoint
    const eventSource = new EventSource("/api/map-updates");

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        // Parse incoming data as JSON
        const data = JSON.parse(event.data);

        // Skip connection messages and validate coordinates
        if (data.type === "connection" || !data.lat || !data.lng) {
          return;
        }

        // Validate that lat and lng are valid numbers
        const lat = parseFloat(data.lat);
        const lng = parseFloat(data.lng);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn("Invalid coordinates received:", data);
          return;
        }

        // Create new PunyaHotspot object from parsed data
        const newHotspot: PunyaHotspot = {
          id:
            data.id ||
            `karma-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          lat: lat,
          lng: lng,
          intensity: data.intensity || 50,
          action: data.action || "Positive action",
          timestamp: data.timestamp || new Date().toISOString(),
        };

        // Update state by appending new hotspot to existing array
        setHotspots((current) => [...current, newHotspot]);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    // Handle connection errors
    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    // Cleanup function to close EventSource on unmount
    return () => {
      eventSource.close();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Show loading state until client-side rendering is ready
  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      {/* Legend Toggle Button */}
      <button
        onClick={() => setShowLegend(!showLegend)}
        className="absolute top-4 right-4 z-[1001] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 hover:bg-white transition-colors"
        title={showLegend ? "Hide Legend" : "Show Legend"}
      >
        {showLegend ? "📋" : "❓"}
      </button>

      {/* Legend/Reference */}
      {showLegend && (
        <div className="absolute top-16 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">
            Karma Intensity Legend
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-sm">
                🔥
              </div>
              <span className="text-gray-700">High (80-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
                ⚡
              </div>
              <span className="text-gray-700">Medium-High (60-79)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                💚
              </div>
              <span className="text-gray-700">Medium (40-59)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                ✨
              </div>
              <span className="text-gray-700">Low-Medium (20-39)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm">
                💫
              </div>
              <span className="text-gray-700">Low (0-19)</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Total Events:</strong> {hotspots.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Click markers for details
            </p>
          </div>
        </div>
      )}

      <MapContainer
        center={[23.1793, 75.7873]} // Ujjain coordinates
        zoom={14}
        className="h-screen w-full"
      >
        {/* OpenStreetMap tile layer with proper attribution */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render individual karma event markers */}
        {hotspots
          .filter(
            (hotspot) =>
              hotspot.lat != null &&
              hotspot.lng != null &&
              !isNaN(hotspot.lat) &&
              !isNaN(hotspot.lng)
          )
          .map((hotspot) => (
            <Marker
              key={hotspot.id}
              position={[hotspot.lat, hotspot.lng]}
              icon={createKarmaIcon(hotspot.intensity)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-green-600 mb-2">
                    🌟 Karma Event
                  </h3>
                  <p className="text-sm mb-1">
                    <strong>Action:</strong> {hotspot.action}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Intensity:</strong> {hotspot.intensity}/100
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(hotspot.timestamp).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
