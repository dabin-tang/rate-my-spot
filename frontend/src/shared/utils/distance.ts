/**
 * Calculates the distance between two coordinates in miles using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Formatted distance string (e.g., "1.2 mi" or "< 0.1 mi")
 */
export const calculateDistance = (
  lat1?: number | null, 
  lon1?: number | null, 
  lat2?: number | null, 
  lon2?: number | null
): string => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return 'Unknown distance';
  }

  const R = 3958.8; // Radius of the Earth in miles
  const rLat1 = (lat1 * Math.PI) / 180;
  const rLat2 = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInMiles = R * c;

  if (distanceInMiles < 0.1) {
    return '< 0.1 mi';
  }

  return `${distanceInMiles.toFixed(1)} mi`;
};
