import { z } from 'zod'

export const DraftCreateSchema = z.object({
  content: z.string(),
  date: z.string(), // YYYY-MM-DD
  emoji: z.string().optional(),
  imageUrl: z.string().nullable(),
  meta: z
    .object({
      timezone: z.string(),
    })
    .nullable(),
})

export const DraftUpdateSchema = z.object({
  id: z.string(),
  content: z.string().min(1).max(2000).optional(),
  imageUrl: z.string().nullable().optional(),
})
