/** Color scheme definitions matching the original card */
export const COLOR_SCHEMES: Record<string, Record<string, string>> = {
  dark: {
    '--room-card-bg': 'rgba(30, 30, 40, 0.9)',
    '--room-secondary-text': 'rgba(255, 255, 255, 0.6)',
    '--room-button-bg': 'rgba(255, 255, 255, 0.08)',
    '--room-slider-bg': 'rgba(255, 255, 255, 0.15)',
    '--room-border-color': 'rgba(255, 255, 255, 0.08)',
    '--room-popup-bg': 'rgba(20, 20, 30, 0.95)',
    '--room-popup-card-bg': 'rgba(40, 40, 55, 0.95)',
    '--room-dropdown-item-active': 'rgba(255, 255, 255, 0.1)',
  },
  light: {
    '--room-card-bg': 'rgba(255, 255, 255, 0.8)',
    '--room-secondary-text': 'rgba(0, 0, 0, 0.6)',
    '--room-button-bg': 'rgba(0, 0, 0, 0.04)',
    '--room-slider-bg': 'rgba(0, 0, 0, 0.15)',
    '--room-border-color': 'rgba(0, 0, 0, 0.08)',
    '--room-popup-bg': 'rgba(255, 255, 255, 0.95)',
    '--room-popup-card-bg': 'rgba(240, 240, 245, 0.95)',
    '--room-dropdown-item-active': 'rgba(0, 0, 0, 0.06)',
  },
}

/** Apply a color scheme to an element */
export function applyColorScheme(el: HTMLElement, theme: string): void {
  const scheme = COLOR_SCHEMES[theme]
  if (!scheme) return
  Object.entries(scheme).forEach(([key, val]) => {
    el.style.setProperty(key, val)
  })
}
