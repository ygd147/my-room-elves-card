<template>
  <button
    class="re-entity-device"
    :class="stateClass"
    :style="buttonStyle"
    @click="handleClick"
  >
    <div class="icon-wrapper">
      <ha-icon :icon="currentIcon" :style="iconStyle"></ha-icon>
    </div>
    <span v-if="showBadge" class="badge">{{ badgeCount }}</span>
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
  name?: string
  icon?: string
  on_icon?: string
  off_icon?: string
  on_color?: string
  off_color?: string
  badgeCount?: number
  showBadge?: boolean
}>()

const state = computed(() => (props.entity ? getEntityState(props.entity, props.hass) : 'off'))
const isOn = computed(() => state.value === 'on')

const stateClass = computed(() => (isOn.value ? 'on' : 'off'))

const currentColor = computed(() => {
  return isOn.value ? (props.on_color || '#2ecc71') : (props.off_color || '#e74c3c')
})

const currentIcon = computed(() => {
  if (isOn.value) return props.on_icon || props.icon || 'mdi:help-circle'
  return props.off_icon || props.icon || 'mdi:help-circle'
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
  if (!props.entity || !props.hass) return
  const domain = props.entity.split('.')[0]
  if (isOn.value) {
    props.hass.callService(domain, 'turn_off', { entity_id: props.entity })
  } else {
    props.hass.callService(domain, 'turn_on', { entity_id: props.entity })
  }
}
</script>

<style scoped>
.re-entity-device {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}
.re-entity-device:hover {
  transform: translateY(-2px);
}
.re-entity-device:active {
  transform: translateY(0);
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #e74c3c;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
</style>
