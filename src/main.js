import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { initializeDefaults } from './utils/localStorage'

// Initialize localStorage defaults
initializeDefaults()

const app = createApp(App)
app.mount('#app')
