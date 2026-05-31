<template>
  <div class="re-popup-free-layout" v-if="hass">
    <div class="popup-header">
      <span class="popup-title">{{ title }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body" :style="bodyStyle">
      <div class="grid-layout" :style="gridStyle">
        <div
          v-for="(card, idx) in cards"
          :key="idx"
          class="grid-cell"
          :class="{ 'is-custom-card': card.type === 'custom' }"
        >
          <component
            :is="getCardComponentByTag(card.tag)"
            v-if="card.tag"
            :hass="hass"
            v-bind="card.config"
          ></component>
          <div v-else class="placeholder-card">
            {{ card.name || '卡片' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { resolveCardComponent } from '../../common/card-resolver'

interface GridCard {
  type?: string
  name?: string
  tag?: string
  config?: Record<string, any>
  entity?: string
  icon?: string
}

const props = defineProps<{
  hass?: Hass | null
  title?: string
  cards?: GridCard[]
  layout?: 'grid' | 'free'
  columns?: number
  gap?: number
  width?: string
  style?: string
  onClose?: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns || 2}, 1fr)`,
  gap: `${props.gap || 12}px`,
}))

const bodyStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.width) s.width = props.width
  if (props.style) {
    props.style.split(';').filter(Boolean).forEach(decl => {
      const [key, val] = decl.split(':').map(s => s.trim())
      if (key && val) s[key] = val
    })
  }
  return s
})

function handleClose() {
  emit('close')
  props.onClose?.()
}

/** Resolve a card tag string (e.g. "entity-light", "chart-line") to a Vue component. */
function getCardComponentByTag(tag: string | undefined): any {
  if (!tag) return undefined
  return resolveCardComponent(tag)
}
</script>

<style scoped>
.re-popup-free-layout {
  background: var(--room-popup-bg, rgba(255,255,255,0.95));
  border-radius: 16px;
  overflow: hidden;
  min-width: 300px;
  max-width: 600px;
}
.popup-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px; border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
}
.popup-title { font-size: 16px; font-weight: 600; }
.close-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px; }
.close-btn:hover { background: rgba(0,0,0,0.06); }
.popup-body { padding: 16px; max-height: 70vh; overflow-y: auto; }
.grid-layout { display: grid; }
.placeholder-card {
  padding: 20px; text-align: center; border-radius: 12px;
  background: var(--room-button-bg, rgba(0,0,0,0.04));
  font-size: 13px; color: var(--room-secondary-text, #666);
}
</style>
