import z from 'zod'

export const createSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  content: z.string(),
  emoji: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  meta: z
    .object({
      timezone: z.string(),
    })
    .nullable(),
})

export const querySchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
  year: z.coerce.number().int().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  cursor: z.iso.datetime().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export const updateSchema = z.object({
  id: z.string(),
  content: z.string().min(1).max(2000).optional(),
  imageUrl: z.string().nullable().optional(),
  // status: z.enum(['draft', 'published']).optional(),
})

export const putSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  timezone: z.string(),
  emoji: z.string().optional(),
})
