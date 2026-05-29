import type { TapAction } from './types'
import { callAction } from './hass'
import type { Hass } from './types'

/** Execute a tap action */
export function executeTapAction(
  action: TapAction | undefined,
  hass: Hass | null,
  defaultEntity?: string,
): void {
  if (!action || action.action === 'none' || !hass) return

  switch (action.action) {
    case 'toggle':
    case 'toggle-all': {
      const entity = action.entity || defaultEntity
      if (entity) callAction(action.action, entity, undefined, hass)
      break
    }
    case 'call-service': {
      if (!action.service) return
      const [domain, service] = action.service.split('.')
      if (domain && service) {
        const data = { ...(action.service_data || {}), entity_id: action.entity || defaultEntity }
        hass.callService(domain, service, data)
      }
      break
    }
    case 'navigate': {
      if (action.navigation_path) {
        window.location.href = action.navigation_path
      }
      break
    }
    case 'url': {
      if (action.url_path) {
        window.open(action.url_path, '_blank')
      }
      break
    }
    case 'more-info': {
      // Dispatch event for HA to handle
      window.dispatchEvent(
        new CustomEvent('hass-more-info', {
          detail: { entityId: action.entity || defaultEntity },
        })
      )
      break
    }
  }
}

/** Create a debounced function */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

/** Throttle a function */
export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): T {
  let inThrottle = false
  return ((...args: any[]) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}
