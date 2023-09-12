import { Document } from 'langchain/dist/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RedisVectorStore } from 'langchain/vectorstores/redis'
import { redis } from '../redis'

export async function embedDocuments(
  documents: Document<Record<string, any>>[],
  keyPrefix: string,
) {
  const { openaiApiKey } = useRuntimeConfig()

  await redis.connect()

  await RedisVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings({
      openAIApiKey: openaiApiKey,
    }),
    {
      indexName: 'resumia-embeddings',
      redisClient: redis,
      keyPrefix: `resumia:${keyPrefix}:`,
    },
  )

  await redis.disconnect()
}

export function vectorStore(keyPrefix: string) {
  const { openaiApiKey } = useRuntimeConfig()

  return new RedisVectorStore(
    new OpenAIEmbeddings({
      openAIApiKey: openaiApiKey,
    }),
    {
      indexName: 'resumia-embeddings',
      redisClient: redis,
      keyPrefix: `resumia:${keyPrefix}:`,
    },
  )
}
