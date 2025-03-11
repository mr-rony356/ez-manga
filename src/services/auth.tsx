import { Token, ValidationError } from '@/types'
import API from './api'
import { AxiosResponse } from 'axios'

const logInRequest = async (email: string, password: string) => {
  await API.post('/login', {
    email,
    password,
  })
}

const signUpRequest = async (
  username: string,
  email: string,
  password: string
) => {
  await API.post('/register', { username, email, password })
  const token = await logInRequest(email, password)
  return token
}

const updateUser = async (user_id: string | number, data: any) => {
  await API.put('/users/' + user_id, data)
}

export { logInRequest, signUpRequest, updateUser }
