import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

const DEFAULT_COORDS = { lat: 37.5665, lon: 126.978 }

export function getCoordsFromCookies(cookieStore: ReadonlyRequestCookies) {
  const lat = Number(cookieStore.get('lat')?.value)
  const lon = Number(cookieStore.get('lon')?.value)
  return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : DEFAULT_COORDS
}
