import { useCompiler } from '#vue-email'
import { TRPCError } from '@trpc/server'
import * as argon2 from 'argon2'
import { nanoid } from 'nanoid'
import { Resend } from 'resend'
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
    role: 'common',
    rememberToken: nanoid(),
  })

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

export const forgotPassword = async ({ input }: { input: string }) => {
  const config = useRuntimeConfig()

  const user = await Users.findOne({ email: input })

  if (!user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid email',
    })
  }

  const rememberToken = nanoid()

  await Users.updateOne(
    {
      id: user.id,
      email: input,
    },
    {
      $set: {
        rememberToken,
      },
    },
  )

  // TODO: send reset email
  const template = await useCompiler('reset-password.vue', {
    user: user.name,
    token: `${config.appBaseUrl}/app/reset-password/${rememberToken}`,
  })

  const resend = new Resend(config.resendKey)
  console.log(config.appUrl)

  await resend.emails.send({
    from: config.fromEmail,
    to: user.email,
    subject: 'Reset password',
    html: template,
  })
  // TODO: Save id of email

  return {
    message: 'Reset email sent',
  }
}

export const resetPassword = async ({
  input,
}: {
  input: { password: string; rememberToken: string; confirmPassword: string }
}) => {
  const user = await Users.findOne({ rememberToken: input.rememberToken })

  if (!user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid token',
    })
  }

  if (input.password !== input.confirmPassword) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Passwords do not match',
    })
  }

  const passwordHash = await argon2.hash(input.password)

  await Users.updateOne(
    {
      id: user.id,
    },
    {
      $set: {
        password: passwordHash,
        rememberToken: null,
      },
    },
  )
}
