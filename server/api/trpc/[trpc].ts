import { createNuxtApiHandler } from 'trpc-nuxt'
import { createContext } from '../../trpc/context'
import { appRouter } from '../../trpc/routers/index'

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error)
    }
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta(opts) {
  //   const { errors } = opts
  //   console.log(errors)
  //   return {
  //     status: 301,
  //   }
  // },
})
