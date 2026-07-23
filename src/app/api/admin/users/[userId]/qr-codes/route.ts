import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(url, anonKey)

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const admin = createSupabaseAdmin()
  const { data: admins, error: adminsError } = await admin
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)

  if (adminsError || !admins?.length) {
    return NextResponse.json({ error: 'User not allowed' }, { status: 403 })
  }

  const { userId } = await params
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const { data: qrCodes, error: qrError } = await admin
    .from('qr_codes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (qrError) {
    return NextResponse.json({ error: qrError.message }, { status: 500 })
  }

  return NextResponse.json({ qrCodes: qrCodes ?? [] })
}
