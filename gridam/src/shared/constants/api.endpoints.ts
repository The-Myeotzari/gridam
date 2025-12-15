const BASE_API = process.env.NEXT_PUBLIC_API_BASE_URL

const AUTH = `/apis/auth`
const AUTH_BASE = `${BASE_API}/auth`
const CALENDAR = `${BASE_API}/calendar`
const DIARIES = `${BASE_API}/diaries`
const DIARIES_BASE = `apis/diaries`
const DRAFT = `${BASE_API}/draft`
const MEMO = `${BASE_API}/memos`
const MYPAGE = `${BASE_API}/mypage`
const OPENAPI = `${BASE_API}/openapi`
const UPLOADS = `${BASE_API}/uploads`
const WEATHER = `${BASE_API}/weather`

export const API_ENDPOINTS = {
  AUTH: {
    CHANGE_PASSWORD: `${AUTH}/change-password`,
    CONFIRM: `${AUTH}/confirm`,
    LOGIN: `${AUTH}/login`,
    LOGOUT: `${AUTH}/logout`,
    REGISTER: `${AUTH}/register`,
    RESET_COMPLETE: `${AUTH_BASE}/reset/complete`,
    RESET_REQUEST: `${AUTH}/reset/request`,
    FORGOT: `${AUTH}/forgot`,
  },
  CALENDAR: {
    DAY: `${CALENDAR}/day`,
    MONTH: `${CALENDAR}/month`,
  },
  DIARIES: {
    BASE: `${DIARIES}`,
    BY_ID: (id: string | number) => `${DIARIES}/${id}`,
    EXPORT: `${DIARIES}/export`,
    EXPORT_BASE: `${DIARIES_BASE}/export`,
    MONTHLY: `${DIARIES}/monthly`,
    MONTHLY_BASE: `${DIARIES_BASE}/monthly`,
  },
  DRAFT: {
    BASE: `${DRAFT}`,
    BY_ID: (id: string | number) => `${DRAFT}/${id}`,
    PUBLISH: (id: string | number) => `${DRAFT}/${id}/publish`,
  },
  MEMO: {
    BASE: `${MEMO}`,
    BY_ID: (id: string | number) => `${MEMO}/${id}`,
  },
  MYPAGE: {
    BASE: `${MYPAGE}`,
  },
  OPENAPI: {
    BASE: `${OPENAPI}`,
  },
  UPLOADS: {
    BASE: `${UPLOADS}`,
    REPLACE: `${UPLOADS}/replace`,
    SIGN: `${UPLOADS}/sign`,
  },
  WEATHER: {
    BASE: `${WEATHER}`,
  },
} as const
