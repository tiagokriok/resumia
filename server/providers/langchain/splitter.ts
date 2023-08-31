import { Document } from 'langchain/dist/document'
import { TokenTextSplitter } from 'langchain/text_splitter'

export async function splitter(docs: Document<Record<string, any>>[]) {
  const splitter = new TokenTextSplitter({
    encodingName: 'cl100k_base',
    chunkSize: 600,
    chunkOverlap: 0,
  })

  return splitter.splitDocuments(docs)
}
