import type { ThemeConfig } from './types'

let _currentTheme = 'light'
let _themeConfig: ThemeConfig | null = null

export function setTheme(theme: string): void {
  _currentTheme = theme
}

export function getTheme(): string {
  return _currentTheme
}

export function setThemeConfig(config: ThemeConfig): void {
  _themeConfig = config
}

export function getThemeConfig(): ThemeConfig | null {
  return _themeConfig
}

/** Get CSS variable value */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Resolve a color value, checking theme variables */
export function resolveColor(color: string): string {
  if (color.startsWith('--')) {
    return getCssVar(color) || color
  }
  return color
}

/** Lighten a hex color by a factor (0-1) */
export function lightenColor(hex: string, factor: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex
  const r = Math.min(255, parseInt(result[1], 16) + Math.round((255 - parseInt(result[1], 16)) * factor))
  const g = Math.min(255, parseInt(result[2], 16) + Math.round((255 - parseInt(result[2], 16)) * factor))
  const b = Math.min(255, parseInt(result[3], 16) + Math.round((255 - parseInt(result[3], 16)) * factor))
  return `rgb(${r}, ${g}, ${b})`
}

/** Convert hex color to RGB string */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '255, 255, 255'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

/** Check if current theme is dark */
export function isDarkTheme(): boolean {
  return _currentTheme === 'dark'
}

/** Apply theme variables to an element */
export function applyTheme(el: HTMLElement, theme: string): void {
  el.setAttribute('data-theme', theme)
}
