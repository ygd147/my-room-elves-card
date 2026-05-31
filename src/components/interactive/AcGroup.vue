<template>
  <div class="re-ac-group">
    <!-- Trigger button (visible in HeadMode grid) -->
    <button
      class="ac-trigger"
      :class="{ 'has-active': anyAcOn }"
      :style="triggerStyle"
      @click="popupVisible = true"
      :title="name || '全屋空调'"
    >
      <ha-icon
        :icon="parsedTriggerIcon"
        :style="{ color: triggerColor }"
      ></ha-icon>
    </button>

    <!-- Popup overlay -->
    <PopupOverlay
      :visible="popupVisible"
      :width="popupWidth"
      @close="popupVisible = false"
    >
      <div class="ac-popup">
        <!-- Header -->
        <div class="popup-header">
          <span class="popup-title">{{ name || '空调控制' }}</span>
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

        <!-- AC grid -->
        <div class="ac-grid" :style="gridStyle">
          <div
            v-for="ac in displayedAcs"
            :key="ac.entity"
            class="ac-item"
            @click="handleAcClick(ac)"
          >
            <ha-icon
              :icon="getAcIcon(ac)"
              :style="{ color: getAcColor(ac) }"
              class="ac-icon"
            ></ha-icon>
            <div class="ac-info">
              <span class="ac-name">{{ ac.name || ac.entity }}</span>
              <span class="ac-temp">
                {{ getAcTemp(ac) }}°
              </span>
              <span class="ac-mode">{{ getAcMode(ac) }}</span>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!displayedAcs.length" class="empty-state">
          暂无空调
        </div>
      </div>
    </PopupOverlay>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Hass, AcCardItem } from '../../common/types'
import PopupOverlay from '../layout/PopupOverlay.vue'
import { resolveConfigValue } from '../../common/entity-resolver'
import { getEntityState, getEntityAttribute } from '../../common/hass'
import { hexToRgb, lightenColor } from '../../common/theme'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  name?: string
  icon?: string
  popupPosition?: string
  perLine?: number
  tabs?: any
  tabsBy?: string
  cards?: AcCardItem[]
}>()

// ── Popup visibility ──
const popupVisible = ref(false)

// ── Active tab ──
const activeTab = ref('')

// ── Entity-resolved booleans ──
const resolvedTabs = computed(() => resolveConfigValue(props.tabs, props.hass as Hass | null))

// ── Room names ──
const roomNames = computed(() => {
  if (!props.cards?.length) return []
  const names = new Set<string>()
  for (const c of props.cards) {
    if (c.room) names.add(c.room)
  }
  return Array.from(names)
})

// ── Filter by active tab ──
const displayedAcs = computed(() => {
  if (!props.cards?.length) return []
  let list = props.cards.filter(c => c.entity)
  if (resolvedTabs.value && activeTab.value && roomNames.value.length > 1) {
    list = list.filter(c => c.room === activeTab.value)
  }
  if (resolvedTabs.value && !activeTab.value && roomNames.value.length) {
    activeTab.value = roomNames.value[0]
  }
  return list
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.perLine || 1}, 1fr)`,
}))

const popupWidth = computed(() => '380px')

// ── Trigger button ──
const anyAcOn = computed(() => {
  if (!props.hass || !props.cards?.length) return false
  return props.cards.some(c => {
    if (!c.entity) return false
    const state = getEntityState(c.entity, props.hass as Hass | null)
    return state !== 'off' && state !== 'unavailable'
  })
})

const parsedTriggerIcon = computed(() => parseIcon(props.icon) || 'mdi:air-conditioner')
const triggerColor = computed(() => anyAcOn.value ? '#3498db' : '#95a5a6')
const triggerStyle = computed(() => ({
  background: lightenColor(triggerColor.value, 0.8),
  boxShadow: `0 4px 12px rgba(${hexToRgb(triggerColor.value)}, ${anyAcOn.value ? 0.3 : 0.15})`,
}))

// ── Individual AC helpers ──
function getAcIcon(ac: AcCardItem): string {
  return parseIcon(ac.icon) || 'mdi:air-conditioner'
}

function getAcColor(ac: AcCardItem): string {
  if (!ac.entity || !props.hass) return '#95a5a6'
  const state = getEntityState(ac.entity, props.hass as Hass | null)
  if (state === 'off' || state === 'unavailable') return '#95a5a6'
  const colors: Record<string, string> = {
    cool: '#3498db',
    heat: '#e74c3c',
    dry: '#9b59b6',
    fan_only: '#1abc9c',
    auto: '#f39c12',
  }
  return colors[state] || '#3498db'
}

function getAcTemp(ac: AcCardItem): string {
  if (!ac.entity || !props.hass) return '--'
  const t = getEntityAttribute(ac.entity, 'current_temperature', props.hass as Hass | null)
  return t !== undefined && t !== null ? String(Math.round(Number(t))) : '--'
}

function getAcMode(ac: AcCardItem): string {
  if (!ac.entity || !props.hass) return '--'
  const state = getEntityState(ac.entity, props.hass as Hass | null)
  const labels: Record<string, string> = {
    off: '关闭', cool: '制冷', heat: '制热',
    dry: '除湿', fan_only: '送风', auto: '自动',
  }
  return labels[state] || state
}

function handleAcClick(ac: AcCardItem) {
  if (ac.entity) {
    window.dispatchEvent(
      new CustomEvent('hass-more-info', { detail: { entityId: ac.entity } })
    )
  }
}
</script>

<style scoped>
.re-ac-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ac-trigger {
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
.ac-trigger:hover {
  transform: translateY(-2px);
}

/* ── Popup ── */
.ac-popup {
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
  background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px;
}
.close-btn:hover { background: rgba(0,0,0,0.06); }

/* ── Tabs ── */
.tabs-bar {
  display: flex; gap: 4px; padding: 10px 16px; overflow-x: auto;
  border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.06));
}
.tab-btn {
  padding: 6px 14px; border: none; border-radius: 20px;
  background: var(--room-button-bg, rgba(0,0,0,0.04));
  font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap;
  transition: all 0.15s ease;
}
.tab-btn.active { background: var(--room-primary-text, #3498db); color: white; }
.tab-btn:hover:not(.active) { background: rgba(0,0,0,0.08); }

/* ── Grid ── */
.ac-grid {
  display: grid; gap: 8px; padding: 16px; max-height: 50vh; overflow-y: auto;
}

.ac-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-radius: 12px;
  background: var(--room-button-bg, rgba(0,0,0,0.03));
  cursor: pointer; transition: all 0.15s ease;
}
.ac-item:hover { background: rgba(0,0,0,0.06); }

.ac-icon {
  flex-shrink: 0;
}

.ac-info {
  display: flex; flex-direction: column; gap: 2px; flex: 1;
}

.ac-name {
  font-size: 13px; font-weight: 500;
}

.ac-temp {
  font-size: 11px; color: var(--room-primary-text, #333); font-weight: 600;
}

.ac-mode {
  font-size: 10px; color: var(--room-secondary-text, #666);
}

.empty-state {
  padding: 32px; text-align: center; color: var(--room-secondary-text, #999); font-size: 13px;
}
</style>
