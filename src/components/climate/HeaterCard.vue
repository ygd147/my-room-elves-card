<template>
  <button
    class="re-heater-card"
    :class="{ on: isOn }"
    :style="buttonStyle"
    @click="handleToggle"
  >
    <div class="icon-wrapper">
      <ha-icon :icon="currentIcon" :style="iconStyle"></ha-icon>
    </div>
    <div v-if="isOn" class="heater-label">{{ heaterTypeLabel }}</div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState } from '../../common/hass'
import { hexToRgb, lightenColor } from '../../common/theme'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  icon?: string
  on_color?: string
  off_color?: string
  activeType?: string
}>()

const state = computed(() => (props.entity ? getEntityState(props.entity, props.hass) : 'off'))
const isOn = computed(() => state.value === 'on')

const heaterTypeLabel = computed(() => {
  const typeLabels: Record<string, string> = {
    wind: '风机',
    water: '水暖',
    electric: '电热',
  }
  return typeLabels[props.activeType || ''] || ''
})

const currentIcon = computed(() => {
  if (!isOn.value) return 'mdi:radiator-off'
  const icons: Record<string, string> = {
    wind: 'mdi:fan',
    water: 'mdi:water-boiler',
    electric: 'mdi:radiator',
  }
  return icons[props.activeType || ''] || 'mdi:fire'
})

const currentColor = computed(() => {
  return isOn.value ? (props.on_color || '#e74c3c') : (props.off_color || '#95a5a6')
})

const iconStyle = computed(() => {
  let anim = ''
  if (isOn.value) {
    if (props.activeType === 'wind') anim = 'animation: spin 2s linear infinite;'
    else anim = 'animation: shake 2s ease-in-out infinite;'
  }
  return { color: currentColor.value, animation: anim }
})

const buttonStyle = computed(() => ({
  background: lightenColor(currentColor.value, 0.8),
  boxShadow: isOn.value
    ? `0 4px 12px rgba(${hexToRgb(currentColor.value)}, 0.3)`
    : `0 4px 12px rgba(${hexToRgb(currentColor.value)}, 0.15)`,
}))

function handleToggle() {
  if (!props.entity || !props.hass) return
  const domain = props.entity.split('.')[0]
  props.hass.callService(domain, isOn.value ? 'turn_off' : 'turn_on', { entity_id: props.entity })
}
</script>

<style scoped>
.re-heater-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 12px;
  width: 52px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.re-heater-card:hover {
  transform: translateY(-2px);
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.heater-label {
  font-size: 9px;
  color: var(--room-secondary-text, #666);
}
</style>
