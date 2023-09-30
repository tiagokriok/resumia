import { Schema, model } from 'mongoose'
import { nanoid } from '../../providers/nanoid'

export interface User {
  id: string
  name: string
  email: string
  password: string
  rememberToken?: string
  expiresAt?: Date
  role: 'common' | 'sys_admin'
  plan: 'free' | 'pro'
  language?: string
  avatar?: string
  verifyAt?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  isDeleted: boolean
}

const UserSchema = new Schema<User>(
  {
    id: {
      type: String,
      default: () => nanoid(),
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    rememberToken: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['owner', 'common', 'sys_admin'],
      default: 'common',
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    language: {
      type: String,
    },
    avatar: {
      type: String,
    },
    verifyAt: {
      type: Date,
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
    collection: 'users',
    versionKey: false,
  },
)

UserSchema.pre(/^update/, function () {
  this.set({ updatedAt: Date.now() })
})

export const Users = model<User>('User', UserSchema)
