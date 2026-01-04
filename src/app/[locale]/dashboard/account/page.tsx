"use client"

import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl'
import { supabase } from "@/lib/supabaseClient"

export default function AccountPage() {
    const t = useTranslations()
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true)

            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setEmail(user.email || "")
            setUsername(user.user_metadata.display_name || "")

            setLoading(false)
        }

        loadProfile()
    }, [])

    const updateProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // const { error } = await supabase
        //     .from("users")
        //     .update({ display_name: username })
        //     .eq("auth_id", user.id)

        const { data, error } = await supabase.auth.updateUser({
            data: {
                display_name: username
            }
        })


        if (error) alert(error.message)
        else alert(t('account.profileUpdated'))
    }

    const changePassword = async () => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        })

        if (error) alert(error.message)
        else {
            alert(t('account.passwordUpdated'))
            setNewPassword("")
        }
    }

    if (loading) return <p className="p-6">{t('common.loading')}</p>

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('account.title')}</h1>

            <div className="bg-white p-6 rounded-xl shadow space-y-6">
                {/* Email (read-only) */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">{t('account.emailLabel')}</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full border rounded p-2 bg-gray-100 text-gray-800"
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">{t('account.usernameLabel')}</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border rounded p-2 text-gray-800"
                    />
                </div>
                <button
                    onClick={updateProfile}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {t('account.saveProfile')}
                </button>

                <hr />

                {/* Change Password */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">{t('account.newPasswordLabel')}</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border rounded p-2 text-gray-800"
                    />
                </div>
                <button
                    onClick={changePassword}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                    {t('account.updatePassword')}
                </button>
            </div>
        </div>
    )
}

