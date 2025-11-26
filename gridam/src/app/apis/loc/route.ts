import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { lat, lon } = await req.json()

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json({ ok: false, error: 'Invalid coordinates' }, { status: 400 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('lat', String(lat), { path: '/', maxAge: 60 * 60 * 24 })
    res.cookies.set('lon', String(lon), { path: '/', maxAge: 60 * 60 * 24 })
    return res
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })
  }
}
