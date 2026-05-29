/** Escape HTML entities */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return str.replace(/[&<>"']/g, c => map[c])
}

/** Format a number with unit */
export function formatNumber(value: number | string, decimals = 1): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '--'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  if (num >= 100) return num.toFixed(0)
  return num.toFixed(decimals)
}

/** Format seconds to duration string */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '--'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

/** Format time from Date */
export function formatTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

/** Format date */
export function formatDate(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/** Format date time */
export function formatDateTime(date: Date | string | number): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

/** Convert a CSS color string to a hex value */
export function colorToHex(color: string): string {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return '#000000'
  ctx.fillStyle = color
  return ctx.fillStyle
}

/** Truncate string */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.substring(0, maxLen - 3) + '...'
}

/** Parse numeric value from entity state */
export function parseNumericState(state: string | undefined): number | null {
  if (!state) return null
  const num = parseFloat(state)
  return isNaN(num) ? null : num
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** Map a value from one range to another */
export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}
