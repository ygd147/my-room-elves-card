<template>
  <div class="re-popup-socket" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="power-display">
        <span class="power-icon">
          <ha-icon :icon="isOn ? 'mdi:power-plug' : 'mdi:power-plug-off'"
                   :style="{ color: isOn ? '#2ecc71' : '#e74c3c' }"></ha-icon>
        </span>
        <span class="power-state">{{ isOn ? '已开启' : '已关闭' }}</span>
      </div>
      <div v-if="powerConsumption !== null" class="consumption">
        <span class="consumption-value">{{ powerConsumption }}</span>
        <span class="consumption-unit">W</span>
      </div>
      <div class="action-buttons">
        <button class="action-btn" :class="isOn ? 'danger' : 'primary'" @click="toggleSocket">
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
  onClose?: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  return '插座控制'
})

const isOn = computed(() => props.entity ? getEntityState(props.entity, props.hass) === 'on' : false)

const powerConsumption = computed(() => {
  if (!props.entity || !props.hass) return null
  const power = getEntityAttribute(props.entity, 'current_power_w', props.hass) ??
                getEntityAttribute(props.entity, 'power', props.hass)
  return power !== undefined ? power : null
})

function toggleSocket() {
  if (!props.entity || !props.hass) return
  const domain = props.entity.split('.')[0]
  props.hass.callService(domain, isOn.value ? 'turn_off' : 'turn_on', { entity_id: props.entity })
}

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-socket {
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
.popup-body { padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.power-display { text-align: center; }
.power-icon ha-icon { font-size: 48px; }
.power-state { display: block; font-size: 14px; margin-top: 8px; }
.consumption { text-align: center; }
.consumption-value { font-size: 32px; font-weight: 700; }
.consumption-unit { font-size: 14px; color: var(--room-secondary-text, #666); margin-left: 4px; }
.action-btn {
  padding: 10px 32px; border: none; border-radius: 10px; cursor: pointer;
  font-size: 14px; font-weight: 600;
}
.action-btn.primary { background: #2ecc71; color: white; }
.action-btn.danger { background: #e74c3c; color: white; }
.action-btn:hover { opacity: 0.9; }
</style>
