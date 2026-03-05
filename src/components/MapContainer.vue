<template>
  <div ref="mapElement" class="map"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet-providers'
import 'leaflet.markercluster'
import { useMap } from '../composables/useMap'
import { useAirports } from '../composables/useAirports'

const mapElement = ref(null)
let map = null

const { initializeMap } = useMap()
const { displayAirports } = useAirports()

onMounted(async () => {
  // Initialize Leaflet map
  map = L.map(mapElement.value, {
    zoom: 10,
    minZoom: 2.5,
    maxZoom: 20,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 1.0
  })

  // Set default center
  map.setView([40, -74], 10)

  // Create base layers
  const lightMaplayer = L.tileLayer.provider('CartoDB.Positron')
  const darkMaplayer = L.tileLayer.provider('CartoDB.DarkMatter')
  const satelliteMaplayer = L.tileLayer.provider('Esri.WorldImagery')

  const baseLayers = {
    'Light': lightMaplayer,
    'Dark': darkMaplayer,
    'Satellite': satelliteMaplayer
  }

  // Create marker cluster group for airports
  const airportMarkers = new L.MarkerClusterGroup()

  const overlays = {
    'Airports': airportMarkers
  }

  // Add layer control
  L.control.layers(baseLayers, overlays).addTo(map)

  // Add default layer
  lightMaplayer.addTo(map)

  // Load airports
  await displayAirports(map, airportMarkers)

  // Listen for map changes
  map.on('moveend', () => displayAirports(map, airportMarkers))
  map.on('zoomend', () => displayAirports(map, airportMarkers))

  // Store map instance for later use
  window.__vatsimMap = map
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
