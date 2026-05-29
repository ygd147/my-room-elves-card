<template>
  <div class="re-popup-consumables" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="items-list">
        <div v-for="item in consumableItems" :key="item.entity" class="consumable-item">
          <div class="item-header">
            <ha-icon :icon="item.icon"></ha-icon>
            <span class="item-name">{{ item.name }}</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: item.percentage + '%', background: item.color }"
            ></div>
          </div>
          <span class="item-value">{{ item.remaining }}</span>
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
  items?: Array<{ entity: string; name: string; icon?: string; max?: number }>
  onClose?: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const displayName = computed(() => {
  if (props.name) return props.name
  return '耗材管理'
})

const consumableItems = computed(() => {
  if (!props.hass) return []
  return (props.items || []).map(item => {
    const state = props.hass?.states[item.entity]
    const value = state ? parseInt(state.state) : 0
    const max = item.max || 100
    const pct = Math.min(100, Math.max(0, (value / max) * 100))
    let color = '#2ecc71'
    if (pct <= 20) color = '#e74c3c'
    else if (pct <= 50) color = '#f39c12'
    return {
      entity: item.entity,
      name: item.name,
      icon: item.icon || 'mdi:clipboard-list',
      percentage: pct,
      remaining: state?.state || '0',
      color,
    }
  })
})

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-consumables {
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
.popup-body { padding: 16px; }
.items-list { display: flex; flex-direction: column; gap: 16px; }
.consumable-item { display: flex; flex-direction: column; gap: 6px; }
.item-header { display: flex; align-items: center; gap: 6px; }
.item-name { font-size: 13px; }
.progress-bar { height: 8px; border-radius: 4px; background: var(--room-slider-bg, rgba(0,0,0,0.1)); overflow: hidden; }
.progress-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
.item-value { font-size: 11px; color: var(--room-secondary-text, #666); text-align: right; }
</style>
