import { ApiResponse } from '@/features/mypage/types/mypage'
import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { api } from '@/shared/lib/fetch-api'

export async function logoutAction(): Promise<ApiResponse> {
  try {
    const res = await api(`${API_ENDPOINTS.AUTH.LOGOUT}`, {
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
