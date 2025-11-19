import DiaryForm from '@/features/diary/components/diary-form'
import DiaryLayout from '@/features/diary/components/diary-layout'
import WeatherIcon from '@/features/weather/weather-icon'
import { fetchWeather } from '@/features/weather/weather.api'
import { formatDate } from '@/shared/utils/format-date'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies } from 'next/headers'

const DEFAULT_COORDS = { lat: 37.5665, lon: 126.978 }

// TODO: 방식 변경 필요
export function getCoordsFromCookies(cookieStore: ReadonlyRequestCookies) {
  const lat = Number(cookieStore.get('lat')?.value)
  const lon = Number(cookieStore.get('lon')?.value)
  return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : DEFAULT_COORDS
}

export default async function Page() {
  const cookie = await cookies()
  const coords = getCoordsFromCookies(cookie)
  const weather = await fetchWeather(coords.lat, coords.lon)

  const dateValue = new Date().toISOString().slice(0, 10)
  const formattedDate = formatDate(dateValue)

  return (
    <DiaryLayout
      date={formattedDate}
      weatherIcon={<WeatherIcon src={weather.iconSrc} alt={weather.description} size={36} />}
    >
      <DiaryForm dateValue={dateValue} weather={weather.iconSrc} />
    </DiaryLayout>
  )
}
