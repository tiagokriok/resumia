import type { EventHandler, EventHandlerRequest } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

export const defineProtectedHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    const start = Date.now()
    try {
      const user = await serverSupabaseUser(event)

      if (!user) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
        })
      }

      event.context.auth = {
        user,
      }

      return await handler(event)
    } catch (err) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    } finally {
      const durationMs = Date.now() - start
      console.info(
        `[API] - ${event.method.toUpperCase()} ${event.path} - ${
          event.node.res.statusCode
        } - took ${durationMs}ms`,
      )
    }
  })
