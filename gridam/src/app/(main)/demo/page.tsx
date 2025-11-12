import WeatherContainer from '@/features/write/components/weather/weather-container'
import DropBox from '@/components/ui/dropbox'
import { cookies } from 'next/headers'

const DEFAULT = { lat: 37.5665, lon: 126.978 }

export default async function Page() {
  // 날씨 컴포넌트 호출 예시
  const cookie = await cookies()
  const lat = Number(cookie.get('lat')?.value)
  const lon = Number(cookie.get('lon')?.value)
  const hasGeo = Number.isFinite(lat) && Number.isFinite(lon)
  const coords = hasGeo ? { lat, lon } : DEFAULT

  async function deletePostAction() {
    'use server'
    // 삭제
  }

  async function editPostAction() {
    'use server'
    // 편집 진입/초기화 등
  }

  return (
    <>
      <DropBox id={'test'} onDelete={deletePostAction} onEdit={editPostAction} />
      {/* 날씨 컴포넌트 호출 예시 */}
      <WeatherContainer lat={coords.lat} lon={coords.lon} />
    </>
  )
}
