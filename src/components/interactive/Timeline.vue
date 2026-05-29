<template>
  <button
    class="re-timeline"
    :class="stateClass"
    :style="buttonStyle"
    @click="handleClick"
  >
    <div class="timeline-content">
      <div class="timeline-icon">
        <ha-icon :icon="currentIcon" :style="iconStyle"></ha-icon>
      </div>
      <div class="timeline-bar" ref="barRef">
        <div class="timeline-bar-mini">加载中...</div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState } from '../../common/hass'
import { hexToRgb, lightenColor } from '../../common/theme'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  icon?: string
  on_color?: string
  off_color?: string
  map_table?: Record<string, any>
}>()

const barRef = ref<HTMLElement | null>(null)

const state = computed(() => (props.entity ? getEntityState(props.entity, props.hass) : 'off'))
const stateClass = computed(() => {
  return isOn.value ? 'on btn-shimmer' : 'off'
})

const isOn = computed(() => {
  if (!props.map_table || !state.value) return false
  const s = state.value.toLowerCase()
  if (props.map_table.on) {
    if (typeof props.map_table.on === 'string' && props.map_table.on === s) return true
    if (Array.isArray(props.map_table.on) && props.map_table.on.includes(s)) return true
    if (props.map_table.on[s]) return true
  }
  return s === 'on'
})

const currentIcon = computed(() => {
  return parseIcon(props.icon || 'mdi:information-variant-circle')
})

const currentColor = computed(() => {
  return isOn.value ? (props.on_color || '#3498db') : (props.off_color || '#3498db')
})

const iconStyle = computed(() => ({
  color: currentColor.value,
  animation: isOn.value ? 'shake 2s ease-in-out infinite' : 'none',
}))

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
.re-timeline {
  display: flex;
  border: none;
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}
.re-timeline:hover {
  transform: translateY(-2px);
}
.timeline-content {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.timeline-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.timeline-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--room-slider-bg, rgba(0,0,0,0.1));
  overflow: hidden;
}
.timeline-bar-mini {
  font-size: 9px;
  color: var(--room-secondary-text, #666);
}
</style>
