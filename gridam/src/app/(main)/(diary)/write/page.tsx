import { fetchWeather } from '@/features/write/api/weather.api'
import WeatherIcon, { mapWeatherIdToIcon } from '@/features/write/components/weathre-icon'
import WriteForm from '@/features/write/components/write-form'
import { formatDate } from '@/utils/format-date'
import { getCoordsFromCookies } from '@/utils/get-coords-from-cookies'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookie = await cookies()
  const coords = getCoordsFromCookies(cookie)
  const data = await fetchWeather(coords.lat, coords.lon)
  const today = formatDate()
  const wearther = mapWeatherIdToIcon(data.id)

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
          <WeatherIcon id={data.id} icon={data.icon} alt={data.description} size={36} />
          {/* <div className="text-md opacity-80">{Math.round(data.temp)}°C</div> */}
        </section>
      </section>

      <WriteForm today={today} weather={wearther} />
    </div>
  )
}
