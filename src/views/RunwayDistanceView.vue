<template>
  <div class="runway-page">
    <div class="runway-page__content">
      <header class="runway-page__header">
        <h1>Runway Distance Visualizer</h1>
        <p>Enter runway and performance values in the same unit (meters or feet).</p>
      </header>

      <section class="runway-grid">
        <form class="input-panel" @submit.prevent>
          <label>
            Runway Number
            <input
              v-model="form.runwayNumber"
              type="text"
              maxlength="3"
              placeholder="e.g. 27"
              inputmode="numeric"
            >
          </label>

          <label>
            Total Runway Length
            <input v-model.number="form.totalRunwayLength" type="number" min="1" step="1" placeholder="e.g. 2400">
          </label>

          <label>
            Available Takeoff Distance
            <input v-model.number="form.availableTakeoffDistance" type="number" min="0" step="1" placeholder="e.g. 2200">
          </label>

          <label>
            Available Landing Distance
            <input v-model.number="form.availableLandingDistance" type="number" min="0" step="1" placeholder="e.g. 2100">
          </label>

          <label>
            Takeoff Distance Needed
            <input v-model.number="form.takeoffDistanceNeeded" type="number" min="0" step="1" placeholder="e.g. 1650">
          </label>

          <label>
            Landing Distance Needed
            <input v-model.number="form.landingDistanceNeeded" type="number" min="0" step="1" placeholder="e.g. 1450">
          </label>
        </form>

        <div class="visual-panel">
          <div class="runway-meta">
            <div><strong>Runway:</strong> {{ runwayLabel }}</div>
            <div><strong>Total Length:</strong> {{ formatNumber(safeTotalRunwayLength) }}</div>
          </div>

          <div class="runway-wrapper" role="img" aria-label="Runway with takeoff and landing markers">
            <div class="runway-number runway-number--left">RWY {{ runwayLabel }}</div>
            <div class="runway-number runway-number--right">RWY {{ oppositeRunwayLabel }}</div>

            <div class="runway-strip">
              <div class="runway-centerline"></div>

              <div
                class="zone zone--takeoff"
                :style="{ width: `${availableTakeoffPercent}%` }"
                title="Available takeoff distance"
              ></div>

              <div
                class="zone zone--landing"
                :style="{ width: `${availableLandingPercent}%` }"
                title="Available landing distance"
              ></div>

              <div
                class="marker marker--takeoff-needed"
                :style="{ left: `${takeoffNeededPercent}%` }"
              >
                <span>TO Needed</span>
              </div>

              <div
                class="marker marker--landing-needed"
                :style="{ left: `${landingNeededMarkerPercent}%` }"
              >
                <span>LDG Needed</span>
              </div>

              <div
                class="marker marker--takeoff-available"
                :style="{ left: `${availableTakeoffPercent}%` }"
              >
                <span>TO Available</span>
              </div>

              <div
                class="marker marker--landing-available"
                :style="{ left: `${landingAvailableMarkerPercent}%` }"
              >
                <span>LDG Available</span>
              </div>
            </div>

            <div class="scale">
              <span>0</span>
              <span>{{ formatNumber(safeTotalRunwayLength) }}</span>
            </div>
          </div>

          <div class="performance-cards">
            <div class="card" :class="takeoffMargin >= 0 ? 'ok' : 'warn'">
              <h3>Takeoff Margin</h3>
              <p>{{ formatSignedNumber(takeoffMargin) }}</p>
            </div>
            <div class="card" :class="landingMargin >= 0 ? 'ok' : 'warn'">
              <h3>Landing Margin</h3>
              <p>{{ formatSignedNumber(landingMargin) }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'

const form = reactive({
  runwayNumber: '27',
  totalRunwayLength: 2400,
  availableTakeoffDistance: 2200,
  availableLandingDistance: 2100,
  takeoffDistanceNeeded: 1650,
  landingDistanceNeeded: 1450
})

const safeTotalRunwayLength = computed(() => {
  const value = Number(form.totalRunwayLength) || 0
  return value > 0 ? value : 1
})

const runwayLabel = computed(() => {
  const raw = String(form.runwayNumber || '').trim()
  if (!raw) {
    return '00'
  }

  const numeric = Number(raw)
  if (Number.isNaN(numeric)) {
    return raw.toUpperCase()
  }

  const normalized = Math.min(36, Math.max(1, Math.round(numeric)))
  return String(normalized).padStart(2, '0')
})

const oppositeRunwayLabel = computed(() => {
  const numeric = Number(runwayLabel.value)
  if (Number.isNaN(numeric) || numeric <= 0) {
    return '--'
  }

  const opposite = ((numeric + 18 - 1) % 36) + 1
  return String(opposite).padStart(2, '0')
})

const availableTakeoffPercent = computed(() => toPercent(form.availableTakeoffDistance))
const availableLandingPercent = computed(() => toPercent(form.availableLandingDistance))
const takeoffNeededPercent = computed(() => toPercent(form.takeoffDistanceNeeded))

const landingNeededMarkerPercent = computed(() => toPercent(form.landingDistanceNeeded))

const landingAvailableMarkerPercent = computed(() => toPercent(form.availableLandingDistance))

const takeoffMargin = computed(() => {
  return clampNumber(form.availableTakeoffDistance) - clampNumber(form.takeoffDistanceNeeded)
})

const landingMargin = computed(() => {
  return clampNumber(form.availableLandingDistance) - clampNumber(form.landingDistanceNeeded)
})

function clampNumber(value) {
  const numeric = Number(value) || 0
  return Math.max(0, Math.min(numeric, safeTotalRunwayLength.value))
}

function toPercent(value) {
  const total = safeTotalRunwayLength.value
  const clamped = Math.max(0, Math.min(Number(value) || 0, total))
  return (clamped / total) * 100
}

function formatNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString()
}

