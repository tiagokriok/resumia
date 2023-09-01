import { sendPrompt } from '../providers/langchain'

export const runtime = 'edge'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    const ctx = event.context

    if (!ctx.auth) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const { user } = ctx.auth

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // Extract the `prompt` from the body of the request
    const { question, fileId } = await readBody(event)

    if (!fileId) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
    }

    if (!question) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
    }

    const response = await sendPrompt(`${user.id}:${fileId}`, question).catch(
      console.error,
    )

    return {
      response,
    }
  })
})
