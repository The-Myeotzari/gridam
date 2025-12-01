import { NextResponse } from 'next/server'

export const ok = (data: unknown, init = 200) =>
  NextResponse.json({ ok: true, data }, { status: init })

export const fail = (message: string, init = 400) =>
  NextResponse.json({ ok: false, message }, { status: init })

// NOTE: 제거 필요
export const withCORS = (resp: Response) => {
  resp.headers.set('Access-Control-Allow-Origin', '*')
  resp.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return resp
}

// NOTE: 제거 필요
export function OPTIONS() {
  return withCORS(new Response(null, { status: 204 }))
}
