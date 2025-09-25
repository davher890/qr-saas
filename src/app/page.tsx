"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { supabase } from "@/lib/supabaseClient"

// App name constant
const APP_NAME = "QRGen"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

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
      <Head>
        <title>{APP_NAME} – Free QR Code Generator with Analytics</title>
        <meta
          name="description"
          content={`Create, customize, and track QR codes for free with ${APP_NAME}. Unlimited QR codes, full analytics, and easy sharing — no paid plan required.`}
        />
        <meta name="keywords" content={`free QR code generator, QR analytics, QR tracking, ${APP_NAME}, custom QR codes, dynamic QR codes`} />
        <meta property="og:title" content={`${APP_NAME} – Free QR Code Generator with Analytics`} />
        <meta property="og:description" content={`Generate, customize, and track QR codes for free with ${APP_NAME}. No paid plans, just unlimited QR codes and analytics.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${APP_NAME} – Free QR Code Generator with Analytics`} />
        <meta name="twitter:description" content={`Generate, customize, and track QR codes for free with ${APP_NAME}. No paid plans, unlimited QR codes, full analytics.`} />
      </Head>

      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
        {/* Top Bar */}
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
            {APP_NAME}
          </h1>
          <div className="flex items-center gap-3">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="border rounded px-2 py-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="border rounded px-2 py-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Log In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="text-center py-20 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Create, Customize & Track QR Codes — Totally Free
          </h2>
          <p className="text-lg md:text-2xl mb-6">
            {APP_NAME} lets you generate unlimited QR codes with full analytics, custom branding, and easy sharing. No paid plan, no limits, 100% free.
          </p>
          <button
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-2xl shadow-md hover:bg-gray-200"
            onClick={() => router.push("/signup")}
          >
            Get Started Free
          </button>
        </header>

        <main>
          {/* Features Section */}
          <section className="py-16 px-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose {APP_NAME}?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold mb-2">⚡ Unlimited QR Codes</h3>
                <p>Create as many QR codes as you need — totally free. No paid plan, no limits, just unlimited usage.</p>
              </article>
              <article className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold mb-2">📊 Full Analytics</h3>
                <p>Track scans by time, location, and device. Get insights to measure performance, completely free.</p>
              </article>
              <article className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold mb-2">✅ Easy Download & Sharing</h3>
                <p>Download your QR codes or share them directly via links. Quick and simple, no customization required.</p>
              </article>
            </div>
          </section>

          {/* Why Free Section */}
          <section className="py-16 px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Why {APP_NAME} is 100% Free</h2>
            <p className="text-center mb-6">
              {APP_NAME} is designed to be simple, fast, and free. Everyone can create, track, and download QR codes without paying a cent.
            </p>
            <ul className="list-disc list-inside space-y-2 text-center text-gray-700">
              <li>Unlimited static and dynamic QR codes</li>
              <li>Full scan analytics with location & device tracking</li>
              <li>Quick download or sharing of QR codes</li>
              <li>No registration required for basic usage</li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="py-16 px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Is {APP_NAME} really free?</h3>
                <p>Yes! Every feature is free for now. You can create unlimited QR codes, track scans, and customize them without paying anything.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Do I need to create an account?</h3>
                <p>For basic usage, you can generate QR codes without signing up. Creating an account allows you to manage your QR codes and see analytics in one place.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Can I track QR code scans?</h3>
                <p>Absolutely. The analytics dashboard shows scans by time, location, and device type, so you can measure engagement without any cost.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Do QR codes expire?</h3>
                <p>Static QR codes never expire. Dynamic QR codes remain active as long as you use the tool — all free.</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </footer>
      </div>
    </>
  )
}
