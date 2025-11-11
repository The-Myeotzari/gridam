'use client'

import { fetchCurrentWeather } from '@/features/write/lib/weather'
import { useLocationStore } from '@/features/write/store/location-store'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useWeather() {
  const { lat, lon, setLocation } = useLocationStore()
  const [geoError, setGeoError] = useState<string | null>(null)

  // 위치 권한 요청
  useEffect(() => {
    if (lat != null && lon != null) return
    if (!('geolocation' in navigator)) {
      setGeoError('브라우저가 위치 정보를 지원하지 않습니다.')
      return
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude)
        setGeoError(null)
      },
      (err) => {
        console.error(err)
        setGeoError('위치 접근이 거부되었거나 실패했습니다.')
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 10_000 }
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [lat, lon, setLocation])

  const query = useQuery({
    queryKey: ['current-weather', lat, lon],
    queryFn: ({ signal }) => fetchCurrentWeather(lat as number, lon as number, signal),
    enabled: lat != null && lon != null,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })

  return { ...query, geoError }
}
