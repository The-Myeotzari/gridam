import Image from 'next/image'

type WeatherIconProps = {
  src: string
  alt?: string
  size?: number
}

export default function WeatherIcon({ src, alt = 'weather icon', size = 48 }: WeatherIconProps) {
  if (!src) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center text-xs text-muted-foreground"
      >
        ?
      </div>
    )
  }

  return <Image src={src} alt={alt} width={size} height={size} priority />
}
