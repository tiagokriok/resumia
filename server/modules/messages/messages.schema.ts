import { Schema, model } from 'mongoose'
import { nanoid } from '~/server/providers/nanoid'

export interface Message {
  id: string
  content: string
  createdAt: Date
  fromUser: boolean
  conversationId: string
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
      required: true,
    },
    fromUser: {
      type: Boolean,
      default: false,
    },
    conversationId: {
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
