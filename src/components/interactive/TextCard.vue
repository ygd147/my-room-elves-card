<template>
  <div class="re-text-card" @click="handleClick">
    <div class="text-header">
      <ha-icon v-if="parsedIcon" :icon="parsedIcon"></ha-icon>
      <span v-if="displayName" class="text-name">{{ displayName }}</span>
    </div>
    <div class="text-body">{{ displayValue }}</div>
    <div v-if="unit" class="text-unit">{{ unit }}</div>
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
  name?: string
  icon?: string
  unit?: string
}>()

const parsedIcon = computed(() => props.icon ? parseIcon(props.icon) : '')

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || ''
  }
  return ''
})

const displayValue = computed(() => {
  if (!props.entity || !props.hass) return '--'
  const state = getEntityState(props.entity, props.hass)
  const attr = props.hass.states[props.entity]?.attributes
  return attr?.state || state
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
.re-text-card {
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  cursor: pointer;
  transition: all 0.2s ease;
}
.re-text-card:hover {
  transform: translateY(-1px);
}
.text-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.text-name {
  font-size: 11px;
  color: var(--room-secondary-text, #666);
}
.text-body {
  font-size: 16px;
  font-weight: 600;
}
.text-unit {
  font-size: 11px;
  color: var(--room-secondary-text, #666);
  margin-top: 2px;
}
</style>
