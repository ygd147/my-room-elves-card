<template>
  <div class="re-room-section">
    <!-- Room header: icon + name + temperature -->
    <div class="room-header">
      <div class="room-name-row">
        <ha-icon v-if="icon" :icon="parsedIcon" class="room-icon"></ha-icon>
        <span class="room-name">{{ name }}</span>
      </div>
      <span v-if="currentTemp !== null" class="room-temp">{{ currentTemp }}°</span>
    </div>

    <!-- Sub-grid of entity cards for this room -->
    <div class="room-cards-grid" :style="gridStyle">
      <div
        v-for="(card, idx) in cards"
        :key="idx"
        class="room-card-wrapper"
      >
        <component
          :is="resolveComponent(card.type)"
          v-if="resolveComponent(card.type)"
          :hass="hass"
          v-bind="mapCardProps(card)"
        ></component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass, ButtonConfig } from '../../common/types'
import { getCardComponent, mapButtonProps } from '../../common/card-resolver'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  /** Room display name */
  name?: string
  /** Room icon (mdi:xxx) */
  icon?: string
  /** Climate entity for temperature display */
  tempEntity?: string
  /** Attribute name for temperature (default: current_temperature) */
  tempAttr?: string
  /** Entity cards in this room */
  cards?: ButtonConfig[]
  /** Grid columns for this room's cards */
  columns?: number
}>()

const parsedIcon = computed(() => parseIcon(props.icon || 'mdi:home'))

const currentTemp = computed(() => {
  if (!props.tempEntity || !props.hass) return null
  const attr = props.tempAttr || 'current_temperature'
  const val = props.hass.states[props.tempEntity]?.attributes?.[attr]
  if (val === undefined || val === null) return null
  return typeof val === 'number' ? Math.round(val) : val
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns || 4}, 1fr)`,
}))

/** Resolve a string type to a Vue component via card-registry. */
function resolveComponent(type: string) {
  return getCardComponent(type)
}

/** Map ButtonConfig snake_case keys to component camelCase props. */
function mapCardProps(card: ButtonConfig): Record<string, any> {
  return mapButtonProps(card)
}
</script>

<style scoped>
.re-room-section {
  margin-bottom: 12px;
}

.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 4px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--room-border-color, rgba(0, 0, 0, 0.08));
}

.room-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.room-icon {
  color: var(--room-primary-text, #3498db);
}

.room-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--room-primary-text, #333);
}

.room-temp {
  font-size: 13px;
  font-weight: 500;
  color: var(--room-secondary-text, #e67e22);
  background: var(--room-button-bg, rgba(0, 0, 0, 0.04));
  padding: 2px 8px;
  border-radius: 10px;
}

.room-cards-grid {
  display: grid;
  gap: 8px;
}

.room-card-wrapper {
  display: flex;
  justify-content: center;
}
</style>