function formatSignedNumber(value) {
  const numeric = Math.round(Number(value) || 0)
  if (numeric > 0) {
    return `+${numeric.toLocaleString()}`
  }
  return numeric.toLocaleString()
}
</script>

<style scoped>
.runway-page {
  min-height: 100vh;
  background: radial-gradient(circle at 10% 10%, #dde9f9, #f8fbff 45%, #dfe7f2 100%);
  color: #172131;
  overflow-y: auto;
}

.runway-page__content {
  max-width: 1150px;
  margin: 0 auto;
  padding: 88px 20px 24px;
}

.runway-page__header {
  margin-bottom: 18px;
}

.runway-page__header h1 {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  margin-bottom: 8px;
}

.runway-page__header p {
  color: #3f4a5a;
}

.runway-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(260px, 320px) 1fr;
}

.input-panel {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 16px;
  display: grid;
  gap: 12px;
  align-content: start;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.input-panel label {
  display: grid;
  gap: 6px;
  font-weight: 600;
  font-size: 0.92rem;
}

.input-panel input {
  border: 1px solid #b6c2d1;
  border-radius: 8px;
  font-size: 1rem;
  padding: 9px 10px;
}

.input-panel input:focus {
  outline: 2px solid #5c8be2;
  border-color: #5c8be2;
}

.visual-panel {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.runway-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.runway-wrapper {
  margin-top: 20px;
}

.runway-number {
  font-weight: 700;
  font-size: 0.86rem;
  color: #4b5563;
}

.runway-number--left {
  text-align: left;
  margin-bottom: 6px;
}

.runway-number--right {
  text-align: right;
  margin-top: 6px;
}

.runway-strip {
  position: relative;
  height: 94px;
  border-radius: 10px;
  background: repeating-linear-gradient(
    to right,
    #404753,
    #404753 22px,
    #39414d 22px,
    #39414d 44px
  );
  border: 2px solid #252b34;
  overflow: hidden;
}

.runway-centerline {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  transform: translateY(-50%);
  background: repeating-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.95) 24px,
    transparent 24px,
    transparent 45px
  );
  z-index: 2;
}

.zone {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
}

.zone--takeoff {
  left: 0;
  background: rgba(34, 197, 94, 0.24);
}

.zone--landing {
  left: 0;
  background: rgba(14, 165, 233, 0.24);
}

.marker {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  z-index: 3;
}

.marker::before {
  content: '';
  position: absolute;
  inset: 0;
}

.marker span {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
  background: rgba(255, 255, 255, 0.95);
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.marker--takeoff-needed::before {
  background: #16a34a;
}

.marker--takeoff-needed span {
  top: 6px;
}

.marker--landing-needed::before {
  background: #f97316;
}

.marker--landing-needed span {
  bottom: 6px;
}

.marker--takeoff-available::before {
  background: #14532d;
  border-left: 1px dashed rgba(255, 255, 255, 0.9);
}

.marker--takeoff-available span {
  top: -26px;
}

.marker--landing-available::before {
  background: #0c4a6e;
  border-left: 1px dashed rgba(255, 255, 255, 0.9);
}

.marker--landing-available span {
  bottom: -26px;
}

.scale {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #4b5563;
}

.performance-cards {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.card {
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.card h3 {
  font-size: 0.92rem;
  margin-bottom: 6px;
}

.card p {
  font-size: 1.2rem;
  font-weight: 700;
}

.card.ok {
  background: #ecfdf3;
  color: #14532d;
}

.card.warn {
  background: #fff7ed;
  color: #9a3412;
}

@media (max-width: 950px) {
  .runway-grid {
    grid-template-columns: 1fr;
  }

  .runway-page__content {
    padding-top: 76px;
  }
}

@media (max-width: 680px) {
  .runway-strip {
    height: 84px;
  }

  .marker span {
    font-size: 0.68rem;
  }

  .performance-cards {
    grid-template-columns: 1fr;
  }
}
</style>
