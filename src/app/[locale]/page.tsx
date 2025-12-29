"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'
import { supabase } from "@/lib/supabaseClient"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function LandingPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const t = useTranslations()

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error) {
            router.push("/dashboard")
        } else {
            alert(error.message)
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
                {/* Top Bar */}
                <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
                        {t('common.appName')}
                    </h1>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <label htmlFor="email" className="sr-only">{t('common.email')}</label>
                        <input
                            id="email"
                            type="email"
                            placeholder={t('common.email')}
                            className="border rounded px-2 py-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password" className="sr-only">{t('common.password')}</label>
                        <input
                            id="password"
                            type="password"
                            placeholder={t('common.password')}
                            className="border rounded px-2 py-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            onClick={handleLogin}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            {t('common.login')}
                        </button>
                        <button
                            onClick={() => router.push("/signup")}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                            {t('common.signup')}
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="text-center py-20 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        {t('landing.hero.title')}
                    </h2>
                    <p className="text-lg md:text-2xl mb-6">
                        {t('landing.hero.subtitle')}
                    </p>
                    <button
                        className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-2xl shadow-md hover:bg-gray-200"
                        onClick={() => router.push("/signup")}
                    >
                        {t('common.getStarted')}
                    </button>
                </header>

                <main>
                    {/* Features Section */}
                    <section className="py-16 px-6 max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">{t('landing.features.title')}</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <article className="bg-white p-6 rounded-2xl shadow">
                                <h3 className="text-xl font-semibold mb-2">{t('landing.features.unlimited.title')}</h3>
                                <p>{t('landing.features.unlimited.description')}</p>
                            </article>
                            <article className="bg-white p-6 rounded-2xl shadow">
                                <h3 className="text-xl font-semibold mb-2">{t('landing.features.personalization.title')}</h3>
                                <p>{t('landing.features.personalization.description')}</p>
                            </article>
                            <article className="bg-white p-6 rounded-2xl shadow">
                                <h3 className="text-xl font-semibold mb-2">{t('landing.features.analytics.title')}</h3>
                                <p>{t('landing.features.analytics.description')}</p>
                            </article>
                        </div>
                    </section>

                    {/* Why Free Section */}
                    <section className="py-16 px-6 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">{t('landing.whyFree.title')}</h2>
                        <p className="text-center mb-6">
                            {t('landing.whyFree.description')}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-center text-gray-700">
                            {t.raw('landing.whyFree.features').map((feature: string, index: number) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-16 px-6 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">{t('landing.faq.title')}</h2>
                        <div className="space-y-6">
                            {t.raw('landing.faq.questions').map((item: { question: string; answer: string }, index: number) => (
                                <div key={index}>
                                    <h3 className="text-lg font-semibold">{item.question}</h3>
                                    <p>{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600">
                    {t('landing.footer.copyright', { year: new Date().getFullYear() })}
                </footer>
            </div>
        </>
    )
}

