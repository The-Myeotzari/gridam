import DiaryForm from '@/features/diary/components/diary-form'
import DiaryLayout from '@/features/diary/components/diary-layout'
import WeatherIcon from '@/features/diary/components/weather-icon'
import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import CanvasContainer from '@/shared/ui/canvas/canvas-container'
import { getFormatDate, getTodayISODate } from '@/shared/utils/date'
import { SITE_URL } from '@/shared/utils/url'
import { Metadata } from 'next'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies } from 'next/headers'

const DEFAULT_COORDS = { lat: 37.5665, lon: 126.978 }

export function getCoordsFromCookies(cookieStore: ReadonlyRequestCookies) {
  const lat = Number(cookieStore.get('lat')?.value)
  const lon = Number(cookieStore.get('lon')?.value)
  return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : DEFAULT_COORDS
}

export async function generateMetadata(): Promise<Metadata> {
  const dateValue = getTodayISODate()
  const formattedDate = getFormatDate(dateValue)
  const title = `${formattedDate} 일기 쓰기 | Gridam`
  const description = `${formattedDate}의 그림 일기를 작성해보세요.`
  const url = new URL(URL_CONSTANTS.DIARY.WRITE, SITE_URL)
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: ['그리담', 'Gridam', '그림일기', '일기쓰기', '오늘일기'],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Gridam',
      type: 'website',
      locale: 'ko_KR',
    },
  }
}

export default async function Page() {
  const cookie = await cookies()
  const coords = getCoordsFromCookies(cookie)

  const weatherRes = await fetch(
    `${API_ENDPOINTS.WEATHER.BASE}?lat=${coords.lat}&lon=${coords.lon}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  )
  const weather = await weatherRes.json()

  const dateValue = getTodayISODate()
  const formattedDate = getFormatDate(dateValue)

  return (
    <DiaryLayout
      date={formattedDate}
      weatherIcon={<WeatherIcon src={weather.iconSrc} alt={weather.description} size={36} />}
      canvasSection={<CanvasContainer />}
      formSection={<DiaryForm dateValue={dateValue} weather={weather.iconSrc} />}
    />
  )
}
