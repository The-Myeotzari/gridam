export const URL_CONSTANTS = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT: '/forgot',
  },
  DIARY: {
    WRITE: '/write',
    BY_ID: (id: string | number) => `/${id}`,
  },
  DRAFT: '/draft',
  MEMO: {
    BASE: '/memo',
    BY_ID: (id: string | number) => `/memo/${id}`,
  },
  MYPAGE: {
    BASE: 'mypage',
  },
} as const
