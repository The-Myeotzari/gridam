export const ok = (data: unknown, init: number = 200) =>
  Response.json({ ok: true, data }, { status: init })
export const fail = (message: string, init: number = 400) =>
  Response.json({ ok: false, message }, { status: init })

export const withCORS = (resp: Response) => {
  resp.headers.set('Access-Control-Allow-Origin', '*')
  resp.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return resp
}

export function OPTIONS() {
  return withCORS(new Response(null, { status: 204 }))
}
