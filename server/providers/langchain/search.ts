import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RedisVectorStore } from 'langchain/vectorstores/redis'
import { redis } from '../redis'

export async function search(keyPrefix: string, question: string) {
  const { openaiApiKey } = useRuntimeConfig()
  await redis.connect()

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

  await redis.disconnect()
}
