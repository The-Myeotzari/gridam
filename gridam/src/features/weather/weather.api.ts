import 'server-only'

// OpenWeather weather.id 매핑 (참고: https://openweathermap.org/weather-conditions)
function mapWeatherIdToIcon(id: number): string {
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

export async function fetchWeather(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`

  const res = await fetch(url, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('날씨 정보를 불러오지 못했습니다.')

  const data = await res.json()

  const id = data.weather[0].id
  const description = data.weather[0].description

  const iconSrc = mapWeatherIdToIcon(id)

  return {
    id,
    description,
    iconSrc,
    raw: data,
  }
}
