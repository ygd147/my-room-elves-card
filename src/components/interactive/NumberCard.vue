<template>
  <div class="re-number-card">
    <div class="number-header">
      <ha-icon :icon="parsedIcon"></ha-icon>
      <span class="number-name">{{ displayName }}</span>
    </div>
    <div class="number-controls">
      <button class="num-btn" @click="decrement">-</button>
      <span class="num-value">{{ currentValue }}{{ unit }}</span>
      <button class="num-btn" @click="increment">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState, getEntityAttribute } from '../../common/hass'
import { parseIcon } from '../../common/icons'
import { parseNumericState } from '../../common/formatters'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  name?: string
  icon?: string
  unit?: string
  step?: number
  min?: number
  max?: number
}>()

const parsedIcon = computed(() => parseIcon(props.icon || 'mdi:counter'))

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  }
  return 'Number'
})

const currentValue = computed(() => {
  if (!props.entity || !props.hass) return '--'
  return getEntityState(props.entity, props.hass)
})

function setValue(val: number) {
  if (props.entity && props.hass) {
    const domain = props.entity.split('.')[0]
    props.hass.callService(domain, 'set_value', {
      entity_id: props.entity,
      value: val,
    })
  }
}

function increment() {
  const step = props.step || 1
  const cur = parseNumericState(currentValue.value) || 0
  const max = props.max ?? Infinity
  setValue(Math.min(cur + step, max))
}

function decrement() {
  const step = props.step || 1
  const cur = parseNumericState(currentValue.value) || 0
  const min = props.min ?? -Infinity
  setValue(Math.max(cur - step, min))
}
</script>

<style scoped>
.re-number-card {
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
}
.number-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.number-name {
  font-size: 12px;
  color: var(--room-secondary-text, #666);
}
.number-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.num-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
  background: var(--room-button-bg, rgba(0,0,0,0.04));
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.num-btn:hover {
  background: var(--room-dropdown-item-active, rgba(0,0,0,0.1));
}
.num-value {
  font-size: 20px;
  font-weight: 700;
  min-width: 60px;
  text-align: center;
}
</style>
