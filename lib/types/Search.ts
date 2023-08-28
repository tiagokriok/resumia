import { z } from 'zod'

export const searchSchema = z.object({
  limit: z.number().min(0).default(10),
  offset: z.number().min(0).default(0),
  orderBy: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  query: z.string().optional(),
  columns: z
    .array(
      z.union([
        z.string().trim(),
        z.object({
          field: z.string().trim(),
          as: z.string().trim(),
        }),
      ]),
    )
    .optional(),
  withTrash: z.boolean().default(false),
})

// ['name', { field: 'email', as: 'email_alias' }]

export type SearchQuery = z.infer<typeof searchSchema>
