"use client"

import { useState } from "react"
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"
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
  const [deleting, setDeleting] = useState(false)

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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this QR code?")) return

    setDeleting(true)
    const { error } = await supabase
      .from("qr_codes")
      .delete()
      .eq("id", id)

    setDeleting(false)

    if (error) {
      alert("❌ Error deleting QR: " + error.message)
    } else {
      alert("✅ QR deleted successfully")
      router.push("/dashboard") // Go back to dashboard
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full md:w-1/3 text-center">
      <QRCodeCanvas value={url || ""} size={200} />
      <p className="mt-4 font-semibold break-all text-gray-800">{url}</p>
      <p className="text-sm text-gray-500">Shortcode: {short_code}</p>
      <p className="text-sm text-gray-500">Created at: {new Date(created_at || "").toLocaleString()}</p>

      {/* Edit URL form */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1 text-gray-800">Edit Destination URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border rounded p-2 mb-4 text-gray-800"
          placeholder="https://example.com"
        />

        {/* Button group */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete QR"}
          </button>
        </div>
      </div>
    </div>
  )
}
