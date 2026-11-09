"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { QRCodeCanvas } from "qrcode.react"
import { supabase } from "@/lib/supabaseClient"
import { QRCodeData } from "@/app/interfaces/interfaces"
import QrScanStats, { QRScan } from "@/components/QrScanStats"

export default function AdminQrStatsPage({
  params,
}: {
  params: Promise<{ userId: string; qrId: string }>
}) {
  const { userId, qrId } = use(params)
  const router = useRouter()
  const t = useTranslations()
  const [qr, setQr] = useState<QRCodeData | null>(null)
  const [scans, setScans] = useState<QRScan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session?.access_token) {
        setError(t("admin.notSignedIn"))
        setLoading(false)
        return
      }
      const res = await fetch(
        `/api/admin/users/${encodeURIComponent(userId)}/qr-codes/${encodeURIComponent(qrId)}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      )
      if (!res.ok) {
        if (res.status === 403) setError(t("admin.accessDenied"))
        else if (res.status === 401) setError(t("admin.notSignedIn"))
        else if (res.status === 404) setError(t("qrDetailPage.qrNotFound"))
        else setError(t("admin.errorLoadingQrCodes"))
        setLoading(false)
        return
      }
      const data = await res.json()
      setQr(data.qr ?? null)
      setScans(data.scans ?? [])
      setLoading(false)
    }
    fetchData()
  }, [userId, qrId, t])

  const backButton = (
    <button
      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      onClick={() => router.push(`/dashboard/admin/users/${userId}`)}
    >
      {t("admin.backToUserQrCodes")}
    </button>
  )

  if (loading) return <p className="p-6">{t("common.loading")}</p>
  if (error || !qr)
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error ?? t("qrDetailPage.qrNotFound")}</p>
        {backButton}
      </div>
    )

  return (
    <div>
      <div className="mb-6">{backButton}</div>
      <h1 className="text-3xl font-bold mb-4">{t("qrDetailPage.title")}</h1>

      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow w-full md:w-1/3 text-center">
          <QRCodeCanvas
            value={process.env.NEXT_PUBLIC_APP_HOSTNAME + "/qr/" + qr.short_code}
            size={qr.size || 128}
            fgColor={qr.fg_color || "#000000"}
            bgColor={qr.bg_color || "#ffffff"}
          />
          <p className="mt-4 font-semibold break-all text-gray-800">{qr.original_url}</p>
          <p className="text-sm text-gray-500">
            {t("qrDetail.shortcode")}: {qr.short_code}
          </p>
          <p className="text-sm text-gray-500">
            {t("qrDetail.createdAt")}: {new Date(qr.created_at).toLocaleString()}
          </p>
          <p className="mt-4 text-sm text-gray-800">
            {t("admin.totalScans", { count: scans.length })}
          </p>
        </div>

        <QrScanStats scans={scans} />
      </div>
    </div>
  )
}
