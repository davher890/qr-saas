"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { supabase } from "@/lib/supabaseClient"
import { QRCodeData } from "@/app/interfaces/interfaces"
import QrGrid from "@/components/QrGrid"

type AdminUser = {
  id: string
  email: string
  username: string
}

export default function AdminUserQrCodesPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = use(params)
  const router = useRouter()
  const t = useTranslations()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQrCodes = async () => {
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
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/qr-codes`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      if (!res.ok) {
        if (res.status === 403) setError(t("admin.accessDenied"))
        else if (res.status === 401) setError(t("admin.notSignedIn"))
        else if (res.status === 404) setError(t("admin.userNotFound"))
        else setError(t("admin.errorLoadingQrCodes"))
        setLoading(false)
        return
      }
      const data = await res.json()
      setUser(data.user ?? null)
      setQrCodes(data.qrCodes ?? [])
      setLoading(false)
    }
    fetchQrCodes()
  }, [userId, t])

  const backButton = (
    <button
      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      onClick={() => router.push("/dashboard/admin")}
    >
      {t("admin.backToUsers")}
    </button>
  )

  if (loading) return <p className="p-6">{t("common.loading")}</p>
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error}</p>
        {backButton}
      </div>
    )

  return (
    <div>
      <div className="mb-6">{backButton}</div>
      <h1 className="text-2xl font-bold mb-1">
        {t("admin.userQrCodesTitle", { name: user?.username || user?.email || userId })}
      </h1>
      {user?.email && <p className="text-gray-500 mb-1">{user.email}</p>}
      <p className="text-gray-500 font-mono text-sm mb-6">{userId}</p>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        {t("admin.totalQrCodes", { count: qrCodes.length })}
      </p>
      <QrGrid
        qrCodes={qrCodes}
        getDetailHref={(qrId) => `/dashboard/admin/users/${userId}/qr/${qrId}`}
      />
    </div>
  )
}
