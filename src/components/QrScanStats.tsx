"use client"

import { useTranslations } from 'next-intl'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export interface QRScan {
    scanned_at: string
    ip_address: string
    user_agent: string
}

export default function QrScanStats({ scans }: { scans: QRScan[] }) {
    const t = useTranslations()

    // Prepare chart data: counts per day
    const chartData = scans.reduce<Record<string, number>>((acc, scan) => {
        const date = new Date(scan.scanned_at).toLocaleDateString()
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {})

    const formattedChartData = Object.entries(chartData).map(([date, count]) => ({ date, count }))

    return (
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
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{t('qrDetailPage.recentScans')}</h3>
                    <ul className="divide-y">
                        {scans.slice(-5).reverse().map((scan, index) => (
                            <li key={index} className="py-2 flex justify-between">
                                <span className="text-gray-800">{new Date(scan.scanned_at).toLocaleString()}</span>
                                <span className="text-gray-500 text-sm">{scan.ip_address}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
