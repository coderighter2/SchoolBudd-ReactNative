import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../constants'

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS
})

export const onLogout = () => ({
  type: LOGOUT_SUCCESS
})