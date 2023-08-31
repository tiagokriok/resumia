import { PDFLoader } from 'langchain/document_loaders/fs/pdf'

export async function pdfLoader(path: string) {
  const loader = new PDFLoader(path)

  const docs = await loader.load()

  return docs
}
