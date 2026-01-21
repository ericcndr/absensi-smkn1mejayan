export interface Coordinates {
  latitude: number
  longitude: number
}

export interface LocationResult {
  coordinates: Coordinates | null
  error: string | null
}

// Get current GPS location
export async function getCurrentLocation(): Promise<LocationResult> {
  if (!navigator.geolocation) {
    return {
      coordinates: null,
      error: "GPS tidak didukung di browser Anda",
    }
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
        })
      },
      (error) => {
        let errorMessage = "Gagal mendapatkan lokasi"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Izin akses lokasi ditolak"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informasi lokasi tidak tersedia"
            break
          case error.TIMEOUT:
            errorMessage = "Timeout mendapatkan lokasi"
            break
        }

        resolve({
          coordinates: null,
          error: errorMessage,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  })
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3 // Earth radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180
  const φ2 = (coord2.latitude * Math.PI) / 180
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

// Check if location is within office radius
export function isWithinRadius(userLocation: Coordinates, officeLocation: Coordinates, radiusMeters: number): boolean {
  const distance = calculateDistance(userLocation, officeLocation)
  return distance <= radiusMeters
}
