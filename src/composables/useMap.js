import { ref } from 'vue'
import L from 'leaflet'

export const useMap = () => {
  const map = ref(null)

  const initializeMap = (element, options = {}) => {
    if (map.value) {
      map.value.remove()
    }

    const defaultOptions = {
      zoom: 10,
      minZoom: 2.5,
      maxZoom: 20,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
      ...options
    }

    map.value = L.map(element, defaultOptions)
    return map.value
  }

  const getMap = () => map.value

  return {
    map,
    initializeMap,
    getMap
  }
}
