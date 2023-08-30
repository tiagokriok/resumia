import { Schema, model } from 'mongoose'
import { Audit } from '~/lib/types/Audit'
import { nanoid } from '../../providers/nanoid'

export interface User {
  id: string
  name: string
  publicName?: string
  email: string
  password: string
  rememberToken?: string
  role: 'owner' | 'common' | 'sys_admin'
  avatar?: string
  verifyAt?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  isDeleted: boolean
  createdBy: Audit
  updatedBy?: Audit
  deletedBy?: Audit
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
    publicName: {
      type: String,
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
    role: {
      type: String,
      enum: ['owner', 'common', 'sys_admin'],
      default: 'common',
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
    createdBy: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    updatedBy: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    deletedBy: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
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
