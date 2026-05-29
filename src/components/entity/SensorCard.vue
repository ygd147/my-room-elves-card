<template>
  <div class="re-entity-sensor" @click="handleClick">
    <div class="sensor-header">
      <ha-icon :icon="parsedIcon" :style="{ color: iconColor }"></ha-icon>
      <span class="sensor-name">{{ displayName }}</span>
    </div>
    <div class="sensor-value-row">
      <span class="sensor-value">{{ displayValue }}</span>
      <span v-if="unitOfMeasure" class="sensor-unit">{{ unitOfMeasure }}</span>
    </div>
    <div v-if="displayAttrs.length" class="sensor-attributes">
      <div v-for="attr in displayAttrs" :key="attr.key" class="sensor-attr">
        <span class="attr-label">{{ attr.label }}</span>
        <span class="attr-value">{{ attr.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState, getEntityAttribute } from '../../common/hass'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  name?: string
  icon?: string
  iconColor?: string
  unit?: string
  attributes?: { key: string; label: string }[]
}>()

const displayAttrs = computed(() => {
  if (!props.hass) return []
  return (props.attributes || []).map(a => ({
    key: a.key,
    label: a.label,
    value: a.key && props.entity ? (getEntityAttribute(props.entity, a.key, props.hass) ?? '--') : '--',
  }))
})

const state = computed(() => (props.entity ? getEntityState(props.entity, props.hass) : '--'))

const parsedIcon = computed(() => parseIcon(props.icon || 'mdi:thermometer'))

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  }
  return props.entity || 'Sensor'
})

const displayValue = computed(() => {
  return state.value
})

const unitOfMeasure = computed(() => {
  if (props.unit) return props.unit
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.unit_of_measurement || ''
  }
  return ''
})

function handleClick() {
  if (props.entity) {
    window.dispatchEvent(
      new CustomEvent('hass-more-info', { detail: { entityId: props.entity } })
    )
  }
}
</script>

<style scoped>
.re-entity-sensor {
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255, 255, 255, 0.8));
  cursor: pointer;
  transition: all 0.2s ease;
}
.re-entity-sensor:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.sensor-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.sensor-name {
  font-size: 12px;
  color: var(--room-secondary-text, #666);
}
.sensor-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.sensor-value {
  font-size: 24px;
  font-weight: 700;
}
.sensor-unit {
  font-size: 13px;
  color: var(--room-secondary-text, #666);
}
.sensor-attributes {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.sensor-attr {
  display: flex;
  gap: 4px;
  align-items: center;
}
.attr-label {
  font-size: 11px;
  color: var(--room-secondary-text, #666);
}
.attr-value {
  font-size: 12px;
  font-weight: 600;
}
</style>
