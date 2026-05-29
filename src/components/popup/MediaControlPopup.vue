<template>
  <div class="re-popup-media" v-if="entity && hass">
    <div class="popup-header">
      <span class="popup-title">{{ displayName }}</span>
      <button class="close-btn" @click="handleClose">
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
    <div class="popup-body">
      <div class="media-info">
        <span class="media-title">{{ mediaTitle || '无播放内容' }}</span>
        <span class="media-artist">{{ mediaArtist }}</span>
      </div>
      <div class="media-controls">
        <button class="ctrl-btn" @click="mediaPrevious">
          <ha-icon icon="mdi:skip-previous"></ha-icon>
        </button>
        <button class="ctrl-btn play-btn" @click="mediaPlayPause">
          <ha-icon :icon="isPlaying ? 'mdi:pause-circle' : 'mdi:play-circle'"></ha-icon>
        </button>
        <button class="ctrl-btn" @click="mediaNext">
          <ha-icon icon="mdi:skip-next"></ha-icon>
        </button>
      </div>
      <div class="volume-control">
        <ha-icon icon="mdi:volume-medium"></ha-icon>
        <input
          type="range"
          class="volume-slider"
          min="0"
          max="100"
          :value="volume"
          @change="handleVolumeChange"
        />
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
  onClose?: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.entity && props.hass) {
    return props.hass.states[props.entity]?.attributes?.friendly_name || props.entity
  }
  return '媒体控制'
})

const isPlaying = computed(() => {
  if (!props.entity || !props.hass) return false
  const state = getEntityState(props.entity, props.hass)
  return state === 'playing'
})

const mediaTitle = computed(() => {
  if (!props.entity || !props.hass) return ''
  return getEntityAttribute(props.entity, 'media_title', props.hass) || ''
})

const mediaArtist = computed(() => {
  if (!props.entity || !props.hass) return ''
  return getEntityAttribute(props.entity, 'media_artist', props.hass) || ''
})

const volume = computed(() => {
  if (!props.entity || !props.hass) return 0
  const vol = getEntityAttribute(props.entity, 'volume_level', props.hass)
  return vol !== undefined ? Math.round(vol * 100) : 0
})

function mediaPlayPause() {
  if (!props.entity || !props.hass) return
  props.hass.callService('media_player', isPlaying.value ? 'media_pause' : 'media_play', {
    entity_id: props.entity,
  })
}

function mediaNext() {
  if (!props.entity || !props.hass) return
  props.hass.callService('media_player', 'media_next_track', { entity_id: props.entity })
}

function mediaPrevious() {
  if (!props.entity || !props.hass) return
  props.hass.callService('media_player', 'media_previous_track', { entity_id: props.entity })
}

function handleVolumeChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value) / 100
  if (!props.entity || !props.hass) return
  props.hass.callService('media_player', 'volume_set', {
    entity_id: props.entity,
    volume_level: val,
  })
}

function handleClose() {
  emit('close')
  props.onClose?.()
}
</script>

<style scoped>
.re-popup-media {
  background: var(--room-popup-bg, rgba(255,255,255,0.95));
  border-radius: 16px;
  overflow: hidden;
  min-width: 280px;
}
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--room-border-color, rgba(0,0,0,0.08));
}
.popup-title { font-size: 16px; font-weight: 600; }
.close-btn {
  background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px;
}
.close-btn:hover { background: rgba(0,0,0,0.06); }
.popup-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.media-info { text-align: center; }
.media-title { display: block; font-size: 16px; font-weight: 600; }
.media-artist { display: block; font-size: 12px; color: var(--room-secondary-text, #666); margin-top: 4px; }
.media-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.ctrl-btn {
  background: none; border: none; cursor: pointer; padding: 8px;
  border-radius: 50%;
}
.ctrl-btn:hover { background: rgba(0,0,0,0.06); }
.play-btn ha-icon { font-size: 48px; color: #2ecc71; }
.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.volume-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 2px;
  background: var(--room-slider-bg, rgba(0,0,0,0.1));
  outline: none;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
