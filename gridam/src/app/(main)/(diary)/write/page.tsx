import { fetchWeather } from '@/features/write/api/weather.api'
import WeatherIcon from '@/features/write/components/weather-icon'
import WriteForm from '@/features/write/components/write-form'
import { formatDate } from '@/utils/format-date'
import { getCoordsFromCookies } from '@/utils/get-coords-from-cookies'
import { mapWeatherIdToIcon } from '@/utils/map-weather-to-icon'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookie = await cookies()
  const coords = getCoordsFromCookies(cookie)
  const data = await fetchWeather(coords.lat, coords.lon)
  const weather = mapWeatherIdToIcon(data.id)
  const today = formatDate()
  const dateValue = new Date().toISOString().slice(0, 10)

  return (
    <div
      className="max-w-4xl mx-auto border-2 border-solid bg-(--color-cream-white)"
      style={{ borderColor: 'black' }}
    >
      <section
        className="flex items-center justify-between p-5 border-b"
        style={{ borderColor: 'black' }}
      >
        <div className="font-bold text-md sm:text-xl">{today}</div>

        <section className="flex items-center leading-9 gap-2">
          <div className="font-bold text-md hidden sm:block">날씨</div>
          <WeatherIcon id={data.id} alt={data.description} size={36} />
          {/* <div className="text-md opacity-80">{Math.round(data.temp)}°C</div> */}
        </section>
      </section>

      <WriteForm today={today} dateValue={dateValue} weather={weather} />
    </div>
  )
}
