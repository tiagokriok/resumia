import { Schema, model } from 'mongoose'
import { nanoid } from '../../providers/nanoid'

export interface File {
  id: string
  label: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document'
  mimeType: string
  sha256: string
  url: string
  size: number
  owner: {
    id: string
    name: string
  }
  createdAt: Date
  deletedAt?: Date
  isDeleted: boolean
}

const FileSchema = new Schema<File>(
  {
    id: {
      type: String,
      default: () => nanoid(),
      required: true,
      unique: true,
    },
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document'],
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    sha256: {
      type: String,
    },
    url: {
      type: String,
    },
    size: {
      type: Number,
      required: true,
    },
    owner: {
      _id: false,
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    createdAt: {
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
    collection: 'files',
    versionKey: false,
  },
)

export const Files = model<File>('File', FileSchema)
