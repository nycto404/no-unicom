export const initializeDefaults = () => {
  // Set default localStorage values
  const defaults = {
    theme: 'light',
    showAircrafts: true,
    showAirports: true,
    mapCenter: JSON.stringify([40, -74]),
    mapZoom: 10
  }

  Object.entries(defaults).forEach(([key, value]) => {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    }
  })
}

export const getTheme = () => localStorage.getItem('theme') || 'light'
export const setTheme = (theme) => localStorage.setItem('theme', theme)

export const getShowAircrafts = () => localStorage.getItem('showAircrafts') === 'true'
export const setShowAircrafts = (show) => localStorage.setItem('showAircrafts', show)

export const getShowAirports = () => localStorage.getItem('showAirports') === 'true'
export const setShowAirports = (show) => localStorage.setItem('showAirports', show)

export const getMapState = () => {
  return {
    center: JSON.parse(localStorage.getItem('mapCenter') || '[40, -74]'),
    zoom: parseInt(localStorage.getItem('mapZoom') || '10', 10)
  }
}

export const setMapState = (center, zoom) => {
  localStorage.setItem('mapCenter', JSON.stringify(center))
  localStorage.setItem('mapZoom', zoom.toString())
}
