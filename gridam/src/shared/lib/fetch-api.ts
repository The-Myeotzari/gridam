export type ApiInit = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
  cookieHeader?: string
  withCredentials?: boolean
}

const DEFAULT_INIT: RequestInit = {
  method: 'GET',
  cache: 'no-store',
  next: { revalidate: 0 },
}

export async function api(input: string, init: ApiInit = {}) {
  const { headers = {}, cookieHeader, withCredentials = true, ...rest } = init

  return fetch(input, {
    ...DEFAULT_INIT,
    ...rest,
    credentials: withCredentials ? 'include' : 'omit',
    headers: {
      ...(withCredentials && cookieHeader ? { Cookie: cookieHeader } : {}),
      ...headers,
    },
  })
}