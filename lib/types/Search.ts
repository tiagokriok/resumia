import { z } from 'zod'

export const searchSchema = z.object({
  limit: z.number().min(0).default(10),
  offset: z.number().min(0).default(0),
  orderBy: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  query: z.string().optional(),
  columns: z.array(z.string().trim()).optional(),
  searchText: z.string().optional(),
})

export type SearchQuery = z.infer<typeof searchSchema>
