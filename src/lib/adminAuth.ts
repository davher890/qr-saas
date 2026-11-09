import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

type AuthResult =
  | { ok: true; user: User; admin: SupabaseClient; isAdmin: boolean }
  | { ok: false; response: NextResponse }

/**
 * Validates the Bearer token from the request and checks whether the user
 * is listed in the `admins` table. Server-side only.
 */
export async function getAdminStatus(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(url, anonKey)

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }),
    }
  }

  const admin = createSupabaseAdmin()
  const { data: admins, error: adminsError } = await admin
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)

  return { ok: true, user, admin, isAdmin: !adminsError && !!admins?.length }
}

/**
 * Like getAdminStatus, but responds 403 when the user is not an admin.
 */
export async function requireAdmin(req: Request) {
  const result = await getAdminStatus(req)
  if (!result.ok) return result
  if (!result.isAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'User not allowed' }, { status: 403 }),
    }
  }
  return result
}
