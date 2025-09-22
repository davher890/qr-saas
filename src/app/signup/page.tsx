"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const router = useRouter()

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
    if (data.user) {
      await supabase.from("users").insert({
        auth_id: data.user.id,
        email,
        username: username,
      })
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Bar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          QRGen
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
          >
            Back to Home
          </button>
        </div>
      </nav>

      {/* Signup Form */}
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
          <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>

          <input
            type="text"
            placeholder="User Name"
            className="w-full border p-2 mb-4 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-6 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Log In
            </span>
          </p>
        </div>
      </main>
    </div>
  )
}
