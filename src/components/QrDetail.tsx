"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

interface QrDetailProps {
  id: string
  original_url: string
  short_code: string
  created_at: string
}

export default function QrDetail({ id, original_url, short_code, created_at }: QrDetailProps) {
  const router = useRouter()
  const [url, setUrl] = useState(original_url)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from("qr_codes")
      .update({ original_url: url })
      .eq("id", id)

    setSaving(false)

    if (error) {
      alert("❌ Error updating QR: " + error.message)
    } else {
      alert("✅ QR updated successfully")
      router.refresh()
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full md:w-1/3 text-center">
        <QRCodeSVG value={url || ""} size={200} />
        <p className="mt-4 font-semibold break-all">{url}</p>
        <p className="text-sm text-gray-500">Shortcode: {short_code}</p>
        <p className="text-sm text-gray-500">Created at: {new Date(created_at || "").toLocaleString()}</p>

        {/* Edit URL form */}
        <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Edit Destination URL</label>
        <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border rounded p-2 mb-2"
            placeholder="https://example.com"
        />
        <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            {saving ? "Saving..." : "Save Changes"}
        </button>
        </div>
    </div>
  )
}
