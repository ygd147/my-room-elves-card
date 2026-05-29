<template>
  <div class="re-popup-curtain" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="curtain-control">
        <div class="position-display">
          <span class="position-value">{{ position }}%</span>
          <span class="position-label">开合度</span>
        </div>
        <input
          type="range"
          class="slider"
          min="0"
          max="100"
          :value="position"
          @change="handlePositionChange"
        />
        <div class="quick-buttons">
          <button class="quick-btn" @click="setPosition(0)">
            <ha-icon icon="mdi:curtain"></ha-icon>
            <span>关闭</span>
          </button>
          <button class="quick-btn" @click="setPosition(50)">
            <ha-icon icon="mdi:curtain-half-open"></ha-icon>
            <span>半开</span>
          </button>
          <button class="quick-btn" @click="setPosition(100)">
            <ha-icon icon="mdi:curtain-open"></ha-icon>
            <span>全开</span>
          </button>
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
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  }
  return '窗帘控制'
})

const position = computed(() => {
  if (!props.entity || !props.hass) return 0
  return getEntityAttribute(props.entity, 'current_position', props.hass) ?? 0
})

function setPosition(pos: number) {
  if (!props.entity || !props.hass) return
  const domain = props.entity.split('.')[0]
  if (pos === 0) {
    props.hass.callService(domain, 'close_cover', { entity_id: props.entity })
  } else if (pos === 100) {
    props.hass.callService(domain, 'open_cover', { entity_id: props.entity })
  } else {
    props.hass.callService(domain, 'set_cover_position', {
      entity_id: props.entity,
      position: pos,
    })
  }
}

function handlePositionChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  setPosition(val)
}

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-curtain {
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
.popup-body { padding: 16px; }
.curtain-control {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.position-display {
  text-align: center;
}
.position-value {
  font-size: 36px;
  font-weight: 700;
  color: #d4b896;
}
.position-label {
  display: block;
  font-size: 11px;
  color: var(--room-secondary-text, #666);
  margin-top: 4px;
}
.slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 3px;
  background: var(--room-slider-bg, rgba(0,0,0,0.1));
  outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.quick-buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}
.quick-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
  border-radius: 12px;
  cursor: pointer;
  font-size: 11px;
  background: var(--room-button-bg, rgba(0,0,0,0.04));
}
.quick-btn:hover {
  background: var(--room-dropdown-item-active, rgba(0,0,0,0.1));
}
</style>
