# Vue Refactor - no-unicom

This is the Vue 3 + Vite refactored version of the no-unicom VATSIM aircraft tracking application.

## What Changed

- **Framework**: Vanilla JS → Vue 3 (Composition API)
- **Build Tool**: None → Vite
- **Package Manager**: Manual CDN imports → npm dependencies
- **Architecture**: jQuery + inline scripts → Component-based with composables

## Project Structure

```
src/
├── components/
│   └── MapContainer.vue        # Main Leaflet map component
├── composables/
│   ├── useMap.js               # Map management logic
│   ├── useAirports.js          # Airport data and markers
│   ├── useVATSIMData.js        # VATSIM data fetching
│   └── useTheme.js             # Dark mode toggle
├── utils/
│   └── localStorage.js         # Local storage management
├── assets/
│   └── main.css                # Global styles
├── App.vue                     # Root component
└── main.js                     # Vue app entry point
```

## Key Features

- ✅ Reactive map with Leaflet.js
- ✅ Real-time VATSIM aircraft tracking
- ✅ Airport display with clustering
- ✅ Dark/Light theme toggle
- ✅ Responsive menu system
- ✅ Local storage persistence

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on `http://localhost:5173`

## Build

```bash
npm run build
```

Creates optimized build in `dist/` folder

## Testing

```bash
npm test
```

## Next Steps

- [ ] Add E2E tests with Playwright
- [ ] Implement VATSIM real-time WebSocket connection
- [ ] Add aircraft markers with rotation
- [ ] Add FIR boundaries display
- [ ] Performance optimization for large datasets
