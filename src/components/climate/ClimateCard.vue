<template>
  <button
    class="re-climate-card"
    :class="stateClass"
    :style="buttonStyle"
    @click="handleClick"
  >
    <div class="icon-wrapper">
      <ha-icon :icon="currentIcon" :style="iconStyle"></ha-icon>
    </div>
    <div class="climate-info">
      <span class="temp">{{ currentTemp }}°</span>
      <span class="hvac-mode">{{ hvacLabel }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState } from '../../common/hass'
import { hexToRgb, lightenColor } from '../../common/theme'
import { parseNumericState } from '../../common/formatters'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  icon?: string
  on_color?: string
  off_color?: string
}>()

const state = computed(() => (props.entity ? getEntityState(props.entity, props.hass) : 'off'))
const isOn = computed(() => state.value === 'on' || ['cool', 'dry', 'heat', 'fan_only'].includes(state.value))

const stateClass = computed(() => (isOn.value ? 'on' : 'off'))

const hvacMode = computed(() => {
  if (!props.entity || !props.hass) return 'off'
  return props.hass.states[props.entity]?.state || 'off'
})

const hvacLabel = computed(() => {
  const labels: Record<string, string> = {
    off: '关闭',
    cool: '制冷',
    heat: '制热',
    dry: '除湿',
    fan_only: '送风',
    auto: '自动',
    on: '开启',
  }
  return labels[hvacMode.value] || hvacMode.value
})

const currentTemp = computed(() => {
  if (!props.entity || !props.hass) return '--'
  return props.hass.states[props.entity]?.attributes?.current_temperature || '--'
})

const targetTemp = computed(() => {
  if (!props.entity || !props.hass) return null
  return props.hass.states[props.entity]?.attributes?.temperature || null
})

const currentIcon = computed(() => {
  if (!isOn.value) return 'mdi:radiator-off'
  const icons: Record<string, string> = {
    cool: 'mdi:snowflake',
    heat: 'mdi:fire',
    dry: 'mdi:water-percent',
    fan_only: 'mdi:fan',
    auto: 'mdi:thermostat-auto',
  }
  return icons[hvacMode.value] || 'mdi:thermostat'
})

const currentColor = computed(() => {
  if (!isOn.value) return props.off_color || '#95a5a6'
  const colors: Record<string, string> = {
    cool: '#3498db',
    heat: '#e74c3c',
    dry: '#9b59b6',
    fan_only: '#1abc9c',
  }
  return colors[hvacMode.value] || (props.on_color || '#f39c12')
})

const iconStyle = computed(() => {
  let anim = ''
  if (isOn.value) {
    if (hvacMode.value === 'cool') anim = 'animation: spin 2s linear infinite;'
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

function handleClick() {
  if (props.entity) {
    window.dispatchEvent(
      new CustomEvent('hass-more-info', { detail: { entityId: props.entity } })
    )
  }
}
</script>

<style scoped>
.re-climate-card {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.re-climate-card:hover {
  transform: translateY(-2px);
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.climate-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.temp {
  font-size: 14px;
  font-weight: 700;
}
.hvac-mode {
  font-size: 10px;
  color: var(--room-secondary-text, #666);
}
</style>
