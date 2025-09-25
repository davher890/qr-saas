"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function DashboardHeader() {
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    return (
        <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard" className="text-3xl font-bold hover:text-blue-600 transition-colors">
                Dashboard
            </Link>
            <div className="flex gap-4">
                <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={() => router.push("/dashboard/account")}
                >
                    My Account
                </button>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={handleLogout}
                >
                    Log Out
                </button>
            </div>
        </div>
    )
}
