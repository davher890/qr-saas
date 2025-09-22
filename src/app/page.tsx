"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      router.push("/dashboard")
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Bar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          QRGen
        </h1>
        <div className="flex items-center gap-3">
          <input
            type="email"
            placeholder="Email"
            className="border rounded px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
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
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Create, Customize & Track Your QR Codes</h1>
        <p className="text-lg md:text-2xl mb-6">
          A simple yet powerful tool for businesses, restaurants, and marketers.
        </p>
        <button
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-2xl shadow-md hover:bg-gray-200"
          onClick={() => router.push("/signup")}
        >
          Get Started Free
        </button>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our QR Generator?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">⚡ Static & Dynamic Codes</h3>
            <p>Create free static codes or upgrade to editable dynamic codes that you can update anytime.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">📊 Scan Analytics</h3>
            <p>Track how many times your code is scanned, and get insights on location, device & time.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">🎨 Custom Branding</h3>
            <p>Personalize with colors, gradients, logos, and frames. Make your QR codes stand out.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
