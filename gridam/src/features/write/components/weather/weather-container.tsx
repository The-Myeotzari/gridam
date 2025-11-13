import { fetchWeather } from '@/features/write/api/weather.api'
import WeatherIcon from '@/features/write/components/weather/weathre-icon'

type Props = { lat: number; lon: number }

export default async function WeatherContainer({ lat, lon }: Props) {
  const data = await fetchWeather(lat, lon)

  return (
    <section className="flex items-center leading-9 gap-2">
      <div className="font-bold text-md hidden sm:block">날씨</div>
      <WeatherIcon id={data.id} icon={data.icon} alt={data.description} size={36} />
      {/* <div className="text-md opacity-80">{Math.round(data.temp)}°C</div> */}
    </section>
  )
}
