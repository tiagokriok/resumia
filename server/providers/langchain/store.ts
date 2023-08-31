import { Document } from 'langchain/dist/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RedisVectorStore } from 'langchain/vectorstores/redis'
import { redis } from '../redis'

export async function embedDocuments(
  documents: Document<Record<string, any>>[],
  keyPrefix: string,
) {
  await redis.connect()

  await RedisVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
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
  return new RedisVectorStore(
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    {
      indexName: 'resumia-embeddings',
      redisClient: redis,
      keyPrefix: `resumia:${keyPrefix}:`,
    },
  )
}
