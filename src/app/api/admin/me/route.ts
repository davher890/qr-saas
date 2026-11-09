import { NextResponse } from 'next/server'
import { getAdminStatus } from '@/lib/adminAuth'

export async function GET(req: Request) {
  const auth = await getAdminStatus(req)
  if (!auth.ok) return auth.response
  return NextResponse.json({ isAdmin: auth.isAdmin })
}
