import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: Request, { params }: { params: Promise<{ shortcode: string }> }) {
  const { shortcode } = await params
  const { data: qrData } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("short_code", shortcode)
    .single()

  if (!qrData) return NextResponse.json({ error: "QR not found" }, { status: 404 })

  // Get IP & User-Agent
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("host") || "unknown"
  const ua = req.headers.get("user-agent") || "unknown"

  // Log scan
  await supabase.from("qr_scans").insert({
    qr_id: qrData.id,
    ip_address: ip,
    user_agent: ua
  })

  // Ensure URL is absolute for redirect
  let redirectUrl = qrData.original_url
  if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
    redirectUrl = `https://${redirectUrl}`
  }

  // Redirect to the original URL
  return NextResponse.redirect(redirectUrl)
}
