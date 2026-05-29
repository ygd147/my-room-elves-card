<template>
  <div class="re-chart-metric" @click="handleClick">
    <div class="metric-header">
      <ha-icon v-if="parsedIcon" :icon="parsedIcon" :style="{ color: iconColor }"></ha-icon>
      <span class="metric-label">{{ label }}</span>
    </div>
    <div class="metric-value-row">
      <span class="metric-value">{{ displayValue }}</span>
      <span v-if="unit" class="metric-unit">{{ unit }}</span>
    </div>
    <div v-if="trendText" class="metric-trend" :class="trendClass">
      {{ trendText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState } from '../../common/hass'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  label?: string
  icon?: string
  iconColor?: string
  unit?: string
  value?: string
  trend?: 'up' | 'down' | 'stable'
  trendText?: string
}>()

const parsedIcon = computed(() => props.icon ? parseIcon(props.icon) : '')

const stateValue = computed(() => {
  if (props.value) return props.value
  if (!props.entity || !props.hass) return '--'
  return getEntityState(props.entity, props.hass)
})

const displayValue = computed(() => {
  const val = stateValue.value
  if (val === 'unavailable') return '--'
  return val
})

const trendClass = computed(() => {
  return {
    'trend-up': props.trend === 'up',
    'trend-down': props.trend === 'down',
    'trend-stable': props.trend === 'stable',
  }
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
.re-chart-metric {
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  cursor: pointer;
  transition: all 0.2s ease;
}
.re-chart-metric:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.metric-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.metric-label {
  font-size: 11px;
  color: var(--room-secondary-text, #666);
}
.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.metric-value {
  font-size: 24px;
  font-weight: 700;
}
.metric-unit {
  font-size: 12px;
  color: var(--room-secondary-text, #666);
}
.metric-trend {
  font-size: 11px;
  margin-top: 4px;
}
.trend-up { color: #e74c3c; }
.trend-down { color: #2ecc71; }
.trend-stable { color: #95a5a6; }
</style>
