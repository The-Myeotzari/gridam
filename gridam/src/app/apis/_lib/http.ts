import { NextResponse } from 'next/server'

export const ok = (data: unknown, init = 200) =>
  NextResponse.json({ ok: true, data }, { status: init })

export const fail = (message: string, init = 400) =>
  NextResponse.json({ ok: false, message }, { status: init })
