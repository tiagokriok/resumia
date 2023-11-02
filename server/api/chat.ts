import { PrismaClient } from '@prisma/client/edge'
import { LangChainStream, StreamingTextResponse } from 'ai'
import { RetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { vectorStore } from '../providers/langchain'
import { defineProtectedHandler } from '../utils/ProtectedHandler'

const prisma = new PrismaClient()

export const runtime = 'edge'

export default defineLazyEventHandler(async () => {
  const { openaiApiKey } = useRuntimeConfig()

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

  return defineProtectedHandler(async (event) => {
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

      const chat = await prisma.chat.findUnique({
        where: {
          id: chatId,
          userId: user.id,
        },
      })

      if (!chat) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Not Found',
          message: 'Chat not found',
        })
      }

      const question = await prisma.message.create({
        data: {
          chatId,
          content: messages.at(-1).content,
          role: 'USER',
        },
      })

      const { stream, handlers } = LangChainStream()

      const openAiChat = new ChatOpenAI({
        openAIApiKey: openaiApiKey,
        modelName: 'gpt-3.5-turbo',
        temperature: 0.3,
        streaming: true,
        callbacks: [handlers],
      })

      const store = vectorStore(chat.fileId)

      const chain = RetrievalQAChain.fromLLM(openAiChat, store.asRetriever(3), {
        prompt,
      })

      chain
        .call({
          query: question.content,
        })
        .then(async (response) => {
          await prisma.message.create({
            data: {
              chatId,
              content: response.text,
              role: 'ASSISTANT',
            },
          })
        })
        .catch(console.error)

      return new StreamingTextResponse(stream)
    } catch (error) {
      console.error(error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
      })
    }
  })
})
