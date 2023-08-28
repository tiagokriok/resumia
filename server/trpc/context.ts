import { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import AccessTokenProvider from '../providers/jwt/AccessTokenProvider'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(event: H3Event) {
  // for API-response caching see https://trpc.io/docs/caching
  // console.log('cookies', parseCookies(event))
  const authorization = event.node.req.headers.authorization ?? null

  const getUser = async (): Promise<{
    id: string
    name: string
    email: string
    role: string
  } | null> => {
    if (authorization) {
      const [, token] = authorization.split(' ')
      const { user } = await AccessTokenProvider.decode(token)

      return {
        ...user,
      }
    }
    return null
  }

  return {
    user: await getUser(),
    ...(authorization && { accessToken: authorization }),
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
