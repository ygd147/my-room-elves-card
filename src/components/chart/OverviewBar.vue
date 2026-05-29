<template>
  <div class="re-chart-overview">
    <div class="overview-row" v-for="(row, idx) in rows" :key="idx">
      <div
        v-for="cell in row"
        :key="cell.label"
        class="overview-cell"
        :class="{ clickable: cell.entity }"
        @click="handleCellClick(cell)"
      >
        <ha-icon
          v-if="cell.icon"
          :icon="cell.icon"
          :style="{ color: cell.color, fontSize: cell.iconSize + 'px' || undefined }"
        ></ha-icon>
        <span v-if="cell.label" class="cell-label">{{ cell.label }}</span>
        <span class="cell-value">{{ cell.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Hass } from '../../common/types'

interface OverviewCell {
  label?: string
  value?: string
  icon?: string
  color?: string
  iconSize?: number
  entity?: string
}

const props = defineProps<{
  hass?: Hass | null
  rows?: OverviewCell[][]
}>()

function handleCellClick(cell: OverviewCell) {
  if (cell.entity) {
    window.dispatchEvent(
      new CustomEvent('hass-more-info', { detail: { entityId: cell.entity } })
    )
  }
}
</script>

<style scoped>
.re-chart-overview {
  padding: 12px;
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.overview-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.overview-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--room-button-bg, rgba(0,0,0,0.04));
  font-size: 11px;
}
.overview-cell.clickable {
  cursor: pointer;
}
.overview-cell.clickable:hover {
  background: var(--room-dropdown-item-active, rgba(0,0,0,0.08));
}
.cell-label {
  color: var(--room-secondary-text, #666);
}
.cell-value {
  font-weight: 600;
}
</style>
