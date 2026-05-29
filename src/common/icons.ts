/** Icon parsing utility */
const _iconCache = new Map<string, string>()

/** Parse an icon string, handling template variables */
export function parseIcon(icon: string | undefined): string {
  if (!icon) return 'mdi:help-circle'
  // Check cache
  const cached = _iconCache.get(icon)
  if (cached) return cached
  // Resolve template
  const resolved = icon.replace(/\${([^}]+)}/g, (_, key) => {
    return key.trim() || 'help-circle'
  })
  // Ensure it has a prefix
  const result = resolved.includes(':') ? resolved : `mdi:${resolved}`
  _iconCache.set(icon, result)
  return result
}

/** Compute icon based on entity state */
export function getStateIcon(
  entityId: string,
  state: string,
  onIcon?: string,
  offIcon?: string,
): string {
  const domain = entityId?.split('.')[0]
  const isOn = state === 'on'

  if (isOn && onIcon) return parseIcon(onIcon)
  if (!isOn && offIcon) return parseIcon(offIcon)

  // Default icons by domain
  const defaultIcons: Record<string, string> = {
    light: 'mdi:lightbulb',
    switch: 'mdi:toggle-switch',
    sensor: 'mdi:thermometer',
    binary_sensor: 'mdi:motion-sensor',
    cover: 'mdi:curtains',
    media_player: 'mdi:cast',
    climate: 'mdi:thermostat',
    fan: 'mdi:fan',
    input_boolean: 'mdi:check-circle',
    lock: 'mdi:lock',
  }
  return defaultIcons[domain] || 'mdi:help-circle'
}

/** Clear icon cache */
export function clearIconCache(): void {
  _iconCache.clear()
}
