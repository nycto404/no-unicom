# no-unicom

A modern Vue 3 + Leaflet.js web application that displays virtual air traffic currently logged in to the VATSIM network. The page can be accessed [here](https://nycto404.github.io/no-unicom/).

![Screenshot 2025-06-30 213110](https://github.com/user-attachments/assets/5a0fdcc3-0c46-48bc-ba3b-e02cfd985a13)
![Screenshot 2025-06-30 213815](https://github.com/user-attachments/assets/874094bc-97ce-4eab-b32e-91e358db6b2c)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Opens the app at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Generates optimized build in `dist/` folder

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

```bash
# Run all tests
npm test

# Interactive test runner
npm run test:ui

# Debug mode
npm run test:debug
```

## 📁 Project Structure

```
no-unicom/
├── src/
│   ├── components/
│   │   └── MapContainer.vue        # Leaflet map wrapper component
│   ├── composables/
│   │   ├── useMap.js              # Map initialization & management
│   │   ├── useAirports.js         # Airport data & markers
│   │   ├── useVATSIMData.js       # VATSIM API integration
│   │   └── useTheme.js            # Dark/light mode
│   ├── utils/
│   │   └── localStorage.js        # Local storage defaults
│   ├── assets/
│   │   └── main.css               # Global styles
│   ├── App.vue                    # Root component
│   └── main.js                    # Vue app entry point
├── tests/
│   └── e2e/                        # Playwright tests
├── data/
│   ├── airports.geojson           # Airport data
│   └── fir.geojson                # Flight Information Region data
├── public/
│   └── images/                    # Static images
├── package.json
├── vite.config.js                 # Vite configuration
├── playwright.config.js           # Playwright testing config
└── index.html

```

## 🏗️ Architecture

### Vue 3 Composition API
The app uses Vue 3's **Composition API** for:
- Reusable logic through composables
- Better code organization and testing
- Reactive state management

### Composables
- `useMap()` - Leaflet map lifecycle and methods
- `useAirports()` - GeoJSON airport loading and display
- `useVATSIMData()` - Fetch and manage VATSIM data
- `useTheme()` - Theme persistence and application

### Components
- `MapContainer.vue` - Main interactive map component
- `App.vue` - Root component with info display and menu

## ✨ Features

- 🗺️ **Interactive Leaflet Maps**
  - Multiple base layers (Light, Dark, Satellite)
  - Marker clustering for performance
  - Real-time airport data

- ✈️ **VATSIM Integration**
  - Live pilot tracking
  - Controller information
  - Real-time statistics

- 🎨 **User Interface**
  - Light/Dark mode toggle
  - Responsive menu system
  - Current time display
  - Mobile-friendly design

- 💾 **Data Persistence**
  - LocalStorage for preferences
  - Theme persistence
  - Map state saving

## 🔧 Development

### Linting
```bash
npm run lint
```

### Available Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm test         # Run Playwright tests
npm run test:ui  # Run tests with UI
npm run test:debug # Debug tests
```

## 📦 Dependencies

### Runtime
- **vue** - Frontend framework
- **leaflet** - Interactive maps
- **leaflet-providers** - Map layers providers
- **leaflet.markercluster** - Marker clustering
- **socket.io-client** - Real-time communication
- **chart.js** - Data visualization

### Development
- **vite** - Build tool
- **@vitejs/plugin-vue** - Vue 3 support for Vite
- **@playwright/test** - E2E testing
- **sass** - CSS preprocessing
- **eslint** - Code quality

## 🧪 Testing Strategy

**Why Playwright?**
- Modern, fast, and reliable
- Cross-browser testing (Chrome, Firefox, Safari)
- Perfect for interactive web UIs
- Built-in debugging and tracing

**Test Structure:**
- `app.spec.js` - Core functionality tests
- `map.spec.js` - Map interaction tests
- `ui.spec.js` - User interface and theme tests

See [TESTING.md](./TESTING.md) for detailed testing guide.

## 🔄 Migration from Vanilla JS

### What Changed
1. **Removed jQuery** - Vue's reactive system replaces DOM manipulation
2. **Vite** - Modern build tool for development speed
3. **Components** - Encapsulated, reusable UI pieces
4. **Composables** - Sharable logic extracted from inline scripts
5. **Modern CSS** - Scoped component styles instead of global CSS

### What Stayed the Same
- ✅ Leaflet.js for mapping
- ✅ Same GeoJSON data sources
- ✅ VATSIM data integration
- ✅ UI/UX experience

## 📝 Notes

### Browser Support
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
- Lazy loading of Leaflet components
- Efficient marker clustering
- Optimized bundle size with Vite

### Known Limitations
- Airport data updates on map drag/zoom only
- VATSIM integration requires real API endpoint configuration

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Lint code: `npm run lint`
5. Submit a pull request

## 📜 License

See LICENSE file for details.

## 🙋 Support

For issues or questions:
- Check [GitHub Issues](https://github.com/nycto404/no-unicom/issues)
- See [TESTING.md](./TESTING.md) for testing help
- See [REFACTOR_NOTES.md](./REFACTOR_NOTES.md) for technical details

---

**Version:** 2.0.0 (Vue 3 Refactor)
**Last Updated:** March 2026
