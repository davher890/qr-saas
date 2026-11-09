import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response
  const { admin } = auth

  const { userId } = await params
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const { data: userData, error: targetUserError } = await admin.auth.admin.getUserById(userId)
  if (targetUserError || !userData?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const targetUser = {
    id: userData.user.id,
    email: userData.user.email ?? '',
    username: (userData.user.user_metadata as { display_name?: string })?.display_name ?? '',
  }

  const { data: qrCodes, error: qrError } = await admin
    .from('qr_codes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (qrError) {
    return NextResponse.json({ error: qrError.message }, { status: 500 })
  }

  return NextResponse.json({ user: targetUser, qrCodes: qrCodes ?? [] })
}
