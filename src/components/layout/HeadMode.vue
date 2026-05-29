<template>
  <div class="re-layout-head-mode" :class="`theme-${theme}`">
    <div class="head-buttons-container" :style="gridStyle">
      <div
        v-for="(btn, idx) in buttons"
        :key="idx"
        class="head-button-wrapper"
        :style="getPositionStyle(btn, idx)"
      >
        <component
          :is="getElementTag(btn)"
          v-bind="getElementProps(btn, idx)"
          :hass="hass"
        ></component>
        <div v-if="getPrimaryText(btn)" class="primary-text" :class="textVariant">
          {{ getPrimaryText(btn) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass, ButtonConfig } from '../../common/types'

const props = defineProps<{
  hass?: Hass | null
  buttons?: ButtonConfig[]
  columns?: number
  theme?: string
  primaryTextVariant?: string
}>()

const textVariant = computed(() => `variant-${props.primaryTextVariant || 'elegant'}`)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns || 4}, 1fr)`,
}))

const elementTagMap: Record<string, string> = {
  light: 're-entity-light',
  switch: 're-entity-switch',
  sensor: 're-entity-sensor',
  curtain: 're-entity-curtain',
  media: 're-entity-media',
  device: 're-entity-device',
  'button_group': 're-interactive-button-group',
  user: 're-interactive-user',
  scene_mode: 're-interactive-scene',
  timeline: 're-interactive-timeline',
  slider: 're-interactive-slider',
  select: 're-interactive-select',
  text: 're-interactive-text',
  html: 're-interactive-html',
  number: 're-interactive-number',
}

function getElementTag(btn: ButtonConfig): string {
  return elementTagMap[btn.type] || 're-entity-light'
}

function getElementProps(btn: ButtonConfig, idx: number): Record<string, any> {
  return {
    entity: btn.entity,
    name: btn.name,
    icon: btn.icon,
    onIcon: btn.on_icon,
    offIcon: btn.off_icon,
    onColor: btn.on_color,
    offColor: btn.off_color,
  }
}

function getPrimaryText(btn: ButtonConfig): string {
  return btn.name || ''
}

function getPositionStyle(btn: ButtonConfig, idx: number): Record<string, string> {
  return {}
}
</script>

<style scoped>
.re-layout-head-mode {
  padding: 12px;
}
.head-buttons-container {
  display: grid;
  gap: 8px;
}
.head-button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.primary-text {
  font-size: 11px;
  color: var(--room-secondary-text, #666);
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.primary-text.variant-elegant {
  font-weight: 500;
  letter-spacing: 0.3px;
}
</style>
