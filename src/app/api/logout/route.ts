import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Borra la cookie con múltiples variantes para cubrir cualquier configuración de path
  response.cookies.delete('auth')
  response.cookies.set('auth', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  })

  return response
}