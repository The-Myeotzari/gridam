// NOTE: 쿼리키 정리 필요

export const QUERY_KEYS = {
  // Auth 관련
  AUTH: {
    ROOT: ['auth'] as const,
    REGISTER: ['auth', 'register'] as const,
    LOGIN: ['auth', 'login'] as const,
    LOGOUT: ['auth', 'logout'] as const,
    RESET_REQUEST: ['auth', 'reset', 'request'] as const,
    RESET_COMPLETE: ['auth', 'reset', 'complete'] as const,
    ME: ['auth', 'me'] as const,
    CHANGE_PASSWORD: ['auth', 'change'] as const,
  },

  // Me 관련
  ME: ['me'] as const,

  // 다이어리
  DIARY: {
    ROOT: ['diary'] as const,
    LIST: (year: string, month: string) => ['diary', 'list', { year, month }] as const,
    DETAIL: (id: string) => ['diary', id] as const,
    CREATE: ['diary', 'create'] as const,
    UPDATE: ['diary', 'update'] as const,
    MONTHLY_EXPORT: (year: number, month: number) =>
      ['diary', 'monthly-export', year, month] as const,
  },

  //Drafts 관련
  DRAFTS: {
    ROOT: ['drafts'] as const,
    LIST: ['drafts', 'list'] as const,
    LATEST: ['drafts', 'latest'] as const,
    DETAIL: (id: string) => ['drafts', id] as const,
    CREATE: ['drafts', 'create'] as const,
    UPDATE: (id: string) => ['drafts', id, 'update'] as const,
    DELETE: (id: string) => ['drafts', id, 'delete'] as const,
    PUBLISH: (id: string) => ['drafts', id, 'publish'] as const,
  },

  // Storage 관련
  STORAGE: {
    ROOT: ['uploads'] as const,
    UPLOAD: ['uploads', 'create'] as const,
    REPLACE: ['uploads', 'replace'] as const,
    DELETE: ['uploads', 'delete'] as const,
    SIGN: (path: string) => ['uploads', 'sign', { path }] as const,
  },
} as const
