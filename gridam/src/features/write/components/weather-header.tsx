'use client'

import { useWeather } from '../hooks/useWeathre'
import WeatherIcon from './weathre-icon'

export default function WeatherHeader() {
  const { data, isLoading, isError, error, refetch, geoError } = useWeather()

  return (
    <section style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0 24px' }}>
      {isLoading && <span>날씨 불러오는 중…</span>}

      {isError && (
        <span style={{ color: 'crimson' }}>
          날씨 조회 실패: {(error as Error)?.message}{' '}
          <button onClick={() => refetch()}>다시 시도</button>
        </span>
      )}

      {geoError && <span style={{ color: 'orange' }}>{geoError}</span>}

      {data && (
        <>
          <WeatherIcon id={data.id} icon={data.icon} alt={data.description} size={36} />
          <div style={{ lineHeight: 1.2 }}>
            <strong>{data.name || '현 위치'}</strong>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              {data.description} · {Math.round(data.temp)}°C (체감 {Math.round(data.feelsLike)}°)
            </div>
          </div>
        </>
      )}
    </section>
  )
}
