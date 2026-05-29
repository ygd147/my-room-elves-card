<template>
  <button
    class="re-entity-light"
    :class="{ on: isOn, off: !isOn }"
    :style="buttonStyle"
    @click="handleClick"
  >
    <div class="icon-wrapper">
      <ha-icon :icon="currentIcon" :style="iconStyle"></ha-icon>
    </div>
    <span v-if="badgeCount > 0" class="badge">{{ badgeCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState, isEntityOn, toggleEntity } from '../../common/hass'
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
  onCount?: number
}>()

const isOn = computed(() => props.entity ? isEntityOn(props.entity, props.hass) : false)

const currentIcon = computed(() => {
  if (isOn.value && props.on_icon) return props.on_icon
  if (!isOn.value && props.off_icon) return props.off_icon
  return props.icon || 'mdi:lightbulb'
})

const currentColor = computed(() => {
  const c = isOn.value ? (props.on_color || '#f1c40f') : (props.off_color || '#95a5a6')
  return c
})

const iconStyle = computed(() => ({
  color: currentColor.value,
  animation: isOn.value ? 'shake 2s ease-in-out infinite' : 'none',
}))

const buttonStyle = computed(() => {
  const base = lightenColor(currentColor.value, 0.8)
  const rgb = hexToRgb(currentColor.value)
  return {
    background: base,
    boxShadow: isOn.value
      ? `0 4px 12px rgba(${rgb}, 0.3)`
      : `0 4px 12px rgba(${rgb}, 0.15)`,
  }
})

const badgeCount = computed(() => props.onCount || 0)

function handleClick() {
  if (props.entity) {
    toggleEntity(props.entity, props.hass)
  }
}
</script>

<style scoped>
.re-entity-light {
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
.re-entity-light:hover {
  transform: translateY(-2px);
}
.re-entity-light:active {
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
