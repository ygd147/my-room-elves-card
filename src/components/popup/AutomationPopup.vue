<template>
  <div class="re-popup-automation" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="items-list">
        <div v-for="auto in automations" :key="auto.entity" class="auto-item">
          <div class="auto-header">
            <ha-icon
              :icon="auto.isOn ? 'mdi:robot' : 'mdi:robot-off'"
              :style="{ color: auto.isOn ? '#2ecc71' : '#e74c3c' }"
            ></ha-icon>
            <span class="auto-name">{{ auto.name }}</span>
          </div>
          <label class="toggle-switch" @click.stop>
            <input type="checkbox" :checked="auto.isOn" @change="toggleAutomation(auto.entity)" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState } from '../../common/hass'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  name?: string
  automations?: Array<{ entity: string; name: string }>
  onClose?: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const displayName = computed(() => {
  if (props.name) return props.name
  return '自动化'
})

const automations = computed(() => {
  if (!props.hass) return []
  return (props.automations || []).map(a => ({
    entity: a.entity,
    name: a.name,
    isOn: getEntityState(a.entity, props.hass) === 'on',
  }))
})

function toggleAutomation(entity: string) {
  if (!props.hass) return
  const isOn = getEntityState(entity, props.hass) === 'on'
  props.hass.callService('automation', isOn ? 'turn_off' : 'turn_on', { entity_id: entity })
}

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-automation {
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
.items-list { display: flex; flex-direction: column; gap: 12px; }
.auto-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.04));
}
.auto-header { display: flex; align-items: center; gap: 8px; }
.auto-name { font-size: 13px; }
.toggle-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--room-slider-bg, #ccc); transition: 0.3s; border-radius: 22px;
}
.toggle-slider:before {
  position: absolute; content: ''; height: 16px; width: 16px;
  left: 3px; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%;
}
.toggle-switch input:checked + .toggle-slider {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}
.toggle-switch input:checked + .toggle-slider:before { transform: translateX(18px); }
</style>
