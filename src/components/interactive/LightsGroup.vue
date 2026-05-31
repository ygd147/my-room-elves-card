<template>
  <div class="re-lights-group">
    <!-- Trigger button (visible in HeadMode grid) -->
    <button
      class="lights-trigger"
      :class="{ 'has-active': anyLightOn }"
      :style="triggerStyle"
      @click="popupVisible = true"
      :title="name || '全屋灯光'"
    >
      <ha-icon :icon="triggerIcon" :style="{ color: triggerColor }"></ha-icon>
    </button>

    <!-- Popup overlay -->
    <PopupOverlay
      :visible="popupVisible"
      :width="popupWidth"
      @close="popupVisible = false"
    >
      <div class="lights-popup">
        <!-- Header -->
        <div class="popup-header">
          <span class="popup-title">{{ name || '灯光控制' }}</span>
          <button class="close-btn" @click="popupVisible = false">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>

        <!-- Tab bar -->
        <div v-if="resolvedTabs && roomNames.length > 1" class="tabs-bar">
          <button
            v-for="room in roomNames"
            :key="room"
            class="tab-btn"
            :class="{ active: activeTab === room }"
            @click="activeTab = room"
          >
            {{ room }}
          </button>
        </div>

        <!-- Lights grid -->
        <div class="lights-grid" :style="gridStyle">
          <div
            v-for="light in displayedLights"
            :key="light.entity"
            class="light-item"
          >
            <button
              class="light-btn"
              :class="{ on: isLightOn(light), off: !isLightOn(light) }"
              :style="getLightBtnStyle(light)"
              @click="toggleLight(light)"
            >
              <ha-icon
                :icon="getLightIcon(light)"
                :style="{ color: getLightColor(light) }"
              ></ha-icon>
            </button>
            <span class="light-name">{{ light.name || light.entity }}</span>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!displayedLights.length" class="empty-state">
          暂无灯光
        </div>
      </div>
    </PopupOverlay>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Hass, LightCardItem } from '../../common/types'
import PopupOverlay from '../layout/PopupOverlay.vue'
import { resolveConfigValue } from '../../common/entity-resolver'
import { isEntityOn, toggleEntity } from '../../common/hass'
import { hexToRgb, lightenColor } from '../../common/theme'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  name?: string
  icon?: string
  onIcon?: string
  offIcon?: string
  onColor?: string
  offColor?: string
  apiBaseUrl?: string
  width?: string
  perLine?: number
  popupPosition?: string
  showDuration?: any
  groupLightsByRoom?: any
  showHistory?: any
  tabs?: any
  tabsBy?: string
  cards?: LightCardItem[]
}>()

// ── Popup visibility ──
const popupVisible = ref(false)

// ── Active tab (for room-based tabs) ──
const activeTab = ref('')

// ── Entity-resolved booleans ──
const resolvedTabs = computed(() => resolveConfigValue(props.tabs, props.hass as Hass | null))
const resolvedGroupByRoom = computed(() => resolveConfigValue(props.groupLightsByRoom, props.hass as Hass | null))
const resolvedShowDuration = computed(() => resolveConfigValue(props.showDuration, props.hass as Hass | null))
const resolvedShowHistory = computed(() => resolveConfigValue(props.showHistory, props.hass as Hass | null))

// ── Room names (unique, from cards) ──
const roomNames = computed(() => {
  if (!props.cards?.length) return []
  const names = new Set<string>()
  for (const c of props.cards) {
    if (c.room) names.add(c.room)
  }
  return Array.from(names)
})

// ── Filter lights by active tab ──
const displayedLights = computed(() => {
  if (!props.cards?.length) return []
  let list = props.cards.filter(c => c.entity)
  if (resolvedTabs.value && activeTab.value && roomNames.value.length > 1) {
    list = list.filter(c => c.room === activeTab.value)
  }
  // Set active tab to first room if not set
  if (resolvedTabs.value && !activeTab.value && roomNames.value.length) {
    activeTab.value = roomNames.value[0]
  }
  return list
})

// ── Grid style ──
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.perLine || 3}, 1fr)`,
}))

const popupWidth = computed(() => props.width || '430px')

// ── Trigger button ──
const anyLightOn = computed(() => {
  if (!props.hass || !props.cards?.length) return false
  return props.cards.some(c => c.entity && isEntityOn(c.entity, props.hass as Hass | null))
})

const triggerIcon = computed(() => {
  if (anyLightOn.value && props.onIcon) return parseIcon(props.onIcon)
  if (!anyLightOn.value && props.offIcon) return parseIcon(props.offIcon)
  return parseIcon(props.icon) || 'mdi:lightbulb-group'
})

const triggerColor = computed(() => {
  return anyLightOn.value ? (props.onColor || '#f58220') : (props.offColor || '#74787c')
})

const triggerStyle = computed(() => {
  const rgb = hexToRgb(triggerColor.value)
  return {
    background: lightenColor(triggerColor.value, 0.8),
    boxShadow: `0 4px 12px rgba(${rgb}, ${anyLightOn.value ? 0.3 : 0.15})`,
  }
})

// ── Individual light helpers ──
function isLightOn(light: LightCardItem): boolean {
  return light.entity ? isEntityOn(light.entity, props.hass as Hass | null) : false
}

function getLightIcon(light: LightCardItem): string {
  const on = isLightOn(light)
  if (on && light.on_icon) return light.on_icon
  if (!on && light.off_icon) return light.off_icon
  return 'mdi:lightbulb'
}

function getLightColor(light: LightCardItem): string {
  const on = isLightOn(light)
  if (on) return light.on_color || '#f58220'
  return light.off_color || '#74787c'
}

function getLightBtnStyle(light: LightCardItem) {
  const color = getLightColor(light)
  const rgb = hexToRgb(color)
  return {
    background: lightenColor(color, 0.8),
    boxShadow: isLightOn(light)
      ? `0 2px 8px rgba(${rgb}, 0.3)`
      : `0 2px 8px rgba(${rgb}, 0.1)`,
  }
}

function toggleLight(light: LightCardItem) {
  if (light.entity) {
    toggleEntity(light.entity, props.hass as Hass | null)
  }
}
</script>

<style scoped>
.re-lights-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lights-trigger {
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
.lights-trigger:hover {
  transform: translateY(-2px);
}

/* ── Popup ── */
.lights-popup {
  background: var(--room-popup-bg, rgba(255, 255, 255, 0.95));
  border-radius: 16px;
  overflow: hidden;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--room-border-color, rgba(0, 0, 0, 0.08));
}
.popup-title {
  font-size: 15px;
  font-weight: 600;
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
}
.close-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

/* ── Tabs ── */
.tabs-bar {
  display: flex;
  gap: 4px;
  padding: 10px 16px;
  overflow-x: auto;
  border-bottom: 1px solid var(--room-border-color, rgba(0, 0, 0, 0.06));
}
.tab-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 20px;
  background: var(--room-button-bg, rgba(0, 0, 0, 0.04));
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.tab-btn.active {
  background: var(--room-primary-text, #3498db);
  color: white;
}
.tab-btn:hover:not(.active) {
  background: rgba(0, 0, 0, 0.08);
}

/* ── Grid ── */
.lights-grid {
  display: grid;
  gap: 10px;
  padding: 16px;
  max-height: 50vh;
  overflow-y: auto;
}

.light-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.light-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}
.light-btn:hover {
  transform: translateY(-1px);
}

.light-name {
  font-size: 10px;
  color: var(--room-secondary-text, #666);
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  padding: 32px;
  text-align: center;
  color: var(--room-secondary-text, #999);
  font-size: 13px;
}
</style>
