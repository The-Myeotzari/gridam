import WeatherContainer from '@/features/write/components/weather/weather-container'
import { cookies } from 'next/headers'

const DEFAULT = { lat: 37.5665, lon: 126.978 }

export default async function Page() {
  // 날씨 컴포넌트 호출 예시
  const cookie = await cookies()
  const lat = Number(cookie.get('lat')?.value)
  const lon = Number(cookie.get('lon')?.value)
  const hasGeo = Number.isFinite(lat) && Number.isFinite(lon)
  const coords = hasGeo ? { lat, lon } : DEFAULT

  return (
    <>
      {/* 날씨 컴포넌트 호출 예시 */}
      <WeatherContainer lat={coords.lat} lon={coords.lon} />
    </>
  )
}
