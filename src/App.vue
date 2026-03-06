<template>
  <div class="app-shell">
    <div class="top-nav">
      <button
        class="top-nav__button"
        :class="{ active: currentView === 'map' }"
        @click="setView('map')"
      >
        Map
      </button>
      <button
        class="top-nav__button"
        :class="{ active: currentView === 'runway' }"
        @click="setView('runway')"
      >
        Runway Distances
      </button>
    </div>

    <div v-if="currentView === 'map'" class="msfs-link-main-container">
      <!-- Map Component -->
      <MapContainer />

      <!-- Info Display -->
      <div class="general-information">
        <div class="info-container" id="pilots">
          <h4>
            <i class="fa-solid fa-plane"></i>
            <span>{{ onlinePilots }}</span>
          </h4>
        </div>

        <div class="info-container" id="atc">
          <h4>
            <i class="fa-solid fa-tower-observation"></i>
            <span>{{ onlineControllers }}</span>
          </h4>
        </div>

        <div class="info-container" id="time-container">
          <h4>{{ currentTime }}</h4>
        </div>
      </div>

      <!-- Menu Toggle Button -->
      <div class="menu-button">
        <button class="burger-button" @click="toggleMenu">
          <i class="fa-solid fa-bars" :class="{ 'fa-x': menuOpen }"></i>
        </button>
      </div>

      <!-- Theme Toggle Button -->
      <div class="theme-button">
        <button class="burger-button" @click="toggleTheme">
          <i class="fa-solid fa-sun"></i>
        </button>
      </div>

      <!-- User Menu -->
      <transition name="slide">
        <div class="user-menu" v-if="menuOpen">
          <div class="controls">
            <input
              type="checkbox"
              id="toggle-aircrafts-checkbox"
              v-model="showAircrafts"
              @change="updateLayerVisibility"
            >
            <label for="toggle-aircrafts-checkbox">Toggle Aircrafts</label>

            <input
              type="checkbox"
              id="toggle-airports-checkbox"
              v-model="showAirports"
              @change="updateLayerVisibility"
            >
            <label for="toggle-airports-checkbox">Toggle Airports</label>
          </div>

          <div class="socials">
            <ul>
              <li>
                <a href="https://github.com/nycto404" target="_blank">
                  <i class="fa-brands fa-github fa-2xl"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>

    <RunwayDistanceView v-else />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MapContainer from './components/MapContainer.vue'
import RunwayDistanceView from './views/RunwayDistanceView.vue'
import { useTheme } from './composables/useTheme'
import { useVATSIMData } from './composables/useVATSIMData'

const menuOpen = ref(false)
const currentView = ref('map')
const showAircrafts = ref(true)
const showAirports = ref(true)
const onlinePilots = ref(0)
const onlineControllers = ref(0)
const currentTime = ref('')

let timeInterval = null
let vatsimInterval = null

const { toggleTheme } = useTheme()
const { fetchVATSIMData } = useVATSIMData()

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const getHashView = () => {
  return window.location.hash === '#/runway' ? 'runway' : 'map'
}

const syncViewFromHash = () => {
  currentView.value = getHashView()
  if (currentView.value !== 'map') {
    menuOpen.value = false
  }
}

const setView = (view) => {
  const target = view === 'runway' ? '#/runway' : '#/map'
  if (window.location.hash !== target) {
    window.location.hash = target
  }
  syncViewFromHash()
}

const updateLayerVisibility = () => {
  // Emit event to MapContainer or store state
  // This will be handled through provide/inject or Pinia
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
}

const updateVATSIMInfo = async () => {
  try {
    const data = await fetchVATSIMData()
    onlinePilots.value = data.pilots?.length || 0
    onlineControllers.value = data.controllers?.length || 0
  } catch (error) {
    console.error('Error fetching VATSIM data:', error)
  }
}

onMounted(() => {
  if (!window.location.hash) {
    window.location.hash = '#/map'
  }

  syncViewFromHash()
  window.addEventListener('hashchange', syncViewFromHash)

  // Update time every second
  timeInterval = setInterval(updateTime, 1000)
  updateTime()

  // Update VATSIM data periodically
  updateVATSIMInfo()
  vatsimInterval = setInterval(updateVATSIMInfo, 15000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }

  if (vatsimInterval) {
    clearInterval(vatsimInterval)
  }

  window.removeEventListener('hashchange', syncViewFromHash)
})
</script>

<style scoped>
.app-shell {
  position: relative;
  width: 100%;
  height: 100%;
}

.msfs-link-main-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.top-nav {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1500;
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  padding: 6px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.top-nav__button {
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: #334155;
}

.top-nav__button.active {
  background: #0f172a;
  color: #fff;
}

.general-information {
  position: absolute;
  top: 56px;
  left: 10px;
  display: flex;
  gap: 10px;
  z-index: 500;
}

.info-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-container h4 {
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-button,
.theme-button {
  position: absolute;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
}

.menu-button {
  top: 66px;
}

.theme-button {
  top: 116px;
}

.burger-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
  transition: color 0.3s;
}

.burger-button:hover {
  color: #666;
}

.user-menu {
  position: absolute;
  top: 168px;
  right: 20px;
  z-index: 999;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.controls input[type='checkbox'] {
  margin-right: 10px;
}

.controls label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.socials ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
}

.socials a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.socials a:hover {
  color: #007bff;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

:global(body.dark-mode) .top-nav {
  background: rgba(33, 37, 41, 0.9);
}

:global(body.dark-mode) .top-nav__button {
  color: #cbd5e1;
}

:global(body.dark-mode) .top-nav__button.active {
  background: #f8fafc;
  color: #1f2937;
}

:global(body.dark-mode) .info-container {
  background: rgba(33, 37, 41, 0.9);
  color: #fff;
}

:global(body.dark-mode) .menu-button,
:global(body.dark-mode) .theme-button {
  background: rgba(33, 37, 41, 0.9);
}

:global(body.dark-mode) .burger-button {
  color: #fff;
}

:global(body.dark-mode) .burger-button:hover {
  color: #ccc;
}

:global(body.dark-mode) .user-menu {
  background: rgba(33, 37, 41, 0.95);
  color: #fff;
}

:global(body.dark-mode) .socials a {
  color: #fff;
}

@media (max-width: 700px) {
  .top-nav {
    width: calc(100% - 16px);
    max-width: 430px;
  }

  .top-nav__button {
    flex: 1;
    text-align: center;
    padding: 8px 10px;
  }

  .general-information {
    top: 62px;
  }

  .menu-button {
    top: 120px;
  }

  .theme-button {
    top: 170px;
  }

  .user-menu {
    top: 220px;
  }
}
</style>
