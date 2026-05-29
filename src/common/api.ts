import type { Hass, HassStates } from './types'

interface CacheEntry<T> {
  data: T
  expiry: number
}

/** Simple TTL cache for API data */
class ApiCache {
  private _cache = new Map<string, CacheEntry<any>>()
  private _maxSize = 50
  private _defaultTTL = 300000 // 5 minutes

  get<T>(key: string): T | null {
    const entry = this._cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiry) {
      this._cache.delete(key)
      return null
    }
    return entry.data as T
  }

  set<T>(key: string, data: T, ttl?: number): void {
    if (this._cache.size >= this._maxSize) {
      const firstKey = this._cache.keys().next().value
      if (firstKey) this._cache.delete(firstKey)
    }
    this._cache.set(key, {
      data,
      expiry: Date.now() + (ttl ?? this._defaultTTL),
    })
  }

  clear(): void {
    this._cache.clear()
  }
}

export const apiCache = new ApiCache()

/** Fetch history from HA */
export async function fetchHistory(
  hass: Hass,
  entityId: string,
  startTime: Date,
  endTime?: Date,
): Promise<any[]> {
  const params = new URLSearchParams({
    filter_entity_id: entityId,
    start_time: startTime.toISOString(),
    minimal_response: 'true',
  })
  if (endTime) params.set('end_time', endTime.toISOString())

  const cacheKey = `history:${entityId}:${startTime.getTime()}:${endTime?.getTime() ?? 0}`
  const cached = apiCache.get<any[]>(cacheKey)
  if (cached) return cached

  const url = `/api/history/period/${startTime.toISOString()}?${params.toString()}`
  const response = await hass.fetchWithTimeout?.(url, {
    headers: { Authorization: `Bearer ${(hass as any).auth?.access_token || ''}` },
  })

  if (!response?.ok) return []
  const data = await response.json()
  apiCache.set(cacheKey, data, 60000) // 1 min cache for history
  return data
}

/** Fetch weather data */
export async function fetchWeather(hass: Hass, entityId: string): Promise<any> {
  const state = hass.states[entityId]
  return state?.attributes || {}
}

/** Fetch energy data overview */
export async function fetchEnergyOverview(hass: Hass): Promise<any> {
  const cacheKey = `energy:overview`
  const cached = apiCache.get(cacheKey)
  if (cached) return cached

  try {
    const response = await hass.fetchWithTimeout?.('/api/energy/overview', {
      headers: { Authorization: `Bearer ${(hass as any).auth?.access_token || ''}` },
    })
    if (!response?.ok) return null
    const data = await response.json()
    apiCache.set(cacheKey, data, 120000) // 2 min cache
    return data
  } catch {
    return null
  }
}

/** Clear all API caches */
export function clearApiCache(): void {
  apiCache.clear()
}
