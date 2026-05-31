/**
 * Central card type → Vue component registry.
 *
 * Imports all Vue components and populates CARD_REGISTRY (defined in card-resolver.ts).
 * Components that need dynamic lookup import from card-resolver.ts — NOT this file —
 * to avoid circular imports.
 *
 * Circular-dependency-safe import map:
 *   card-resolver.ts   ←  imports NOTHING (safe for anyone to import)
 *   card-registry.ts   ←  imports card-resolver.ts + all Vue components
 *   HeadMode.vue       ←  imports card-resolver.ts
 *   RoomSection.vue    ←  imports card-resolver.ts
 *   FreeLayoutPopup.vue ←  imports card-resolver.ts
 */

import { CARD_REGISTRY } from './card-resolver'

// ── Entity cards ──
import LightCard from '../components/entity/LightCard.vue'
import SwitchCard from '../components/entity/SwitchCard.vue'
import SensorCard from '../components/entity/SensorCard.vue'
import CurtainCard from '../components/entity/CurtainCard.vue'
import MediaCard from '../components/entity/MediaCard.vue'
import DeviceCard from '../components/entity/DeviceCard.vue'

// ── Climate ──
import ClimateCard from '../components/climate/ClimateCard.vue'
import HeaterCard from '../components/climate/HeaterCard.vue'

// ── Interactive ──
import ButtonGroup from '../components/interactive/ButtonGroup.vue'
import UserCard from '../components/interactive/UserCard.vue'
import SceneMode from '../components/interactive/SceneMode.vue'
import Timeline from '../components/interactive/Timeline.vue'
import SliderCard from '../components/interactive/SliderCard.vue'
import SelectCard from '../components/interactive/SelectCard.vue'
import TextCard from '../components/interactive/TextCard.vue'
import HtmlCard from '../components/interactive/HtmlCard.vue'
import NumberCard from '../components/interactive/NumberCard.vue'
import LightsGroup from '../components/interactive/LightsGroup.vue'
import AcGroup from '../components/interactive/AcGroup.vue'
import EnvironmentOverview from '../components/interactive/EnvironmentOverview.vue'

// ── Charts ──
import LineChart from '../components/chart/LineChart.vue'
import BarChart from '../components/chart/BarChart.vue'
import PieChart from '../components/chart/PieChart.vue'
import MixedChart from '../components/chart/MixedChart.vue'
import SankeyChart from '../components/chart/SankeyChart.vue'
import CalendarChart from '../components/chart/CalendarChart.vue'
import GaugeChart from '../components/chart/GaugeChart.vue'
import MetricCard from '../components/chart/MetricCard.vue'
import OverviewBar from '../components/chart/OverviewBar.vue'

// ── Popups ──
import LightControlPopup from '../components/popup/LightControlPopup.vue'
import DeviceControlPopup from '../components/popup/DeviceControlPopup.vue'
import CurtainControlPopup from '../components/popup/CurtainControlPopup.vue'
import AcControlPopup from '../components/popup/AcControlPopup.vue'
import MediaControlPopup from '../components/popup/MediaControlPopup.vue'
import SocketControlPopup from '../components/popup/SocketControlPopup.vue'
import PhoneControlPopup from '../components/popup/PhoneControlPopup.vue'
import HealthControlPopup from '../components/popup/HealthControlPopup.vue'
import ConsumablesPopup from '../components/popup/ConsumablesPopup.vue'
import AutomationPopup from '../components/popup/AutomationPopup.vue'
import PersonPopup from '../components/popup/PersonPopup.vue'
import FreeLayoutPopup from '../components/popup/FreeLayoutPopup.vue'

// ── Layout ──
import PopupOverlay from '../components/layout/PopupOverlay.vue'
import DynamicIcon from '../components/layout/DynamicIcon.vue'
import RoomSection from '../components/layout/RoomSection.vue'

// ═══════════════════════════════════════════════
// Populate the shared registry (defined in card-resolver.ts)
// ═══════════════════════════════════════════════

