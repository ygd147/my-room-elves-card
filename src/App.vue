<template>
  <div class="room-elves-app">
    <header class="app-header" v-if="showHeader">
      <h1>Room Elves Card</h1>
      <p>Home Assistant 自定义卡片组件</p>
    </header>
    <main class="app-main">
      <div class="demo-section" v-if="hass">
        <!-- Entity Cards -->
        <section class="demo-category">
          <h2>Entity Cards</h2>
          <div class="demo-grid columns-4">
            <div class="demo-item">
              <LightCard
                :hass="hass"
                entity="light.demo_light"
                on-color="#f1c40f"
                off-color="#95a5a6"
              />
              <span class="demo-label">Light</span>
            </div>
            <div class="demo-item">
              <SwitchCard
                :hass="hass"
                entity="switch.demo_switch"
                label="开关"
              />
              <span class="demo-label">Switch</span>
            </div>
            <div class="demo-item">
              <SensorCard
                :hass="hass"
                entity="sensor.demo_sensor"
                icon="mdi:thermometer"
                unit="°C"
              />
              <span class="demo-label">Sensor</span>
            </div>
            <div class="demo-item">
              <CurtainCard
                :hass="hass"
                entity="cover.demo_curtain"
                on-color="#d4b896"
                off-color="#7f8c8d"
              />
              <span class="demo-label">Curtain</span>
            </div>
          </div>
        </section>

        <!-- Chart Cards -->
        <section class="demo-category">
          <h2>Chart Cards</h2>
          <div class="demo-grid columns-2">
            <div class="demo-item wide">
              <LineChart :data="lineData" :hass="hass" />
              <span class="demo-label">Line Chart</span>
            </div>
            <div class="demo-item wide">
              <PieChart :data="pieData" :hass="hass" />
              <span class="demo-label">Pie Chart</span>
            </div>
          </div>
        </section>

        <!-- Climate Cards -->
        <section class="demo-category">
          <h2>Climate</h2>
          <div class="demo-grid columns-4">
            <div class="demo-item">
              <ClimateCard
                :hass="hass"
                entity="climate.demo_ac"
              />
              <span class="demo-label">Climate</span>
            </div>
          </div>
        </section>
      </div>
      <div v-else class="no-hass">
        <p>等待 Home Assistant 连接...</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Hass } from './common/types'
import LightCard from './components/entity/LightCard.vue'
import SwitchCard from './components/entity/SwitchCard.vue'
import SensorCard from './components/entity/SensorCard.vue'
import CurtainCard from './components/entity/CurtainCard.vue'
import LineChart from './components/chart/LineChart.vue'
import PieChart from './components/chart/PieChart.vue'
import ClimateCard from './components/climate/ClimateCard.vue'

const props = defineProps<{
  hass?: Hass | null
  showHeader?: boolean
}>()

const lineData = ref([
  { time: '00:00', value: 12 },
  { time: '04:00', value: 14 },
  { time: '08:00', value: 20 },
  { time: '12:00', value: 26 },
  { time: '16:00', value: 24 },
  { time: '20:00', value: 18 },
  { time: '23:00', value: 15 },
])

const pieData = ref([
  { name: '照明', value: 35 },
  { name: '空调', value: 40 },
  { name: '插座', value: 15 },
  { name: '其他', value: 10 },
])
</script>

<style>
/* Global reset for web component context */
.room-elves-app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
}

.app-header {
  padding: 24px;
  text-align: center;
}
.app-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}
.app-header p {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
}
.app-main {
  padding: 16px;
  max-width: 900px;
  margin: 0 auto;
}
.demo-category {
  margin-bottom: 32px;
}
.demo-category h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.demo-grid {
  display: grid;
  gap: 12px;
}
.columns-4 { grid-template-columns: repeat(4, 1fr); }
.columns-2 { grid-template-columns: repeat(2, 1fr); }
.demo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.demo-item.wide {
  grid-column: 1 / -1;
}
.demo-label {
  font-size: 11px;
  color: #999;
}
.no-hass {
  text-align: center;
  padding: 48px;
  color: #999;
}
</style>
