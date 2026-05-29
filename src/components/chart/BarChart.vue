<template>
  <div class="re-chart-bar" ref="chartRef" style="width: 100%; height: 250px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import type { Hass } from '../../common/types'
import { hexToRgb } from '../../common/theme'

const props = defineProps<{
  hass?: Hass | null
  data?: Array<{ label: string; value1: number; value2?: number }>
  title?: string
  value1Name?: string
  value2Name?: string
  value1Color?: string
  value2Color?: string
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

    const data = props.data || []
    const labels = data.map(d => d.label)
    const v1Name = props.value1Name || 'Value 1'
    const v2Name = props.value2Name || 'Value 2'
    const v1Color = props.value1Color || '#3498db'
    const v2Color = props.value2Color || '#e74c3c'

    const series: any[] = [{
      name: v1Name,
      type: 'bar',
      data: data.map(d => d.value1),
      itemStyle: { color: v1Color, borderRadius: [4, 4, 0, 0] },
      barWidth: '40%',
      label: { show: true, position: 'top', color: '#999', fontSize: 10 },
    }]

    if (data.some(d => d.value2 !== undefined)) {
      series.push({
        name: v2Name,
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.value2),
        itemStyle: { color: v2Color },
        lineStyle: { width: 2, color: v2Color },
      })
    }

    const option = {
      tooltip: { trigger: 'axis' },
      legend: { show: true, bottom: 0, textStyle: { fontSize: 10 } },
      grid: { left: 50, right: 20, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { fontSize: 10, color: '#999' },
      },
      yAxis: [
        { type: 'value', axisLabel: { fontSize: 10, color: '#999' }, splitLine: { lineStyle: { color: 'rgba(0,0,0,0.05)' } } },
        { type: 'value', axisLabel: { fontSize: 10, color: '#999' }, splitLine: { show: false } },
      ],
      series,
    }

    chartInstance.setOption(option, true)
  } catch (e) {
    console.warn('[BarChart] ECharts render error:', e)
  }
}

onMounted(renderChart)
watch(() => props.data, renderChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.re-chart-bar {
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  overflow: hidden;
}
</style>
