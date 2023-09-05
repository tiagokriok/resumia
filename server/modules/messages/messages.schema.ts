import { Schema, model } from 'mongoose'
import { nanoid } from '~/server/providers/nanoid'

export interface Message {
  id: string
  content: string
  createdAt: Date
  role: 'user' | 'assistant'
  chatId: string
}

const MessageSchema = new Schema<Message>(
  {
    id: {
      type: String,
      default: () => nanoid(),
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      defaut: Date.now,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
    },
    chatId: {
      type: String,
      required: true,
      ref: 'Conversation',
    },
  },
  {
    collection: 'messages',
    versionKey: false,
  },
)

export const Messages = model<Message>('Message', MessageSchema)
