import { NextResponse } from 'next/server'

const PASSWORD = process.env.APP_PASSWORD || 'barefoot2024'

export async function POST(req: Request) {
  const { password } = await req.json()

  if (password === PASSWORD) {
    const response = NextResponse.json({ ok: true })
    response.cookies.set('auth', 'true', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  }

  return NextResponse.json({ ok: false }, { status: 401 })
}