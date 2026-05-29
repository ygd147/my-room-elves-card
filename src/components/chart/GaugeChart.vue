<template>
  <div class="re-chart-gauge" ref="chartRef" style="width: 100%; height: 200px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import type { Hass } from '../../common/types'

const props = defineProps<{
  hass?: Hass | null
  value?: number
  name?: string
  unit?: string
  min?: number
  max?: number
  color?: string
}>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: any = null

async function loadECharts(): Promise<any> {
  const w = window as any
  if (w.echarts) return w.echarts
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js'
    script.onload = () => resolve(w.echarts)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function renderChart() {
  if (!chartRef.value) return
  try {
    const echarts = await loadECharts()
    if (!chartInstance) {
      chartInstance = echarts.init(chartRef.value, null, { renderer: 'canvas' })
    }

    const option = {
      series: [{
        type: 'gauge',
        startAngle: 220,
        endAngle: -40,
        min: props.min ?? 0,
        max: props.max ?? 100,
        pointer: { show: true },
        progress: {
          show: true,
          width: 8,
          itemStyle: { color: props.color || '#3498db' },
        },
        axisLine: {
          lineStyle: {
            width: 8,
            color: [[1, 'rgba(0,0,0,0.08)']],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          fontSize: 18,
          fontWeight: 'bold',
          offsetCenter: [0, '50%'],
          formatter: `{value}${props.unit || ''}`,
        },
        title: {
          fontSize: 11,
          color: '#999',
          offsetCenter: [0, '70%'],
        },
        data: [{ value: props.value ?? 0, name: props.name || '' }],
      }],
    }

    chartInstance.setOption(option, true)
  } catch (e) {
    console.warn('[GaugeChart] ECharts render error:', e)
  }
}

onMounted(renderChart)
watch(() => [props.value, props.name], renderChart)

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.re-chart-gauge {
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  overflow: hidden;
}
</style>
