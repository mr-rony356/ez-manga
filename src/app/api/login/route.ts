import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { Website_Local_API } from '@global'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const response = await axios.post(`${Website_Local_API}/login`, {
    email,
    password,
  })

  return NextResponse.json(
    { redirect: true },
    {
      headers: {
        'Set-Cookie': response.headers['set-cookie']!.join('; '),
      },
    }
  )
}
