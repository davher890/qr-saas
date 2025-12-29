"use client"

import { useRouter } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
import { supabase } from "@/lib/supabaseClient"
import LanguageSwitcher from "./LanguageSwitcher"

export default function DashboardHeader() {
    const router = useRouter()
    const t = useTranslations()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    return (
        <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard" className="text-3xl font-bold hover:text-blue-600 transition-colors">
                {t('dashboard.title')}
            </Link>
            <div className="flex gap-4 items-center">
                <LanguageSwitcher />
                <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={() => router.push("/dashboard/account")}
                >
                    {t('dashboard.myAccount')}
                </button>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={handleLogout}
                >
                    {t('dashboard.logout')}
                </button>
            </div>
        </div>
    )
}
