import { MESSAGES } from "@/shared/constants/messages"
import { ApiResponse } from "@/features/mypage/types/mypage"

export async function logoutAction(): Promise<ApiResponse> {
  try {
    const res = await fetch('/apis/auth/logout', {
      method: 'POST',
    })

    const json = (await res.json()) as ApiResponse

    if (!json.ok) {
      return {
        ok: false,
        message: json.message ?? MESSAGES.AUTH.ERROR.LOGOUT,
      }
    }

    return json
  } catch {

    return {
      ok: false,
      message: MESSAGES.AUTH.ERROR.LOGOUT,
    }
  }
}