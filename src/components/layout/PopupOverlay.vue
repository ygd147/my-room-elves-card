<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="re-layout-popup-overlay"
      :class="{ blur: overlayBlur }"
      @click.self="handleOverlayClick"
    >
      <div class="popup-container" :style="containerStyle">
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps<{
  visible?: boolean
  overlayBlur?: boolean
  width?: string
  position?: 'center' | 'left' | 'right' | 'bottom'
  onClose?: () => void
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:visible', val: boolean): void
}>()

const containerStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.width) s.width = props.width
  return s
})

watch(() => props.visible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function handleOverlayClick() {
  emit('close')
  emit('update:visible', false)
  props.onClose?.()
}
</script>

<style scoped>
.re-layout-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: none;
}
.re-layout-popup-overlay.blur {
  backdrop-filter: blur(4px);
}
.popup-container {
  max-width: 90vw;
  max-height: 85vh;
  animation: popupFadeIn 0.2s ease;
}
@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
