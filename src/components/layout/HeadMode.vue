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
import { getCardComponent, mapButtonProps } from '../../common/card-resolver'

const props = defineProps<{
  hass?: Hass | null
  buttons?: ButtonConfig[]
  columns?: number
  headColumns?: number
  theme?: string
  primaryTextVariant?: string
  showAnimation?: boolean
}>()

const textVariant = computed(() => `variant-${props.primaryTextVariant || 'elegant'}`)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.headColumns || props.columns || 4}, 1fr)`,
}))

/** Resolve a ButtonConfig type to a Vue component object (from card-registry). */
function getElementTag(btn: ButtonConfig): any {
  return getCardComponent(btn.type) || getCardComponent('light')
}

/** Map ButtonConfig snake_case keys to component camelCase props. */
function getElementProps(btn: ButtonConfig, _idx: number): Record<string, any> {
  return mapButtonProps(btn)
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

/* variant-minimal: transparent, no border/shadow, understated */
.primary-text.variant-minimal {
  background: transparent;
  border: none;
  box-shadow: none;
  font-weight: 500;
  opacity: 0.8;
  backdrop-filter: none;
  border-bottom: 1px solid transparent;
  transition: all 0.15s ease;
}
.primary-text.variant-minimal:hover {
  background: rgba(0, 0, 0, 0.02);
  border-bottom-color: var(--room-primary-text, #3498db);
}

/* variant-neon: glowing border with text shadow, translucent bg */
.primary-text.variant-neon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
  padding: 3px 6px;
  border-radius: 4px;
}
.primary-text.variant-neon:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}

/* variant-badge: solid colored pill, white text */
.primary-text.variant-badge {
  background: var(--room-primary-text, #3498db);
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 9px;
  font-weight: 700;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.primary-text.variant-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
