<template>
  <button
    class="re-scene-mode"
    :style="buttonStyle"
    @click="handleClick"
  >
    <div class="icon-wrapper">
      <ha-icon :icon="parsedIcon" :style="iconStyle"></ha-icon>
    </div>
    <span v-if="sceneCount > 0" class="badge">{{ sceneCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  icon?: string
  icon_color?: string
  scenes?: Array<any>
  show_badge?: boolean
}>()

const parsedIcon = computed(() => parseIcon(props.icon || 'mdi:tune'))

const iconStyle = computed(() => ({
  color: props.icon_color || '#3498db',
}))

const buttonStyle = computed(() => ({
  background: 'rgba(52, 152, 219, 0.1)',
}))

const sceneCount = computed(() => props.scenes?.length || 0)
const showBadge = computed(() => props.show_badge !== false && sceneCount.value > 0)

function handleClick() {
  // Scene mode click handler - would dispatch scene selection UI
}
</script>

<style scoped>
.re-scene-mode {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}
.re-scene-mode:hover {
  transform: translateY(-2px);
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #3498db;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
</style>
