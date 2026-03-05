import { ref, watch } from 'vue'

const isDarkMode = ref(false)

export const useTheme = () => {
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    isDarkMode.value = savedTheme === 'dark'
    applyTheme()
  }

  const applyTheme = () => {
    if (isDarkMode.value) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
  }

  const setTheme = (theme) => {
    isDarkMode.value = theme === 'dark'
    applyTheme()
  }

  // Watch for changes
  watch(isDarkMode, applyTheme)

  return {
    isDarkMode,
    initializeTheme,
    toggleTheme,
    setTheme
  }
}
