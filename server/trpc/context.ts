import { serverSupabaseUser } from '#supabase/server'
import { PrismaClient } from '@prisma/client'
import { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(event: H3Event) {
  // for API-response caching see https://trpc.io/docs/caching
  // console.log('cookies', parseCookies(event))

  const getUser = async () => {
    return await serverSupabaseUser(event)
  }

  const prisma = new PrismaClient({
    log: ['query'],
  })

  return {
    user: await getUser(),
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
