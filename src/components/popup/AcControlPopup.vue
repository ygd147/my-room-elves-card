<template>
  <div class="re-popup-ac" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="temp-display">
        <span class="temp-value">{{ currentTemp }}°</span>
      </div>
      <div class="temp-controls">
        <button class="temp-btn" @click="adjustTemp(-1)">
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
        <span class="target-temp">{{ targetTemp }}°</span>
        <button class="temp-btn" @click="adjustTemp(1)">
          <ha-icon icon="mdi:chevron-up"></ha-icon>
        </button>
      </div>
      <div class="mode-buttons">
        <button
          v-for="mode in hvacModes"
          :key="mode.value"
          class="mode-btn"
          :class="{ active: hvacMode === mode.value }"
          @click="setMode(mode.value)"
        >
          <ha-icon :icon="mode.icon"></ha-icon>
          <span>{{ mode.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState, getEntityAttribute } from '../../common/hass'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  name?: string
  onClose?: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const hvacModes = [
  { value: 'off', icon: 'mdi:power-off', label: '关闭' },
  { value: 'cool', icon: 'mdi:snowflake', label: '制冷' },
  { value: 'heat', icon: 'mdi:fire', label: '制热' },
  { value: 'dry', icon: 'mdi:water-percent', label: '除湿' },
  { value: 'fan_only', icon: 'mdi:fan', label: '送风' },
  { value: 'auto', icon: 'mdi:thermostat-auto', label: '自动' },
]

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  }
  return '空调控制'
})

const hvacMode = computed(() => {
  if (!props.entity || !props.hass) return 'off'
  return getEntityState(props.entity, props.hass)
})

const currentTemp = computed(() => {
  if (!props.entity || !props.hass) return '--'
  return getEntityAttribute(props.entity, 'current_temperature', props.hass) ?? '--'
})

const targetTemp = computed(() => {
  if (!props.entity || !props.hass) return '--'
  return getEntityAttribute(props.entity, 'temperature', props.hass) ?? '--'
})

function setMode(mode: string) {
  if (!props.entity || !props.hass) return
  props.hass.callService('climate', 'set_hvac_mode', {
    entity_id: props.entity,
    hvac_mode: mode,
  })
}

function adjustTemp(delta: number) {
  if (!props.entity || !props.hass) return
  const current = getEntityAttribute(props.entity, 'temperature', props.hass)
  if (current === undefined) return
  props.hass.callService('climate', 'set_temperature', {
    entity_id: props.entity,
    temperature: current + delta,
  })
}

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-ac {
  background: var(--room-popup-bg, rgba(255,255,255,0.95));
  border-radius: 16px;
  overflow: hidden;
  min-width: 280px;
}
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
}
.popup-title { font-size: 16px; font-weight: 600; }
.close-btn {
  background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px;
}
.close-btn:hover { background: rgba(0,0,0,0.06); }
.popup-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.temp-display { text-align: center; }
.temp-value { font-size: 48px; font-weight: 300; color: #3498db; }
.temp-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.temp-btn {
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--room-button-bg, rgba(0,0,0,0.04));
}
.temp-btn:hover { background: rgba(0,0,0,0.08); }
.target-temp { font-size: 32px; font-weight: 700; min-width: 80px; text-align: center; }
.mode-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
  border-radius: 12px;
  cursor: pointer;
  font-size: 10px;
  background: var(--room-button-bg, rgba(0,0,0,0.04));
  transition: all 0.2s;
}
.mode-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}
.mode-btn:hover { transform: translateY(-1px); }
</style>
