import { defineCustomElement } from 'vue'
import LightCard from './components/entity/LightCard.vue'
import SwitchCard from './components/entity/SwitchCard.vue'
import SensorCard from './components/entity/SensorCard.vue'
import CurtainCard from './components/entity/CurtainCard.vue'
import MediaCard from './components/entity/MediaCard.vue'
import DeviceCard from './components/entity/DeviceCard.vue'
import ClimateCard from './components/climate/ClimateCard.vue'
import HeaterCard from './components/climate/HeaterCard.vue'
import ButtonGroup from './components/interactive/ButtonGroup.vue'
import UserCard from './components/interactive/UserCard.vue'
import SceneMode from './components/interactive/SceneMode.vue'
import Timeline from './components/interactive/Timeline.vue'
import SliderCard from './components/interactive/SliderCard.vue'
import SelectCard from './components/interactive/SelectCard.vue'
import TextCard from './components/interactive/TextCard.vue'
import HtmlCard from './components/interactive/HtmlCard.vue'
import NumberCard from './components/interactive/NumberCard.vue'
import LineChart from './components/chart/LineChart.vue'
import BarChart from './components/chart/BarChart.vue'
import PieChart from './components/chart/PieChart.vue'
import MixedChart from './components/chart/MixedChart.vue'
import SankeyChart from './components/chart/SankeyChart.vue'
import CalendarChart from './components/chart/CalendarChart.vue'
import GaugeChart from './components/chart/GaugeChart.vue'
import MetricCard from './components/chart/MetricCard.vue'
import OverviewBar from './components/chart/OverviewBar.vue'
import LightControlPopup from './components/popup/LightControlPopup.vue'
import DeviceControlPopup from './components/popup/DeviceControlPopup.vue'
import CurtainControlPopup from './components/popup/CurtainControlPopup.vue'
import AcControlPopup from './components/popup/AcControlPopup.vue'
import MediaControlPopup from './components/popup/MediaControlPopup.vue'
import SocketControlPopup from './components/popup/SocketControlPopup.vue'
import PhoneControlPopup from './components/popup/PhoneControlPopup.vue'
import HealthControlPopup from './components/popup/HealthControlPopup.vue'
import ConsumablesPopup from './components/popup/ConsumablesPopup.vue'
import AutomationPopup from './components/popup/AutomationPopup.vue'
import PersonPopup from './components/popup/PersonPopup.vue'
import FreeLayoutPopup from './components/popup/FreeLayoutPopup.vue'
import HeadMode from './components/layout/HeadMode.vue'
import PopupOverlay from './components/layout/PopupOverlay.vue'
import DynamicIcon from './components/layout/DynamicIcon.vue'

// Entity cards
customElements.define('re-entity-light', defineCustomElement(LightCard))
customElements.define('re-entity-switch', defineCustomElement(SwitchCard))
customElements.define('re-entity-sensor', defineCustomElement(SensorCard))
customElements.define('re-entity-curtain', defineCustomElement(CurtainCard))
customElements.define('re-entity-media', defineCustomElement(MediaCard))
customElements.define('re-entity-device', defineCustomElement(DeviceCard))

// Climate
customElements.define('re-climate-card', defineCustomElement(ClimateCard))
customElements.define('re-heater-card', defineCustomElement(HeaterCard))

// Interactive
customElements.define('re-interactive-button-group', defineCustomElement(ButtonGroup))
customElements.define('re-interactive-user', defineCustomElement(UserCard))
customElements.define('re-interactive-scene', defineCustomElement(SceneMode))
customElements.define('re-interactive-timeline', defineCustomElement(Timeline))
customElements.define('re-interactive-slider', defineCustomElement(SliderCard))
customElements.define('re-interactive-select', defineCustomElement(SelectCard))
customElements.define('re-interactive-text', defineCustomElement(TextCard))
customElements.define('re-interactive-html', defineCustomElement(HtmlCard))
customElements.define('re-interactive-number', defineCustomElement(NumberCard))

// Charts
customElements.define('re-chart-line', defineCustomElement(LineChart))
customElements.define('re-chart-bar', defineCustomElement(BarChart))
customElements.define('re-chart-pie', defineCustomElement(PieChart))
customElements.define('re-chart-mixed', defineCustomElement(MixedChart))
customElements.define('re-chart-sankey', defineCustomElement(SankeyChart))
customElements.define('re-chart-calendar', defineCustomElement(CalendarChart))
customElements.define('re-chart-gauge', defineCustomElement(GaugeChart))
customElements.define('re-chart-metric', defineCustomElement(MetricCard))
customElements.define('re-chart-overview', defineCustomElement(OverviewBar))

// Popups
customElements.define('re-popup-light', defineCustomElement(LightControlPopup))
customElements.define('re-popup-device', defineCustomElement(DeviceControlPopup))
customElements.define('re-popup-curtain', defineCustomElement(CurtainControlPopup))
customElements.define('re-popup-ac', defineCustomElement(AcControlPopup))
customElements.define('re-popup-media', defineCustomElement(MediaControlPopup))
customElements.define('re-popup-socket', defineCustomElement(SocketControlPopup))
customElements.define('re-popup-phone', defineCustomElement(PhoneControlPopup))
customElements.define('re-popup-health', defineCustomElement(HealthControlPopup))
customElements.define('re-popup-consumables', defineCustomElement(ConsumablesPopup))
customElements.define('re-popup-automation', defineCustomElement(AutomationPopup))
customElements.define('re-popup-person', defineCustomElement(PersonPopup))
customElements.define('re-popup-free-layout', defineCustomElement(FreeLayoutPopup))

// Layout
customElements.define('re-layout-head-mode', defineCustomElement(HeadMode))
customElements.define('re-layout-popup-overlay', defineCustomElement(PopupOverlay))
customElements.define('re-layout-dynamic-icon', defineCustomElement(DynamicIcon))

// Register as HA custom cards
const w = window as any
w.customCards = w.customCards || []
w.customCards.push({
  type: 'room-elves-card',
  name: 'Room Elves Card',
  description: 'Room Elves card system built with Vue 3',
})
