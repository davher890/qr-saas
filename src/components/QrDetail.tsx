"use client"

import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

interface QrDetailProps {
  id: string
  original_url: string
  short_code: string
  created_at: string
  fg_color: string
  bg_color: string
  size: number
}

export default function QrDetail({ id, original_url, short_code, fg_color, bg_color, size, created_at }: QrDetailProps) {
  const router = useRouter()

  const [url, setUrl] = useState(original_url)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // new state for customization
  const [fgColorState, setFgColor] = useState(fg_color)
  const [bgColorState, setBgColor] = useState(bg_color)
  const [sizeState, setSize] = useState(size)

  const handleSave = async () => {
    setSaving(true)
    if (id) {
      const { error } = await supabase
        .from("qr_codes")
        .update({
          original_url: url,
          fg_color: fgColorState,
          bg_color: bgColorState,
          size: sizeState
        })
        .eq("id", id)
      setSaving(false)

      if (error) {
        alert("❌ Error updating QR: " + error.message)
      } else {
        alert("✅ QR updated successfully")
        router.refresh()
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from("qr_codes").insert({
        original_url: url,
        short_code: short_code,
        user_id: user?.id,
        fg_color: fgColorState,
        bg_color: bgColorState,
        size: sizeState
      })
      setSaving(false)

      if (error) {
        alert("❌ Error inserting new QR: " + error.message)
      } else {
        alert("✅ QR inserted successfully")
        router.push("/dashboard")
      }
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
      <QRCodeCanvas
        value={process.env.NEXT_PUBLIC_APP_HOSTNAME + "/qr/" + short_code}
        size={sizeState}
        fgColor={fgColorState}
        bgColor={bgColorState}
      />
      <p className="mt-4 font-semibold break-all text-gray-800">{url}</p>
      <p className="text-sm text-gray-500">Shortcode: {short_code}</p>
      <p className="text-sm text-gray-500">Created at: {new Date(created_at || "").toLocaleString()}</p>

      {/* Customization controls */}
      <div className="mt-6 flex flex-col gap-3 text-left">
        <div className="flex items-center justify-between">
          <label htmlFor="fgColor" className="text-sm font-medium text-gray-800">Foreground</label>
          <input
            id="fgColor"
            type="color"
            value={fgColorState}
            onChange={(e) => setFgColor(e.target.value)}
            className="w-12 h-8 border rounded cursor-pointer text-gray-800"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="bgColor" className="text-sm font-medium text-gray-800">Background</label>
          <input
            id="bgColor"
            type="color"
            value={bgColorState}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-12 h-8 border rounded cursor-pointer text-gray-800"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="size" className="text-sm font-medium text-gray-800">Size (px)</label>
          <input
            id="size"
            type="number"
            min={64}
            max={1024}
            step={8}
            value={sizeState}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24 text-gray-800"
          />
        </div>
      </div>

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
