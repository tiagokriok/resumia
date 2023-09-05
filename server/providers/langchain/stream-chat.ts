import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { BufferMemory } from 'langchain/memory'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'

import * as fs from 'fs'

export const run = async () => {
  const text = fs.readFileSync('state_of_the_union.txt', 'utf8')
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })
  const docs = await textSplitter.createDocuments([text])
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings())
  let streamedResponse = ''
  const streamingModel = new ChatOpenAI({
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          streamedResponse += token
        },
      },
    ],
  })
  const nonStreamingModel = new ChatOpenAI({})
  const chain = ConversationalRetrievalQAChain.fromLLM(
    streamingModel,
    vectorStore.asRetriever(),
    {
      returnSourceDocuments: true,
      memory: new BufferMemory({
        memoryKey: 'chat_history',
        inputKey: 'question', // The key for the input to the chain
        outputKey: 'text', // The key for the final conversational output of the chain
        returnMessages: true, // If using with a chat model
      }),
      questionGeneratorChainOptions: {
        llm: nonStreamingModel,
      },
    },
  )
  /* Ask it a question */
  const question = 'What did the president say about Justice Breyer?'
  const res = await chain.call({ question })
  console.log({ streamedResponse })
  /*
    {
      streamedResponse: 'President Biden thanked Justice Breyer for his service, and honored him as an Army veteran, Constitutional scholar and retiring Justice of the United States Supreme Court.'
    }
  */
}
