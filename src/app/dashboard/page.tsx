"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { QRCodeSVG } from "qrcode.react"
import QrCard from "@/components/QrCard"

interface QRCodeData {
  id: string
  original_url: string
  short_code: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQRCodes = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error)
      } else {
        setQrCodes(data || [])
      }
      setLoading(false)
    }

    fetchQRCodes()
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

    if (lines.length === 0) {
      alert("File is empty")
      return
    }

    let createdCount = 0
    for (const url of lines) {
      const shortCode = Math.random().toString(36).substring(2, 8) // generate shortcode
      const { error } = await supabase.from("qr_codes").insert([
        { original_url: url, short_code: shortCode }
      ])
      if (!error) createdCount++
    }

    alert(`✅ Created ${createdCount} new QR codes from file`)
    router.refresh()
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push("/dashboard/create")}
        >
          Create New QR
        </button>

        {/* Upload button */}
        <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
          Upload File
          <input
            type="file"
            accept=".txt,.csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {qrCodes.length === 0 ? (
        <p>No QR codes created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <QrCard
              key={qr.id}
              id={qr.id}
              original_url={qr.original_url}
              short_code={qr.short_code}
              created_at={qr.created_at}
            />
          ))}
        </div>
      )}
    </div>
  )
}
