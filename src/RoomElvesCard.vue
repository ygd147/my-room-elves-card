<template>
  <div
    class="room-elves-card-root"
    :style="rootStyle"
    v-if="hass && localConfig"
  >
    <!-- Environment overview (temperature per room) -->
    <EnvironmentOverview
      v-if="localConfig.overview?.length"
      :hass="hass"
      :overview="localConfig.overview"
    />
    <HeadMode
      v-if="localConfig.head || localConfig.buttons?.length"
      :hass="hass"
      :buttons="localConfig.buttons"
      :columns="localConfig.columns"
      :headColumns="localConfig.head_columns"
      :theme="resolvedTheme"
      :primaryTextVariant="localConfig.primary_text_variant"
      :showAnimation="resolvedShowAnimation"
    />
    <div v-else class="card-placeholder">
      <span>{{ localConfig.name || 'Room Elves Card' }}</span>
    </div>
  </div>
  <div v-else class="room-elves-card-waiting">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from './common/types'
import HeadMode from './components/layout/HeadMode.vue'
import EnvironmentOverview from './components/interactive/EnvironmentOverview.vue'
import { resolveConfigValue } from './common/entity-resolver'

const props = defineProps<{
  hass?: Hass | null
  config?: any
}>()

const localConfig = computed(() => {
  if (!props.config || typeof props.config !== 'object') return null
  return JSON.parse(JSON.stringify(props.config))
})

// Resolve entity references in top-level config values
const resolvedTheme = computed(() =>
  resolveConfigValue(localConfig.value?.theme, props.hass as Hass | null)
)

const resolvedShowAnimation = computed(() =>
  resolveConfigValue(localConfig.value?.show_animation, props.hass as Hass | null)
)

// Handle style config: [{ class, height, width }] → inline styles
const rootStyle = computed(() => {
  const styles: Record<string, string> = {}
  const styleCfg = localConfig.value?.style
  if (styleCfg && Array.isArray(styleCfg)) {
    for (const entry of styleCfg) {
      if (entry.height) styles.height = entry.height
      if (entry.width) styles.width = entry.width
    }
  }
  return styles
})
</script>

<style>
/* 样式保持不变 */
.room-elves-card-root { display: block; width: 100%; height: 100%; }
.card-placeholder { display: flex; align-items: center; justify-content: center; padding: 16px; color: var(--room-secondary-text, #999); font-size: 14px; }
.room-elves-card-waiting { padding: 12px; color: var(--room-secondary-text, #999); text-align: center; font-size: 13px; }
</style>
