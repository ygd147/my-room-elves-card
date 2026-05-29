<template>
  <div class="re-layout-dynamic-icon" :style="wrapperStyle">
    <ha-icon :icon="currentIcon" :style="iconStyle"></ha-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { parseIcon } from '../../common/icons'

interface IconRule {
  icon?: string
  color?: string
  animation?: string
}

const props = defineProps<{
  defaultIcon?: string
  defaultColor?: string
  rules?: IconRule[]
  loopDisplay?: boolean
  displayTime?: number
}>()

const currentIndex = ref(0)
let intervalTimer: ReturnType<typeof setInterval> | null = null

const currentRule = computed(() => {
  if (!props.rules?.length) return null
  return props.rules[currentIndex.value]
})

const currentIcon = computed(() => {
  return parseIcon(currentRule.value?.icon || props.defaultIcon || 'mdi:help-circle')
})

const iconStyle = computed(() => {
  const anim = currentRule.value?.animation || ''
  return {
    color: currentRule.value?.color || props.defaultColor || '#74787c',
    animation: anim || 'none',
  }
})

const wrapperStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

function startLoop() {
  stopLoop()
  if (!props.rules?.length || props.rules.length < 2) return
  if (!props.loopDisplay) return

  const dt = (props.displayTime || 3) * 1000
  intervalTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % (props.rules?.length || 1)
  }, dt)
}

function stopLoop() {
  if (intervalTimer) {
    clearInterval(intervalTimer)
    intervalTimer = null
  }
}

watch(() => props.rules, () => {
  currentIndex.value = 0
  startLoop()
}, { deep: true })

onUnmounted(stopLoop)
</script>

<style scoped>
.re-layout-dynamic-icon {
  transition: all 0.3s ease;
}
</style>
