"use client"

import { useRouter } from "next/navigation"
import { QRCodeCanvas } from "qrcode.react"

interface QrCardProps {
  id: string
  original_url: string
  short_code: string
  created_at: string
}

const HOSTNAME = "https://qr-saas-git-develop-davher890s-projects.vercel.app"

export default function QrCard({ id, original_url, short_code, created_at }: QrCardProps) {
  const router = useRouter()

  return (
    <div
      className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
      onClick={() => router.push(`/dashboard/qr/${id}`)}
    >
      <QRCodeCanvas value={HOSTNAME + "/qr/" + short_code} size={120} />
      <p className="mt-2 font-semibold break-all text-gray-800">{original_url}</p>
      <p className="text-sm text-gray-500">Shortcode: {short_code}</p>
      <p className="text-sm text-gray-500">
        Created: {new Date(created_at).toLocaleString()}
      </p>
    </div>
  )
}
