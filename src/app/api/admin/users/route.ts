import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response
  const { admin } = auth

  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers()
  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 })
  }

  const users = (usersData?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? '',
    username: (u.user_metadata as { display_name?: string })?.display_name ?? '',
  }))

  return NextResponse.json({ users })
}
