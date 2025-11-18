import { fetchWeather } from '@/features/diary-detail/api/weather.api'
import DiaryForm from '@/features/diary-detail/components/diary-form'
import DiaryLayout from '@/features/diary-detail/components/diary-layout'
import WeatherIcon from '@/features/diary-detail/components/weather/weather-icon'
import { formatDate } from '@/utils/format-date'
import { getCoordsFromCookies } from '@/utils/get-coords-from-cookies'
import { mapWeatherIdToIcon } from '@/utils/map-weather-to-icon'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookie = await cookies()
  const coords = getCoordsFromCookies(cookie)
  const data = await fetchWeather(coords.lat, coords.lon)
  const weather = mapWeatherIdToIcon(data.id)

  const dateValue = new Date().toISOString().slice(0, 10)
  const formattedDate = formatDate(dateValue)

  return (
    <DiaryLayout
      date={formattedDate}
      weatherIcon={<WeatherIcon id={data.id} alt={data.description} size={36} />}
    >
      <DiaryForm dateValue={dateValue} weather={weather} />
    </DiaryLayout>
  )
}
