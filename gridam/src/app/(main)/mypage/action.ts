import { getCookies } from "@/shared/utils/get-cookies"

// 사용자 통합 정보 조회 함수
export async function getUserData() {
  const cookieHeader = await getCookies()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/mypage`,
    {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
      next: { revalidate: 0 },
      headers: {
        Cookie: cookieHeader,
      },
    }
  )

  return res.json()
}
