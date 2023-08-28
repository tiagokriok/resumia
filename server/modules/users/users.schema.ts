import { Schema, model } from 'mongoose'
import { nanoid } from '../../providers/nanoid'

export interface User {
  id: string
  name: string
  publicName?: string
  email: string
  password: string
  rememberToken?: string
  role: 'owner' | 'manager' | 'staff' | 'sys_admin'
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
      enum: ['owner', 'manager', 'staff', 'sys_admin'],
      default: 'staff',
    },
  },
  {
    collection: 'users',
  },
)

UserSchema.pre(/^update/, function () {
  this.set({ updatedAt: Date.now() })
})

export const Users = model<User>('User', UserSchema)
