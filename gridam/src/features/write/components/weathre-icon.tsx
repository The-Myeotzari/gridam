'use client'
import Image from 'next/image'

// OpenWeather weather.id 매핑 (참고: https://openweathermap.org/weather-conditions)
export function mapWeatherIdToIcon(id: number, icon: string): string {
  const isDay = icon.endsWith('d')

  // 2xx 천둥번개
  if (id >= 200 && id < 300) return '/icon/thunderstorm.svg'
  // 3xx 이슬비/소나기
  if (id >= 300 && id < 400) return '/icon/shower-rain.svg'
  // 5xx 비
  if (id >= 500 && id < 600) return '/icon/rain.svg'
  // 6xx 눈
  if (id >= 600 && id < 700) return '/icon/snow.svg'
  // 7xx 안개/연무
  if (id >= 700 && id < 800) return '/icon/mist.svg'
  // 800 맑음
  if (id === 800) return '/icon/clear-sky.svg'
  // 구름
  if (id === 801) return '/icon/few-clouds.svg'
  if (id === 802) return '/icon/scattered-clouds.svg'
  if (id === 803 || id === 804) return '/icon/broken-clouds.svg'

  return '/icon/clear sky.svg'
}

type Props = {
  id: number
  icon: string
  alt?: string
  size?: number
}

export default function WeatherIcon({ id, icon, alt, size = 48 }: Props) {
  const src = mapWeatherIdToIcon(id, icon)
  return <Image src={src} alt={alt ?? 'weather icon'} width={size} height={size} priority />
}
