<template>
  <div class="msfs-link-main-container">
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
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MapContainer from './components/MapContainer.vue'
import { useTheme } from './composables/useTheme'
import { useVATSIMData } from './composables/useVATSIMData'

const menuOpen = ref(false)
const showAircrafts = ref(true)
const showAirports = ref(true)
const onlinePilots = ref(0)
const onlineControllers = ref(0)
const currentTime = ref('')

const { toggleTheme } = useTheme()
const { fetchVATSIMData } = useVATSIMData()

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
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
  // Update time every second
  const timeInterval = setInterval(updateTime, 1000)
  updateTime()

  // Update VATSIM data periodically
  updateVATSIMInfo()
  const vatsimInterval = setInterval(updateVATSIMInfo, 15000) // Update every 15 seconds

  onUnmounted(() => {
    clearInterval(timeInterval)
    clearInterval(vatsimInterval)
  })
})

// Close menu when clicking map
const handleMapClick = () => {
  menuOpen.value = false
}
</script>

<style scoped>
.msfs-link-main-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.general-information {
  position: absolute;
  top: 10px;
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
  top: 20px;
}

.theme-button {
  top: 70px;
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
  top: 120px;
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
</style>
