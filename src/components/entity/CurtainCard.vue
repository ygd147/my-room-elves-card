<template>
  <button
    class="re-entity-curtain"
    :class="{ on: isOpen }"
    :style="buttonStyle"
    @click="handleToggle"
  >
    <div class="icon-wrapper">
      <ha-icon :icon="currentIcon" :style="iconStyle"></ha-icon>
    </div>
    <span v-if="position !== null" class="position">{{ position }}%</span>
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

const state = computed(() => (props.entity ? getEntityState(props.entity, props.hass) : 'unknown'))
const isOpen = computed(() => state.value === 'open' || state.value === 'opening')

const position = computed(() => {
  if (!props.entity || !props.hass) return null
  const pos = props.hass.states[props.entity]?.attributes?.current_position
  return pos !== undefined ? pos : null
})

const currentIcon = computed(() => {
  if (isOpen.value && props.on_icon) return props.on_icon
  if (!isOpen.value && props.off_icon) return props.off_icon
  return isOpen.value ? 'mdi:curtain-open' : 'mdi:curtain'
})

const currentColor = computed(() => {
  return isOpen.value ? (props.on_color || '#d4b896') : (props.off_color || '#7f8c8d')
})

const iconStyle = computed(() => ({
  color: currentColor.value,
}))

const buttonStyle = computed(() => {
  return {
    background: lightenColor(currentColor.value, 0.8),
    boxShadow: `0 4px 12px rgba(${hexToRgb(currentColor.value)}, ${isOpen.value ? 0.3 : 0.15})`,
  }
})

function handleToggle() {
  if (!props.entity || !props.hass) return
  const domain = props.entity.split('.')[0]
  if (isOpen.value) {
    props.hass.callService(domain, 'close_cover', { entity_id: props.entity })
  } else {
    props.hass.callService(domain, 'open_cover', { entity_id: props.entity })
  }
}
</script>

<style scoped>
.re-entity-curtain {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 56px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px;
}
.re-entity-curtain:hover {
  transform: translateY(-2px);
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.position {
  font-size: 10px;
  font-weight: 600;
  color: var(--room-secondary-text, #666);
}
</style>
