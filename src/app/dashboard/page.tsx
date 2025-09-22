"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function DashboardPage() {
  const [qrs, setQrs] = useState<any[]>([])

  useEffect(() => {
    const fetchQrs = async () => {
      const { data } = await supabase.from("qr_codes").select("*")
      setQrs(data || [])
    }
    fetchQrs()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your QR Codes</h1>
      {qrs.length === 0 ? (
        <p>No QR codes yet. .</p>
      ) : (
        <div className="flex flex-col gap-4">
          <a href="/dashboard/create" className="text-blue-600">Create one</a>
          <ul className="space-y-3">
            {qrs.map((qr) => (
              <li key={qr.id} className="border p-3 rounded flex justify-between">
                <span>{qr.original_url}</span>
                <a href={`/dashboard/qr/${qr.id}`} className="text-blue-600">View</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
