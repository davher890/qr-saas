"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import QrCard from "@/components/QrCard"

interface QRCodeData {
  id: string
  original_url: string
  short_code: string
  created_at: string
  fg_color: string
  bg_color: string
  size: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([])
  const [filteredQrCodes, setFilteredQrCodes] = useState<QRCodeData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

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
        setFilteredQrCodes(data || [])
      }
      setLoading(false)
    }

    fetchQRCodes()
  }, [])

  useEffect(() => {
    if (!search.trim()) setFilteredQrCodes(qrCodes)
    else {
      const filtered = qrCodes.filter((qr) =>
        qr.original_url.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredQrCodes(filtered)
    }
  }, [search, qrCodes])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { data: { user } } = await supabase.auth.getUser()
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
      const shortCode = Math.random().toString(36).substring(2, 8)
      const { error } = await supabase.from("qr_codes").insert([
        { 
          original_url: url, 
          short_code: shortCode,
          user_id: user?.id
        }
      ])
      if (!error) createdCount++
      else alert(error.message)
    }

    alert(`✅ Created ${createdCount} new QR codes from file`)
    router.refresh()
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full md:w-1/3"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push("/dashboard/create")}
        >
          Create New QR
        </button>

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

      {filteredQrCodes.length === 0 ? (
        <p>No QR codes created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredQrCodes.map((qr) => (
            <QrCard
              key={qr.id}
              id={qr.id}
              original_url={qr.original_url}
              short_code={qr.short_code}
              created_at={qr.created_at}
              fgColor={qr.fg_color || "#000000"}
              bgColor={qr.bg_color || "#ffffff"}
              size={qr.size || 128}
            />
          ))}
        </div>
      )}
    </>
  )
}
