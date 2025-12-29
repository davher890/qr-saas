"use client"

import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
import { supabase } from "@/lib/supabaseClient"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import QrDetail from "@/components/QrDetail"

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
    fg_color: string
    bg_color: string
    size: number
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const t = useTranslations()
    const [qr, setQr] = useState<QRCodeData | null>(null)
    const [scans, setScans] = useState<QRScan[]>([])
    const [loading, setLoading] = useState(true)
    const [qrId, setQrId] = useState<string>("")

    useEffect(() => {
        params.then(p => setQrId(p.id))
    }, [params])

    useEffect(() => {
        if (!qrId) return

        const fetchData = async () => {
            setLoading(true)

            // Fetch QR code info
            const { data: qrData, error: qrError } = await supabase
                .from("qr_codes")
                .select("*")
                .eq("id", qrId)
                .single()

            if (qrError || !qrData) {
                alert(t('qrDetailPage.qrNotFound'))
                router.push("/dashboard")
                return
            }

            setQr(qrData)

            // Fetch scan info
            const { data: scanData } = await supabase
                .from("qr_scans")
                .select("*")
                .eq("qr_id", qrId)
                .order("scanned_at", { ascending: true })

            setScans(scanData || [])
            setLoading(false)
        }

        fetchData()
    }, [qrId, router])

    // Prepare chart data: counts per day
    const chartData = scans.reduce<Record<string, number>>((acc, scan) => {
        const date = new Date(scan.scanned_at).toLocaleDateString()
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {})

    const formattedChartData = Object.entries(chartData).map(([date, count]) => ({ date, count }))

    if (loading) return <p className="p-6">{t('common.loading')}</p>

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{t('qrDetailPage.title')}</h1>

            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                <QrDetail
                    id={qr?.id || ""}
                    original_url={qr?.original_url || ""}
                    short_code={qr?.short_code || ""}
                    created_at={qr?.created_at || ""}
                    fg_color={qr?.fg_color || "#000000"}
                    bg_color={qr?.bg_color || "#ffffff"}
                    size={qr?.size || 128}
                />

                <div className="bg-white p-6 rounded-xl shadow w-full md:w-2/3">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t('qrDetailPage.scanAnalytics')}</h2>
                    {scans.length === 0 ? (
                        <p className="text-gray-800">{t('qrDetailPage.noScans')}</p>
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
                            <h3 className="text-xl font-semibold mb-2">{t('qrDetailPage.recentScans')}</h3>
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
                <span className="text-gray-800">{t('qrDetailPage.backToDashboard')}</span>
            </button>
        </div>
    )
}

