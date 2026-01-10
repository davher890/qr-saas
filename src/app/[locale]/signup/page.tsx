"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
import { supabase } from "@/lib/supabaseClient"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const router = useRouter()
  const t = useTranslations()

  const handleSignup = async () => {
    // Sign up via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    // Optional: create user metadata in `users` table
    if (data.user && username !== "") {
      // await supabase.from("users").insert({
      //   auth_id: data.user.id,
      //   email,
      //   username: username,
      //   data: {
      //     display_name: username
      //   }
      // })
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
          alert(t('signup.userNotFound'))
          return
      }
      const { data, error } = await supabase.auth.updateUser({
        data: {
            display_name: username
        }
      })
      if (error) {
        alert(error.message)
        return
      }
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Bar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          {t('common.appName')}
        </h1>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
          >
            {t('common.backToHome')}
          </button>
        </div>
      </nav>

      {/* Signup Form */}
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
          <h2 className="text-3xl font-bold mb-6 text-center">{t('signup.title')}</h2>

          <input
            type="text"
            placeholder={t('signup.usernamePlaceholder')}
            className="w-full border p-2 mb-4 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder={t('signup.emailPlaceholder')}
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder={t('signup.passwordPlaceholder')}
            className="w-full border p-2 mb-6 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSignup()
              }
            }}
          />

          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
          >
            {t('signup.submitButton')}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t('signup.alreadyHaveAccount')}{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              {t('signup.loginLink')}
            </span>
          </p>
        </div>
      </main>
    </div>
  )
}
