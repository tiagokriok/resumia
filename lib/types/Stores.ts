import { User } from '../../server/modules/users/users.schema'

export interface AuthState {
  isAuthenticated: boolean
  user: Omit<
    User,
    | 'password'
    | 'rememberToken'
    | 'verifyAt'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'isDeleted'
    | 'createdBy'
  >
  access_token: string
}

export interface LoginAction {
  user: Omit<
    User,
    | 'password'
    | 'rememberToken'
    | 'verifyAt'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'isDeleted'
    | 'createdBy'
  >
  access_token: string
}
