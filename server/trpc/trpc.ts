/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { TRPCError, initTRPC } from '@trpc/server'
import { Context } from '../trpc/context'

const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      message:
        error.code === 'INTERNAL_SERVER_ERROR' &&
        process.env.NODE_ENV === 'production'
          ? 'Something went wrong'
          : shape.message,
      data: {
        code: shape.data.code,
        httpStatus: shape.data.httpStatus,
      },
    }
  },
})

const loggerMiddleware = t.middleware(async (opts) => {
  const start = Date.now()

  const result = await opts.next()

  const durationMs = Date.now() - start
  const meta = { path: opts.path, type: opts.type, durationMs }

  result.ok
    ? console.log(
        `[TRPC] - ${meta.type.toUpperCase()} ${meta.path} took ${durationMs}ms`,
      )
    : console.error(
        `[TRPC] - ERROR - ${meta.type.toUpperCase()} ${
          meta.path
        } took ${durationMs}ms`,
      )

  return result
})

const ensureAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Missing authorization',
    })
  }

  // if (!user) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' })
  // }

  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

const procedure = t.procedure.use(loggerMiddleware)

/**
 * Unprotected procedure
 **/
export const publicProcedure = procedure
export const protectedProcedure = procedure.use(ensureAuth)
export const router = t.router
export const middleware = t.middleware
