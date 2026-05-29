<template>
  <div class="re-chart-line" ref="chartRef" style="width: 100%; height: 250px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import type { Hass } from '../../common/types'

const props = defineProps<{
  hass?: Hass | null
  data?: Array<{ time: string; value: number; name?: string }>
  title?: string
  xField?: string
  yField?: string
  color?: string
  smooth?: boolean
}>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: any = null

async function loadECharts(): Promise<any> {
  const w = window as any
  if (w.echarts) return w.echarts

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js'
    script.onload = () => {
      resolve(w.echarts)
    }
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
    const times = data.map((d: any) => d.time || d.x || '')
    const values = data.map((d: any) => d.value || d.y || 0)

    const option = {
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 16, top: 30, bottom: 25 },
      xAxis: {
        type: 'category',
        data: times,
        axisLabel: { fontSize: 10, color: '#999' },
        axisLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#999' },
        splitLine: { lineStyle: { color: 'rgba(0,0,0,0.05)' } },
      },
      series: [{
        type: 'line',
        data: values,
        smooth: props.smooth !== false,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2, color: props.color || '#3498db' },
        itemStyle: { color: props.color || '#3498db' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: (props.color || '#3498db') + '40' },
              { offset: 1, color: (props.color || '#3498db') + '05' },
            ],
          },
        },
      }],
    }

    chartInstance.setOption(option, true)
  } catch (e) {
    console.warn('[LineChart] ECharts render error:', e)
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
.re-chart-line {
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  overflow: hidden;
}
</style>
