<template>
  <div class="re-chart-mixed" ref="chartRef" style="width: 100%; height: 280px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import type { Hass } from '../../common/types'

const props = defineProps<{
  hass?: Hass | null
  series?: any[]
  xData?: string[]
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

    const defaultSeries = props.series || [
      {
        name: 'Series 1',
        type: 'bar',
        data: [10, 20, 15, 30, 25],
        itemStyle: { color: '#3498db' },
      },
      {
        name: 'Series 2',
        type: 'line',
        data: [5, 15, 10, 20, 18],
        itemStyle: { color: '#e74c3c' },
        lineStyle: { width: 2 },
      },
    ]

    const option = {
      tooltip: { trigger: 'axis' },
      legend: { show: true, bottom: 0, textStyle: { fontSize: 10 } },
      grid: { left: 45, right: 16, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: props.xData || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        axisLabel: { fontSize: 10, color: '#999' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#999' },
        splitLine: { lineStyle: { color: 'rgba(0,0,0,0.05)' } },
      },
      series: defaultSeries,
    }

    chartInstance.setOption(option, true)
  } catch (e) {
    console.warn('[MixedChart] ECharts render error:', e)
  }
}

onMounted(renderChart)
watch(() => props.series, renderChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.re-chart-mixed {
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  overflow: hidden;
}
</style>
