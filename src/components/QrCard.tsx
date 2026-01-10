"use client"

import { useRef } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
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

export default function QrCard({ id, original_url, short_code, created_at, fgColor, bgColor }: QrCardProps) {
  const router = useRouter()
  const t = useTranslations()
  const qrRef = useRef<HTMLCanvasElement>(null)

  const downloadQR = (e: React.MouseEvent) => {
    e.stopPropagation()

    const canvas = qrRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `qr-${short_code}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
      onClick={() => router.push(`/dashboard/qr/${id}`)}
    >
      <QRCodeCanvas
        ref={qrRef}
        value={process.env.NEXT_PUBLIC_APP_HOSTNAME + "/qr/" + short_code}
        fgColor={fgColor}
        bgColor={bgColor}
      />
      <button
        onClick={downloadQR}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        {t('qrCard.download')}
      </button>
      <p className="mt-2 font-semibold break-all text-gray-800">{original_url}</p>
      <p className="text-sm text-gray-500">{t('qrCard.shortcode')}: {short_code}</p>
      <p className="text-sm text-gray-500">
        {t('qrCard.created')}: {new Date(created_at).toLocaleString()}
      </p>
    </div>
  )
}
