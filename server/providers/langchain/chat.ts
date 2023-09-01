import { RetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { redis } from '../redis'
import { vectorStore } from './store'

export const openAiChat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.3,
  streaming: true,
})

export async function sendPrompt(keyPrefix: string, question: string) {
  try {
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

    const store = vectorStore(keyPrefix)

    const chain = RetrievalQAChain.fromLLM(openAiChat, store.asRetriever(3), {
      prompt,
    })

    await redis.connect()

    const response = await chain.call({
      query: question,
    })

    await redis.disconnect()

    return response
  } catch (error) {
    console.error(error)
    throw new Error('Send prompt error')
  }
}
