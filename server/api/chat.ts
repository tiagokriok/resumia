import { LangChainStream, StreamingTextResponse } from 'ai'
import { RetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { Chats } from '~/server/modules/chats/chats.schema'
import { Messages } from '~/server/modules/messages/messages.schema'
import { vectorStore } from '../providers/langchain'
import { redis } from '../providers/redis'

export const runtime = 'edge'

export default defineLazyEventHandler(async () => {
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

      const question = await Messages.create({
        chatId,
        content: messages.at(-1).content,
        role: 'user',
      })

      // TODO: update Chat

      const { stream, handlers } = LangChainStream()

      const openAiChat = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-3.5-turbo',
        temperature: 0.3,
        streaming: true,
        callbacks: [handlers],
      })

      await redis.connect()

      const store = vectorStore(chat.file.id)

      const chain = RetrievalQAChain.fromLLM(openAiChat, store.asRetriever(3), {
        prompt,
      })

      chain
        .call({
          query: question.content,
        })
        .then(async (response) => {
          await redis.disconnect()

          await Messages.create({
            chatId,
            content: response.text,
            role: 'assistant',
          })

          // TODO: update Chat
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
    } finally {
    }
  })
})
