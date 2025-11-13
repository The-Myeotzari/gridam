import WeatherContainer from '@/features/write/components/weather/weather-container'
import { cookies } from 'next/headers'

const DEFAULT = { lat: 37.5665, lon: 126.978 }

export default async function WriteHader() {
  const cookie = await cookies()
  const lat = Number(cookie.get('lat')?.value)
  const lon = Number(cookie.get('lon')?.value)
  const hasGeo = Number.isFinite(lat) && Number.isFinite(lon)
  const coords = hasGeo ? { lat, lon } : DEFAULT

  return (
    <section
      className="flex items-center justify-between p-5 border-b"
      style={{ borderColor: 'black' }}
    >
      <div className="font-bold text-md sm:text-xl">2025년 11월 13일 목요일</div>
      <WeatherContainer lat={coords.lat} lon={coords.lon} />
    </section>
  )
}
