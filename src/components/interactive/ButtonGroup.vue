<template>
  <div class="re-button-group" :class="directionClass">
    <div v-if="label" class="group-label">{{ label }}</div>
    <div class="group-tabs" :style="gapStyle">
      <button
        v-for="(btn, idx) in buttons"
        :key="idx"
        class="btn-group-item"
        :class="isItemOn(btn) ? 'on' : 'off'"
        :style="{ background: getItemBg(btn) }"
        @click="handleItemClick(btn)"
        :title="getItemName(btn)"
      >
        <ha-icon
          :icon="getItemIcon(btn)"
          :style="{ color: getItemColor(btn) }"
        ></ha-icon>
        <span
          v-if="showItemName(btn)"
          class="btn-group-text"
        >{{ getItemName(btn) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { isEntityOn } from '../../common/hass'
import { lightenColor } from '../../common/theme'
import { parseIcon } from '../../common/icons'
import { executeTapAction } from '../../common/tap-action'

interface GroupButton {
  entity?: string
  name?: string
  icon?: string
  on_icon?: string
  off_icon?: string
  on_color?: string
  off_color?: string
  show_name?: boolean
  tap_action?: any
}

const props = defineProps<{
  hass?: Hass | null
  buttons?: GroupButton[]
  label?: string
  direction?: 'horizontal' | 'vertical'
  gap?: string
  defaultColor?: string
  iconSize?: number
}>()

const directionClass = computed(() => `direction-${props.direction || 'horizontal'}`)

const gapStyle = computed(() => {
  return props.gap ? { gap: props.gap } : {}
})

function isItemOn(btn: GroupButton): boolean {
  return btn.entity ? isEntityOn(btn.entity, props.hass) : false
}

function getItemIcon(btn: GroupButton): string {
  if (isItemOn(btn) && btn.on_icon) return btn.on_icon
  if (!isItemOn(btn) && btn.off_icon) return btn.off_icon
  return parseIcon(btn.icon) || 'mdi:help-circle'
}

function getItemColor(btn: GroupButton): string {
  if (isItemOn(btn)) return btn.on_color || props.defaultColor || '#3498db'
  return btn.off_color || '#95a5a6'
}

function getItemBg(btn: GroupButton): string {
  return lightenColor(getItemColor(btn), 0.85)
}

function getItemName(btn: GroupButton): string {
  return btn.name || btn.entity?.split('.').pop() || 'button'
}

function showItemName(btn: GroupButton): boolean {
  return btn.show_name !== false
}

function handleItemClick(btn: GroupButton) {
  const action = btn.tap_action || { action: 'toggle' }
  executeTapAction(action, props.hass || null, btn.entity)
}
</script>

<style scoped>
.re-button-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.re-button-group.direction-horizontal .group-tabs {
  flex-direction: row;
}
.re-button-group.direction-vertical .group-tabs {
  flex-direction: column;
}
.group-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--room-secondary-text, #666);
}
.group-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.btn-group-item {
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}
.btn-group-item:hover {
  transform: translateY(-1px);
}
.btn-group-text {
  font-size: 11px;
  color: var(--room-secondary-text, #666);
}
</style>
