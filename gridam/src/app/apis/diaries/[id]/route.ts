import { MESSAGES } from '@/shared/constants/messages'
import { Params } from '@/shared/types/params'
import { updateSchema } from '@/shared/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { uploadDiaryImage } from '@/shared/utils/uploads/upload-diary-image'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ message: MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER }, { status: 401 })
    }

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
    if (!user) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER },
        { status: 401 }
      )
    }

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

    let uploadedUrl: string | null = null
    if (imageUrl) {
      const { url } = await uploadDiaryImage(imageUrl, user.id)
      uploadedUrl = url
    }

    const patch: Record<string, any> = {
      ...(content !== undefined && { content }),
      image_url: uploadedUrl ?? null,
    }

    if (existing.status === 'published') {
      patch.published_at = existing.published_at
    }

    const { data, error } = await supabase
      .from('diaries')
      .update(patch)
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
    if (!user) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER },
        { status: 401 }
      )
    }

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
