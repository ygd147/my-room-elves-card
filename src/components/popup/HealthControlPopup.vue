<template>
  <div class="re-popup-health" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="health-summary">
        <ha-icon icon="mdi:heart-pulse" class="heart-icon"></ha-icon>
        <div class="metrics">
          <div v-for="metric in healthMetrics" :key="metric.label" class="metric">
            <span class="metric-label">{{ metric.label }}</span>
            <span class="metric-value">{{ metric.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState, getEntityAttribute } from '../../common/hass'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  name?: string
  onClose?: () => void
  metrics?: Array<{ entity: string; label: string; unit?: string }>
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const displayName = computed(() => {
  if (props.name) return props.name
  return '健康数据'
})

const healthMetrics = computed(() => {
  if (!props.hass) return []
  return (props.metrics || []).map(m => ({
    label: m.label,
    value: props.hass?.states[m.entity]?.state || '--',
    unit: m.unit || '',
  }))
})

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-health {
  background: var(--room-popup-bg, rgba(255,255,255,0.95));
  border-radius: 16px;
  overflow: hidden;
  min-width: 280px;
}
.popup-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px; border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
}
.popup-title { font-size: 16px; font-weight: 600; }
.close-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px; }
.close-btn:hover { background: rgba(0,0,0,0.06); }
.popup-body { padding: 16px; }
.health-summary { text-align: center; }
.heart-icon { font-size: 48px; color: #e74c3c; animation: pulse 1.5s ease-in-out infinite; }
.metrics { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; justify-content: center; }
.metric { text-align: center; padding: 8px 16px; background: var(--room-button-bg, rgba(0,0,0,0.04)); border-radius: 10px; }
.metric-label { display: block; font-size: 10px; color: var(--room-secondary-text, #666); }
.metric-value { display: block; font-size: 20px; font-weight: 700; margin-top: 4px; }
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
