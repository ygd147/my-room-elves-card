<template>
  <div class="re-chart-sankey" ref="chartRef" style="width: 100%; height: 300px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import type { Hass } from '../../common/types'

const props = defineProps<{
  hass?: Hass | null
  nodes?: Array<{ name: string; itemStyle?: any }>
  links?: Array<{ source: string; target: string; value: number }>
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

    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']
    const defaultNodes = (props.nodes || []).map((n, i) => ({
      ...n,
      itemStyle: n.itemStyle || { color: colors[i % colors.length] },
    }))

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      series: [{
        type: 'sankey',
        layout: 'none',
        emphasis: { focus: 'adjacency' },
        nodeAlign: 'left',
        nodeWidth: 16,
        nodeGap: 10,
        data: defaultNodes,
        links: props.links || [],
        label: { fontSize: 10, color: '#666' },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
        },
      }],
    }

    chartInstance.setOption(option, true)
  } catch (e) {
    console.warn('[SankeyChart] ECharts render error:', e)
  }
}

onMounted(renderChart)
watch(() => [props.nodes, props.links], renderChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.re-chart-sankey {
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  overflow: hidden;
}
</style>
