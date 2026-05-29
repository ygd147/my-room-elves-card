<template>
  <div class="re-user-card" @click="handleClick">
    <div class="user-header">
      <ha-icon icon="mdi:account-circle" class="user-avatar"></ha-icon>
      <div class="user-info">
        <span class="user-name">{{ displayName }}</span>
        <span class="user-status" :class="{ online: isOnline }">
          {{ isOnline ? '在家' : '离家' }}
        </span>
      </div>
    </div>
    <div v-if="weather" class="user-weather">
      <ha-icon :icon="weatherIcon"></ha-icon>
      <span>{{ weather.temperature }}° {{ weather.condition }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState } from '../../common/hass'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  name?: string
  persons?: Array<{ entity: string; name: string }>
  weather_entity?: string
  showHistory?: boolean
}>()

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || '用户'
  }
  return '用户'
})

const isOnline = computed(() => {
  if (!props.entity || !props.hass) return false
  return getEntityState(props.entity, props.hass) === 'on' ||
    getEntityState(props.entity, props.hass) === 'home'
})

const weather = computed(() => {
  if (!props.weather_entity || !props.hass) return null
  const state = props.hass.states[props.weather_entity]
  if (!state) return null
  return {
    temperature: state.attributes?.temperature || '--',
    condition: state.attributes?.condition || '',
  }
})

const weatherIcon = computed(() => {
  if (!weather.value) return 'mdi:weather-sunny'
  const icons: Record<string, string> = {
    sunny: 'mdi:weather-sunny',
    cloudy: 'mdi:weather-cloudy',
    rainy: 'mdi:weather-rainy',
    snowy: 'mdi:weather-snowy',
    foggy: 'mdi:weather-fog',
  }
  return icons[weather.value.condition] || 'mdi:weather-sunny'
})

function handleClick() {
  if (props.entity) {
    window.dispatchEvent(
      new CustomEvent('hass-more-info', { detail: { entityId: props.entity } })
    )
  }
}
</script>

<style scoped>
.re-user-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 16px;
  background: var(--room-popup-card-bg, rgba(240, 240, 245, 0.95));
  border: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
  cursor: pointer;
  transition: all 0.2s ease;
}
.re-user-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}
.user-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.user-avatar {
  font-size: 32px;
  color: #3498db;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 14px;
  font-weight: 600;
}
.user-status {
  font-size: 11px;
  color: #95a5a6;
}
.user-status.online {
  color: #2ecc71;
}
.user-weather {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--room-secondary-text, #666);
}
</style>
