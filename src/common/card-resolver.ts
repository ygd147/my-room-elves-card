import type { Component } from 'vue'

/**
 * Central card type → Vue component registry.
 *
 * Populated by card-registry.ts at import time.
 * Components that need dynamic lookup (HeadMode, RoomSection, FreeLayoutPopup)
 * import from this file — NOT from card-registry.ts — to avoid circular imports.
 */
export const CARD_REGISTRY: Record<string, Component> = {}

/**
 * Look up a component by its config type string (e.g. "light", "chart_line").
 * Used by HeadMode and RoomSection when resolving button types.
 */
export function getCardComponent(type: string): Component | undefined {
  return CARD_REGISTRY[type]
}

/**
 * Resolve a component by its FreeLayoutPopup tag (e.g. "entity-light", "chart-line").
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
    // RoomSection-specific
    tempEntity: btn.temp_entity,
    tempAttr: btn.temp_attr,
    cards: btn.cards || btn.card,
    columns: btn.columns,
    // LightsGroup / AcGroup popup controls
    apiBaseUrl: btn.api_base_url,
    perLine: btn.per_line,
    popupPosition: btn.popup_position,
    showDuration: btn.show_duration,
    groupLightsByRoom: btn.group_lights_by_room,
    showHistory: btn.show_history,
    tabs: btn.tabs,
    tabsBy: btn.tabs_by,
    ...btn.props,
  }
}
