import DiaryForm from '@/features/diary-detail/components/diary-form'
import DiaryLayout from '@/features/diary-detail/components/diary-layout'
import { fetchWeather } from '@/features/weather/api/weather.api'
import WeatherIcon from '@/features/weather/components/weather-icon'
import { getCoordsFromCookies } from '@/features/weather/utils/get-coords-from-cookies'
import { mapWeatherIdToIcon } from '@/features/weather/utils/map-weather-to-icon'
import { formatDate } from '@/utils/format-date'
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
