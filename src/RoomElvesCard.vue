<template>
  <div class="room-elves-card-root" v-if="hass && localConfig">
    <HeadMode
      v-if="localConfig.head || localConfig.buttons?.length"
      :hass="hass"
      :buttons="localConfig.buttons"
      :columns="localConfig.columns"
      :theme="localConfig.theme"
      :primaryTextVariant="localConfig.primary_text_variant"
    />
    <!-- Placeholder for other render modes (entity, chart, etc.) -->
    <div v-else class="card-placeholder">
      <span>{{ localConfig.name || 'Room Elves Card' }}</span>
    </div>
  </div>
  <div v-else class="room-elves-card-waiting">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Hass } from './common/types'
import HeadMode from './components/layout/HeadMode.vue'

defineProps<{
  hass?: Hass | null
}>()

const localConfig = ref<any>(null)

function setConfig(config: any): void {
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid configuration: config must be an object')
  }
  // Deep-clone to avoid external mutation issues (matching original JS behavior)
  localConfig.value = JSON.parse(JSON.stringify(config))
}

function getCardSize(): number {
  return 3
}

// Methods exposed via defineExpose become callable on the custom element
// in Vue 3.5+ defineCustomElement mode.
defineExpose({ setConfig, getCardSize })
</script>

<style>
/*
 * Global styles for the custom element — not scoped, so they apply
 * within the shadow DOM boundary.
 */
.room-elves-card-root {
  display: block;
  width: 100%;
  height: 100%;
}

.card-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: var(--room-secondary-text, #999);
  font-size: 14px;
}

.room-elves-card-waiting {
  padding: 12px;
  color: var(--room-secondary-text, #999);
  text-align: center;
  font-size: 13px;
}
</style>
