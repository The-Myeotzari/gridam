import { MESSAGES } from '@/shared/constants/messages'
import type { Params } from '@/shared/types/params.type'
import { updateSchema } from '@/shared/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase, user } = await getAuthenticatedUser()

    const query = supabase.from('diaries').select('*').eq('id', id).single()
    const { data, error } = await query

    if (error) {
      return NextResponse.json({ message: MESSAGES.DIARY.ERROR.READ }, { status: 500 })
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
    const body = await req.json()

    const { supabase, user } = await getAuthenticatedUser()

    const parsed = updateSchema.safeParse({ ...body, id })
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.DIARY.ERROR.CREATE_NO_DATA },
        { status: 400 }
      )
    }
    const { content, imageUrl } = parsed.data

    const { data: existing, error: fetchErr } = await supabase
      .from('diaries')
      .select('status, published_at')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchErr || !existing) {
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.READ }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('diaries')
      .update({
        content,
        image_url: imageUrl,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.UPDATE }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: MESSAGES.DIARY.ERROR.UPDATE }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase, user } = await getAuthenticatedUser()

    const { data: existing, error: fetchErr } = await supabase
      .from('diaries')
      .select('id, user_id, deleted_at')
      .eq('id', id)
      .single()

    if (fetchErr) {
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.READ }, { status: 500 })
    }
    if (!existing || existing.deleted_at) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.DIARY.ERROR.READ_NO },
        { status: 500 }
      )
    }

    const { error } = await supabase
      .from('diaries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.DELETE }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
