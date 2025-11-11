import { z } from 'zod'

export const DraftCreateSchema = z.object({
  content: z.string().min(1).max(200),
  image: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  emoji: z.string().optional().nullable(),
})

export const DraftUpdateSchema = z.object({
  content: z.string().min(1).max(200).optional(),
  image: z.string().optional().nullable(),
  emoji: z.string().optional().nullable(),
})
