<template>
  <div class="re-overview-section" v-if="overview?.length">
    <div
      v-for="(section, si) in overview"
      :key="si"
      class="overview-card"
    >
      <div class="overview-header">
        <ha-icon
          v-if="section.icon"
          :icon="parsedIcon(section.icon)"
          class="overview-header-icon"
        ></ha-icon>
        <span class="overview-title">{{ section.name }}</span>
      </div>
      <div class="rooms-grid">
        <div
          v-for="(tempConfig, roomName) in section.rooms"
          :key="roomName"
          class="room-temp-item"
        >
          <span class="temp-value">{{ readTemp(tempConfig?.temperature) }}</span>
          <span class="temp-label">{{ roomName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Hass, EnvironmentOverviewConfig } from '../../common/types'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  overview?: EnvironmentOverviewConfig[]
}>()

function parsedIcon(icon: string): string {
  return parseIcon(icon)
}

/** Read temperature from a sensor entity's state. */
function readTemp(entityId: string | undefined): string {
  if (!entityId || !props.hass) return '--'
  const state = props.hass.states[entityId]?.state
  if (state === undefined || state === 'unavailable' || state === 'unknown') return '--'
  // Try to parse as number and round
  const num = parseFloat(state)
  if (!isNaN(num)) return `${Math.round(num)}°`
  return `${state}°`
}
</script>

<style scoped>
.re-overview-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.overview-card {
  flex: 1;
  min-width: 150px;
  background: var(--room-card-bg, rgba(255, 255, 255, 0.8));
  border-radius: 12px;
  padding: 10px 14px;
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--room-border-color, rgba(0, 0, 0, 0.06));
}

.overview-header-icon {
  color: var(--room-primary-text, #3498db);
  font-size: 16px;
}

.overview-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--room-secondary-text, #666);
}

.rooms-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.room-temp-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--room-button-bg, rgba(0, 0, 0, 0.03));
  min-width: 50px;
}

.temp-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--room-primary-text, #e67e22);
}

.temp-label {
  font-size: 10px;
  color: var(--room-secondary-text, #999);
  white-space: nowrap;
}
</style>
