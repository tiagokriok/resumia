import { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import { User, Users } from '~/server/modules/users/users.schema'
import AccessTokenProvider from '~/server/providers/jwt/AccessTokenProvider'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(event: H3Event) {
  // for API-response caching see https://trpc.io/docs/caching
  // console.log('cookies', parseCookies(event))
  const authorization = event.node.req.headers.authorization ?? null

  const getUser = async (): Promise<User | null> => {
    if (authorization) {
      const [, token] = authorization.split(' ')
      const { user: userPayload } = await AccessTokenProvider.decode(token)

      const user = await Users.findOne({ id: userPayload.id }).lean()

      if (!user) {
        return null
      }

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
