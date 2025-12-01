import { MESSAGES } from '@/shared/constants/messages'
import { createMemoSchema } from '@/shared/types/zod/apis/memos'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    const { searchParams } = new URL(req.url)

    const rawLimit = searchParams.get('limit')
    const limit =
      Number.isNaN(Number(rawLimit)) || !rawLimit
        ? 50
        : Math.min(Math.max(Number(rawLimit), 1), 100)

    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ ok: false, message: MESSAGES.MEMO.ERROR.READ }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    const body = await req.json()

    const parsed = createMemoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.MEMO.ERROR.CREATE_NO_DATA },
        { status: 400 }
      )
    }

    const { title, content } = parsed.data

    const { data, error } = await supabase
      .from('memos')
      .insert({
        user_id: user.id,
        title,
        content,
      })
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ ok: false, message: MESSAGES.MEMO.ERROR.CREATE }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
