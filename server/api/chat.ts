import { LangChainStream, StreamingTextResponse } from 'ai'
import { RetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { Chats } from '~/server/modules/chats/chats.schema'
import { vectorStore } from '../providers/langchain'
import { redis } from '../providers/redis'

export const runtime = 'edge'

export default defineLazyEventHandler(async () => {
  await redis.connect()

  const prompt = new PromptTemplate({
    template: `
			Você é especialista em analise de documentos.
			O usuário recebeu esse documento e precisa de ajuda para entender o conteúdo.
			Se a resposta não for encontrada no conteúdo do documento, responda que você não encontrou nenhuma informação sobre o assunto, não tente inventar uma resposta.
			Responda a pergunta de acordo com o que está escrito abaixo:
			{context}

			Pergunta:
			{question}
		`.trim(),
    inputVariables: ['context', 'question'],
  })

  return defineEventHandler(async (event) => {
    try {
      const ctx = event.context

      if (!ctx.auth) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
      }

      const { user } = ctx.auth

      if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
      }

      const body = await readBody(event)

      if (!body) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Missing body',
        })
      }

      const { chatId, messages } = body

      console.log('chatId', chatId, 'messages', messages)

      if (!chatId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Missing file id',
        })
      }

      const chat = await Chats.findOne({ id: chatId, 'owner.id': user.id })

      if (!chat) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Not Found',
          message: 'Chat not found',
        })
      }

      // TODO: Save question

      const { stream, handlers } = LangChainStream()

      const openAiChat = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-3.5-turbo',
        temperature: 0.3,
        streaming: true,
        callbacks: [handlers],
      })

      const store = vectorStore(chat.file.id)

      const chain = RetrievalQAChain.fromLLM(openAiChat, store.asRetriever(3), {
        prompt,
      })

      chain
        .call({
          query: messages.at(-1).content,
        })
        .then(async (response) => {
          await redis.disconnect()
          // TODO: save response
          console.log(response)
        })
        .catch(console.error)

      return new StreamingTextResponse(stream)
    } catch (error) {
      await redis.disconnect()
      console.error(error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
      })
    }
  })
})