Object.assign(CARD_REGISTRY, {
  // ── HeadMode short type names ──
  light: LightCard,
  switch: SwitchCard,
  sensor: SensorCard,
  curtain: CurtainCard,
  media: MediaCard,
  device: DeviceCard,
  climate: ClimateCard,
  heater: HeaterCard,
  button_group: ButtonGroup,
  user: UserCard,
  scene_mode: SceneMode,
  timeline: Timeline,
  slider: SliderCard,
  select: SelectCard,
  text: TextCard,
  html: HtmlCard,
  number: NumberCard,
  lights: LightsGroup,
  ac: AcGroup,
  environment_overview: EnvironmentOverview,

  // ── Chart short names ──
  chart_line: LineChart,
  chart_bar: BarChart,
  chart_pie: PieChart,
  chart_mixed: MixedChart,
  chart_sankey: SankeyChart,
  chart_calendar: CalendarChart,
  chart_gauge: GaugeChart,
  chart_metric: MetricCard,
  chart_overview: OverviewBar,

  // ── Popup short names ──
  popup_light: LightControlPopup,
  popup_device: DeviceControlPopup,
  popup_curtain: CurtainControlPopup,
  popup_ac: AcControlPopup,
  popup_media: MediaControlPopup,
  popup_socket: SocketControlPopup,
  popup_phone: PhoneControlPopup,
  popup_health: HealthControlPopup,
  popup_consumables: ConsumablesPopup,
  popup_automation: AutomationPopup,
  popup_person: PersonPopup,
  popup_free_layout: FreeLayoutPopup,

  // ── Layout short names ──
  room_section: RoomSection,
  popup_overlay: PopupOverlay,
  dynamic_icon: DynamicIcon,

  // ═══════════════════════════════════════════════
  // FreeLayoutPopup tag-name aliases (card.tag)
  // ═══════════════════════════════════════════════

  // entity-* tags
  'entity-light': LightCard,
  'entity-switch': SwitchCard,
  'entity-sensor': SensorCard,
  'entity-curtain': CurtainCard,
  'entity-media': MediaCard,
  'entity-device': DeviceCard,

  // interactive-* tags
  'interactive-button-group': ButtonGroup,
  'interactive-user': UserCard,
  'interactive-scene': SceneMode,
  'interactive-timeline': Timeline,
  'interactive-slider': SliderCard,
  'interactive-select': SelectCard,
  'interactive-text': TextCard,
  'interactive-html': HtmlCard,
  'interactive-number': NumberCard,
  'interactive-lights-group': LightsGroup,
  'interactive-ac-group': AcGroup,
  'interactive-environment-overview': EnvironmentOverview,

  // chart-* tags
  'chart-line': LineChart,
  'chart-bar': BarChart,
  'chart-pie': PieChart,
  'chart-mixed': MixedChart,
  'chart-sankey': SankeyChart,
  'chart-calendar': CalendarChart,
  'chart-gauge': GaugeChart,
  'chart-metric': MetricCard,
  'chart-overview': OverviewBar,

  // popup-* tags
  'popup-light': LightControlPopup,
  'popup-device': DeviceControlPopup,
  'popup-curtain': CurtainControlPopup,
  'popup-ac': AcControlPopup,
  'popup-media': MediaControlPopup,
  'popup-socket': SocketControlPopup,
  'popup-phone': PhoneControlPopup,
  'popup-health': HealthControlPopup,
  'popup-consumables': ConsumablesPopup,
  'popup-automation': AutomationPopup,
  'popup-person': PersonPopup,
  'popup-free-layout': FreeLayoutPopup,

  // climate-* / layout-* tags
  'climate-card': ClimateCard,
  'heater-card': HeaterCard,
  'layout-room-section': RoomSection,
  'layout-popup-overlay': PopupOverlay,
  'layout-dynamic-icon': DynamicIcon,
})

// Re-export everything from card-resolver for backward compatibility
export { CARD_REGISTRY, getCardComponent, resolveCardComponent, mapButtonProps } from './card-resolver'
