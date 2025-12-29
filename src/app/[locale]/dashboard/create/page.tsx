"use client"

import { useTranslations } from 'next-intl'
import QrDetail from "@/components/QrDetail"

export default function CreateQrPage() {
    const t = useTranslations()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{t('createQR.title')}</h1>
            <div className="mb-4">
                <QrDetail
                    id={null as unknown as string}
                    original_url={""}
                    short_code={Math.random().toString(36).substring(2, 16)}
                    fg_color="#000000"
                    bg_color="#ffffff"
                    size={128}
                    created_at={new Date().toISOString()}
                />
            </div>
        </div>
    )
}

