<template>
  <button
    class="re-entity-switch"
    :class="{ active: isOn }"
    :style="buttonStyle"
    @click="handleToggle"
  >
    <div class="card-content">
      <ha-icon :icon="currentIcon" :style="iconStyle"></ha-icon>
      <div v-if="label" class="label">{{ label }}</div>
      <label class="toggle-switch" @click.stop>
        <input type="checkbox" :checked="isOn" @change="handleToggle" />
        <span class="toggle-slider"></span>
      </label>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { isEntityOn, toggleEntity } from '../../common/hass'
import { hexToRgb } from '../../common/theme'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  name?: string
  icon?: string
  on_icon?: string
  off_icon?: string
  label?: string
}>()

const isOn = computed(() => (props.entity ? isEntityOn(props.entity, props.hass) : false))

const currentIcon = computed(() => {
  if (isOn.value) return parseIcon(props.on_icon || props.icon) || 'mdi:toggle-switch'
  return parseIcon(props.off_icon || props.icon) || 'mdi:toggle-switch-off'
})

const iconStyle = computed(() => ({
  color: isOn.value ? '#2ecc71' : '#95a5a6',
}))

const buttonStyle = computed(() => ({
  background: isOn.value
    ? 'linear-gradient(180deg, rgba(255,236,153,0.8) 0%, rgba(255,236,153,0.05) 50%, transparent 100%)'
    : 'rgba(255, 255, 255, 0.05)',
  borderColor: isOn.value ? 'rgba(46,204,113,0.3)' : 'transparent',
}))

function handleToggle() {
  if (props.entity) toggleEntity(props.entity, props.hass)
}
</script>

<style scoped>
.re-entity-switch {
  display: flex;
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}
.re-entity-switch:hover {
  transform: translateY(-2px);
}
.card-content {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.label {
  font-size: 12px;
  font-weight: 500;
  flex: 1;
}
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--room-slider-bg, #ccc);
  transition: 0.3s;
  border-radius: 24px;
}
.toggle-slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.toggle-switch input:checked + .toggle-slider {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}
.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}
</style>
