"use client";

import { useState, useEffect } from "react";
import dynamicImport from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// TypeScript interfaces for different marker types
interface PunyaHotspot {
  id: string;
  lat: number;
  lng: number;
  type: "karma" | "lost_found" | "crime";
  intensity?: number;
  action?: string;
  timestamp?: string;
  // Lost/Found specific
  subtype?: "lost" | "found";
  category?: string;
  name?: string;
  description?: string;
  location?: string;
  contact_name?: string;
  contact_phone?: string;
  image_url?: string;
  created_at?: string;
  user_name?: string;
  severity?: string;
  // Crime specific
  incident_date?: string;
  is_anonymous?: boolean;
}

// Create custom SVG-based marker icon based on type
const createMarkerIcon = (hotspot: PunyaHotspot) => {
  let symbol = "🌟";
  let color = "#10b981";

  switch (hotspot.type) {
    case "karma":
      // Choose symbol based on intensity
      if (hotspot.intensity && hotspot.intensity >= 80) {
        symbol = "🔥";
        color = "#ef4444";
      } else if (hotspot.intensity && hotspot.intensity >= 60) {
        symbol = "⚡";
        color = "#f59e0b";
      } else if (hotspot.intensity && hotspot.intensity >= 40) {
        symbol = "💚";
        color = "#22c55e";
      } else if (hotspot.intensity && hotspot.intensity >= 20) {
        symbol = "✨";
        color = "#3b82f6";
      } else {
        symbol = "💫";
        color = "#8b5cf6";
      }
      break;

    case "lost_found":
      if (hotspot.subtype === "lost") {
        symbol = "🔍";
        color = "#ef4444"; // Red for lost items
      } else {
        symbol = "✅";
        color = "#22c55e"; // Green for found items
      }
      break;

    case "crime":
      switch (hotspot.severity) {
        case "critical":
          symbol = "🚨";
          color = "#dc2626";
          break;
        case "high":
          symbol = "⚠️";
          color = "#ea580c";
          break;
        case "medium":
          symbol = "🔶";
          color = "#d97706";
          break;
        default:
          symbol = "📋";
          color = "#6b7280";
      }
      break;
  }

  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="16" y="20" text-anchor="middle" font-size="16" fill="white">${symbol}</text>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: `custom-marker-${hotspot.type}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

function LiveKarmaMapComponent() {
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
            `marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          lat: lat,
          lng: lng,
          type: data.type || "karma",
          intensity: data.intensity,
          action: data.action,
          timestamp: data.timestamp,
          // Lost/Found fields
          subtype: data.subtype,
          category: data.category,
          name: data.name,
          description: data.description,
          location: data.location,
          contact_name: data.contact_name,
          contact_phone: data.contact_phone,
          image_url: data.image_url,
          created_at: data.created_at,
          user_name: data.user_name,
          severity: data.severity,
          // Crime fields
          incident_date: data.incident_date,
          is_anonymous: data.is_anonymous,
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
            Community Map Legend
          </h3>

          {/* Lost/Found Items */}
          <div className="mb-3">
            <h4 className="font-medium text-gray-700 mb-2 text-xs">
              Lost & Found
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                  🔍
                </div>
                <span className="text-gray-600">Lost Items</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                  ✅
                </div>
                <span className="text-gray-600">Found Items</span>
              </div>
            </div>
          </div>

          {/* Crime Reports */}
          <div className="mb-3">
            <h4 className="font-medium text-gray-700 mb-2 text-xs">
              Crime Reports
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">
                  🚨
                </div>
                <span className="text-gray-600">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                  ⚠️
                </div>
                <span className="text-gray-600">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">
                  🔶
                </div>
                <span className="text-gray-600">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">
                  📋
                </div>
                <span className="text-gray-600">Low</span>
              </div>
            </div>
          </div>

          {/* Karma Events */}
          <div className="mb-3">
            <h4 className="font-medium text-gray-700 mb-2 text-xs">
              Positive Actions
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                  🔥
                </div>
                <span className="text-gray-600">High Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                  💚
                </div>
                <span className="text-gray-600">Medium Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                  ✨
                </div>
                <span className="text-gray-600">Low Impact</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Total Markers:</strong> {hotspots.length}
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
              icon={createMarkerIcon(hotspot)}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  {hotspot.type === "karma" && (
                    <>
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
                        {hotspot.timestamp &&
                          new Date(hotspot.timestamp).toLocaleString()}
                      </p>
                    </>
                  )}

                  {hotspot.type === "lost_found" && (
                    <>
                      <h3
                        className={`font-semibold mb-2 ${
                          hotspot.subtype === "lost"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {hotspot.subtype === "lost"
                          ? "🔍 Lost Item"
                          : "✅ Found Item"}
                      </h3>
                      <p className="text-sm mb-1">
                        <strong>Name:</strong> {hotspot.name}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Category:</strong> {hotspot.category}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Description:</strong>{" "}
                        {hotspot.description?.substring(0, 100)}...
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Contact:</strong> {hotspot.contact_name} -{" "}
                        {hotspot.contact_phone}
                      </p>
                      <p className="text-xs text-gray-500">
                        {hotspot.created_at &&
                          new Date(hotspot.created_at).toLocaleString()}
                      </p>
                    </>
                  )}

                  {hotspot.type === "crime" && (
                    <>
                      <h3
                        className={`font-semibold mb-2 ${
                          hotspot.severity === "critical"
                            ? "text-red-600"
                            : hotspot.severity === "high"
                            ? "text-orange-600"
                            : hotspot.severity === "medium"
                            ? "text-yellow-600"
                            : "text-gray-600"
                        }`}
                      >
                        🚨 Crime Report
                      </h3>
                      <p className="text-sm mb-1">
                        <strong>Type:</strong> {hotspot.subtype}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Severity:</strong> {hotspot.severity}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Description:</strong>{" "}
                        {hotspot.description?.substring(0, 100)}...
                      </p>
                      {!hotspot.is_anonymous && (
                        <p className="text-sm mb-1">
                          <strong>Contact:</strong> {hotspot.contact_name} -{" "}
                          {hotspot.contact_phone}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {hotspot.created_at &&
                          new Date(hotspot.created_at).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

// Export the component wrapped in dynamic import to prevent SSR
export default dynamicImport(() => Promise.resolve(LiveKarmaMapComponent), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="text-lg text-gray-600">Loading map...</div>
    </div>
  ),
});
