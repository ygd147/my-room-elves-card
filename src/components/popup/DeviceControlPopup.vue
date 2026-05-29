<template>
  <div class="re-popup-device" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="device-status">
        <div class="status-row">
          <span class="status-label">状态</span>
          <span class="status-value" :class="isOn ? 'on' : 'off'">
            {{ isOn ? '开启' : '关闭' }}
          </span>
        </div>
        <div v-for="attr in displayAttrs" :key="attr.key" class="status-row">
          <span class="status-label">{{ attr.label }}</span>
          <span class="status-value">{{ attr.value }}</span>
        </div>
      </div>
      <div class="action-buttons">
        <button class="action-btn primary" @click="toggleDevice">
          <ha-icon :icon="isOn ? 'mdi:power-off' : 'mdi:power-on'"></ha-icon>
          <span>{{ isOn ? '关闭' : '开启' }}</span>
        </button>
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
  displayAttributes?: Array<{ key: string; label: string }>
  onClose?: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  }
  return '设备控制'
})

const isOn = computed(() => {
  if (!props.entity || !props.hass) return false
  return getEntityState(props.entity, props.hass) === 'on'
})

const displayAttrs = computed(() => {
  if (!props.entity || !props.hass) return []
  return (props.displayAttributes || []).map(attr => ({
    ...attr,
    value: getEntityAttribute(props.entity!, attr.key, props.hass) ?? '--',
  }))
})

function toggleDevice() {
  if (!props.entity || !props.hass) return
  const domain = props.entity.split('.')[0]
  props.hass.callService(domain, isOn.value ? 'turn_off' : 'turn_on', {
    entity_id: props.entity,
  })
}

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-device {
  background: var(--room-popup-bg, rgba(255,255,255,0.95));
  border-radius: 16px;
  overflow: hidden;
  min-width: 280px;
}
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
}
.popup-title { font-size: 16px; font-weight: 600; }
.close-btn {
  background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px;
}
.close-btn:hover { background: rgba(0,0,0,0.06); }
.popup-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.device-status { display: flex; flex-direction: column; gap: 8px; }
.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.04));
}
.status-label { font-size: 12px; color: var(--room-secondary-text, #666); }
.status-value { font-size: 13px; font-weight: 600; }
.status-value.on { color: #2ecc71; }
.status-value.off { color: #e74c3c; }
.action-buttons { display: flex; gap: 8px; }
.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
}
.action-btn.primary {
  background: #3498db;
  color: white;
}
.action-btn.primary:hover { background: #2980b9; }
</style>
