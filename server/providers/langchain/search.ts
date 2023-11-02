import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RedisVectorStore } from 'langchain/vectorstores/redis'
import { redis } from '../redis'

export async function search(keyPrefix: string, question: string) {
  const { openaiApiKey } = useRuntimeConfig()

  const store = new RedisVectorStore(
    new OpenAIEmbeddings({
      openAIApiKey: openaiApiKey,
    }),
    {
      indexName: 'resumia-embeddings',
      redisClient: redis,
      keyPrefix: `resumia:${keyPrefix}:`,
    },
  )

  const response = await store.similaritySearchWithScore(question, 5)

  console.log(response)
}
