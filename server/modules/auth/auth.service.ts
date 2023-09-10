import { TRPCError } from '@trpc/server'
import * as argon2 from 'argon2'
import { nanoid } from 'nanoid'
import AccessTokenProvider from '../../providers/jwt/AccessTokenProvider'
import { Users } from '../users/users.schema'
import { LoginInput, RegisterInput } from './dto'

export const register = async ({ input }: { input: RegisterInput }) => {
  const emailExists = await Users.findOne({ email: input.email })

  if (emailExists) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Email already exists',
    })
  }

  const passwordHash = await argon2.hash(input.password)

  const user = await Users.create({
    email: input.email,
    name: input.name,
    password: passwordHash,
    role: 'owner',
    rememberToken: nanoid(),
  })

  // TODO: Send verification email

  const { password, rememberToken, ...userWithoutPassword } = user.toObject()

  const access_token = await AccessTokenProvider.sign(userWithoutPassword)

  return {
    user: userWithoutPassword,
    access_token,
  }
}

export const login = async ({ input }: { input: LoginInput }) => {
  const user = await Users.findOne({ email: input.email })

  if (!user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid email or password',
    })
  }

  if (!(await argon2.verify(user.password, input.password))) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid email or password',
    })
  }

  const { password, rememberToken, plan, ...userWithoutPassword } = user

  const access_token = await AccessTokenProvider.sign(userWithoutPassword)

  return {
    user: userWithoutPassword,
    access_token,
  }
}
