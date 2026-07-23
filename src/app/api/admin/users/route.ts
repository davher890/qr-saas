import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
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
