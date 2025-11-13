import WeatherContainer from '@/features/write/components/weather/weather-container'
import WriteForm from '@/features/write/components/write-form'
import { getCoordsFromCookies } from '@/utils/get-coords-from-cookies'
import { cookies } from 'next/headers'

const DEFAULT = { lat: 37.5665, lon: 126.978 }

export default async function Page() {
  const cookie = await cookies()
  const coords = getCoordsFromCookies(cookie)
  const today = formatDate()

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
        <WeatherContainer lat={coords.lat} lon={coords.lon} />
      </section>
      <WriteForm />
    </div>
  )
}
