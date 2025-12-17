import { NextResponse } from 'next/server'

const FALLBACK = {
  id: 0,
  description: '날씨 정보를 가져올 수 없습니다',
  iconSrc: '/icon/clear-sky.svg',
  raw: null,
}

// OpenWeather weather.id 매핑 (참고: https://openweathermap.org/weather-conditions)
function mapWeatherIdToIcon(id: number): string {
  if (id >= 200 && id < 300) return '/icon/thunderstorm.svg'
  if (id >= 300 && id < 400) return '/icon/shower-rain.svg'
  if (id >= 500 && id < 600) return '/icon/rain.svg'
  if (id >= 600 && id < 700) return '/icon/snow.svg'
  if (id >= 700 && id < 800) return '/icon/mist.svg'
  if (id === 800) return '/icon/clear-sky.svg'
  if (id === 801) return '/icon/few-clouds.svg'
  if (id === 802) return '/icon/scattered-clouds.svg'
  if (id === 803 || id === 804) return '/icon/broken-clouds.svg'

  return '/icon/clear-sky.svg'
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(FALLBACK, { status: 400 })
  }

  try {
    const key = process.env.OPENWEATHER_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=kr`

    const res = await fetch(url, { cache: 'no-store' })

    if (!res.ok) return NextResponse.json(FALLBACK)

    const data = await res.json()

    const id = data.weather?.[0]?.id
    const description = data.weather?.[0]?.description ?? '알 수 없는 날씨'
    const iconSrc = mapWeatherIdToIcon(id)

    return NextResponse.json({
      id,
      description,
      iconSrc,
      raw: data,
    })
  } catch (err) {
    return NextResponse.json(FALLBACK)
  }
}
