const API = process.env.NEXT_PUBLIC_OPENWEATHER_KEY

type Weather = {
  id: number
  description: string
  icon: string
  temp: number
}

export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error(`Invalid coords: lat=${lat}, lon=${lon}`)
  }

  if (!API) {
    throw new Error('Missing OPENWEATHER_API_KEY')
  }

  const url = new URL('https://api.openweathermap.org/data/2.5/weather')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lon))
  url.searchParams.set('appid', API)
  url.searchParams.set('units', 'metric') // 섭씨
  url.searchParams.set('lang', 'kr')

  const res = await fetch(url.toString(), { cache: 'no-store' })

  if (!res.ok) {
    return {} as Weather
  }

  const json = await res.json()
  const weather = json?.weather?.[0] ?? {}

  return {
    id: Number(weather.id) || 0,
    description: weather.description ?? '',
    icon: weather.icon ?? '',
    temp: json?.main?.temp || 0,
  }
}
