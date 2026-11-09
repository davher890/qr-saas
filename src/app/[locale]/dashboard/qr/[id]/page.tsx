"use client"

import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
import { supabase } from "@/lib/supabaseClient"
import QrDetail from "@/components/QrDetail"
import QrScanStats, { QRScan } from "@/components/QrScanStats"

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

                <QrScanStats scans={scans} />
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

