"use client"

import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { supabase } from "@/lib/supabaseClient"

type AdminUser = {
  id: string
  email: string
  username: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const t = useTranslations()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
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
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      if (!res.ok) {
        if (res.status === 403) setError(t("admin.accessDenied"))
        else if (res.status === 401) setError(t("admin.notSignedIn"))
        else setError(t("admin.errorLoading"))
        setLoading(false)
        return
      }
      const data = await res.json()
      setUsers(data.users ?? [])
      setLoading(false)
    }
    fetchUsers()
  }, [t])

  if (loading) return <p className="p-6">{t("common.loading")}</p>
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => router.push("/dashboard")}
        >
          {t("qrDetailPage.backToDashboard")}
        </button>
      </div>
    )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("admin.title")}</h1>
      <div className="border rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 font-semibold">{t("admin.email")}</th>
              <th className="p-3 font-semibold">{t("common.username")}</th>
              <th className="p-3 font-semibold">{t("admin.userId")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="p-3">{u.email || "—"}</td>
                <td className="p-3">{u.username || "—"}</td>
                <td className="p-3 font-mono text-sm text-gray-600">{u.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-gray-600">
        {t("admin.totalUsers", { count: users.length })}
      </p>
    </div>
  )
}
