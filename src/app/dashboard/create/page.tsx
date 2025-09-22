"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

export default function CreateQrPage() {
  const [url, setUrl] = useState("")
  const [shortcode, setShortcode] = useState("")
  const router = useRouter()

  const handleCreate = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const shortcode = Math.random().toString(36).substring(2, 16)
    setShortcode(shortcode)
    const { error } = await supabase.from("qr_codes").insert({
      original_url: url,
      short_code: shortcode,
      user_id: user?.id,
    })
    if (!error) router.push("/dashboard")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create a QR Code</h1>
      <input
        type="url"
        placeholder="Enter a URL"
        className="border p-2 rounded w-full mb-4"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {url && (
        <div className="mb-4">
          <QRCodeSVG value={`www.localhost:3000/qr/${shortcode}`} size={128} />
        </div>
      )}
      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  )
}
