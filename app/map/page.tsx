"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const HeatmapLayer = dynamic(
  () =>
    import("react-leaflet-heatmap-layer-v3").then((mod) => mod.HeatmapLayer),
  { ssr: false }
);

// TypeScript interface for hotspot data points
interface PunyaHotspot {
  lat: number;
  lng: number;
  intensity: number;
}

export default function LiveKarmaMap() {
  // State management for hotspot data points
  const [hotspots, setHotspots] = useState<PunyaHotspot[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Real-time data fetching with Server-Sent Events
  useEffect(() => {
    // Create EventSource connection to backend endpoint
    const eventSource = new EventSource("/api/map-updates");

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        // Parse incoming data as JSON
        const data = JSON.parse(event.data);

        // Create new PunyaHotspot object from parsed data
        const newHotspot: PunyaHotspot = {
          lat: data.lat,
          lng: data.lng,
          intensity: data.intensity,
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
    <div className="h-screen w-full">
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

        {/* Conditionally render heatmap layer only if hotspots exist */}
        {hotspots.length > 0 && (
          <HeatmapLayer
            points={hotspots}
            latitudeExtractor={(point: PunyaHotspot) => point.lat}
            longitudeExtractor={(point: PunyaHotspot) => point.lng}
            intensityExtractor={(point: PunyaHotspot) => point.intensity}
            radius={25}
            blur={15}
          />
        )}
      </MapContainer>
    </div>
  );
}
