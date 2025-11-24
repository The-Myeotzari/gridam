import { MESSAGES } from '@/shared/constants/messages'
import { Params } from '@/shared/types/params'
import { updateMemoSchema } from '@/shared/types/zod/apis/memos'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase, user } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()

    if (error || !data) {
      return NextResponse.json({ ok: false, message: MESSAGES.MEMO.ERROR.READ_NO }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase, user } = await getAuthenticatedUser()
    const body = await req.json()

    const parsed = updateMemoSchema.safeParse({ ...body, id })
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.MEMO.ERROR.UPDATE_NO_DATA },
        { status: 400 }
      )
    }

    const { title, content } = parsed.data

    if (!title && !content) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.MEMO.ERROR.UPDATE_NO_DATA },
        { status: 400 }
      )
    }

    const { data: existing, error: fetchErr } = await supabase
      .from('memos')
      .select('id, user_id, deleted_at, title, content')
      .eq('id', id)
      .single()

    if (fetchErr || !existing || existing.deleted_at || existing.user_id !== user.id) {
      return NextResponse.json({ ok: false, message: MESSAGES.MEMO.ERROR.READ_NO }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('memos')
      .update({
        title: title ?? existing.title,
        content: content ?? existing.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ ok: false, message: MESSAGES.MEMO.ERROR.UPDATE }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase, user } = await getAuthenticatedUser()

    const { data: existing, error: fetchErr } = await supabase
      .from('memos')
      .select('id, user_id, deleted_at')
      .eq('id', id)
      .single()

    if (fetchErr) {
      return NextResponse.json({ ok: false, message: MESSAGES.MEMO.ERROR.READ }, { status: 500 })
    }

    if (!existing || existing.deleted_at || existing.user_id !== user.id) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.MEMO.ERROR.DELETE_OVER },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('memos')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ ok: false, message: MESSAGES.MEMO.ERROR.DELETE }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
