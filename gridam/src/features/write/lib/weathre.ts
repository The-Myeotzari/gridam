export type CurrentWeather = {
  id: number // weather[0].id
  main: string // "Rain"
  description: string // "moderate rain"
  icon: string // "10d"
  temp: number // 섭씨
  feelsLike: number
  name: string // 도시명
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<CurrentWeather> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY
  if (!apiKey) throw new Error('Missing NEXT_PUBLIC_OPENWEATHER_KEY')

  const url = new URL('https://api.openweathermap.org/data/2.5/weather')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lon))
  url.searchParams.set('appid', apiKey)
  url.searchParams.set('units', 'metric') // 섭씨
  url.searchParams.set('lang', 'kr')

  const res = await fetch(url.toString(), { signal, cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch weather')
  const json = await res.json()

  const w = json.weather?.[0]
  return {
    id: w?.id ?? 0,
    main: w?.main ?? '',
    description: w?.description ?? '',
    icon: w?.icon ?? '',
    temp: json.main?.temp ?? 0,
    feelsLike: json.main?.feels_like ?? 0,
    name: json.name ?? '',
  }
}
