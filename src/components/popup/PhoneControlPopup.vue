<template>
  <div class="re-popup-phone" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="phone-info">
        <ha-icon icon="mdi:cellphone" class="phone-icon"></ha-icon>
        <span class="battery-level" :class="batteryClass">
          {{ battery }}%
        </span>
      </div>
      <div class="info-rows">
        <div class="info-row">
          <span class="info-label">状态</span>
          <span class="info-value">{{ isOn ? '在线' : '离线' }}</span>
        </div>
        <div class="info-row" v-if="battery">
          <span class="info-label">电量</span>
          <span class="info-value">{{ battery }}%</span>
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
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  return '手机状态'
})

const isOn = computed(() => props.entity ? getEntityState(props.entity, props.hass) === 'on' : false)

const battery = computed(() => {
  if (!props.entity || !props.hass) return null
  return getEntityAttribute(props.entity, 'battery_level', props.hass) ??
         getEntityAttribute(props.entity, 'battery', props.hass) ?? null
})

const batteryClass = computed(() => {
  if (!battery.value) return ''
  if (battery.value <= 20) return 'battery-low'
  if (battery.value <= 50) return 'battery-medium'
  return 'battery-high'
})

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-phone {
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
.phone-info { text-align: center; }
.phone-icon { font-size: 48px; color: #1890ff; }
.battery-level { display: block; font-size: 24px; font-weight: 700; margin-top: 8px; }
.battery-high { color: #2ecc71; }
.battery-medium { color: #f39c12; }
.battery-low { color: #e74c3c; }
.info-rows { display: flex; flex-direction: column; gap: 8px; }
.info-row {
  display: flex; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.04));
}
.info-label { font-size: 12px; color: var(--room-secondary-text, #666); }
.info-value { font-size: 13px; font-weight: 600; }
</style>
