/**
 * Central card type → Vue component registry.
 *
 * Maps both short config type names (used by HeadMode) and
 * FreeLayoutPopup tag names to their Vue component objects.
 */
import type { Component } from 'vue'

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

/**
 * Unified registry: both short config-type keys (HeadMode) and
 * FreeLayoutPopup tag keys map to the same component objects.
 */
export const CARD_REGISTRY: Record<string, Component> = {
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
  'layout-popup-overlay': PopupOverlay,
  'layout-dynamic-icon': DynamicIcon,
}

/**
 * Look up a component by its config type string (e.g. "light", "chart_line").
 * Used by HeadMode when resolving button types.
 */
export function getCardComponent(type: string): Component | undefined {
  return CARD_REGISTRY[type]
}

/**
 * Resolve a component by its FreeLayoutPopup tag (e.g. "entity-light", "chart-line").
 * Falls back to exact registry lookup if no prefix match is found.
 */
export function resolveCardComponent(tag: string): Component | undefined {
  if (!tag) return undefined
  return CARD_REGISTRY[tag]
}

/**
 * Map a ButtonConfig type to its component props.
 * Handles snake_case config keys → camelCase component props.
 */
export function mapButtonProps(btn: { type: string; [key: string]: any }): Record<string, any> {
  return {
    entity: btn.entity,
    name: btn.name,
    icon: btn.icon,
    onIcon: btn.on_icon,
    offIcon: btn.off_icon,
    onColor: btn.on_color,
    offColor: btn.off_color,
    onCount: btn.on_count,
    label: btn.label,
    showIcon: btn.show_icon,
    showName: btn.show_name,
    showState: btn.show_state,
    entityPicture: btn.entity_picture,
    tapAction: btn.tap_action,
    state: btn.state,
    ...btn.props,
  }
}
