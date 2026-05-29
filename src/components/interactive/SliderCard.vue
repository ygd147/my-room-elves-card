<template>
  <div class="re-slider-card">
    <div class="slider-header">
      <ha-icon :icon="parsedIcon"></ha-icon>
      <span class="slider-name">{{ displayName }}</span>
      <span class="slider-value">{{ displayValue }}{{ unit }}</span>
    </div>
    <input
      type="range"
      class="slider-input"
      :min="min"
      :max="max"
      :step="step"
      :value="sliderValue"
      @input="handleInput"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState, getEntityAttribute } from '../../common/hass'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  name?: string
  icon?: string
  unit?: string
  min?: number
  max?: number
  step?: number
}>()

const localValue = ref<number | null>(null)
const isDragging = ref(false)

const state = computed(() => (props.entity ? getEntityState(props.entity, props.hass) : '0'))
const parsedIcon = computed(() => parseIcon(props.icon || 'mdi:tune'))

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  }
  return 'Slider'
})

const entityValue = computed(() => {
  if (!props.entity || !props.hass) return 0
  const val = getEntityAttribute(props.entity, 'brightness', props.hass)
    ?? props.hass.states[props.entity]?.attributes?.percentage_level
    ?? parseFloat(state.value)
  return isNaN(val) ? 0 : val
})

const sliderValue = computed(() => {
  return isDragging.value ? (localValue.value ?? 0) : entityValue.value
})

const displayValue = computed(() => Math.round(sliderValue.value))

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  localValue.value = parseInt(target.value)
  isDragging.value = true
}

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  const val = parseInt(target.value)
  isDragging.value = false
  localValue.value = null
  if (props.entity && props.hass) {
    const domain = props.entity.split('.')[0]
    props.hass.callService(domain, 'turn_on', {
      entity_id: props.entity,
      brightness: val,
    })
  }
}
</script>

<style scoped>
.re-slider-card {
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
}
.slider-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.slider-name {
  flex: 1;
  font-size: 12px;
  color: var(--room-secondary-text, #666);
}
.slider-value {
  font-size: 13px;
  font-weight: 600;
}
.slider-input {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 3px;
  background: var(--room-slider-bg, rgba(0,0,0,0.1));
  outline: none;
}
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
</style>
