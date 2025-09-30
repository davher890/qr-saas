"use client"

import { useRouter } from "next/navigation"
import { QRCodeCanvas } from "qrcode.react"

interface QrCardProps {
  id: string
  original_url: string
  short_code: string
  created_at: string
  fgColor: string
  bgColor: string
  size: number
}

export default function QrCard({ id, original_url, short_code, created_at, fgColor, bgColor, size }: QrCardProps) {
  const router = useRouter()

  return (
    <div
      className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
      onClick={() => router.push(`/dashboard/qr/${id}`)}
    >
      <QRCodeCanvas value={process.env.NEXT_PUBLIC_APP_HOSTNAME + "/qr/" + short_code} fgColor={fgColor} bgColor={bgColor} />
      <p className="mt-2 font-semibold break-all text-gray-800">{original_url}</p>
      <p className="text-sm text-gray-500">Shortcode: {short_code}</p>
      <p className="text-sm text-gray-500">
        Created: {new Date(created_at).toLocaleString()}
      </p>
    </div>
  )
}
