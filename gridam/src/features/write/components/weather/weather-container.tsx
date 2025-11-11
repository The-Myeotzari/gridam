import { fetchWeather } from '@/features/write/api/weather.api'
import WeatherIcon from '@/features/write/components/weather/weathre-icon'

type Props = { lat: number; lon: number }

export default async function WeatherContainer({ lat, lon }: Props) {
  const data = await fetchWeather(lat, lon)

  return (
    <section style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0 24px' }}>
      <WeatherIcon id={data.id} icon={data.icon} alt={data.description} size={36} />
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: 14, opacity: 0.8 }}>
          {data.description} · {Math.round(data.temp)}°C
        </div>
      </div>
    </section>
  )
}
