import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    const tag = request.nextUrl.searchParams.get('tag') ?? 'home'
    revalidateTag(tag)
    return NextResponse.json({ revalidated: true, now: Date.now() })
}