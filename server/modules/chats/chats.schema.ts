import { Schema, model } from 'mongoose'
import { nanoid } from '~/server/providers/nanoid'
import { Message } from '../messages/messages.schema'

export interface Chat {
  id: string
  owner: {
    id: string
    name: string
  }
  file: {
    id: string
    label: string
  }
  messages: Omit<Message, 'chatId'>[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  isDeleted: boolean
}

const ChatSchema = new Schema<Chat>(
  {
    id: {
      type: String,
      default: () => nanoid(),
      required: true,
      unique: true,
    },
    owner: {
      _id: false,
      id: {
        type: String,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    file: {
      _id: false,
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
    },
    messages: {
      type: [
        {
          _id: false,
          id: {
            type: String,
            ref: 'Message',
          },
          content: {
            type: String,
          },
          createdAt: {
            type: Date,
          },
          role: {
            type: String,
            enum: ['user', 'assistant'],
          },
        },
      ],
      validate: [
        (
          val: {
            content: string
            fromUser: boolean
            createdAt: Date
            id: string
          }[],
        ) => val.length <= 10,
        '{PATH} cannot have more than 10 messages',
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'chats',
    versionKey: false,
  },
)

ChatSchema.pre(/^update/, function () {
  this.set({ updatedAt: Date.now() })
})

export const Chats = model<Chat>('Chat', ChatSchema)
