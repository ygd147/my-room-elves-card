import type { Hass } from './types'

/**
 * Resolve a config value that might be an entity ID reference.
 *
 * If the value is a string matching a known entity domain pattern,
 * reads the entity's state from hass. Otherwise returns the literal value.
 *
 * Supported patterns:
 *   input_boolean.xxx  → boolean (state === 'on')
 *   input_select.xxx   → state string
 *   input_number.xxx   → number (parseFloat)
 *   binary_sensor.xxx  → boolean (state === 'on')
 *   sensor.xxx         → state string (used for temperature etc.)
 */
export function resolveConfigValue(value: any, hass: Hass | null): any {
  if (typeof value !== 'string' || !hass) return value

  // input_boolean → boolean
  if (value.startsWith('input_boolean.')) {
    return hass.states[value]?.state === 'on'
  }

  // input_select → state string
  if (value.startsWith('input_select.')) {
    return hass.states[value]?.state ?? value
  }

  // input_number → number
  if (value.startsWith('input_number.')) {
    const s = hass.states[value]?.state
    if (s === undefined || s === 'unavailable' || s === 'unknown') return null
    return parseFloat(s)
  }

  // binary_sensor → boolean
  if (value.startsWith('binary_sensor.')) {
    return hass.states[value]?.state === 'on'
  }

  return value
}
