"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export interface LocationData {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeName?: string;
}

interface LocationPickerProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  error?: string;
}

export function LocationPicker({
  value,
  onChange,
  error,
}: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Common places in Ujjain for suggestions
  const ujjainPlaces = [
    "Mahakal Temple",
    "Ram Ghat",
    "Harsiddhi Temple",
    "Bade Ganeshji Ka Mandir",
    "Kal Bhairav Temple",
    "Ujjain Railway Station",
    "Ujjain Bus Stand",
    "Vikram University",
    "Sandipani Ashram",
    "Gopal Mandir",
    "Mangalnath Temple",
    "Chintaman Ganesh Temple",
    "Pir Matsyendranath",
    "Gadkalika Temple",
    "Triveni Ghat",
    "Shipra River",
    "Kaliadeh Palace",
    "Vedh Shala Observatory",
    "Maharishi Sandipani Ashram",
    "Bhartrihari Caves",
  ];

  // Get current location using GPS
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${
              process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || "demo"
            }`
          );

          if (response.ok) {
            const data = await response.json();
            const address =
              data.results[0]?.formatted ||
              `Lat: ${latitude}, Lng: ${longitude}`;

            onChange({
              address,
              coordinates: { lat: latitude, lng: longitude },
              placeName: data.results[0]?.components?.city || "Ujjain",
            });
          } else {
            // Fallback if reverse geocoding fails
            onChange({
              address: `Near coordinates: ${latitude.toFixed(
                6
              )}, ${longitude.toFixed(6)}`,
              coordinates: { lat: latitude, lng: longitude },
              placeName: "Ujjain",
            });
          }
        } catch (error) {
          // Fallback if API fails
          onChange({
            address: `Near coordinates: ${latitude.toFixed(
              6
            )}, ${longitude.toFixed(6)}`,
            coordinates: { lat: latitude, lng: longitude },
            placeName: "Ujjain",
          });
        }

        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Handle address input change
  const handleAddressChange = (address: string) => {
    onChange({ ...value, address });

    // Show suggestions based on input
    if (address.length > 2) {
      const filtered = ujjainPlaces.filter((place) =>
        place.toLowerCase().includes(address.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    onChange({
      ...value,
      address: suggestion,
      placeName: suggestion,
    });
    setShowSuggestions(false);
  };

  // Handle manual coordinate input
  const handleCoordinateInput = (lat: string, lng: string) => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (!isNaN(latNum) && !isNaN(lngNum)) {
      onChange({
        ...value,
        address: `Manual coordinates: ${lat}, ${lng}`,
        coordinates: { lat: latNum, lng: lngNum },
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Location Input */}
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="location"
            value={value.address}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Enter location or click 'Get My Location'"
            className={`pl-10 ${error ? "border-red-500" : ""}`}
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Location Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-2"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          {isGettingLocation ? "Getting Location..." : "Get My Location"}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Browse Places
        </Button>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <p className="text-sm text-red-600">{locationError}</p>
        </div>
      )}

      {/* Location Info Display */}
      {value.coordinates && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              Location Captured
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="font-medium">{value.address}</span>
              </div>
              {value.coordinates && (
                <div className="flex items-center gap-4 text-green-700">
                  <Badge variant="outline" className="text-xs">
                    Lat: {value.coordinates.lat.toFixed(6)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Lng: {value.coordinates.lng.toFixed(6)}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Coordinate Input */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-800">
            Manual Coordinates (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="lat" className="text-xs">
                Latitude
              </Label>
              <Input
                id="lat"
                type="number"
                step="any"
                placeholder="23.1765"
                className="text-sm"
                onChange={(e) => {
                  const lngInput = document.getElementById(
                    "lng"
                  ) as HTMLInputElement;
                  handleCoordinateInput(e.target.value, lngInput?.value || "");
                }}
              />
            </div>
            <div>
              <Label htmlFor="lng" className="text-xs">
                Longitude
              </Label>
              <Input
                id="lng"
                type="number"
                step="any"
                placeholder="75.7849"
                className="text-sm"
                onChange={(e) => {
                  const latInput = document.getElementById(
                    "lat"
                  ) as HTMLInputElement;
                  handleCoordinateInput(latInput?.value || "", e.target.value);
                }}
              />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Ujjain coordinates: 23.1765°N, 75.7849°E
          </p>
        </CardContent>
      </Card>

      {/* Popular Places */}
      {showSuggestions && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Popular Places in Ujjain</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ujjainPlaces.map((place, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionSelect(place)}
                  className="justify-start text-left h-auto p-2"
                >
                  <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="text-xs">{place}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
