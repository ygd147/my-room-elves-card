<template>
  <button
    class="re-entity-media"
    :class="stateClass"
    :style="buttonStyle"
    @click="handleClick"
  >
    <div class="icon-wrapper">
      <ha-icon :icon="currentIcon" :style="iconStyle"></ha-icon>
    </div>
    <div v-if="mediaTitle" class="media-title">{{ mediaTitle }}</div>
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
  icon?: string
  on_icon?: string
  off_icon?: string
  on_color?: string
  off_color?: string
}>()

const state = computed(() => (props.entity ? getEntityState(props.entity, props.hass) : 'off'))
const isActive = computed(() => ['on', 'idle', 'playing', 'paused'].includes(state.value))

const stateClass = computed(() => (isActive.value ? 'on' : 'off'))

const currentIcon = computed(() => {
  if (isActive.value && props.on_icon) return props.on_icon
  if (!isActive.value && props.off_icon) return props.off_icon
  return isActive.value ? 'mdi:cast-connected' : 'mdi:cast'
})

const currentColor = computed(() => {
  return isActive.value ? (props.on_color || '#2ecc71') : (props.off_color || '#e74c3c')
})

const iconStyle = computed(() => ({
  color: currentColor.value,
  animation: isActive.value ? 'shake 2s ease-in-out infinite' : 'none',
}))

const buttonStyle = computed(() => ({
  background: lightenColor(currentColor.value, 0.8),
  boxShadow: isActive.value
    ? `0 4px 12px rgba(${hexToRgb(currentColor.value)}, 0.3)`
    : `0 4px 12px rgba(${hexToRgb(currentColor.value)}, 0.15)`,
}))

const mediaTitle = computed(() => {
  if (!props.entity || !props.hass) return ''
  return props.hass.states[props.entity]?.attributes?.media_title || ''
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
.re-entity-media {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  border-radius: 12px;
  width: 56px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.re-entity-media:hover {
  transform: translateY(-2px);
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.media-title {
  font-size: 9px;
  color: var(--room-secondary-text, #666);
  text-align: center;
  max-width: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
