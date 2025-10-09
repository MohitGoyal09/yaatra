/**
 * Location utilities for validating Ujjain coordinates
 */

// Ujjain city boundaries (approximate coordinates)
const UJJAIN_BOUNDS = {
  north: 23.25, // Northern boundary
  south: 23.1, // Southern boundary
  east: 75.9, // Eastern boundary
  west: 75.7, // Western boundary
};

// Mahakaleshwar Temple coordinates (center of Ujjain)
const MAHAKALESHWAR_TEMPLE = {
  latitude: 23.1828,
  longitude: 75.7772,
};

// Maximum allowed distance from Mahakaleshwar Temple (in kilometers)
const MAX_DISTANCE_FROM_CENTER = 15; // 15km radius

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Validate if coordinates are within Ujjain city boundaries
 */
export function isWithinUjjainBounds(
  latitude: number,
  longitude: number
): boolean {
  return (
    latitude >= UJJAIN_BOUNDS.south &&
    latitude <= UJJAIN_BOUNDS.north &&
    longitude >= UJJAIN_BOUNDS.west &&
    longitude <= UJJAIN_BOUNDS.east
  );
}

/**
 * Validate if coordinates are within reasonable distance from Mahakaleshwar Temple
 */
export function isWithinUjjainRadius(
  latitude: number,
  longitude: number
): boolean {
  const distance = calculateDistance(
    latitude,
    longitude,
    MAHAKALESHWAR_TEMPLE.latitude,
    MAHAKALESHWAR_TEMPLE.longitude
  );
  return distance <= MAX_DISTANCE_FROM_CENTER;
}

/**
 * Comprehensive validation for Ujjain location
 */
export function validateUjjainLocation(
  latitude: number,
  longitude: number
): {
  isValid: boolean;
  reason?: string;
  distance?: number;
} {
  // Check if coordinates are valid numbers
  if (isNaN(latitude) || isNaN(longitude)) {
    return {
      isValid: false,
      reason: "Invalid coordinates provided",
    };
  }

  // Check if within city bounds
  if (!isWithinUjjainBounds(latitude, longitude)) {
    return {
      isValid: false,
      reason: "Location is outside Ujjain city boundaries",
    };
  }

  // Check distance from temple center
  const distance = calculateDistance(
    latitude,
    longitude,
    MAHAKALESHWAR_TEMPLE.latitude,
    MAHAKALESHWAR_TEMPLE.longitude
  );

  if (!isWithinUjjainRadius(latitude, longitude)) {
    return {
      isValid: false,
      reason: `Location is too far from Ujjain center (${distance.toFixed(
        1
      )}km away)`,
      distance,
    };
  }

  return {
    isValid: true,
    distance,
  };
}

/**
 * Get user-friendly location validation message
 */
export function getLocationValidationMessage(
  latitude: number,
  longitude: number
): string {
  const validation = validateUjjainLocation(latitude, longitude);

  if (validation.isValid) {
    return `Location verified: You are ${validation.distance?.toFixed(
      1
    )}km from Mahakaleshwar Temple`;
  }

  return `Location validation failed: ${validation.reason}`;
}

export { MAHAKALESHWAR_TEMPLE, MAX_DISTANCE_FROM_CENTER };
