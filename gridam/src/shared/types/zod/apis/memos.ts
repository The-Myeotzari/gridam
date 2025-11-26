import z from 'zod'

export const createMemoSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

export const updateMemoSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
})
