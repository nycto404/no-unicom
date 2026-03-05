import L from 'leaflet'

export const useAirports = () => {
  const displayAirports = async (map, airportMarkers) => {
    // Check if airports layer is active
    if (!map.hasLayer(airportMarkers)) {
      return
    }

    try {
      const response = await fetch('/data/airports.geojson')
      const data = await response.json()
      const AIRPORTS = data

      const bounds = map.getBounds()

      // Filter airports by visible bounds
      const filteredAirports = AIRPORTS.features.filter(feature => {
        const [lng, lat] = feature.geometry.coordinates
        return bounds.contains([lat, lng])
      })

      // Clear existing markers
      airportMarkers.clearLayers()

      // Add filtered airports
      L.geoJSON(filteredAirports, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng).bindPopup(`
            <b>${feature.properties.name}</b><br>
            ${feature.properties.city}, ${feature.properties.country}<br>
            IATA: ${feature.properties.iata}, ICAO: ${feature.properties.icao}
          `)
        }
      }).addTo(airportMarkers)

      airportMarkers.addTo(map)
    } catch (error) {
      console.error('Error loading airports:', error)
    }
  }

  return {
    displayAirports
  }
}
