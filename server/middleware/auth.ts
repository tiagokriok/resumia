import AccessTokenProvider from '../providers/jwt/AccessTokenProvider'

export default defineEventHandler(async (event) => {
  const authCookie = getCookie(event, 'auth')

  const headers = getHeaders(event)

  if (headers.authorization) {
    const authorization = headers.authorization

    const token = authorization.replace('Bearer ', '')
    const { user } = await AccessTokenProvider.decode(token)

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    event.context.auth = {
      user,
      accessToken: authorization,
    }
  } else if (authCookie) {
    const auth = JSON.parse(authCookie)

    const { access_token } = auth

    if (access_token) {
      const { user } = await AccessTokenProvider.decode(access_token)

      if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
      }

      event.context.auth = {
        user,
        accessToken: access_token,
      }
    }
  }
})
