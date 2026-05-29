<template>
  <div class="re-popup-person" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="person-header">
        <ha-icon icon="mdi:account-circle" class="person-avatar"></ha-icon>
        <span class="person-name">{{ displayName }}</span>
        <span class="person-status" :class="{ online: isOn }">
          {{ isOn ? '在家' : '离家' }}
        </span>
      </div>
      <div class="person-details">
        <div v-for="detail in details" :key="detail.label" class="detail-row">
          <span class="detail-label">{{ detail.label }}</span>
          <span class="detail-value">{{ detail.value }}</span>
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
  details?: Array<{ entity: string; label: string }>
  onClose?: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  return '人员'
})

const isOn = computed(() => {
  if (!props.entity || !props.hass) return false
  const state = getEntityState(props.entity, props.hass)
  return state === 'on' || state === 'home'
})

const details = computed(() => {
  if (!props.hass) return []
  return (props.details || []).map(d => ({
    label: d.label,
    value: props.hass?.states[d.entity]?.state || '--',
  }))
})

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-person {
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
.popup-body { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.person-header { text-align: center; }
.person-avatar { font-size: 48px; color: #3498db; }
.person-name { display: block; font-size: 16px; font-weight: 600; margin-top: 8px; }
.person-status { display: inline-block; font-size: 12px; padding: 2px 12px; border-radius: 10px; margin-top: 4px; background: #e74c3c; color: white; }
.person-status.online { background: #2ecc71; }
.detail-row {
  display: flex; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.04));
}
.detail-label { font-size: 12px; color: var(--room-secondary-text, #666); }
.detail-value { font-size: 13px; font-weight: 600; }
</style>
