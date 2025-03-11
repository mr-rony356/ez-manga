import { NextResponse, type NextRequest } from 'next/server'
import { Website_Local_API } from '@global'
import { User } from '@/types'

const ALLOWED_ROLES = ['Admin']

export async function middleware(request: NextRequest) {
  const cookies = request.cookies.toString()
  const user = (
    await (
      await fetch(`${Website_Local_API}/auth/user`, {
        headers: {
          cookie: cookies,
        },
      })
    ).json()
  ).user as User
  if (!ALLOWED_ROLES.includes(user.role))
    return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: ['/api/website', '/api/assets'],
}
