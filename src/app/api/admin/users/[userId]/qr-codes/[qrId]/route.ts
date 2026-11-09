import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string; qrId: string }> }
) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response
  const { admin } = auth

  const { userId, qrId } = await params

  const { data: qr, error: qrError } = await admin
    .from('qr_codes')
    .select('*')
    .eq('id', qrId)
    .eq('user_id', userId)
    .maybeSingle()

  if (qrError) {
    return NextResponse.json({ error: qrError.message }, { status: 500 })
  }
  if (!qr) {
    return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
  }

  const { data: scans, error: scansError } = await admin
    .from('qr_scans')
    .select('*')
    .eq('qr_id', qrId)
    .order('scanned_at', { ascending: true })

  if (scansError) {
    return NextResponse.json({ error: scansError.message }, { status: 500 })
  }

  return NextResponse.json({ qr, scans: scans ?? [] })
}
