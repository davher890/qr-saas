import { QRCodeData } from "@/app/interfaces/interfaces"
import QrCard from "./QrCard"
import { useTranslations } from 'next-intl'

export default function QrGrid({ qrCodes }: { qrCodes: QRCodeData[] }) {
    const t = useTranslations()
    return (
        <div>
            {qrCodes.length === 0 ? (
                <p>{t('dashboard.noQRCodes')}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {qrCodes.map((qr) => (
                        <QrCard
                            key={qr.id}
                            id={qr.id}
                            original_url={qr.original_url}
                            short_code={qr.short_code}
                            created_at={qr.created_at}
                            fgColor={qr.fg_color || "#000000"}
                            bgColor={qr.bg_color || "#ffffff"}
                            size={qr.size || 128}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
