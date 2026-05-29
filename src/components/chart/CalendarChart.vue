<template>
  <div class="re-chart-calendar" ref="chartRef" style="width: 100%; height: 200px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import type { Hass } from '../../common/types'

const props = defineProps<{
  hass?: Hass | null
  year?: number
  data?: Array<[string, number]>
  min?: number
  max?: number
  title?: string
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

    const year = props.year || new Date().getFullYear()
    const min = props.min ?? 0
    const max = props.max ?? 100

    const option = {
      tooltip: {
        formatter: (p: any) => {
          const d = p.data?.[0] || ''
          const v = p.data?.[1] || 0
          return `${d}: ${v}`
        },
      },
      visualMap: {
        min,
        max,
        text: ['High', 'Low'],
        show: true,
        type: 'continuous',
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: { fontSize: 9, color: '#666' },
        inRange: {
          color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
        },
      },
      calendar: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 40,
        range: year,
        cellSize: ['auto', 14],
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
        },
        splitLine: { show: false },
        dayLabel: { show: false },
        monthLabel: { show: true, fontSize: 9, color: '#999' },
        yearLabel: { show: true, fontSize: 10 },
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: props.data || [],
      }],
    }

    chartInstance.setOption(option, true)
  } catch (e) {
    console.warn('[CalendarChart] ECharts render error:', e)
  }
}

onMounted(renderChart)
watch(() => [props.data, props.year], renderChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.re-chart-calendar {
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  overflow: hidden;
}
</style>
