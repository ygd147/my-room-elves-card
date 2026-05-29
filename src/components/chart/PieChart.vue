<template>
  <div class="re-chart-pie" ref="chartRef" style="width: 100%; height: 250px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import type { Hass } from '../../common/types'

const props = defineProps<{
  hass?: Hass | null
  data?: Array<{ name: string; value: number }>
  title?: string
  roseType?: boolean
  radius?: string[]
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

    const data = [...(props.data || [])].sort((a, b) => b.value - a.value)
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e']

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        show: true,
        bottom: 0,
        textStyle: { fontSize: 10 },
      },
      series: [{
        type: 'pie',
        roseType: props.roseType ? 'area' : undefined,
        radius: props.radius || ['10%', '85%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: { borderRadius: 4 },
        label: {
          show: true,
          fontSize: 11,
          formatter: '{b}\n{d}%',
        },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 'bold' },
        },
        data: data.map((d, i) => ({
          ...d,
          itemStyle: { color: colors[i % colors.length] },
        })),
      }],
    }

    chartInstance.setOption(option, true)
  } catch (e) {
    console.warn('[PieChart] ECharts render error:', e)
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
.re-chart-pie {
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  overflow: hidden;
}
</style>
