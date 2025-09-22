"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { QRCodeSVG } from "qrcode.react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface QRScan {
  scanned_at: string
  ip_address: string
  user_agent: string
}

interface QRCodeData {
  id: string
  original_url: string
  short_code: string
  created_at: string
}

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [qr, setQr] = useState<QRCodeData | null>(null)
  const [scans, setScans] = useState<QRScan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Fetch QR code info
      const { data: qrData, error: qrError } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("id", id)
        .single()

      if (qrError || !qrData) {
        alert("QR code not found")
        router.push("/dashboard")
        return
      }

      setQr(qrData)

      // Fetch scan info
      const { data: scanData } = await supabase
        .from("qr_scans")
        .select("*")
        .eq("qr_id", id)
        .order("scanned_at", { ascending: true })

      setScans(scanData || [])
      setLoading(false)
    }

    fetchData()
  }, [  id, router])

  // Prepare chart data: counts per day
  const chartData = scans.reduce<Record<string, number>>((acc, scan) => {
    const date = new Date(scan.scanned_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const formattedChartData = Object.entries(chartData).map(([date, count]) => ({ date, count }))

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">QR Code Details</h1>

      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow w-full md:w-1/3 text-center">
          <QRCodeSVG value={`www.localhost:3000/qr/${qr?.short_code}`} size={200} />
          <p className="mt-4 font-semibold">{qr?.original_url}</p>
          <p className="text-sm text-gray-500">Shortcode: {qr?.short_code}</p>
          <p className="text-sm text-gray-500">Created at: {new Date(qr?.created_at || "").toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow w-full md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Scan Analytics</h2>
          {scans.length === 0 ? (
            <p>No scans yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" />
              </LineChart>
            </ResponsiveContainer>
          )}

          {scans.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Recent Scans</h3>
              <ul className="divide-y">
                {scans.slice(-5).reverse().map((scan, index) => (
                  <li key={index} className="py-2 flex justify-between">
                    <span>{new Date(scan.scanned_at).toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">{scan.ip_address}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <button
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  )
}
