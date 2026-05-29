<template>
  <div class="re-select-card" @click="toggleDropdown">
    <div class="select-header">
      <ha-icon :icon="parsedIcon"></ha-icon>
      <span class="select-name">{{ displayName }}</span>
      <span class="select-value">{{ currentOption }}</span>
      <ha-icon icon="mdi:chevron-down" class="chevron"></ha-icon>
    </div>
    <div v-if="showDropdown" class="select-dropdown">
      <button
        v-for="opt in options"
        :key="opt"
        class="select-option"
        :class="{ selected: opt === currentOption }"
        @click.stop="selectOption(opt)"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Hass } from '../../common/types'
import { getEntityState, getEntityAttribute } from '../../common/hass'
import { parseIcon } from '../../common/icons'

const props = defineProps<{
  hass?: Hass | null
  entity?: string
  name?: string
  icon?: string
}>()

const showDropdown = ref(false)

const parsedIcon = computed(() => parseIcon(props.icon || 'mdi:form-dropdown'))

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  }
  return 'Select'
})

const currentOption = computed(() => {
  if (!props.entity || !props.hass) return '--'
  return getEntityState(props.entity, props.hass)
})

const options = computed(() => {
  if (!props.entity || !props.hass) return []
  return getEntityAttribute(props.entity, 'options', props.hass) || []
})

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function selectOption(option: string) {
  showDropdown.value = false
  if (props.entity && props.hass) {
    const domain = props.entity.split('.')[0]
    props.hass.callService(domain, 'select_option', {
      entity_id: props.entity,
      option,
    })
  }
}
</script>

<style scoped>
.re-select-card {
  position: relative;
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  cursor: pointer;
}
.select-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.select-name {
  flex: 1;
  font-size: 12px;
  color: var(--room-secondary-text, #666);
}
.select-value {
  font-size: 12px;
  font-weight: 600;
}
.chevron {
  font-size: 16px;
  color: var(--room-secondary-text, #666);
}
.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  margin-top: 4px;
  border-radius: 12px;
  background: var(--room-popup-bg, white);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  overflow: hidden;
}
.select-option {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
}
.select-option:hover {
  background: var(--room-dropdown-item-active, rgba(0,0,0,0.06));
}
.select-option.selected {
  color: #3498db;
  font-weight: 600;
}
</style>
