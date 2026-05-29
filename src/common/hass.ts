import type { Hass } from './types'

/** Global Hass state cache */
let _hass: Hass | null = null

export function setHass(hass: Hass): void {
  _hass = hass
}

export function getHass(): Hass | null {
  return _hass
}

/** Check if entity is "on" */
export function isEntityOn(entityId: string | undefined, hass?: Hass | null): boolean {
  if (!entityId || !hass) return false
  const state = hass.states[entityId]
  if (!state) return false
  const domain = entityId.split('.')[0]
  if (['switch', 'input_boolean', 'binary_sensor', 'light', 'fan', 'climate'].includes(domain)) {
    return state.state === 'on'
  }
  return state.state === 'on'
}

/** Get entity state value */
export function getEntityState(entityId: string | undefined, hass?: Hass | null): string {
  if (!entityId || !hass) return 'unavailable'
  return hass.states[entityId]?.state ?? 'unavailable'
}

/** Get entity attribute */
export function getEntityAttribute(entityId: string, attr: string, hass?: Hass | null): any {
  if (!hass) return undefined
  return hass.states[entityId]?.attributes?.[attr]
}

/** Get friendly name for entity */
export function getEntityName(entityId: string, hass?: Hass | null): string {
  if (!hass) return entityId
  return hass.states[entityId]?.attributes?.friendly_name ?? entityId
}

/** Call HA service */
export async function callService(
  domain: string,
  service: string,
  data?: Record<string, any>,
  hass?: Hass | null
): Promise<void> {
  if (!hass) return
  return hass.callService(domain, service, data)
}

/** Call service with entity target */
export function callAction(
  action: string,
  entity: string,
  serviceData?: Record<string, any>,
  hass?: Hass | null
): Promise<void> | undefined {
  if (!hass || !entity) return
  const domain = entity.split('.')[0]
  if (action === 'toggle' || action === 'toggle-all') {
    return callService(domain, 'toggle', { entity_id: entity }, hass)
  }
  if (serviceData) {
    return callService(domain, action, { entity_id: entity, ...serviceData }, hass)
  }
}

/** Toggle entity */
export function toggleEntity(entity: string, hass?: Hass | null): Promise<void> | undefined {
  return callAction('toggle', entity, undefined, hass)
}
