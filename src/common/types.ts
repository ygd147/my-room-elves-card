/** Home Assistant entity state */
export interface HassEntity {
  entity_id: string
  state: string
  attributes: Record<string, any>
  context?: { id: string; parent_id?: string; user_id?: string }
  last_changed: string
  last_updated: string
}

/** Home Assistant states object */
export interface HassStates {
  [entityId: string]: HassEntity
}

/** Home Assistant service call */
export interface HassService {
  domain: string
  service: string
  service_data?: Record<string, any>
}

/** Home Assistant connection */
export interface Hass {
  states: HassStates
  callService: (domain: string, service: string, data?: Record<string, any>) => Promise<void>
  fetchWithTimeout?: (url: string, options?: RequestInit) => Promise<Response>
  auth?: { wsUrl: string }
  connection?: any
}

/** Button configuration for a card */
export interface ButtonConfig {
  type: string
  entity?: string
  name?: string
  icon?: string
  on_icon?: string
  off_icon?: string
  on_color?: string
  off_color?: string
  icon_color?: string
  tap_action?: TapAction
  entity_picture?: string
  show_name?: boolean
  show_state?: boolean
  show_icon?: boolean
  state?: string
}

/** Tap action configuration */
export interface TapAction {
  action: 'none' | 'toggle' | 'toggle-all' | 'call-service' | 'navigate' | 'url' | 'more-info'
  service?: string
  service_data?: Record<string, any>
  navigation_path?: string
  url_path?: string
  entity?: string
}

/** Card configuration from HA YAML */
export interface CardConfig {
  type: string
  entity?: string
  entities?: string[]
  name?: string
  icon?: string
  title?: string
  buttons?: ButtonConfig[]
  head?: boolean
  mode?: string
  columns?: number
  [key: string]: any
}

/** Theme configuration */
export interface ThemeConfig {
  light?: Record<string, string>
  dark?: Record<string, string>
}

/** Card size for HA grid layout */
export interface CardSize {
  width: number
  height: number
}

/** ECharts option fragment */
export interface EChartsOption {
  [key: string]: any
}

/** Single light entry inside a LightsGroup card[] array */
export interface LightCardItem {
  name?: string
  room?: string
  entity?: string
  on_icon?: string
  off_icon?: string
  on_color?: string
  off_color?: string
  tap_action?: TapAction
}

/** Single AC entry inside an AcGroup card[] array */
export interface AcCardItem {
  name?: string
  room?: string
  entity?: string
  icon?: string
}

/** Per-room temperature config (overview section) */
export interface RoomTempConfig {
  [room: string]: {
    temperature?: string
  }
}

/** Overview section config (environment, etc.) */
export interface EnvironmentOverviewConfig {
  type: string
  name?: string
  icon?: string
  rooms?: RoomTempConfig
}
