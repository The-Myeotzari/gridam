import { mapWeatherIdToIcon } from '@/utils/map-weather-to-icon'
import Image from 'next/image'

type Props = {
  id: number
  icon: string
  alt?: string
  size?: number
}

export default function WeatherIcon({ id, alt, size = 48 }: Props) {
  const src = mapWeatherIdToIcon(id)
  return <Image src={src} alt={alt ?? 'weather icon'} width={size} height={size} priority />
}
