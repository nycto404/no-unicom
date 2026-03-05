import { ref } from 'vue'

export const useVATSIMData = () => {
  const pilots = ref([])
  const controllers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchVATSIMData = async () => {
    loading.value = true
    error.value = null

    try {
      // Fetch from VATSIM data API
      // This is a placeholder - replace with actual VATSIM API endpoint
      const response = await fetch('https://data.vatsim.net/v3/vatsim-data.json')
      
      if (!response.ok) {
        throw new Error(`VATSIM API error: ${response.status}`)
      }

      const data = await response.json()
      
      pilots.value = data.pilots || []
      controllers.value = data.controllers || []

      return {
        pilots: pilots.value,
        controllers: controllers.value
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching VATSIM data:', err)
      return {
        pilots: [],
        controllers: []
      }
    } finally {
      loading.value = false
    }
  }

  return {
    pilots,
    controllers,
    loading,
    error,
    fetchVATSIMData
  }
}
