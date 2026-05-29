<template>
  <div class="re-popup-light" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="light-control">
        <div class="brightness-section">
          <span class="section-label">亮度</span>
          <input
            type="range"
            class="slider"
            min="0"
            max="255"
            :value="brightness"
            @input="handleBrightnessChange"
          />
          <span class="value-label">{{ Math.round((brightness / 255) * 100) }}%</span>
        </div>
        <div class="color-section" v-if="supportColor">
          <span class="section-label">色温</span>
          <input
            type="range"
            class="slider"
            min="153"
            max="500"
            :value="colorTemp"
            @input="handleColorTempChange"
          />
        </div>
        <div class="action-buttons">
          <button class="action-btn" @click="toggleLight">
            <ha-icon :icon="isOn ? 'mdi:lightbulb-off' : 'mdi:lightbulb'"></ha-icon>
            <span>{{ isOn ? '关闭' : '开启' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const brightness = ref(255)
const colorTemp = ref(400)

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  }
  return '灯光控制'
})

const isOn = computed(() => {
  if (!props.entity || !props.hass) return false
  return getEntityState(props.entity, props.hass) === 'on'
})

const supportColor = computed(() => {
  if (!props.entity || !props.hass) return false
  const supported = getEntityAttribute(props.entity, 'supported_color_modes', props.hass) || []
  return supported.includes('color_temp') || supported.includes('hs')
})

// Brightness from entity (0-255)
if (props.entity && props.hass) {
  const b = getEntityAttribute(props.entity, 'brightness', props.hass)
  if (b !== undefined) brightness.value = b
  const ct = getEntityAttribute(props.entity, 'color_temp', props.hass)
  if (ct !== undefined) colorTemp.value = ct
}

function toggleLight() {
  if (!props.entity || !props.hass) return
  props.hass.callService('light', isOn.value ? 'turn_off' : 'turn_on', {
    entity_id: props.entity,
  })
}

function handleBrightnessChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  brightness.value = val
  if (!props.entity || !props.hass) return
  props.hass.callService('light', 'turn_on', {
    entity_id: props.entity,
    brightness: val,
  })
}

function handleColorTempChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  colorTemp.value = val
  if (!props.entity || !props.hass) return
  props.hass.callService('light', 'turn_on', {
    entity_id: props.entity,
    color_temp: val,
  })
}

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-light {
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
.popup-title {
  font-size: 16px;
  font-weight: 600;
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
}
.close-btn:hover {
  background: rgba(0,0,0,0.06);
}
.popup-body {
  padding: 16px;
}
.light-control {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.brightness-section,
.color-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-label {
  font-size: 12px;
  color: var(--room-secondary-text, #666);
}
.slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 3px;
  background: var(--room-slider-bg, rgba(0,0,0,0.1));
  outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.value-label {
  font-size: 12px;
  font-weight: 600;
  text-align: right;
}
.action-buttons {
  display: flex;
  gap: 8px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  background: var(--room-button-bg, rgba(0,0,0,0.04));
}
.action-btn:hover {
  background: var(--room-dropdown-item-active, rgba(0,0,0,0.1));
}
</style>
