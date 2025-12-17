import { MESSAGES } from "@/shared/constants/messages"
import { ApiResponse } from "@/features/mypage/types/mypage"

type ChangePasswordPayload = {
  password: string
  newPassword: string
  confirmPassword: string
}

export async function changePasswordAction(
  values: ChangePasswordPayload
): Promise<ApiResponse> {
  try {
    const res = await fetch('/apis/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const json = (await res.json()) as ApiResponse

    if (!json.ok) {
      return {
        ok: false,
        message: json.message ?? MESSAGES.AUTH.ERROR.PASSWORD_RESET,
      }
    }

    return json
  } catch {
    return {
      ok: false,
      message: MESSAGES.AUTH.ERROR.PASSWORD_RESET,
    }
  }
}