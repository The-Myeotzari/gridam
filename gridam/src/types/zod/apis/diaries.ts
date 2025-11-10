import z from 'zod'

export const createSchema = z.object({
  content: z.string().min(1).max(200),
  date: z.string(), // 'YYYY-MM-DD'
  emoji: z.string().optional(),
  imageUrl: z.string().url().optional(),
  meta: z
    .object({
      timezone: z.string(),
      weather: z.any().optional(),
    })
    .optional(),
})

export const querySchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
})

export const updateSchema = z.object({
  content: z.string().min(1).max(200).optional(),
  emoji: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export const putSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  timezone: z.string(),
  weather: z.any().nullable().optional(),
})
