import { TRPCError } from '@trpc/server'
import { createSecretKey } from 'crypto'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { User } from '~/server/modules/users/users.schema'

export interface tokenPayload extends JWTPayload {
  iat: number
  exp: number
  sub: string
  user: Omit<User, 'password' | 'rememberToken'>
}

class AccessTokenProvider {
  /**
   * Signs a user object into a JWT token using the provided secret and options.
   * @param user - The user object to sign (without password and remember_token fields).
   * @returns The JWT token signed with the user object, secret and options.
   * @throws An error if there is an issue signing the user object.
   */
  public static async sign(
    user: Omit<User, 'password' | 'rememberToken'>,
  ) {
    try {
      const config = useRuntimeConfig()
      return await new SignJWT({ user })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(createSecretKey(config.jwtSecret, 'utf-8'))
    } catch (error) {
      throw error
    }
  }

  /**
   * Decode an access token using the JWT secret from the environment.
   * @param access_token - The access token to decode.
   * @returns The decoded token payload.
   * @throws An error if the access token cannot be decoded.
   */
  public static async decode(access_token: string) {
    try {
      const config = useRuntimeConfig()
      const { payload } = await jwtVerify(
        access_token,
        createSecretKey(config.jwtSecret, 'utf-8'),
      )
      return payload as tokenPayload
    } catch (error) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
  }
}

export default AccessTokenProvider
