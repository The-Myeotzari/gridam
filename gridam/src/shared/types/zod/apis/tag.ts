import { z } from 'zod'

// 개별 태그 (한글/영어/숫자만, 1~12자)
export const memoTagItemSchema = z
  .string()
  .trim()
  .min(1, '태그는 최소 1자 이상이어야 합니다.')
  .max(12, '태그는 최대 12자까지 가능합니다.')
  .regex(/^[가-힣A-Za-z0-9]+$/, '태그는 한글, 영어, 숫자만 입력할 수 있습니다.')

// 태그 배열 (최대 5개)
export const memoTagSchema = z
  .array(memoTagItemSchema)
  .max(5, '태그는 한 메모당 최대 5개까지 추가할 수 있습니다.')
